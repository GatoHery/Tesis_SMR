#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClientSecure.h>
#include <BearSSLHelpers.h>
#include <ArduinoJson.h>


// Pines
#define MAX9814_SENSOR A0
#define BUZZER D1
#define RELAY D2

// Parámetros de muestreo y alarma
const int SAMPLE_SIZE = 500;
float THRESHOLD_DB = 85.0;                   // Umbral editable
int detectionCount = 0;                      // Contador de detecciones
const int DETECTION_LIMIT = 3;               // Límite para activar (3 veces)
unsigned long lastDetectionTime = 0;         // Tiempo de última detección
const unsigned long RESET_INTERVAL = 30000;  // 30s para reiniciar contador

// Configuración de red estática - CORREGIR GATEWAY
IPAddress local_IP(192, 168, 137, 201);
IPAddress gateway(192, 168, 137, 1);  // Cambiar de 192.168.1.1 a 192.168.137.1
IPAddress subnet(255, 255, 255, 0);
IPAddress primaryDNS(8, 8, 8, 8);   // Google DNS
IPAddress secondaryDNS(8, 8, 4, 4); // Google DNS secundario

const char* ip = "192.168.137.201";  // Actualizar IP del ESP
const char* ssid = "bumblebee";
const char* password = "d50m7444";
const char* serverUrl = "https://dei.uca.edu.sv/alarma/api/api/sound-detection/"; // Backend en .1
const char* reportUrl = "https://dei.uca.edu.sv/alarma/api/api/sensor-devices/";  // Backend en .1
const char* sensorLocation = "Laboratorio 4";
const char* sensorName = "Sensor 1";


// Estados configurables
bool alarm = true;
bool notification = true;

// Reporter periódica
unsigned long lastReportTime = 0;
const unsigned long reportInterval = 60000;  // 1 minuto

BearSSL::WiFiClientSecure client;


HTTPClient http;
bool buzzerActive = false;



// —————————————————————————————————————————————————————————————————————————————
// reportToBackend()
// Envía un JSON con estado actual al backend cada minuto.
// —————————————————————————————————————————————————————————————————————————————
void reportToBackend(float dB) {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("⚠️ WiFi no conectado. No se reporta.");
    return;
  }


  StaticJsonDocument<200> workValues;
  HTTPClient reportHttp;
  reportHttp.begin(client, reportUrl);  // <— Correcto: incluir client
  reportHttp.addHeader("Content-Type", "application/json");

  String payload = "{";
  payload += "\"ip\":\"" + String(ip) + "\",";
  payload += "\"name\":\"" + String(sensorName) + "\",";
  payload += "\"location\":\"" + String(sensorLocation) + "\",";
  payload += "\"currentReading\":" + String(dB, 2);
  payload += "}";

  


  Serial.println("📡 Reportando al backend:");
  Serial.println(payload);

  int code = reportHttp.PATCH(payload);
  //Código de prueba

  String resp = reportHttp.getString();
  Serial.printf("📬 HTTP %d — %s\n", code, resp.c_str());

  
  

  if (code >= 200 && code < 300) {
    if(resp.length() > 0){
      DeserializationError error = deserializeJson(workValues, resp);
      if(!error){
      Serial.print("Valor del umbral asignado: ");
      Serial.println(THRESHOLD_DB);
      Serial.print("Valor de la alarma asignado: ");
      Serial.println(alarm);
      Serial.print("Valor de la notificación asignado: ");
      Serial.println(notification);
      Serial.println("valores nuevos:");  
      THRESHOLD_DB = workValues["threshold"];
      alarm = workValues["alarm"];
      notification = workValues["notifications"];
      Serial.print("Valor del umbral asignado: ");
      Serial.println(THRESHOLD_DB);
      Serial.print("Valor de la alarma asignado: ");
      Serial.println(alarm);
      Serial.print("Valor de la notificación asignado: ");
      Serial.println(notification);
      }

    else { 
      Serial.print("❌ Error asignando valores al ESP");
    }
    }

    
  }
  else{
    Serial.print("❌ Error asignando valores al ESP");
  }

  reportHttp.end();
}

// —————————————————————————————————————————————————————————————————————————————
// Handlers WebServer
// —————————————————————————————————————————————————————————————————————————————


// —————————————————————————————————————————————————————————————————————————————
// setup()
// —————————————————————————————————————————————————————————————————————————————
void setup() {
  pinMode(BUZZER, OUTPUT);
  pinMode(RELAY, OUTPUT);
  digitalWrite(RELAY, HIGH);  // Relay OFF

  Serial.begin(115200);
  WiFi.config(local_IP, gateway, subnet);
  WiFi.begin(ssid, password);
  Serial.print("🔌 Conectando WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(300);
    Serial.print(".");
  }
  Serial.printf("\n✅ Conectado IP: %s\n", WiFi.localIP().toString().c_str());

   WiFi.mode(WIFI_STA);
  if (!WiFi.config(local_IP, gateway, subnet, primaryDNS, secondaryDNS)) {
    Serial.println("⚠️ Error configurando IP estática");
  }


  //Verificación de certificado almacenado.
 
  //Se asocía el certificado de la UCA a nuestro cliente http
  //client.setTrustAnchors(new BearSSL::X509List(cert_root));


  // Agregar una ruta de prueba para verificar conectividad

  client.setInsecure();
}

// —————————————————————————————————————————————————————————————————————————————
// loop()
// —————————————————————————————————————————————————————————————————————————————
void loop() {
  


  // Leer amplitud de sonido
  int minV = 1023, maxV = 0;
  for (int i = 0; i < SAMPLE_SIZE; i++) {
    int r = analogRead(MAX9814_SENSOR);
    minV = min(minV, r);
    maxV = max(maxV, r);
  }
  int amplitude = maxV - minV;
  float voltageAmp = amplitude * (3.3 / 1023.0);
  float dB = map(amplitude, 50, 600, 40, 85);

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
      payload += "\"decibels\":" + String(dB, 2) + ",";
      payload += "\"detectionCount\":" + String(detectionCount) + ",";
      payload += "\"notification\":" + String(notification ? "true" : "false") + ",";
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