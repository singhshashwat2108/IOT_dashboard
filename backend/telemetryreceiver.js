const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');

const STATES = ["Order placed", "Packaging", "In Transit", "Delivery in progress", "Delivered"];
let stateIndex = 0;

async function telemetryReceiver(io) {
  console.log("Starting Telemetry Receiver...");

  try {
    const ports = await SerialPort.list();
    // Try to find the ESP32 port. You can adjust the manufacturer/vendorId if needed.
    const espPortInfo = ports.find(p => p.manufacturer === "wch.cn" || p.vendorId === "1A86" || (p.path && p.path.startsWith("COM")));
    
    if (espPortInfo) {
      console.log(`📡 Connecting to ESP32 on ${espPortInfo.path}...`);
      
      const port = new SerialPort({ path: espPortInfo.path, baudRate: 115200 }); // Default ESP32 baudrate. Change to 9600 if your code uses 9600.
      const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }));
      
      // Keep tracking automated states just in case
      setInterval(() => {
         if (Math.random() > 0.9) {
           stateIndex = (stateIndex + 1) % STATES.length;
         }
      }, 1000);

      // --- DATA FILTERING & THROTTLING ---
      let latestData = {
        speed: null, voltage: null, imuX: null, imuY: null, imuZ: null,
        acceleration: null, battery: null, lat: null, long: null, status: null
      };
      
      const ALPHA = 0.2; // Exponential Moving Average smoothing factor

      parser.on('data', (line) => {
        let sensorData = {};
        
        try {
          sensorData = JSON.parse(line);
        } catch (e) {
          const matchLat = line.match(/lat(?:itude)?\s*[:=]\s*(-?[\d.]+)/i);
          const matchLong = line.match(/lon(?:gitude)?\s*[:=]\s*(-?[\d.]+)/i);
          const matchSpeed = line.match(/speed\s*[:=]\s*([\d.]+)/i);
          const matchImuX = line.match(/imuX|accelX\s*[:=]\s*(-?[\d.]+)/i);
          const matchImuY = line.match(/imuY|accelY\s*[:=]\s*(-?[\d.]+)/i);
          const matchImuZ = line.match(/imuZ|accelZ\s*[:=]\s*(-?[\d.]+)/i);
          const matchAccel = line.match(/accel(?:eration)?\s*[:=]\s*(-?[\d.]+)/i);
          const matchPress = line.match(/press(?:ure)?\s*[:=]\s*(-?[\d.]+)/i);
          const matchV = line.match(/volt(?:age)?\s*[:=]\s*(-?[\d.]+)/i);

          if (matchLat) sensorData.lat = parseFloat(matchLat[1]);
          if (matchLong) sensorData.long = parseFloat(matchLong[1]);
          if (matchSpeed) sensorData.speed = parseFloat(matchSpeed[1]);
          if (matchImuX) sensorData.imuX = parseFloat(matchImuX[1]);
          if (matchImuY) sensorData.imuY = parseFloat(matchImuY[1]);
          if (matchImuZ) sensorData.imuZ = parseFloat(matchImuZ[1]);
          if (matchAccel) sensorData.acceleration = parseFloat(matchAccel[1]);
          if (matchPress) sensorData.pressure = parseFloat(matchPress[1]);
          if (matchV) sensorData.voltage = parseFloat(matchV[1]);
        }

        // Apply Exponential Moving Average (EMA) to smooth out MPU6050/sensor noise
        if (sensorData.speed !== undefined) latestData.speed = latestData.speed === null ? sensorData.speed : (latestData.speed * (1-ALPHA) + sensorData.speed * ALPHA);
        if (sensorData.voltage !== undefined) latestData.voltage = latestData.voltage === null ? sensorData.voltage : (latestData.voltage * (1-ALPHA) + sensorData.voltage * ALPHA);
        if (sensorData.imuX !== undefined) latestData.imuX = latestData.imuX === null ? sensorData.imuX : (latestData.imuX * (1-ALPHA) + sensorData.imuX * ALPHA);
        if (sensorData.imuY !== undefined) latestData.imuY = latestData.imuY === null ? sensorData.imuY : (latestData.imuY * (1-ALPHA) + sensorData.imuY * ALPHA);
        if (sensorData.imuZ !== undefined) latestData.imuZ = latestData.imuZ === null ? sensorData.imuZ : (latestData.imuZ * (1-ALPHA) + sensorData.imuZ * ALPHA);
        if (sensorData.acceleration !== undefined) latestData.acceleration = latestData.acceleration === null ? sensorData.acceleration : (latestData.acceleration * (1-ALPHA) + sensorData.acceleration * ALPHA);
        if (sensorData.battery !== undefined) latestData.battery = latestData.battery === null ? sensorData.battery : (latestData.battery * (1-ALPHA) + sensorData.battery * ALPHA);
        
        // Don't smooth GPS, just update
        if (sensorData.lat !== undefined && sensorData.lat !== 0) latestData.lat = sensorData.lat;
        if (sensorData.long !== undefined && sensorData.long !== 0) latestData.long = sensorData.long;
        
        if (sensorData.status) latestData.status = sensorData.status;
      });

      // Reduced data rate: Emit once per second instead of matching the incoming baud rate
      setInterval(() => {
        const telemetry = {
          speed: (latestData.speed !== null ? latestData.speed : (15 + Math.random() * 5)).toFixed(2),
          voltage: (latestData.voltage !== null ? latestData.voltage : (46 + Math.random() * 2)).toFixed(2),
          imuX: (latestData.imuX !== null ? latestData.imuX : (Math.random() * 1.5 - 0.75)).toFixed(2),
          imuY: (latestData.imuY !== null ? latestData.imuY : (9.7 + Math.random() * 0.3)).toFixed(2),
          imuZ: (latestData.imuZ !== null ? latestData.imuZ : (Math.random() * 1)).toFixed(2),
          acceleration: (latestData.acceleration !== null ? latestData.acceleration : (Math.random() * 1.5)).toFixed(2),
          battery: (latestData.battery !== null ? latestData.battery : 85).toFixed(0),
          lat: latestData.lat !== null ? latestData.lat : 12.969 + (Math.random() / 5000),
          long: latestData.long !== null ? latestData.long : 79.155 + (Math.random() / 5000),
          status: latestData.status || STATES[stateIndex]
        };

        console.log(`[${new Date().toLocaleTimeString()}] Broadcast:`, telemetry);
        io.emit("telemetry", telemetry);
      }, 1000);
      
      port.on('error', (err) => {
        console.error("❌ Serial Port Error (Is the Arduino IDE Monitor open? Please close it!): ", err.message);
        fallbackSimulation(io);
      });

    } else {
      console.log("⚠️ No ESP32 serial port found. Check your connections.");
      fallbackSimulation(io);
    }
  } catch (err) {
    console.error("Error reading serial ports: ", err.message);
    fallbackSimulation(io);
  }
}

function fallbackSimulation(io) {
  console.log("Running in FULL SIMULATION MODE...");
  setInterval(() => {
    if (Math.random() > 0.9) {
      stateIndex = (stateIndex + 1) % STATES.length;
    }
    const telemetry = {
      speed: (Math.random() * 5 + 15).toFixed(2), 
      voltage: (46 + Math.random() * 2).toFixed(2),
      imuX: (Math.random() * 5).toFixed(2),
      imuY: (9 + Math.random()).toFixed(2),
      imuZ: (Math.random() * 3).toFixed(2),
      acceleration: (Math.random() * 2).toFixed(2),
      battery: (80 + Math.random() * 20).toFixed(0),
      lat: 12.969 + (Math.random() / 5000),
      long: 79.155 + (Math.random() / 5000),
      status: STATES[stateIndex]
    };
    
    console.log(`[${new Date().toLocaleTimeString()}] Broadcast [SIM]:`, telemetry);
    io.emit("telemetry", telemetry);
  }, 1000);
}

module.exports = telemetryReceiver;