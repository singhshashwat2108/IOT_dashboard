function Sidebar({data}){

  return(
  
  <div style={{
      width:"250px",
      background:"#f4f4f4",
      padding:"10px"
  }}>
  
  <h3>Status</h3>
  
  <p><b>Delivery:</b> {data.status || "Packaging"}</p>
  <p><b>Robot:</b> {data.status || "Not Started"}</p>
  
  <p><b>Speed:</b> {data.speed || 0} m/s</p>
  <p><b>Battery:</b> {data.battery || 0}%</p>
  
  <p><b>Acceleration:</b> {data.accel || 0}</p>
  
  <p><b>Coordinates:</b></p>
  <p>{data.lat || 0}, {data.long || 0}</p>
  
  </div>
  
  )
  
  }
  
  export default Sidebar