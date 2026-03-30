const express = require("express")
const http = require("http")
const cors = require("cors")
const { Server } = require("socket.io")

const telemetryReceiver = require("./telemetryReceiver")
const authRoutes = require("./routes/authRoutes")
const db = require("./db")

const app = express()
app.use(cors())
app.use(express.json())

// authentication route
app.use("/api/auth", authRoutes)

// state change log route
app.post("/api/logs/state", (req, res) => {
  const { status } = req.body;
  if (!status) {
    return res.status(400).json({ message: "Status is required" });
  }

  db.run(
    "INSERT INTO state_change_logs (status) VALUES (?)",
    [status],
    function (err) {
      if (err) {
        console.error("Error logging state to DB:", err.message);
        return res.status(500).json({ message: "Internal server error" });
      }
      res.status(200).json({ message: "State logged successfully", id: this.lastID });
    }
  );
});

const server = http.createServer(app)

const io = new Server(server,{
    cors:{
        origin:"*"
    }
})

telemetryReceiver(io)

app.get("/",(req,res)=>{
    res.send("Robot Delivery Backend Running")
})

server.listen(5000,()=>{
    console.log("Server running on port 5000")
})
