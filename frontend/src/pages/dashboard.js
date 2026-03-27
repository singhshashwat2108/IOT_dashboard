import { useEffect,useState } from "react"
import socket from "../services/socketService"

import Header from "../components/Header"
import Sidebar from "../components/Sidebar"
import Graphs from "../components/Graphs"
import MapView from "../components/MapView"

function Dashboard(){

const [telemetry,setTelemetry] = useState({})

useEffect(()=>{
    socket.on("telemetry",(data)=>{
        setTelemetry(data)
    })
},[])

return(
<div>

<Header/>

<div style={{display:"flex"}}>
    <Sidebar data={telemetry}/>

    <div>
        <Graphs data={telemetry}/>
        <MapView lat={telemetry.lat} long={telemetry.long}/>
    </div>
</div>

</div>
)

}

export default Dashboard