import { Line } from "react-chartjs-2"
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement } from "chart.js"

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement)

function Graphs({data}){

const chartData = {
    labels:["Now"],
    datasets:[
        {
            label:"Speed",
            data:[data.speed || 0],
        },
        {
            label:"Battery",
            data:[data.battery || 0],
        }
    ]
}

return(
<div style={{width:"500px"}}>
    <Line data={chartData}/>
</div>
)

}

export default Graphs