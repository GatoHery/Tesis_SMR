#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <ESP8266WebServer.h>
#include <ESP8266WebServer.h>

// Pines
#define MAX9814_SENSOR A0
#define BUZZER         D1
#define RELAY          D2

// Parámetros de muestreo y alarma
const int   SAMPLE_SIZE       = 500;
float       THRESHOLD_DB      = 85.0;           // Umbral editable
int         detectionCount    = 0;              // Contador de detecciones
const int   DETECTION_LIMIT   = 3;              // Límite para activar (3 veces)
unsigned long lastDetectionTime  = 0;           // Tiempo de última detección
const unsigned long RESET_INTERVAL   = 30000;   // 30s para reiniciar contador

// Configuración de red estática
IPAddress local_IP(192, 168, 137, 1);
IPAddress gateway(  192, 168, 1, 1);
IPAddress subnet(   255, 255, 255, 0);

//const char* ip             = "10.40.7.133";    // UID = IP
const char* ip             = "192.168.137.1";    // UID = IP
const char* ssid           = "LAPTOP-0PCANB8P 0657";
const char* password       = "2*537Xz1";
//const char* serverUrl      = "http://10.40.7.133:5050/api/sound-detection/";
//const char* reportUrl      = "http://10.40.7.133:5050/api/sensor-devices";
const char* serverUrl      = "http://192.168.137.1:5050/api/sound-detection/";
const char* reportUrl      = "http://192.168.137.1:5050/api/sensor-devices";
const char* sensorLocation = "Laboratorio 3";
const char* sensorName     = "Sensor 2";

// Estados configurables
bool alarm        = true;
bool notification = true;

// Reporter periódica
unsigned long lastReportTime    = 0;
const unsigned long reportInterval = 60000; // 1 minuto

WiFiClient       client;
HTTPClient       http;
ESP8266WebServer server(80);
bool             buzzerActive = false;

// —————————————————————————————————————————————————————————————————————————————
// reportToBackend()
// Envía un JSON con estado actual al backend cada minuto.
// —————————————————————————————————————————————————————————————————————————————
void reportToBackend(float dB) {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("⚠️ WiFi no conectado. No se reporta.");
    return;
  }
  HTTPClient reportHttp;
  reportHttp.begin(client, reportUrl);  // <— Correcto: incluir client
  reportHttp.addHeader("Content-Type", "application/json");

  String payload = "{";
  payload += "\"ip\":\"" + String(ip) + "\",";
  payload += "\"name\":\"" + String(sensorName) + "\",";
  payload += "\"location\":\"" + String(sensorLocation) + "\",";
  payload += "\"currentReading\":" + String(dB, 2) + ",";
  payload += "\"notifications\":" + String(notification ? "true" : "false") + ",";
  payload += "\"alarm\":" + String(alarm ? "true" : "false") + ",";
  payload += "\"threshold\":" + String(THRESHOLD_DB);
  payload += "}";

  Serial.println("📡 Reportando al backend:");
  Serial.println(payload);

  int code = reportHttp.PATCH(payload);
  String resp = reportHttp.getString();
  Serial.printf("📬 HTTP %d — %s\n", code, resp.c_str());

  reportHttp.end();
}

// —————————————————————————————————————————————————————————————————————————————
// Handlers WebServer
// —————————————————————————————————————————————————————————————————————————————
void handleSetThreshold() {
  if (server.hasArg("value")) {
    float v = server.arg("value").toFloat();
    if (v > 0) {
      THRESHOLD_DB = v;
      Serial.printf("✅ Umbral actualizado: %.1f dB\n", THRESHOLD_DB);
      server.send(200, "text/plain", "Nuevo THRESHOLD_DB: " + String(THRESHOLD_DB));
      return;
    }
  }
  server.send(400, "text/plain", "Falta o valor inválido");
}

void handleSetAlarm() {
  if (server.hasArg("value")) {
    String v = server.arg("value");
    alarm = (v == "true");
    Serial.printf("🔧 Alarm %s\n", alarm ? "ACTIVADA" : "DESACTIVADA");
    server.send(200, "text/plain", alarm ? "Alarm ACTIVADA" : "Alarm DESACTIVADA");
    return;
  }
  server.send(400, "text/plain", "Falta parámetro 'value'");
}

