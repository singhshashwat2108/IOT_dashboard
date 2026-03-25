import { useState } from "react"
import { useNavigate } from "react-router-dom"

function Login(){

const [user,setUser]=useState("")
const navigate = useNavigate()

function login(){

localStorage.setItem("user",user)
navigate("/dashboard")

}

return(

<div>

<h2>Robot Delivery Login</h2>

<input
placeholder="username"
onChange={(e)=>setUser(e.target.value)}
/>

<button onClick={login}>Login</button>

</div>

)

}

export default Login