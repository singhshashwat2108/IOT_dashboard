import { useEffect,useState } from "react"
import socket from "../services/socketService"

import Header from "../components/Header"
import Sidebar from "../components/Sidebar"
import Graphs from "../components/Graphs"
import MapView from "../components/MapView"
import DeliveryDetailsPopup from "../components/DeliveryDetailsPopup"

function Dashboard(){

const [telemetry,setTelemetry] = useState({})
const [showPopup,setShowPopup] = useState(false)

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

<button onClick={()=>setShowPopup(true)}>Open Details</button>

</div>

</div>

{showPopup && (
<DeliveryDetailsPopup
data={telemetry}
onClose={()=>setShowPopup(false)}
/>
)}

</div>

)

}

export default Dashboard