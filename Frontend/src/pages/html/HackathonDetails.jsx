import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  MapPin,
  Users,
} from "lucide-react";
import Sidebar from "../../components/html/sidebar";
import { getAuthHeaders, normalizeRole } from "../../utils/auth";
import "../css/dashboard.css";

const API = "http://localhost:8000/api/v1";
const formatDate = (value) =>
  value
    ? new Date(value).toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "Not scheduled";

const HackathonDetails = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const role = normalizeRole(localStorage.getItem("userRole"));
  const [event, setEvent] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [registered, setRegistered] = useState(false);

  useEffect(() => {
    axios
      .get(`${API}/events/${eventId}/`, { headers: getAuthHeaders() })
      .then(({ data }) => setEvent(data))
      .catch(() => setError("This hackathon could not be loaded."));
    if (role === "participant") {
      axios
        .get(`${API}/registrations/`, { headers: getAuthHeaders() })
        .then(({ data }) =>
          setRegistered(
            (data || []).some((item) => String(item.event) === String(eventId)),
          ),
        )
        .catch(() => setRegistered(false));
    }
  }, [eventId, role]);

  const register = async () => {
    try {
      await axios.post(
        `${API}/events/${eventId}/register/`,
        {},
        { headers: getAuthHeaders() },
      );
      setRegistered(true);
      setMessage("Registration completed. Create or join a team to continue.");
    } catch (requestError) {
      setError(
        requestError.response?.data?.detail ||
          "Registration could not be completed.",
      );
    }
  };

  if (!event)
    return (
      <div className="dash_layout">
        <Sidebar activePage="events" />
        <main className="dash_main">
          <p className={error ? "error_text" : ""}>
            {error || "Loading hackathon..."}
          </p>
        </main>
      </div>
    );

  return (
    <div className="dash_layout">
      <Sidebar activePage="events" />
      <main className="dash_main">
        <Link className="back_link" to="/events">
          <ArrowLeft size={15} /> Back to hackathons
        </Link>
        <section className="event_detail_hero panel">
          <span className={`status_badge status_${event.status}`}>
            {event.status}
          </span>
          <h1 className="dash_title">{event.title}</h1>
          <p className="dash_subtitle">
            {event.description || "No description has been added yet."}
          </p>
          <div className="event_detail_meta">
            <span>
              <CalendarDays size={15} /> {formatDate(event.start_date)} to{" "}
              {formatDate(event.end_date)}
            </span>
            <span>
              <MapPin size={15} /> Online
            </span>
            <span>
              <Users size={15} /> Organizer:{" "}
              {event.organizer || "Event organizer"}
            </span>
          </div>
          <div className="detail_actions">
            {role === "participant" &&
              event.status === "open" &&
              !registered && (
                <button className="btn_primary" onClick={register}>
                  Register now
                </button>
              )}
            {role === "participant" && registered && (
              <span className="success_text">
                <CheckCircle2 size={15} /> Registered
              </span>
            )}
            {role === "organizer" && (
              <button
                className="btn_primary"
                onClick={() => navigate("/organizer/hackathons")}
              >
                Manage hackathon
              </button>
            )}
            {role === "judge" && (
              <button
                className="btn_primary"
                onClick={() => navigate("/review")}
              >
                Review assigned projects
              </button>
            )}
            {event.status !== "open" && (
              <span className="muted_text">Registration is not open.</span>
            )}
          </div>
          {message && (
            <p className="success_text">
              <CheckCircle2 size={15} /> {message}
            </p>
          )}
          {error && <p className="error_text">{error}</p>}
        </section>
        <div className="detail_grid">
          <section className="panel detail_section">
            <h2>Overview</h2>
            <p>{event.description || "No overview has been added yet."}</p>
          </section>
          <section className="panel detail_section">
            <h2>Timeline</h2>
            <div className="timeline_row">
              <strong>Starts</strong>
              <span>{formatDate(event.start_date)}</span>
            </div>
            <div className="timeline_row">
              <strong>Ends</strong>
              <span>{formatDate(event.end_date)}</span>
            </div>
          </section>
          <section className="panel detail_section">
            <h2>Participation</h2>
            <p>
              Registration details will appear here when configured by the
              organizer.
            </p>
          </section>
          <section className="panel detail_section">
            <h2>Prize pool</h2>
            <p>{event.prize_pool || "0"}</p>
          </section>
        </div>
      </main>
    </div>
  );
};

export default HackathonDetails;
