const express = require("express")
const http = require("http")
const cors = require("cors")
const { Server } = require("socket.io")

const telemetryReceiver = require("./telemetryReceiver")

const app = express()
app.use(cors())
app.use(express.json())

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