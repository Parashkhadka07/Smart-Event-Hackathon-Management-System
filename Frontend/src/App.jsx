import { useState } from "react";
import "./App.css";
import Navbar from "./components/html/navbar";
import { Footer } from "./components/html/footer";
import Home from "./pages/html/home";
import Register from "./pages/html/Register";
import Login from "./pages/html/Login";
import { Routes,Route } from "react-router-dom";


function App() {
 
  
  return (
    <>
   <Routes>
    <Route path="/" element={ <Home/> }></Route>
    <Route path="/login" element={ <Login/> }></Route>
    <Route path="/register" element={ <Register/> }></Route>


   </Routes>
    </>
  );
}

export default App;
