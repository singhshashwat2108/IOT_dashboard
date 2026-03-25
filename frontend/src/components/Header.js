import Timer from "./Timer"

function Header(){

const user = localStorage.getItem("user")

function refreshPage(){
    window.location.reload()
}

function showDetails(){
    alert("Delivery Details Popup (You can replace with modal)")
}

return(

<div style={{
    display:"flex",
    justifyContent:"space-between",
    padding:"10px",
    background:"#222",
    color:"white"
}}>

<div>
    <button>Contact</button>
    <button>Update</button>
    <button onClick={refreshPage}>Refresh</button>
    <button onClick={showDetails}>Details</button>
</div>

<Timer/>

<div>
    User: {user}
</div>

</div>

)

}

export default Header