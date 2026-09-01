import {Link } from "react-router-dom";
import '../css/logo.css'
const Logo = () => {
  return (
    <>
     <Link to='/' className="project">
          <div className="logo">N</div>
          <div className="name">
            <span className="firstname">Nerd</span>
            <span className="lastname">Hub</span>
            <p className="full">Hackathon Management System</p>
          </div>
        </Link>
    </>
  )
}

export default Logo