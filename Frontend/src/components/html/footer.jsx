import Logo from "./logo";
import "../css/footer.css";

export const Footer = () => {
  return (
    <>
      <div className="footer">
        <Logo />
        <p>© 2026. Built for Organizers, Hackers & Mentors.</p>
        <span>Privacy Policy</span>
        <span>Terms of Service</span>
        <a href="mailto:support@nerdhub.local">Support</a>
      </div>
    </>
  );
};
