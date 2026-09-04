import { useEffect, useState } from "react";
import axios from "axios";
import { CalendarDays, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import Sidebar from "../../components/html/sidebar";
import { getAuthHeaders } from "../../utils/auth";
import "../css/dashboard.css";

const MyHackathons = () => {
  const [items, setItems] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [state, setState] = useState("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const [registrationsResponse, eventsResponse] = await Promise.all([
          axios.get("http://localhost:8000/api/v1/registrations/", {
            headers: getAuthHeaders(),
          }),
          axios.get("http://localhost:8000/api/v1/events/", {
            headers: getAuthHeaders(),
          }),
        ]);
        const registeredIds = new Set(
          (registrationsResponse.data || []).map((item) => String(item.event)),
        );
        setRegistrations(registrationsResponse.data || []);
        setItems(
          (eventsResponse.data || []).filter((event) =>
            registeredIds.has(String(event.id)),
          ),
        );
        setState("ready");
      } catch {
        setState("error");
      }
    };
    load();
  }, []);

  const cancelRegistration = async (registrationId, eventId) => {
    if (!window.confirm("Cancel your registration for this hackathon?")) return;
    try {
      await axios.delete(
        `http://localhost:8000/api/v1/registrations/${registrationId}/`,
        { headers: getAuthHeaders() },
      );
      setRegistrations((current) =>
        current.filter((item) => String(item.id) !== String(registrationId)),
      );
      setItems((current) =>
        current.filter((event) => String(event.id) !== String(eventId)),
      );
      setMessage("Registration cancelled.");
    } catch {
      setMessage("Registration could not be cancelled.");
    }
  };

  return (
    <div className="dash_layout" >
      <Sidebar activePage="my-hackathons" />
      <main className="dash_main">
        <div className="dash_header">
          <div>
            <h1 className="dash_title">My Hackathons</h1>
            <p className="dash_subtitle">Your registrations and next steps.</p>
          </div>
          <Link className="btn_primary" to="/events">
            Browse hackathons <ArrowRight size={14} />
          </Link>
        </div>
        {state === "loading" && <p>Loading your registrations...</p>}
        {state === "error" && (
          <p className="error_text">
            Unable to load your registered hackathons.
          </p>
        )}
        {state === "ready" && items.length === 0 && (
          <div className="panel">
            <h2 className="panel_title">No registered hackathons yet</h2>
            <p className="panel_desc">
              Browse open hackathons and register to start your journey.
            </p>
            <Link className="btn_primary" to="/events">
              Find a hackathon
            </Link>
          </div>
        )}
        {message && <p className="success_text">{message}</p>}
        {state === "ready" && items.length > 0 && (
          <div className="event_grid">
            {items.map((event) => (
              <article className="event_card" key={event.id}>
                <div className="event_banner banner_open">
                  <span className="event_status">REGISTERED</span>
                  <h3 className="event_name">{event.title}</h3>
                </div>
                <div className="event_body">
                  <div className="event_meta_row">
                    <span>
                      <CalendarDays size={13} />{" "}
                      {new Date(event.start_date).toLocaleDateString()}
                    </span>
                    <span>{event.status}</span>
                  </div>
                  <p className="event_desc">
                    {event.description || "No description provided."}
                  </p>
                  <Link
                    className="btn_ghost btn_full"
                    to={`/events/${event.id}`}
                  >
                    Open hackathon
                  </Link>
                  {event.status === "open" && (
                    <button
                      className="btn_ghost btn_full"
                      onClick={() =>
                        cancelRegistration(
                          registrations.find(
                            (item) => String(item.event) === String(event.id),
                          )?.id,
                          event.id,
                        )
                      }
                    >
                      Cancel registration
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default MyHackathons;
