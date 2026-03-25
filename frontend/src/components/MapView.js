import { MapContainer, TileLayer, Marker } from "react-leaflet"
import "leaflet/dist/leaflet.css"

function MapView({lat,long}){

if(!lat || !long) return <p>Waiting for GPS...</p>

return(

<MapContainer center={[lat,long]} zoom={15} style={{height:"400px", width:"500px"}}>

<TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>

<Marker position={[lat,long]} />

</MapContainer>

)

}

export default MapView