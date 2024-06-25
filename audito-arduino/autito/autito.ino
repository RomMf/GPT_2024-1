#include <WiFi.h>
#include <WebSocketsServer.h>
#include <ArduinoJson.h>
#include <esp_camera.h>

// Configuración de la red WiFi
const char* ssid = "Mundo Pacifico";
const char* password = "210240918";

// Pines de control del motor y LED
const int gpLb =  2;  // Left Backward
const int gpLf = 14;  // Left Forward
const int gpRb = 15;  // Right Backward  
const int gpRf = 13;  // Right Forward   
const int gpLed =  4; // Light



WebSocketsServer webSocket = WebSocketsServer(81); // Puerto 81 para WebSocket

void setup() {
  Serial.begin(115200);

  // Inicialización de los pines del motor y LED
  pinMode(gpLb, OUTPUT);
  pinMode(gpLf, OUTPUT);
  pinMode(gpRb, OUTPUT);
  pinMode(gpRf, OUTPUT);
  pinMode(gpLed, OUTPUT);

  // Conexión a la red WiFi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  Serial.println("Connected to WiFi");
  Serial.println(WiFi.localIP());

  // Inicialización del servidor WebSocket
  webSocket.begin();
  webSocket.onEvent(webSocketEvent);
}

void loop() {
  webSocket.loop();
}

void webSocketEvent(uint8_t num, WStype_t type, uint8_t *payload, size_t length) {
  if (type == WStype_TEXT) {
    handleWebSocketMessage(payload, length);
  }
}

void handleWebSocketMessage(uint8_t *payload, size_t length) {
  StaticJsonDocument<200> doc;
  DeserializationError error = deserializeJson(doc, payload, length);
  if (error) {
    Serial.println(F("Error parsing JSON"));
    return;
  }
//void WheelAct(int nLf, int nLb, int nRf, int nRb);
  const char *command = doc["command"];
   if (strncmp(command, "speed_", 6) == 0) {
    int speedValue = atoi(command + 6); // Extrae el valor de velocidad
    analogWrite(gpLf, speedValue); // Ajusta la velocidad del motor izquierdo
    analogWrite(gpRf, speedValue); // Ajusta la velocidad del motor derecho
    // Nota: Asegúrate de que gpLf y gpRf estén conectados a pines que soporten PWM
  }
  if (strcmp(command, "forward") == 0) {
    //WheelAct(HIGH, LOW, HIGH, LOW);
    digitalWrite(gpLf, HIGH);
    digitalWrite(gpLb, LOW);
    digitalWrite(gpRf, HIGH);
    digitalWrite(gpRb, LOW);
  } else if (strcmp(command, "backward") == 0) {
    //WheelAct(LOW, HIGH, LOW, HIGH);
    digitalWrite(gpLf, LOW);
    digitalWrite(gpLb, HIGH);
    digitalWrite(gpRf, LOW);
    digitalWrite(gpRb, HIGH);

  } else if (strcmp(command, "left") == 0) {
    //    WheelAct(HIGH, LOW, LOW, HIGH);
    digitalWrite(gpLf, HIGH);
    digitalWrite(gpLb, LOW);
    digitalWrite(gpRf, LOW);
    digitalWrite(gpRb, HIGH);
  } else if (strcmp(command, "right") == 0) {

  //WheelAct(LOW, HIGH, HIGH, LOW); 
    digitalWrite(gpLf, LOW);
    digitalWrite(gpLb, HIGH);
    digitalWrite(gpRf, HIGH);
    digitalWrite(gpRb, LOW);
  } else if (strcmp(command, "stop") == 0) {
      
    //WheelAct(LOW, HIGH, HIGH, LOW); 

    digitalWrite(gpLf, HIGH);
    digitalWrite(gpRf, LOW);
    digitalWrite(gpLb, LOW);
    digitalWrite(gpRb, HIGH);
  } else if (strcmp(command, "led_on") == 0) {
    digitalWrite(gpLed, HIGH); // Encender LED
    delay(100); // Pequeño retardo para evitar interferencias
  } else if (strcmp(command, "led_off") == 0) {
    digitalWrite(gpLed, LOW); // Apagar LED
    delay(10); // Pequeño retardo para evitar interferencias
  }
}

