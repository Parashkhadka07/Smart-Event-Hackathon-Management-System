import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/html/home";
import Register from "./pages/html/Register";
import Login from "./pages/html/Login";
import Dashboard from "./pages/html/Dashboard";
import Profile from "./pages/html/Profile";
import Discover from "./pages/html/Discover";
import Team from "./pages/html/Team";
import SubmitProject from "./pages/html/SubmitProject";
import Leaderboard from "./pages/html/LeaderBoard";
import Notifications from "./pages/html/Notifications";
import CreateEvent from "./pages/html/CreateEvent";
import ReviewProjects from "./pages/html/ReviewProjects";
import OrganizerHackathons from "./pages/html/OrganizerHackathons";
import HackathonDetails from "./pages/html/HackathonDetails";
import MyHackathons from "./pages/html/MyHackathons";
import OrganizerWorkspace from "./pages/html/OrganizerWorkspace";
import { isAuthenticated, normalizeRole } from "./utils/auth";

function ProtectedRoute({ children, allowedRoles = [] }) {
  const tokenExists = isAuthenticated();
  const currentRole = normalizeRole(localStorage.getItem("userRole"));

  if (!tokenExists) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(currentRole)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute
              allowedRoles={["participant", "organizer", "judge"]}
            >
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute
              allowedRoles={["participant", "organizer", "judge"]}
            >
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/events"
          element={
            <ProtectedRoute
              allowedRoles={["participant", "organizer", "judge"]}
            >
              <Discover />
            </ProtectedRoute>
          }
        />
        <Route
          path="/events/:eventId"
          element={
            <ProtectedRoute
              allowedRoles={["participant", "organizer", "judge"]}
            >
              <HackathonDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/team"
          element={
            <ProtectedRoute allowedRoles={["participant"]}>
              <Team />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-hackathons"
          element={
            <ProtectedRoute allowedRoles={["participant"]}>
              <MyHackathons />
            </ProtectedRoute>
          }
        />
        <Route
          path="/submit"
          element={
            <ProtectedRoute allowedRoles={["participant"]}>
              <SubmitProject />
            </ProtectedRoute>
          }
        />
        <Route
          path="/leaderboard"
          element={
            <ProtectedRoute
              allowedRoles={["participant", "organizer", "judge"]}
            >
              <Leaderboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <ProtectedRoute
              allowedRoles={["participant", "organizer", "judge"]}
            >
              <Notifications />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-event"
          element={
            <ProtectedRoute allowedRoles={["organizer"]}>
              <CreateEvent />
            </ProtectedRoute>
          }
        />
        <Route
          path="/review"
          element={
            <ProtectedRoute allowedRoles={["judge"]}>
              <ReviewProjects />
            </ProtectedRoute>
          }
        />
        <Route
          path="/organizer/hackathons"
          element={
            <ProtectedRoute allowedRoles={["organizer"]}>
              <OrganizerHackathons />
            </ProtectedRoute>
          }
        />
        <Route
          path="/organizer/hackathons/:eventId/manage"
          element={
            <ProtectedRoute allowedRoles={["organizer"]}>
              <OrganizerWorkspace />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
