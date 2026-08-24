import React, { useState } from "react";
import "../css/register.css"; // reuse the same styling as Register
import Logo from "../../components/html/logo";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage({});

    const userdata = { email, password };

    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/login/", // adjust to your actual login endpoint
        userdata,
      );
      console.log("login response:", response.data);
      // e.g. store token: localStorage-free approach recommended, but if you use one:
      // localStorage.setItem("access", response.data.access);
    } catch (error) {
      if (error.response?.data) {
        setErrorMessage(error.response.data);
      } else {
        setErrorMessage({ non_field_errors: ["Something went wrong. Please try again."] });
      }
      console.error("login error", error.response?.data);
    }
  };

  return (
    <div className="register-container">
      <div className="register-form-wrapper">
        <Logo />
        <div className="form-card">
          <h2>Login</h2>
          <p className="subtitle">Enter your credentials to continue</p>

          <form onSubmit={handleLogin} className="register-form">
            {errorMessage.non_field_errors && (
              <p className="error-text" style={{ color: "red" }}>
                {errorMessage.non_field_errors.join(" ")}
              </p>
            )}

            <div className="input-group">
              <label>Email</label>
              <input
                type="email"
                placeholder="name@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                style={{ position: "relative", display: "flex", alignItems: "center" }}
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
                  {showPassword ? <EyeOff size={20} color="#666" /> : <Eye size={20} color="#666" />}
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

            <button type="submit" className="buttonn">
              Login
            </button>
            <div style={{ textAlign: "center", marginTop: "15px" }}>
              Don't have an account? <a href="#">sign up</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;