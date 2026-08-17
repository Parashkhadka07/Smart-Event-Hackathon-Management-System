import React from "react";
import Logo from "./logo";
import "../css/footer.css";

export const Footer = () => {
  return (
    <>
      <div className="footer">
        <Logo />
        <p>© 2026. Built for Organizers, Hackers & Mentors.</p>
        <a href="#">Privacy Policy</a>
        <a href="#">Terms of Service</a>
        <a href="#">Support</a>
      </div>
    </>
  );
};
