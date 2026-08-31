import { useState } from "react";
import "../css/navbar.css";
import Logo from "./logo";
import Button from "./Button";
import { User, CircleUserRound } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [activeLink, setActiveLink] = useState("Home");
  const navigate = useNavigate();

  const navLinks = ["Home", "Events", "How It Works", "Leaderboard"];

  // Check if user is logged in
  const isLoggedIn = !!localStorage.getItem("accessToken");

  return (
    <div className="navbar">
      <Logo />

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
        {isLoggedIn ? (
          // Logged in → show profile icon

          <div style={{ display: "flex", gap: "50px" }}>
            <CircleUserRound size={32} className="text-blue-500" />

            <Button
              name="log out"
              to=""
              onClick={() => {
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");

                navigate("/login");
              }}
            />
          </div>
        ) : (
          // Not logged in → show Login + Register
          <>
            <Button name="Login" link="/login" />
            <Button name="Register" link="/register" />
          </>
        )}
      </ul>
    </div>
  );
};

export default Navbar;
