import Login from "./pages/Login"
import ForgotPassword from "./pages/ForgotPassword"
import Dashboard from "./pages/Dashboard"
import Navigation from "./pages/Navigation"
import { BrowserRouter,Routes,Route } from "react-router-dom"
import "./styles/dashboard.css";

function App(){

return(

<BrowserRouter>

<Routes>
<Route path="/" element={<Login/>}/>
<Route path="/forgot-password" element={<ForgotPassword/>}/>
<Route path="/dashboard" element={<Dashboard/>}/>
<Route path="/navigation" element={<Navigation/>}/>
</Routes>

</BrowserRouter>

)

}

export default App