import { MapContainer, TileLayer, Marker } from "react-leaflet"

function MapView({lat,long}){

if(!lat) return null

return(

<MapContainer center={[lat,long]} zoom={15} style={{height:"400px"}}>

<TileLayer
url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
/>

<Marker position={[lat,long]} />

</MapContainer>

)

}

export default MapView