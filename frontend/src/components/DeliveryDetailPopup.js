function DeliveryDetailsPopup({onClose,data}){

  return(
  
  <div style={{
      position:"fixed",
      top:"20%",
      left:"30%",
      background:"white",
      padding:"20px",
      border:"2px solid black"
  }}>
  
  <h3>Delivery Details</h3>
  
  <p>Status: {data.status}</p>
  <p>Speed: {data.speed}</p>
  <p>Battery: {data.battery}</p>
  
  <button onClick={onClose}>Close</button>
  
  </div>
  
  )
  
  }
  
  export default DeliveryDetailsPopup