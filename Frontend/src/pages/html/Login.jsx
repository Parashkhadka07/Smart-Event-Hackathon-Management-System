import { useState } from "react";
import "../css/register.css"; // reuse the same styling as Register
import Logo from "../../components/html/logo";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { setLoggedInUser } from "../../utils/auth";
import { ArrowRight, ShieldCheck } from "lucide-react";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage({});
    setIsSubmitting(true);

    const userdata = { username, password };

    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/login/",
        userdata,
      );

      const tokenResponse = await axios.get(
        "http://localhost:8000/api/v1/me/",
        {
          headers: { Authorization: `Bearer ${response.data.access}` },
        },
      );

      const role = tokenResponse.data.role || "participant";

      setLoggedInUser({
        username,
        role,
        accessToken: response.data.access,
        refreshToken: response.data.refresh,
      });

      navigate("/dashboard");
      alert("login sucessfull");
    } catch (error) {
      if (error.response?.data) {
        setErrorMessage(error.response.data);
      } else {
        setErrorMessage({
          non_field_errors: ["Something went wrong. Please try again."],
        });
      }
      console.error("login error", error.response?.data);
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
            <ShieldCheck size={14} /> Secure workspace access
          </span>
          <h1>Bring your next big idea into focus.</h1>
          <p>
            One calm workspace for finding challenges, running events, and
            making judging fair.
          </p>
        </div>
        <div className="auth-aside_footer">
          NerdHub / Hackathon Management System
        </div>
      </aside>
      <main className="auth-form-wrapper">
        <div className="auth-form-card">
          <div className="auth-mobile_logo">
            <Logo />
          </div>
          <span className="auth-kicker">Welcome back</span>
          <h2>Login</h2>
          <p className="subtitle">Sign in to continue to your workspace.</p>

          <form onSubmit={handleLogin} className="register-form">
            {errorMessage.non_field_errors && (
              <p className="error-text" style={{ color: "red" }}>
                {errorMessage.non_field_errors.join(" ")}
              </p>
            )}
            <div>
              {errorMessage.detail && (
                <small style={{ color: "red" }}>{errorMessage.detail}</small>
              )}
            </div>
            <div className="input-group">
              <label>Username</label>
              <input
                placeholder="username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              {errorMessage.email && (
                <small style={{ color: "red" }}>
                  {Array.isArray(errorMessage.email)
                    ? errorMessage.email.join(" ")
                    : errorMessage.email}
                </small>
              )}
            </div>

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
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ width: "100%", margin: "0 -100px 0 0" }}
                />
                <button
                  type="button"
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
                <small style={{ color: "red" }}>
                  {Array.isArray(errorMessage.password)
                    ? errorMessage.password.join(" ")
                    : errorMessage.password}
                </small>
              )}
            </div>

            <button type="submit" className="buttonn" disabled={isSubmitting}>
              {isSubmitting ? "Signing in..." : "Sign in"}{" "}
              {!isSubmitting && <ArrowRight size={16} />}
            </button>
            <div className="auth-switch">
              Don&apos;t have an account? <Link to="/register">Create one</Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Login;
