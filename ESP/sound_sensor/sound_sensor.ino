#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClientSecure.h>
#include <ESP8266WebServer.h>
#include <pgmspace.h>
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
bool eventInProgress = false;

unsigned long lastAlarmTime = 0;
const unsigned long ALARM_COOLDOWN = 30000; // 30 segundos

unsigned long lastDetectionIncrement = 0;
const unsigned long DETECTION_STEP = 1000; // 1 segundo

// Configuración de red estática - CORREGIR GATEWAY
IPAddress local_IP(192, 168, 137, 201);
IPAddress gateway(192, 168, 137, 1);  // Cambiar de 192.168.1.1 a 192.168.137.1
IPAddress subnet(255, 255, 255, 0);
IPAddress primaryDNS(8, 8, 8, 8);   // Google DNS
IPAddress secondaryDNS(8, 8, 4, 4); // Google DNS secundario

const char* ip = "192.168.137.201";  // Actualizar IP del ESP
const char* ssid = "bumblebee";
const char* password = "d50m7444";
const char* serverUrl = "https://dei.uca.edu.sv/alarma/api/api/sound-detection/";  // Backend en .1
const char* reportUrl = "https://dei.uca.edu.sv/alarma/api/api/sound-detection/";  // Backend en .1
const char* sensorLocation = "Laboratorio 5";
const char* sensorName = "Sensor 1";


// Estados configurables
bool alarm = true;
bool notification = true;

// Reporter periódica
unsigned long lastReportTime = 0;
const unsigned long reportInterval = 60000;  // 1 minuto

BearSSL::WiFiClientSecure client;


HTTPClient http;
ESP8266WebServer server(80);
bool buzzerActive = false;


