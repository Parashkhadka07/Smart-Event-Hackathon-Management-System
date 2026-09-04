import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/html/sidebar";
import { getAuthHeaders } from "../../utils/auth";
import "../css/dashboard.css";


const OrganizerHackathons = () => {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const loadEvents = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/v1/events/", {
        headers: getAuthHeaders(),
      });
      setEvents(response.data || []);
    } catch {
      setError("Unable to load your hackathons.");
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const updateStatus = async (event, status) => {
    if (
      status === "cancelled" &&
      !window.confirm("Are you sure you want to cancel this hackathon?")
    )
      return;
    try {
      await axios.patch(
        `http://localhost:8000/api/v1/events/${event.id}/`,
        { status },
        { headers: getAuthHeaders() },
      );
      loadEvents();
    } catch {
      setError("Unable to update the hackathon status.");
    }
  };

  const deleteEvent = async (event) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this hackathon? This action cannot be undone.",
      )
    )
      return;
    try {
      await axios.delete(`http://localhost:8000/api/v1/events/${event.id}/`, {
        headers: getAuthHeaders(),
      });
      setEvents((current) => current.filter((item) => item.id !== event.id));
    } catch {
      setError("Unable to delete the hackathon.");
    }
  };

  return (
    <div className="dash_layout">
      <Sidebar activePage="hackathons" />
      <main className="dash_main">
        <div className="dash_header">
          <div>
            <h1 className="dash_title">My Hackathons</h1>
            <p className="dash_subtitle">Manage the hackathons you own.</p>
          </div>
          <button
            className="btn_primary"
            onClick={() => navigate("/create-event")}
          >
            Create Hackathon
          </button>
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {events.length === 0 ? (
          <div className="panel">
            <h3 className="panel_title">No hackathons yet</h3>
            <p className="panel_desc">
              Create your first hackathon to get started.
            </p>
          </div>
        ) : (
          <div className="member_grid" >
            {events.map((event) => (
               
              <div className="panell" key={event.id}>
                <span className="tag_active">{event.status}</span>
                <h3 className="panel_title">{event.title}</h3>
                <p className="panel_desc">{event.description}</p>
                <p>
                  {new Date(event.start_date).toLocaleString()} -{" "}
                  {new Date(event.end_date).toLocaleString()}
                </p>
                <div className="form_actions">
                  <button
                    className="btn_ghost"
                    onClick={() =>
                      navigate(`/organizer/hackathons/${event.id}/manage`)
                    }
                  >
                    Manage
                  </button>
                  {event.status !== "completed" &&
                    event.status !== "cancelled" && (
                      <button
                        className="btn_ghost"
                        onClick={() =>
                          updateStatus(
                            event,
                            event.status === "open" ? "closed" : "open",
                          )
                        }
                      >
                        {event.status === "open"
                          ? "Close Registration"
                          : "Publish"}
                      </button>
                    )}
                  {event.status !== "completed" &&
                    event.status !== "cancelled" && (
                      <button
                        className="btn_ghost"
                        onClick={() => updateStatus(event, "cancelled")}
                      >
                        Cancel
                      </button>
                    )}
                  {event.status !== "completed" && (
                    <button
                      className="btn_ghost"
                      onClick={() => deleteEvent(event)}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
             
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default OrganizerHackathons;
