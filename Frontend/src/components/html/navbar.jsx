import { useState } from "react";
import "../css/navbar.css";
import Logo from "./logo";
import Button from "./Button";
const Navbar = () => {
  const [activeLink, setActiveLink] = useState("Home");

  const navLinks = ["Home", "Events", "How It Works", "Leaderboard"];

  return (
    <>
      <div className="navbar">
       <Logo/>

        <ul className="links">
          {navLinks.map((link) => (
            <li
              key={link}
              className={activeLink === link ? "active" : ""}
              onClick={() => setActiveLink(link)}
            >
              {link}
            </li>
          ))}
        </ul>

        <ul className="user">
          <Button name='Login'/>
          <Button name='Register'/>
        </ul>
      </div>
    </>
  );
};

export default Navbar;