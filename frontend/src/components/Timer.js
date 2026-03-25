import { useState,useEffect } from "react"

function Timer(){

const [time,setTime] = useState(600)

useEffect(()=>{

const interval = setInterval(()=>{
    setTime(t => t > 0 ? t-1 : 0)
},1000)

return ()=>clearInterval(interval)

},[])

return(
<h3>ETA: {time}s</h3>
)

}

export default Timer