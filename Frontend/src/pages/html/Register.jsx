import { useState } from "react";
import "../css/register.css";
import Logo from "../../components/html/logo";
// 1. Import the eye icons
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { setLoggedInUser } from "../../utils/auth";
import { ArrowRight, ShieldCheck } from "lucide-react";
const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setconfirmpassword] = useState("");
  const [role, setRole] = useState("");
  const [errorMessage, setErrorMessage] = useState({});

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const selectedRole = role;

  const handleregister = async (e) => {
    e.preventDefault();

    if (password !== confirmpassword) {
      setErrorMessage({ password: ["Passwords do not match."] });
      return;
    }

    const userdata = { username, email, password, role: selectedRole };
    setIsSubmitting(true);
    try {
      await axios.post("http://localhost:8000/api/v1/users/", userdata);
      setLoggedInUser({ username, role: selectedRole });
      setErrorMessage({});
      navigate("/login");
    } catch (error) {
      setErrorMessage(
        error.response?.data || { detail: "Unable to create your account." },
      );
      console.error("this is  the error", error.response.data);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-container">
      <aside className="auth-aside">
        <Logo />
        <div className="auth-aside_content">
          <span className="auth-eyebrow">
            <ShieldCheck size={14} /> Build your place in the room
          </span>
          <h1>Start with the right workspace for your role.</h1>
          <p>
            Join as a participant, organizer, or judge. Your workspace will
            adapt to the work ahead.
          </p>
        </div>
        <div className="auth-aside_footer">Participant / Organizer / Judge</div>
      </aside>
      <main className="auth-form-wrapper">
        <div className="auth-form-card auth-register-card">
          <div className="auth-mobile_logo">
            <Logo />
          </div>
          <span className="auth-kicker">Create your account</span>
          <h2>Join NerdHub</h2>
          <p className="subtitle">
            Set up your account and choose how you contribute.
          </p>

          <form onSubmit={handleregister} className="register-form">
            {/* Email and Username inputs stay identical... */}
            <div className="input-group">
              <label>Email</label>
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
              />
              {errorMessage.email && (
                <small style={{ color: "red" }}>{errorMessage.email}</small>
              )}
            </div>
            <div className="input-group">
              <label>Username</label>
              <input
                type="text"
                placeholder="johndoe"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              {errorMessage.username && (
                <small style={{ color: "red" }}>{errorMessage.username}</small>
              )}
            </div>

            {/* 3. Updated Password Field Wrapper */}
            <div className="input-group">
              <label>Password</label>
              <div
                className="password-wrapper"
                style={{
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <input
                  type={showPassword ? "text" : "password"} // 👈 Changes dynamically
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ width: "100%", margin: "0 -100px 0 0" }} // Make room for icon
                />
                <button
                  type="button" // 👈 Crucial to prevent accidental form submission
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: "10px",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {showPassword ? (
                    <EyeOff size={20} color="#666" />
                  ) : (
                    <Eye size={20} color="#666" />
                  )}
                </button>
              </div>
              {errorMessage.password && (
                <small style={{ color: "red" }}>{errorMessage.password}</small>
              )}
            </div>

            {/* 4. Updated Confirm Password Field Wrapper */}
            <div className="input-group">
              <label>Confirm Password</label>
              <div
                className="password-wrapper"
                style={{
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <input
                  type={showConfirmPassword ? "text" : "password"} // 👈 Changes dynamically
                  placeholder="••••••••"
                  required
                  value={confirmpassword}
                  onChange={(e) => setconfirmpassword(e.target.value)}
                  style={{ width: "100%", margin: "0 -100px 0 0" }}
                />
                <button
                  type="button" // 👈 Prevent form submission
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{
                    position: "absolute",
                    right: "10px",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} color="#666" />
                  ) : (
                    <Eye size={20} color="#666" />
                  )}
                </button>
              </div>
              {errorMessage.password && (
                <small style={{ color: "red" }}>{errorMessage.password}</small>
              )}
            </div>

            <div className="input-group">
              <label>Role</label>
              <select
                className="role"
                required
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="" disabled>
                  Select a role
                </option>
                <option value="participant">participant</option>
                <option value="judge">judge</option>
                <option value="organizer">organizer</option>
              </select>
            </div>
            {errorMessage.role && (
              <small style={{ color: "red" }}>{errorMessage.role}</small>
            )}

            <button type="submit" className="buttonn" disabled={isSubmitting}>
              {isSubmitting ? "Creating account..." : "Create account"}{" "}
              {!isSubmitting && <ArrowRight size={16} />}
            </button>
            <div className="auth-switch">
              Already have an account? <Link to="/login">Sign in</Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Register;
