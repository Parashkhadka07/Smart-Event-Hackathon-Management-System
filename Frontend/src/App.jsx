import { useState } from "react";
import "./App.css";
import Navbar from "./components/html/navbar";
import { Footer } from "./components/html/footer";
import Home from "./pages/html/home";
import Register from "./pages/html/Register";
import Login from "./pages/html/Login";
function App() {
 
  
  return (
    <>
    {/* <Navbar />
   
    <Home/>
   
    <Footer/> */}
    {/* <Register/> */}
    <Login/>
    </>
  );
}

export default App;
