## Preparación del ESP8266

### Carga del Código al ESP8266

1. Clonar el repositorio
2. Abrir el proyecto con Arduino IDE

### Configuración de red y parámetros del sensor 

1. Dirección IP

      Al momento de asignar la IP, es importante verificar que dicha dirección IP no haya sido
      asignada a otro dispositivo de la red.
   
3. Gateway y Subnet

      Configurar la puerta de enlace `gateway` y la máscara de red `subnet` acorde a la red
      local.
   
5. SSID y Contraseña

      En el campo `ssid`, colocar el nombre de la red WiFi (solo redes de `2.4GHz`) a la cual se
    conectará el ESP8266, así como su correspondiente contraseña `password`.

6. URLs del Backend

    Los campos serverUrl y reportUrl deben configurarse con la URL de la API backend
    donde se recibirán:

      * detecciones de sonido (serverUrl)
  
      * registro y actualización del dispositivo (reportUrl)

8. Ubicación y nombre del sensor

      * `sensorLocation`: ubicación física donde se instala el ESP8266
      * `sensorName`: nombre identificador del sensor

Ejemplo: 

```cpp

// Configuración de red estática
IPAddress local_IP(192, 168, 1, 37);
IPAddress gateway( 192, 168, 1, 1);
IPAddress subnet( 255, 255, 255, 0);
const char* ip = "192.168.1.37";
const char* ssid = "INSERT_COIN2.4";
const char* password = "";
const char* serverUrl = "http://192.168.1.5:5050/api/sound-detection/";
const char* reportUrl = "http://192.168.1.5:5050/api/sensor-devices";
const char* sensorLocation = "Laboratorio 5";
const char* sensorName = "Sensor 2";

```

### Carga del Firmware

Finalmente, carga el código al ESP8266