const char cert_root[] PROGMEM = R"EOF(
-----BEGIN CERTIFICATE-----
MIIFazCCA1OgAwIBAgIRAIIQz7DSQONZRGPgu2OCiwAwDQYJKoZIhvcNAQELBQAw
TzELMAkGA1UEBhMCVVMxKTAnBgNVBAoTIEludGVybmV0IFNlY3VyaXR5IFJlc2Vh
cmNoIEdyb3VwMRUwEwYDVQQDEwxJU1JHIFJvb3QgWDEwHhcNMTUwNjA0MTEwNDM4
WhcNMzUwNjA0MTEwNDM4WjBPMQswCQYDVQQGEwJVUzEpMCcGA1UEChMgSW50ZXJu
ZXQgU2VjdXJpdHkgUmVzZWFyY2ggR3JvdXAxFTATBgNVBAMTDElTUkcgUm9vdCBY
MTCCAiIwDQYJKoZIhvcNAQEBBQADggIPADCCAgoCggIBAK3oJHP0FDfzm54rVygc
h77ct984kIxuPOZXoHj3dcKi/vVqbvYATyjb3miGbESTtrFj/RQSa78f0uoxmyF+
0TM8ukj13Xnfs7j/EvEhmkvBioZxaUpmZmyPfjxwv60pIgbz5MDmgK7iS4+3mX6U
A5/TR5d8mUgjU+g4rk8Kb4Mu0UlXjIB0ttov0DiNewNwIRt18jA8+o+u3dpjq+sW
T8KOEUt+zwvo/7V3LvSye0rgTBIlDHCNAymg4VMk7BPZ7hm/ELNKjD+Jo2FR3qyH
B5T0Y3HsLuJvW5iB4YlcNHlsdu87kGJ55tukmi8mxdAQ4Q7e2RCOFvu396j3x+UC
B5iPNgiV5+I3lg02dZ77DnKxHZu8A/lJBdiB3QW0KtZB6awBdpUKD9jf1b0SHzUv
KBds0pjBqAlkd25HN7rOrFleaJ1/ctaJxQZBKT5ZPt0m9STJEadao0xAH0ahmbWn
OlFuhjuefXKnEgV4We0+UXgVCwOPjdAvBbI+e0ocS3MFEvzG6uBQE3xDk3SzynTn
jh8BCNAw1FtxNrQHusEwMFxIt4I7mKZ9YIqioymCzLq9gwQbooMDQaHWBfEbwrbw
qHyGO0aoSCqI3Haadr8faqU9GY/rOPNk3sgrDQoo//fb4hVC1CLQJ13hef4Y53CI
rU7m2Ys6xt0nUW7/vGT1M0NPAgMBAAGjQjBAMA4GA1UdDwEB/wQEAwIBBjAPBgNV
HRMBAf8EBTADAQH/MB0GA1UdDgQWBBR5tFnme7bl5AFzgAiIyBpY9umbbjANBgkq
hkiG9w0BAQsFAAOCAgEAUBDnZ0+1L0EwYc3rgIxeqmoeZaZX6mE6oPD58Ll35H5T
KqfHbLOy7YwG0CGqU8nhIOzr05tPOJY1o1Y4BSbnVtA7eMGU8Zkq7rHPPEKq1xbH
LsKkR4+vq1r4B5IUpB5Qn/OQvPsvBLmvBxGZ+rsoAhH2m6q+UpBAkLTlaX2UjsFv
uXJxi19aUfKokpgp5YOrWSre5C5ZzSQ2uPiJX4e61+J4PSJVpaz6RtWLpmjHtk0N
yDRWsdJqeybcnzVrPwPIQseqhwR3n6Tk2bYcubkzymZxyGvCbf9wZC5qT1Q+GjOQ
BOUwJpO1TlAIHXbAW1ZkaD+6a8GN0pXBwaBsE3ZYZk+YQpQRhY7GoTdQajAD+t5P
7cKnPvgQXR96kdb+bp0UWjHwISzHPQbUACm78H0T50fgpRJ9V2t6D8pdtKbBpTAJ
oYh0b07XHtcwPa5RWPLXnwI75PwQxzb62LF8A3BnQUwpsOSJyYwcmBHQYaWV7k/3
VHyCuXapnwYfJOLLmObAun1vDLteA94ppIqhzyapMI2vlA38nSxrdbidKfnUSsfx
ktpgnZ6PUEB7vbW9lgaE1xJcIqWqZP/uh7uAcmFJxuTDL9y8p2HvSOhC0e5z6iGY
Fbe2tW6JxEnjG0u/l6EUMlzUxr87hcPLZ9eczsQnUnxekxCGr0C7Do2l
-----END CERTIFICATE-----
)EOF";
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
  payload += "\"sensorLocation\":\"" + String(sensorLocation) + "\",";
  payload += "\"decibels\":" + String(dB, 2) + ",";
  payload += "\"notification\":" + String(notification ? "true" : "false") + ",";
  payload += "\"alarm\":" + String(alarm ? "true" : "false") + ",";
  payload += "\"threshold\":" + String(THRESHOLD_DB) + ",";
  payload += "\"detectionCount\":" + String(detectionCount);
  payload += "}";

  


  Serial.println("📡 Reportando al backend:");
  Serial.println(payload);

  int code = reportHttp.POST(payload);
  //Código de prueba

  String resp = reportHttp.getString();
  Serial.printf("📬 HTTP %d — %s\n", code, resp.c_str());

  
  

  if (code >= 200 && code < 300) {
    if(resp.length() > 0){
      DeserializationError error = deserializeJson(workValues, resp);
      if (!error) {

  if (workValues.containsKey("threshold")) {
    THRESHOLD_DB = workValues["threshold"];
    Serial.printf("🎚️ Threshold actualizado desde backend: %.1f\n", THRESHOLD_DB);
  }

  if (workValues.containsKey("alarm")) {
    alarm = workValues["alarm"];
    Serial.printf("🔔 Alarm actualizado desde backend: %s\n", alarm ? "ON" : "OFF");
  }
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
void handleSetThreshold() {
  Serial.println("🔧 handleSetThreshold() llamado!");
  Serial.printf("Método: %s\n", server.method() == HTTP_GET ? "GET" : "POST");
  Serial.printf("URI: %s\n", server.uri().c_str());
  Serial.printf("Args: %d\n", server.args());

  // Agregar headers CORS
  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.sendHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  server.sendHeader("Access-Control-Allow-Headers", "Content-Type");

  // Mostrar todos los argumentos para debug
  for (int i = 0; i < server.args(); i++) {
    Serial.printf("Arg[%d]: %s = %s\n", i, server.argName(i).c_str(), server.arg(i).c_str());
  }

  if (server.hasArg("value")) {
    float v = server.arg("value").toFloat();
    Serial.printf("🔍 Valor recibido: %s -> %.1f\n", server.arg("value").c_str(), v);
    if (v > 0) {
      THRESHOLD_DB = v;
      Serial.printf("✅ Umbral actualizado: %.1f dB\n", THRESHOLD_DB);

      // Respuesta JSON limpia y válida
      String jsonResponse = "{";
      jsonResponse += "\"success\":true,";
      jsonResponse += "\"threshold\":" + String(THRESHOLD_DB, 1) + ",";
      jsonResponse += "\"message\":\"Threshold actualizado correctamente\"";
      jsonResponse += "}";

      server.send(200, "application/json", jsonResponse);
      return;
    } else {
      Serial.println("❌ Valor inválido (debe ser > 0)");
    }
  } else {
    Serial.println("❌ Parámetro 'value' no encontrado");
  }

  String errorResponse = "{";
  errorResponse += "\"success\":false,";
  errorResponse += "\"error\":\"Parametro value faltante o invalido\"";
  errorResponse += "}";

  server.send(400, "application/json", errorResponse);
}

// Agregar handler para OPTIONS (preflight CORS)
void handleOptions() {
  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.sendHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, OPTIONS");
  server.sendHeader("Access-Control-Allow-Headers", "Content-Type");
  server.send(200, "text/plain", "");
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

  // Rutas HTTP con CORS support
  server.on("/set-threshold", HTTP_POST, handleSetThreshold);
  server.on("/set-threshold", HTTP_GET, handleSetThreshold);
  server.on("/set-threshold", HTTP_OPTIONS, handleOptions);  // Agregar OPTIONS
  server.on("/set-alarm", HTTP_PATCH, handleSetAlarm);
  server.on("/set-notification", HTTP_PATCH, handleSetNotification);

  // Agregar una ruta de prueba para verificar conectividad
  server.on("/test", HTTP_GET, []() {
    Serial.println("🧪 Endpoint /test llamado");
    server.send(200, "text/plain", "ESP funcionando correctamente");
  });

  server.begin();
  Serial.println("🌐 Servidor web iniciado.");
  Serial.printf("📍 Rutas disponibles:\n");
  Serial.printf("  GET/POST /set-threshold?value=X\n");
  Serial.printf("  PATCH /set-alarm\n");
  Serial.printf("  PATCH /set-notification\n");
  Serial.printf("  GET /test\n");
  client.setInsecure();
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
  int amplitude = maxV - minV;
  float voltageAmp = amplitude * (3.3 / 1023.0);
  float dB = map(amplitude, 50, 600, 40, 85);

  Serial.printf("📏 Amp:%d  Volt:%.2fV  dB:%.1f  Th:%.1f\n",
                amplitude, voltageAmp, dB, THRESHOLD_DB);

    unsigned long currentMillis = millis();
                
  // Reporte periódico
  if (currentMillis - lastReportTime >= reportInterval) {
    lastReportTime = currentMillis;
    reportToBackend(dB);
  }

  // Reinicia contador si pasó mucho
  if ((currentMillis - lastDetectionTime > RESET_INTERVAL) && detectionCount > 0) {
    detectionCount = 0;
    Serial.println("⏰ Contador de detecciones reiniciado");
  }

  if (eventInProgress || (currentMillis - lastAlarmTime < ALARM_COOLDOWN)) {
    delay(200);
    return;
  }

  // Detección y envío al backend
  if (dB >= THRESHOLD_DB && (currentMillis - lastDetectionIncrement >= DETECTION_STEP)) {
    detectionCount++;
    lastDetectionTime = currentMillis;
    lastDetectionIncrement = currentMillis;
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
        eventInProgress = true;
        lastAlarmTime = currentMillis;
        tone(BUZZER, 1000);
        digitalWrite(RELAY, LOW);
        delay(10000);
        noTone(BUZZER);
        digitalWrite(RELAY, HIGH);
        buzzerActive = false;
        detectionCount = 0;
        eventInProgress = false;
      }

      if (detectionCount >= 3) {
        detectionCount = 0;
      }
    }
  }

  delay(200);
}