import { BrowserRouter, Route, Routes } from "react-router-dom"
import DashboardScreen from "./screens/dashboard"
import AdminPanel from "./screens/admin"

const App = () => {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<DashboardScreen />} />
        <Route path='/admin' element={<AdminPanel />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
