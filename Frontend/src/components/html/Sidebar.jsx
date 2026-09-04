import "../css/sidebar.css";
import { useNavigate } from "react-router-dom";
import { getStoredUser } from "../../utils/auth";
import {
  Home,
  Compass,
  Users,
  Code2,
  Trophy,
  Bell,
  User,
  CalendarPlus,
  ClipboardCheck,
  Calendar,
  LogOut,
} from "lucide-react";

const NAV_ICONS = {
  dashboard: Home,
  events: Compass,
  team: Users,
  submit: Code2,
  leaderboard: Trophy,
  notifications: Bell,
  profile: User,
  "create-event": CalendarPlus,
  review: ClipboardCheck,
  hackathons: Calendar,
  "my-hackathons": Calendar,
};

const navItems = [
  { id: "dashboard", label: "Dashboard" },
  { id: "create-event", label: "Create Event", organizerOnly: true },
  { id: "hackathons", label: "My Hackathons", organizerOnly: true },
  { id: "review", label: "Review Projects", judgeOnly: true },
  { id: "events", label: "Discover Events" },
  { id: "my-hackathons", label: "My Hackathons", participantOnly: true },
  { id: "team", label: "My Team" },
  { id: "submit", label: "Submit Project" },
  { id: "leaderboard", label: "Leaderboard" },
  { id: "notifications", label: "Notifications" },
  { id: "profile", label: "My Profile" },
];

const Sidebar = ({
  user = getStoredUser(),
  activePage = "dashboard",
  onNavigate = () => {},
}) => {
  const navigate = useNavigate();
  const currentUser = {
    ...getStoredUser(),
    ...user,
    role: (user?.role || getStoredUser().role || "participant").replace(
      /_/g,
      " ",
    ),
    name: user?.name || getStoredUser().name || "Hackathon User",
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userRole");
    localStorage.removeItem("username");
    navigate("/login");
  };

  const visibleNavItems = (() => {
    const role = (currentUser.role || "participant").toLowerCase();

    if (role === "organizer")
      return navItems.filter((item) => !item.judgeOnly && item.id !== "submit");
    if (role === "judge")
      return navItems.filter(
        (item) =>
          !item.organizerOnly &&
          [
            "dashboard",
            "events",
            "review",
            "leaderboard",
            "notifications",
            "profile",
          ].includes(item.id),
      );
    return navItems.filter(
      (item) =>
        !item.organizerOnly &&
        !item.judgeOnly &&
        [
          "dashboard",
          "events",
          "my-hackathons",
          "team",
          "submit",
          "leaderboard",
          "notifications",
          "profile",
        ].includes(item.id),
    );
  })();

  return (
    <aside className="sidebar">
      {/* Brand */}
      <div className="sidebar_header">
        <div
          className="sidebar_logo"
          onClick={() => {
            navigate("/");
          }}
          style={{ cursor: "pointer" }}
        >
          <span className="logo_mark">N</span>
          <span className="logo_text">
            Nerd<span className="logo_accent">Hub</span>
          </span>
        </div>
        <span className="role_badge">{currentUser.role}</span>
      </div>

      {/* Nav */}
      <nav className="sidebar_nav">
        {visibleNavItems.map((item) => {
          const Icon = NAV_ICONS[item.id];
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              className={`nav_item ${isActive ? "nav_item_active" : ""}`}
              onClick={() => {
                onNavigate(item.id);
                navigate(
                  item.id === "hackathons"
                    ? "/organizer/hackathons"
                    : "/" + item.id,
                );
              }}
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
          <div className="footer_avatar" aria-label="User avatar">
            {currentUser.name.slice(0, 1).toUpperCase()}
          </div>
          <div className="footer_userinfo">
            <span className="footer_name">{currentUser.name}</span>
            <span className="footer_role">{currentUser.role}</span>
          </div>
        </div>
        <button
          className="footer_bell"
          onClick={() => navigate("/notifications")}
        >
          <Bell className="nav_icon" size={18} />
          <span className="bell_dot"></span>
        </button>
        <button
          className="footer_logout"
          type="button"
          onClick={handleLogout}
          aria-label="Log out"
          title="Log out"
        >
          <LogOut size={17} />
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
