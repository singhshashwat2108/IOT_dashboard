const STATES = ["Order placed", "Packaging", "In Transit", "Delivery in progress", "Delivered"];
let stateIndex = 0;

function telemetryReceiver(io) {
  console.log("Running in SIMULATION MODE...");

  setInterval(() => {
    // Cycle state every 10 seconds for simulation purposes
    if (Math.random() > 0.9) {
      stateIndex = (stateIndex + 1) % STATES.length;
    }

    const telemetry = {
      speed: (Math.random() * 5 + 15).toFixed(2), // 15-20 km/h
      voltage: (46 + Math.random() * 2).toFixed(2), // 46-48V
      imuX: (Math.random() * 5).toFixed(2),
      imuY: (9 + Math.random()).toFixed(2), // Gravity
      imuZ: (Math.random() * 3).toFixed(2),
      acceleration: (Math.random() * 2).toFixed(2),
      battery: (80 + Math.random() * 20).toFixed(0),
      lat: 40.7128 + (Math.random() / 500), // Near mock NYC center
      long: -74.0060 + (Math.random() / 500),
      status: STATES[stateIndex]
    };

    io.emit("telemetry", telemetry);
  }, 1000);
}

module.exports = telemetryReceiver;