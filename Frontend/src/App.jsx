import { useState } from "react";
import "./App.css";
import Navbar from "./components/html/navbar";
import { Footer } from "./components/html/footer";
import Home from "./pages/html/home";
import Register from "./pages/html/Register";
import Login from "./pages/html/Login";
import { Routes,Route } from "react-router-dom";
import Dashboard from "./pages/html/Dashboard";
import Profile from "./pages/html/Profile";
import Discover from "./pages/html/Discover";
import Team from "./pages/html/Team";
import SubmitProject from "./pages/html/SubmitProject";
import Leaderboard from "./pages/html/LeaderBoard";
import Notifications from "./pages/html/Notifications";


function App() {
 
  
  return (
    <>
   <Routes>
    <Route path="/" element={ <Home/> }></Route>
    <Route path="/login" element={ <Login/> }></Route>
    <Route path="/register" element={ <Register/> }></Route>
    <Route path="/dashboard" element={ <Dashboard/> }></Route>
    <Route path="/Profile" element={ <Profile/> }></Route>
    <Route path="/events" element={ <Discover/> }></Route>
    <Route path="/team" element={ <Team/> }></Route>
    <Route path="/submit" element={ <SubmitProject/> }></Route>
    <Route path="/leaderboard" element={ <Leaderboard/> }></Route>
    <Route path="/notifications" element={ <Notifications/> }></Route>









   </Routes>
    </>
  );
}

export default App;
