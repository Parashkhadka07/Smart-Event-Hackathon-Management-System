import { useState } from "react";
import "./App.css";
import Navbar from "./components/html/navbar";
import { Footer } from "./components/html/footer";
import Home from "./components/html/home";
function App() {
 
  
  return (
    <>
    <Navbar />
    <Home/>
    <Footer/>
    </>
  );
}

export default App;
