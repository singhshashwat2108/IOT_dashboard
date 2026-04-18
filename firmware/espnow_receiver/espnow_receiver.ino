#include <esp_now.h>
#include <WiFi.h>

// Must match the transmitter structure EXACTLY!
typedef struct struct_message {
  float lat;
  float lon;        // Changed from 'long' as it's a reserved keyword in C++
  float speed;
  float imuX;
  float imuY;
  float imuZ;
  float acceleration;
  float pressure;
  float temp;
  float voltage;
  int battery;
  char status[20];
} struct_message;

struct_message telemetryData;

// Flag to indicate when new data is received
volatile bool newData = false;

// Callback function executed when data is received
// Note: If you get a compile error here on newer ESP32 core versions, change the signature to:
// void OnDataRecv(const esp_now_recv_info_t * esp_now_info, const uint8_t *incomingData, int len)
void OnDataRecv(const uint8_t * mac, const uint8_t *incomingData, int len) {
  if (len == sizeof(telemetryData)) {
    memcpy(&telemetryData, incomingData, sizeof(telemetryData));
    newData = true;
  } else {
    Serial.println("Received data length mismatch. Ensure transmitter struct matches perfectly.");
  }
}

void setup() {
  // Initialize Serial Monitor at 115200 (Matches Node.js backend setting)
  Serial.begin(115200);
  
  // Set device as a Wi-Fi Station (required for ESP-NOW)
  WiFi.mode(WIFI_STA);
  
  // Disconnect from any previously saved wifi networks to ensure a clean ESP-NOW channel
  WiFi.disconnect();
  delay(100); // Give the radio hardware 100ms to spin up

  // Init ESP-NOW first to guarantee the MAC layers are active
  if (esp_now_init() != ESP_OK) {
    Serial.println("Error initializing ESP-NOW");
    return;
  }

  // Important: Print MAC address to pair the transmitter to this receiver
  Serial.print("ESP32 Receiver MAC Address: ");
  Serial.println(WiFi.macAddress());
  
  // Register receive callback
  #if ESP_IDF_VERSION >= ESP_IDF_VERSION_VAL(5, 0, 0)
    // For Arduino Core 3.x.x
    esp_now_register_recv_cb([](const esp_now_recv_info_t *info, const uint8_t *data, int len) {
      if (len == sizeof(telemetryData)) {
        memcpy(&telemetryData, data, sizeof(telemetryData));
        newData = true;
      }
    });
  #else
    // For Arduino Core 2.x.x
    esp_now_register_recv_cb(OnDataRecv);
  #endif
  
  Serial.println("ESP-NOW Receiver Initialized.");
}

void loop() {
  if (newData) {
    newData = false;
    
    // Format and print the received data as a seamless JSON string.
    // Our Node.js backend telemetry receiver is programmed to automatically capture this JSON!
    Serial.print("{");
    Serial.print("\"lat\":"); Serial.print(telemetryData.lat, 6); Serial.print(",");
    Serial.print("\"long\":"); Serial.print(telemetryData.lon, 6); Serial.print(",");
    Serial.print("\"speed\":"); Serial.print(telemetryData.speed); Serial.print(",");
    Serial.print("\"imuX\":"); Serial.print(telemetryData.imuX); Serial.print(",");
    Serial.print("\"imuY\":"); Serial.print(telemetryData.imuY); Serial.print(",");
    Serial.print("\"imuZ\":"); Serial.print(telemetryData.imuZ); Serial.print(",");
    Serial.print("\"acceleration\":"); Serial.print(telemetryData.acceleration); Serial.print(",");
    Serial.print("\"pressure\":"); Serial.print(telemetryData.pressure); Serial.print(",");
    Serial.print("\"temp\":"); Serial.print(telemetryData.temp); Serial.print(",");
    Serial.print("\"voltage\":"); Serial.print(telemetryData.voltage); Serial.print(",");
    Serial.print("\"battery\":"); Serial.print(telemetryData.battery); Serial.print(",");
    Serial.print("\"status\":\""); Serial.print(telemetryData.status); Serial.print("\"");
    Serial.println("}");
  }
  
  // Small delay to prevent tight loop exhaustion
  delay(5);
}
