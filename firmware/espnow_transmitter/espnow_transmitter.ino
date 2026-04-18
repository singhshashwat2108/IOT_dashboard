#include <esp_now.h>
#include <WiFi.h>
#include <Wire.h>

// --- Standard Sensor Libraries ---
// You will need to install these via the Arduino Library Manager:
// - Adafruit MPU6050
// - Adafruit BMP280 Library
// - TinyGPSPlus (by Mikal Hart)
#include <Adafruit_MPU6050.h>
#include <Adafruit_Sensor.h>
#include <Adafruit_BMP280.h>
#include <TinyGPSPlus.h>

// --- SENSOR OBJECTS ---
Adafruit_MPU6050 mpu;
Adafruit_BMP280 bmp;
TinyGPSPlus gps;

// --- PIN DEFINITIONS ---
// Adjust these pins based on how your NEO-6M GPS is wired to the ESP32-S3
#define GPS_RX_PIN 16
#define GPS_TX_PIN 17

// ==========================================
// ⚠️ REPLACE WITH YOUR RECEIVER MAC ADDRESS! ⚠️
// Example: If receiver is 34:00:20:11:AB:CD replace below with 0x34, 0x00, 0x20, 0x11, 0xAB, 0xCD
// ==========================================
uint8_t broadcastAddress[] = {0x70, 0x4B, 0xCA, 0x4D, 0x4F, 0xA4};

// Must match the receiver structure EXACTLY!
typedef struct struct_message {
  float lat;
  float lon;        
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

esp_now_peer_info_t peerInfo;

// --- Speed Integration Variables ---
float currentSpeedMps = 0.0;
unsigned long lastTime = 0;
void OnDataSent(const uint8_t *mac_addr, esp_now_send_status_t status) {
  Serial.print("\r\nLast Packet Send Status:\t");
  Serial.println(status == ESP_NOW_SEND_SUCCESS ? "Delivery Success" : "Delivery Fail");
}

void setup() {
  Serial.begin(115200);
  
  // GPS Serial Init
  Serial1.begin(9600, SERIAL_8N1, GPS_RX_PIN, GPS_TX_PIN);

  // Set device as a Wi-Fi Station
  WiFi.mode(WIFI_STA);
  WiFi.disconnect();
  delay(100);

  // Init ESP-NOW
  if (esp_now_init() != ESP_OK) {
    Serial.println("Error initializing ESP-NOW");
    return;
  }

  // Register send callback
  esp_now_register_send_cb(OnDataSent);
  
  // Register peer
  memcpy(peerInfo.peer_addr, broadcastAddress, 6);
  peerInfo.channel = 0;  // Use current channel
  peerInfo.encrypt = false;
  
  // Add peer        
  if (esp_now_add_peer(&peerInfo) != ESP_OK){
    Serial.println("Failed to add peer! Ensure you inputted a valid MAC address.");
    return;
  }

  // --- SENSOR INITIALIZATION ---
  Wire.begin(); // Join I2C bus (ESP32-S3 default I2C pins: SDA=8, SCL=9. Change in code if different!)
  
  if (!mpu.begin()) {
    Serial.println("Failed to find MPU6050 chip. Check wiring!");
  } else {
    Serial.println("MPU6050 Found!");
    mpu.setAccelerometerRange(MPU6050_RANGE_8_G);
    mpu.setGyroRange(MPU6050_RANGE_500_DEG);
    mpu.setFilterBandwidth(MPU6050_BAND_21_HZ);
  }

  if (!bmp.begin(0x76)) { // 0x76 or 0x77 are common I2C addresses for BMP280
    Serial.println("Failed to find BMP280 chip. Check wiring!");
  } else {
    Serial.println("BMP280 Found!");
  }

  // Initialize the timekeeper for IMU integration
  lastTime = millis();
}

void loop() {
  // 1. READ NEO-6M GPS
  // Feed incoming hardware serial data from the GPS module into the tinyGPS++ parser
  while (Serial1.available() > 0) {
    gps.encode(Serial1.read());
  }

  // If we have a valid lock and active satellites, use real GPS data
  if (gps.location.isValid() && gps.satellites.value() > 0) {
    telemetryData.lat = gps.location.lat();
    telemetryData.lon = gps.location.lng();
  } else {
    // Fallback coordinates when no GPS lock is acquired
    telemetryData.lat = 12.969; // 12.969 N
    telemetryData.lon = 79.155; // 79.155 E
  }
  /* Disabled GPS Speed to use IMU calculation instead
  if (gps.speed.isValid()) {
    telemetryData.speed = gps.speed.kmph();
  }
  */

  // --- TIME DELTA LOGIC ---
  unsigned long currentTime = millis();
  float dt = (currentTime - lastTime) / 1000.0;
  lastTime = currentTime;

  // 2. READ MPU6050
  sensors_event_t a, g, temp;
  mpu.getEvent(&a, &g, &temp);
  
  telemetryData.imuX = a.acceleration.x;
  telemetryData.imuY = a.acceleration.y;
  telemetryData.imuZ = a.acceleration.z;
  
  // Calculate Net Acceleration (Magnitude minus Earth's 9.81 m/s^2 gravity)
  float rawMagnitude = sqrt(pow(a.acceleration.x, 2) + pow(a.acceleration.y, 2) + pow(a.acceleration.z, 2));
  float netAccel = rawMagnitude - 9.81;
  
  // Apply a deadband filter so the robot doesn't "accelerate" while sitting still due to noise
  if (abs(netAccel) < 0.3) {
    netAccel = 0.0;
    currentSpeedMps *= 0.95; // Friction constraint: bleed off speed if no raw acceleration is happening
  }
  
  // Integrate acceleration over time to calculate speed
  currentSpeedMps += netAccel * dt;
  if (currentSpeedMps < 0) currentSpeedMps = 0; // Constrain reverse/drifting negative speeds
  
  telemetryData.acceleration = netAccel;
  telemetryData.speed = currentSpeedMps * 3.6; // Convert final calculated m/s into km/h

  // 3. READ BMP280
  telemetryData.temp = bmp.readTemperature();
  telemetryData.pressure = bmp.readPressure() / 100.0F; // Convert Pa to hPa

  // 4. CONSTRAINED RANDOM METRICS
  // Constrain voltage heavily between 46.00V and 48.00V
  telemetryData.voltage = 46.0 + (random(0, 201) / 100.0); 
  // Constrain battery heavily between 80% and 95%
  telemetryData.battery = random(80, 96);
  
  String defaultStatus = "In Transit";
  defaultStatus.toCharArray(telemetryData.status, sizeof(telemetryData.status));

  // 5. TRANSMIT
  esp_err_t result = esp_now_send(broadcastAddress, (uint8_t *) &telemetryData, sizeof(telemetryData));
  
  // Wait before sending next packet (Sending roughly 5 times a second to not crowd the airspace)
  delay(200); 
}
