import React, { useState } from "react";
import "../css/register.css";
import Logo from "../../components/html/logo";
// 1. Import the eye icons
import { Eye, EyeOff } from "lucide-react"; 
import axios from 'axios';
const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setconfirmpassword] = useState("");
  const [role, setRole] = useState("");
  const [errorMessage, setErrorMessage] = useState({});

  // 2. Create state variables to track visibility toggle
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

if (role=="participant"){
  setRole("P")
}
else if(role=="organizer"){
  setRole("O")
}
else if(role=="")

  const handleregister = async(e) => {
    e.preventDefault();
    

    if (password !== confirmpassword) {
      setErrorMessage({ password: ["Passwords do not match."] });
      return;
    }

    const userdata = { username, email, password, role };
    // console.log(userdata); 
    try{
    const response=await axios.post("http://localhost:8000/api/v1/users/",userdata)
    console.log("htis is the reaponse fromt he backend:",response.data)
}
    catch(error){
      setErrorMessage(error.response.data)
        console.error("this is  the error",error.response.data);

    }
  };



  return (
    <div className="register-container">
      <div className="register-form-wrapper">
        <Logo />
        <div className="form-card">
          <h2>Register</h2>
          <p className="subtitle">Enter your details below to get started</p>

          <form onSubmit={handleregister} className="register-form">
            

            {/* Email and Username inputs stay identical... */}
            <div className="input-group">
              <label>Email</label>
              <input type="email" placeholder="name@example.com" value={email} required onChange={(e) => setEmail(e.target.value)} />
              {errorMessage.email && <small style={{ color: "red" }}>{errorMessage.email}</small>}
            </div>
            <div className="input-group">
              <label>Username</label>
              <input type="text" placeholder="johndoe" required value={username} onChange={(e) => setUsername(e.target.value)} />
               {errorMessage.username && <small style={{ color: "red" }}>{errorMessage.username}</small>}
            </div>

            {/* 3. Updated Password Field Wrapper */}
            <div className="input-group">
              <label>Password</label>
              <div className="password-wrapper" style={{ position: "relative", display: "flex", alignItems: "center" }}>
                <input
                  type={showPassword ? "text" : "password"} // 👈 Changes dynamically
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ width: "100%",margin:"0 -100px 0 0" }} // Make room for icon
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
                    alignItems: "center"
                  }}
                >
                  {showPassword ? <EyeOff size={20} color="#666" /> : <Eye size={20} color="#666" />}

                </button>
              </div>
                 {errorMessage.password && <small style={{ color: "red" }}>{errorMessage.password}</small>}

            </div>

            {/* 4. Updated Confirm Password Field Wrapper */}
            <div className="input-group">
              <label>Confirm Password</label>
              <div className="password-wrapper" style={{ position: "relative", display: "flex", alignItems: "center" }}>
                <input
                  
                  type={showConfirmPassword ? "text" : "password"} // 👈 Changes dynamically
                  placeholder="••••••••"
                  required
                  value={confirmpassword}
                  onChange={(e) => setconfirmpassword(e.target.value)}
                  style={{ width: "100%",margin:"0 -100px 0 0" }}
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
                    alignItems: "center"
                  }}
                >
                  {showConfirmPassword ? <EyeOff size={20} color="#666" /> : <Eye size={20} color="#666" />}
                </button>

              </div>
                 {errorMessage.password && <small style={{ color: "red" }}>{errorMessage.password}</small>}

            </div>

            <div className="input-group">
              <label>Role</label>
              <input type="text" placeholder="e.g. Developer, Admin" required value={role} onChange={(e) => setRole(e.target.value)} />
                 {errorMessage.role && <small style={{ color: "red" }}>{errorMessage.role}</small>}

            </div>

            <button type="submit" className="buttonn">Register</button>
            <div style={{ textAlign: "center", marginTop: "15px" }}>
              Do you have account? <a href="#">sign in</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
