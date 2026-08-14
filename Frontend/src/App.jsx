import { useState } from "react";
import "./App.css";
import Navbar from "./components/html/navbar";
import Home from "./pages/html/home";
import { Footer, SecondFooter } from "./components/html/footer";
function App() {
  const [num,setNum]=useState(5)
  
  
  return (
    <>
     <h1><Navbar /> </h1> 
      <h1><Home /> </h1>
      <button onClick={()=>{setNum(num-1)}}>decrease</button>
      <h1>The number is : {num}</h1>
      <button onClick={()=>{setNum(num+1)}}>increase</button>
      <Footer />
      <SecondFooter />
    </>
  );
}

export default App;
