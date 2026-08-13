import { useState } from "react";
import "./App.css";
import Navbar from "./components/html/navbar";
import Home from "./pages/html/home";
import { Footer, SecondFooter } from "./components/html/footer";
function App() {
  return (
    <>
     <h1><Navbar /> </h1> 
      <h1><Home /> </h1>
      
      <Footer />
      <SecondFooter />
    </>
  );
}

export default App;
