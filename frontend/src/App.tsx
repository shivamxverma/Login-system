import NavBar from "./components/Navbar"
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Signup";
import Dashboard from "./pages/Dashboard";

function App() {

  return (
    <>
      <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
