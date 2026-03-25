function telemetryReceiver(io){

  console.log("Running in SIMULATION MODE...")

  setInterval(()=>{

      const telemetry = {
          speed: (Math.random()*5).toFixed(2),
          battery: (80 + Math.random()*20).toFixed(0),
          lat: 13.0827 + (Math.random()/100),
          long: 80.2707 + (Math.random()/100),
          accel: (Math.random()).toFixed(2),
          status: ["travelling","stopped","reached"][Math.floor(Math.random()*3)]
      }

      console.log("Simulated:", telemetry)

      io.emit("telemetry", telemetry)

  },1000)

}

module.exports = telemetryReceiver