void handleSetNotification() {
  if (server.hasArg("value")) {
    String v = server.arg("value");
    notification = (v == "true");
    Serial.printf("🔔 Notification %s\n", notification ? "ON" : "OFF");
    server.send(200, "text/plain", notification ? "Notifications ON" : "Notifications OFF");
    return;
  }
  server.send(400, "text/plain", "Falta parámetro 'value'");
}

// —————————————————————————————————————————————————————————————————————————————
// setup()
// —————————————————————————————————————————————————————————————————————————————
void setup() {
  pinMode(BUZZER, OUTPUT);
  pinMode(RELAY, OUTPUT);
  digitalWrite(RELAY, HIGH); // Relay OFF

  Serial.begin(115200);
  WiFi.config(local_IP, gateway, subnet);
  WiFi.begin(ssid, password);
  Serial.print("🔌 Conectando WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(300);
    Serial.print(".");
  }
  Serial.printf("\n✅ Conectado IP: %s\n", WiFi.localIP().toString().c_str());

  // Rutas HTTP
  server.on("/set-threshold",     HTTP_POST,  handleSetThreshold);
  server.on("/set-alarm",         HTTP_PATCH, handleSetAlarm);
  server.on("/set-notification",  HTTP_PATCH, handleSetNotification);
  server.begin();
  Serial.println("🌐 Servidor web iniciado.");
}

// —————————————————————————————————————————————————————————————————————————————
// loop()
// —————————————————————————————————————————————————————————————————————————————
void loop() {
  server.handleClient();

  // Leer amplitud de sonido
  int minV = 1023, maxV = 0;
  for (int i = 0; i < SAMPLE_SIZE; i++) {
    int r = analogRead(MAX9814_SENSOR);
    minV = min(minV, r);
    maxV = max(maxV, r);
  }
  int   amplitude  = maxV - minV;
  float voltageAmp = amplitude * (3.3 / 1023.0);
  float dB         = map(amplitude, 50, 600, 40, 85);

  Serial.printf("📏 Amp:%d  Volt:%.2fV  dB:%.1f  Th:%.1f\n",
                amplitude, voltageAmp, dB, THRESHOLD_DB);

  // Reporte periódico
  if (millis() - lastReportTime >= reportInterval) {
    lastReportTime = millis();
    reportToBackend(dB);
  }

  // Reinicia contador si pasó mucho
  if ((millis() - lastDetectionTime > RESET_INTERVAL) && detectionCount > 0) {
    detectionCount = 0;
    Serial.println("⏰ Contador de detecciones reiniciado");
  }

  // Detección y envío al backend
  if (dB >= THRESHOLD_DB) {
    detectionCount++;
    lastDetectionTime = millis();
    Serial.printf("🚨 Detección alta #%d\n", detectionCount);

    if (WiFi.status() == WL_CONNECTED) {
      http.begin(client, serverUrl);  // <— Corrección aquí también
      http.addHeader("Content-Type", "application/json");

      String payload = "{";
      payload += "\"decibels\":"     + String(dB, 2)        + ",";
      payload += "\"detectionCount\":" + String(detectionCount) + ",";
      payload += "\"notification\":"  + String(notification ? "true" : "false") + ",";
      payload += "\"sensorLocation\":\"" + String(sensorLocation) + "\"";
      payload += "}";

      Serial.println("📤 Payload: " + payload);
      int code = http.POST(payload);
      String resp = http.getString();
      Serial.printf("📬 HTTP %d — %s\n", code, resp.c_str());
      http.end();

      // Activa alarma si toca
      if (code > 0
          && resp.indexOf("\"triggerBuzzer\":true") >= 0
          && detectionCount >= DETECTION_LIMIT
          && alarm) {
        Serial.println("🎯 ACTIVANDO alarma!");
        buzzerActive = true;
        tone(BUZZER, 1000);
        digitalWrite(RELAY, LOW);
        delay(10000);
        noTone(BUZZER);
        digitalWrite(RELAY, HIGH);
        buzzerActive = false;
        detectionCount = 0;
      }

      if (detectionCount >= 3) {
        detectionCount = 0;
      }
    }
  }

  delay(200);
}