import React from "react";
import "../css/sidebar.css";
import { useNavigate } from "react-router-dom";
import {
  Home,
  Compass,
  Users,
  Code2,
  Trophy,
  Bell,
  User,
} from "lucide-react";

const NAV_ICONS = {
  dashboard: Home,
  events: Compass,
  team: Users,
  submit: Code2,
  leaderboard: Trophy,
  notifications: Bell,
  profile: User,
};

const navItems = [
  { id: "dashboard", label: "Dashboard" },
  { id: "events", label: "Discover Events" },
  { id: "team", label: "My Team" },
  { id: "submit", label: "Submit Project" },
  { id: "leaderboard", label: "Leaderboard" },
  { id: "notifications", label: "Notifications" },
  { id: "profile", label: "My Profile" },
];

const Sidebar = ({
  user = { name: "Parash Sharma", role: "Participant", avatar: "" },
  activePage = "dashboard",
  onNavigate = () => {},
}) => {
    const navigate=useNavigate()
  return (
    <aside className="sidebar">
      {/* Brand */}
      <div className="sidebar_header">
        <div className="sidebar_logo" onClick={()=>{navigate("/")} } style={{ cursor: "pointer" }}>
          <span className="logo_mark">N</span>
          <span className="logo_text">
            Nerd<span className="logo_accent">Hub</span>
          </span>
        </div>
        <span className="role_badge">{user.role}</span>
      </div>

      {/* Nav */}
      <nav className="sidebar_nav">
        {navItems.map((item) => {
          const Icon = NAV_ICONS[item.id];
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              className={`nav_item ${isActive ? "nav_item_active" : ""}`}
              onClick={() => navigate("/"+item.id)}
            >
              <Icon className="nav_icon" size={18} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* User footer */}
      <div className="sidebar_footer">
        <div className="footer_user" onClick={() => navigate("/profile")}>
          <img
            src={user.avatar || "https://i.pravatar.cc/100"}
            alt="avatar"
            className="footer_avatar"
          />
          <div className="footer_userinfo">
            <span className="footer_name">{user.name}</span>
            <span className="footer_role">{user.role}</span>
          </div>
        </div>
        <button
          className="footer_bell"
          onClick={() => nagivate("notifications")}
        >
          <Bell className="nav_icon" size={18} />
          <span className="bell_dot"></span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;