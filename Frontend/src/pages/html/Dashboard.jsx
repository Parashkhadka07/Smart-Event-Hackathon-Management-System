import { useEffect, useState } from "react";
import axios from "axios";
import "../css/Dashboard.css";
import Sidebar from "../../components/html/sidebar";
import { useNavigate } from "react-router-dom";
import { Search, Upload, Calendar, Users, Code2, Clock } from "lucide-react";

const Dashboard = () => {
  const role = localStorage.getItem("userRole") || "participant";
  const isOrganizer = role === "organizer";
  const isJudge = role === "judge";
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [teams, setTeams] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [judgements, setJudgements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const headers = {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        };
        const [
          eventResponse,
          registrationResponse,
          teamResponse,
          submissionResponse,
          judgementResponse,
        ] = await Promise.all([
          axios.get("http://localhost:8000/api/v1/events/", headers),
          axios.get("http://localhost:8000/api/v1/registrations/", headers),
          axios.get("http://localhost:8000/api/v1/teams/", headers),
          axios.get("http://localhost:8000/api/v1/submissions/", headers),
          axios.get("http://localhost:8000/api/v1/judgements/", headers),
        ]);
        setEvents(eventResponse.data || []);
        setRegistrations(registrationResponse.data || []);
        setTeams(teamResponse.data || []);
        setSubmissions(submissionResponse.data || []);
        setJudgements(judgementResponse.data || []);
      } catch (error) {
        console.error("Unable to load dashboard events", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const activeEvents = events.filter((event) => event.status === "open").length;
  const totalSubmissions = submissions.length;
  const pendingEvaluations = Math.max(
    submissions.length - judgements.length,
    0,
  );

  const participantHeader = {
    title: "Welcome back! 👋",
    subtitle: "Your hackathon workspace is now connected to the backend data.",
    primaryAction: "Submit Project",
    secondaryAction: "Find Hackathons",
  };

  const organizerHeader = {
    title: "Organizer dashboard",
    subtitle: "Monitor live events and registrations from the backend.",
    primaryAction: "Create Event",
    secondaryAction: "View Registrations",
  };

  const judgeHeader = {
    title: "Judge dashboard",
    subtitle: "Review backend-managed submissions and score them accurately.",
    primaryAction: "Review Projects",
    secondaryAction: "Leaderboard",
  };

  const activeHeader = isOrganizer
    ? organizerHeader
    : isJudge
      ? judgeHeader
      : participantHeader;

  return (
    <div className="dash_layout">
      <Sidebar activePage="dashboard" onNavigate={() => {}} />

      <main className="dash_main">
        <div className="dash_header">
          <div>
            <h1 className="dash_title">{activeHeader.title}</h1>
            <p className="dash_subtitle">{activeHeader.subtitle}</p>
          </div>
          <div className="dash_header_actions">
            <button
              className="btn_ghost"
              onClick={() =>
                navigate(
                  isOrganizer
                    ? "/events"
                    : isJudge
                      ? "/leaderboard"
                      : "/events",
                )
              }
            >
              <Search size={14} /> {activeHeader.secondaryAction}
            </button>
            <button
              className="btn_primary"
              onClick={() =>
                navigate(
                  isOrganizer
                    ? "/create-event"
                    : isJudge
                      ? "/review"
                      : "/submit",
                )
              }
            >
              <Upload size={14} /> {activeHeader.primaryAction}
            </button>
          </div>
        </div>

        <div className="stat_grid">
          {isOrganizer ? (
            <>
              <div className="stat_card">
                <div className="stat_top">
                  <span>Events</span>
                  <Calendar size={16} className="stat_icon" />
                </div>
                <div className="stat_value">
                  {loading ? "..." : events.length}
                </div>
                <div className="stat_note">Backend total</div>
              </div>
              <div className="stat_card">
                <div className="stat_top">
                  <span>Open</span>
                  <Users size={16} className="stat_icon" />
                </div>
                <div className="stat_value">{activeEvents}</div>
                <div className="stat_note">Registration open</div>
              </div>
              <div className="stat_card">
                <div className="stat_top">
                  <span>Submissions</span>
                  <Code2 size={16} className="stat_icon" />
                </div>
                <div className="stat_value">
                  {loading ? "..." : totalSubmissions}
                </div>
                <div className="stat_note">Event records</div>
              </div>
              <div className="stat_card">
                <div className="stat_top">
                  <span>Review</span>
                  <Clock size={16} className="stat_icon" />
                </div>
                <div className="stat_value stat_value_alert">Live</div>
                <div className="stat_note">Backend status</div>
              </div>
            </>
          ) : isJudge ? (
            <>
              <div className="stat_card">
                <div className="stat_top">
                  <span>Assigned</span>
                  <Calendar size={16} className="stat_icon" />
                </div>
                <div className="stat_value">{events.length}</div>
                <div className="stat_note">Assigned events</div>
              </div>
              <div className="stat_card">
                <div className="stat_top">
                  <span>Submissions</span>
                  <Code2 size={16} className="stat_icon" />
                </div>
                <div className="stat_value">{totalSubmissions}</div>
                <div className="stat_note">Assigned submissions</div>
              </div>
              <div className="stat_card">
                <div className="stat_top">
                  <span>Live</span>
                  <Users size={16} className="stat_icon" />
                </div>
                <div className="stat_value">
                  {loading ? "..." : pendingEvaluations}
                </div>
                <div className="stat_note">Evaluations remaining</div>
              </div>
              <div className="stat_card">
                <div className="stat_top">
                  <span>Deadline</span>
                  <Clock size={16} className="stat_icon" />
                </div>
                <div className="stat_value stat_value_alert">
                  {loading ? "..." : judgements.length}
                </div>
                <div className="stat_note">Evaluations completed</div>
              </div>
            </>
          ) : (
            <>
              <div className="stat_card">
                <div className="stat_top">
                  <span>Registered</span>
                  <Calendar size={16} className="stat_icon" />
                </div>
                <div className="stat_value">
                  {loading ? "..." : registrations.length}
                </div>
                <div className="stat_note">My hackathons</div>
              </div>
              <div className="stat_card">
                <div className="stat_top">
                  <span>Open</span>
                  <Users size={16} className="stat_icon" />
                </div>
                <div className="stat_value">{activeEvents}</div>
                <div className="stat_note">Registration open</div>
              </div>
              <div className="stat_card">
                <div className="stat_top">
                  <span>Submissions</span>
                  <Code2 size={16} className="stat_icon" />
                </div>
                <div className="stat_value">
                  {loading ? "..." : submissions.length}
                </div>
                <div className="stat_note">My submissions</div>
              </div>
              <div className="stat_card">
                <div className="stat_top">
                  <span>Teams</span>
                  <Clock size={16} className="stat_icon" />
                </div>
                <div className="stat_value stat_value_alert">
                  {loading ? "..." : teams.length}
                </div>
                <div className="stat_note">My teams</div>
              </div>
            </>
          )}
        </div>

        <div className="panel panel_event">
          <div className="panel_top_row">
            <span className="tag_active">Backend event status</span>
            <span className="panel_meta">Live data</span>
          </div>
          <h2 className="panel_title">
            {events[0]?.title || "No event created yet"}
          </h2>
          <p className="panel_desc">
            {events[0]?.description ||
              "Create your first event from the backend or add an event record to begin the workflow."}
          </p>
          <div className="phase_grid">
            {events.length > 0 ? (
              events.slice(0, 3).map((event) => (
                <div className="phase_box" key={event.id}>
                  <div className="phase_label">{event.title}</div>
                  <div className="phase_value">{event.status}</div>
                </div>
              ))
            ) : (
              <div className="phase_box">
                <div className="phase_label">No records</div>
                <div className="phase_value">Backend empty</div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
