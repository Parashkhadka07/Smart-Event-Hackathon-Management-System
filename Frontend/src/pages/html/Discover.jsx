import { useState, useEffect } from "react";
import axios from "axios";
import "../css/dashboard.css";
import "../css/discover.css";
import Sidebar from "../../components/html/sidebar";
import { Search, Calendar, Users, Trophy, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Discover = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(
          "http://localhost:8000/api/v1/events/",
          {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          },
        );
        setEvents(response.data || []);
      } catch (err) {
        console.error("Failed to load events", err);
        setError("Unable to load events from the backend.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const filtered = events.filter((event) =>
    event.title?.toLowerCase().includes(query.toLowerCase()),
  );

  const formatDate = (value) => {
    if (!value) return "TBD";
    return new Date(value).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const statusLabel = (status) => {
    const map = {
      draft: "DRAFT",
      open: "REGISTRATION OPEN",
      closed: "CLOSED",
      completed: "COMPLETED",
    };
    return map[status] || status?.toUpperCase() || "UNKNOWN";
  };

  const statusType = (status) => {
    if (status === "open") return "open";
    if (status === "completed") return "completed";
    if (status === "closed") return "upcoming";
    return "upcoming";
  };

  return (
    <div className="dash_layout">
      <Sidebar activePage="events" onNavigate={() => {}} />

      <main className="dash_main">
        <div className="dash_header">
          <div>
            <h1 className="dash_title">Discover Hackathons & Events</h1>
            <p className="dash_subtitle">
              Explore live backend-driven hackathons and event data.
            </p>
          </div>
        </div>

        <div className="panel filter_bar">
          <div className="search_box">
            <Search size={14} className="search_icon" />
            <input
              type="text"
              placeholder="Search hackathons..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="event_grid">
          {loading ? (
            <p className="no_results">Loading events...</p>
          ) : error ? (
            <p className="no_results">{error}</p>
          ) : filtered.length > 0 ? (
            filtered.map((event) => {
              const type = statusType(event.status);
              return (
                <div className="event_card" key={event.id}>
                  <div className={`event_banner banner_${type}`}>
                    <span className={`event_status status_${type}`}>
                      {statusLabel(event.status)}
                    </span>
                    <div>
                      <h3 className="event_name">{event.title}</h3>
                      <span className="event_org">
                        Organized by {event.organizer || "Event Team"}
                      </span>
                    </div>
                  </div>

                  <div className="event_body">
                    <div className="event_meta_row">
                      <span>
                        <Calendar size={12} /> {formatDate(event.start_date)} -{" "}
                        {formatDate(event.end_date)}
                      </span>
                      <span>
                        <MapPin size={12} /> Online
                      </span>
                    </div>
                    <div className="event_meta_row">
                      <span>
                        <Users size={12} /> {event.registrations?.length || 0}{" "}
                        Participants
                      </span>
                      <span className="event_prize">
                        <Trophy size={12} /> {event.prize_pool || "0"}
                      </span>
                    </div>
                    <p className="event_desc">{event.description}</p>
                  </div>

                  <div className="event_footer">
                    <button
                      className="btn_ghost btn_full"
                      onClick={() => navigate(`/events/${event.id}`)}
                    >
                      View hackathon
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="no_results">No events match your search.</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default Discover;
