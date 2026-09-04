import { useEffect, useState } from "react";
import axios from "axios";
import {
  ArrowRight,
  CalendarDays,
  Compass,
  Gavel,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";
import { LogIn, LogOut } from "lucide-react";
import { getAuthHeaders, isAuthenticated } from "../../utils/auth";
import "../css/home.css";

const API = "http://localhost:8000/api/v1";
const formatDate = (value) =>
  value
    ? new Date(value).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      })
    : "Date to be announced";

const Home = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const loggedIn = isAuthenticated();

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userRole");
    localStorage.removeItem("username");
    window.location.assign("/");
  };

  useEffect(() => {
    if (!isAuthenticated()) return;
    setLoading(true);
    axios
      .get(`${API}/events/`, { headers: getAuthHeaders() })
      .then(({ data }) => setEvents(data || []))
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="landing">
      <header className="landing_nav">
        <Link className="landing_brand" to="/">
          Nerd<span>Hub</span>
        </Link>
        <nav className="landing_nav_links" aria-label="Primary navigation">
          <Link to="/events">Hackathons</Link>
          <a href="#how-it-works">How it works</a>
        </nav>
        <div className="landing_nav_actions">
          {loggedIn ? (
            <>
              <Link className="landing_button" to="/dashboard">
                Workspace
              </Link>
              <button
                className="landing_button"
                type="button"
                onClick={handleLogout}
              >
                <LogOut size={14} /> Log out
              </button>
            </>
          ) : (
            <>
              <Link className="landing_button" to="/login">
                <LogIn size={14} /> Sign in
              </Link>
              <Link
                className="landing_button landing_button_primary"
                to="/register"
              >
                Get started
              </Link>
            </>
          )}
        </div>
      </header>

      <main>
        <section className="landing_hero">
          <div>
            <div className="landing_kicker">
              <Sparkles size={13} /> One workspace for every hackathon
            </div>
            <h1>
              Discover. Build. <em>Compete.</em>
            </h1>
            <p>
              A focused platform for finding challenges, forming teams,
              submitting projects, and running fair evaluations.
            </p>
            <div className="landing_actions">
              <Link
                className="landing_button landing_button_primary"
                to="/events"
              >
                Browse hackathons <ArrowRight size={15} />
              </Link>
              <Link
                className="landing_button"
                to={isAuthenticated() ? "/dashboard" : "/register"}
              >
                {isAuthenticated() ? "Open workspace" : "Create account"}
              </Link>
            </div>
          </div>
          <div className="landing_signal">
            <div className="landing_signal_label">Your next move</div>
            <h2>
              {isAuthenticated()
                ? "Continue your workspace"
                : "Find your first challenge"}
            </h2>
            <p>
              {isAuthenticated()
                ? "Your dashboard brings together the events and work that matter to your role."
                : "Join as a participant, organizer, or judge and get the right workspace from the start."}
            </p>
            <div className="landing_signal_row">
              <span>
                <Compass size={14} /> Explore
              </span>
              <span>
                <Gavel size={14} /> Evaluate
              </span>
              <span>
                <CalendarDays size={14} /> Launch
              </span>
            </div>
          </div>
        </section>

        <section className="landing_section" aria-labelledby="featured-heading">
          <div className="landing_section_header">
            <div>
              <h2 id="featured-heading">Open on NerdHub</h2>
              <p>Live events from your workspace.</p>
            </div>
            <Link className="back_link" to="/events">
              View all <ArrowRight size={14} />
            </Link>
          </div>
          <div className="landing_event_grid">
            {loading ? (
              <div className="landing_empty">
                Loading available hackathons...
              </div>
            ) : (
              events
                .filter((event) => event.status !== "draft")
                .slice(0, 3)
                .map((event) => (
                  <Link
                    className="landing_event"
                    to={`/events/${event.id}`}
                    key={event.id}
                  >
                    <span className="status_badge">{event.status}</span>
                    <h3>{event.title}</h3>
                    <p>
                      {event.description ||
                        "Details will be shared by the organizer."}
                    </p>
                    <div className="landing_event_meta">
                      <CalendarDays size={13} /> {formatDate(event.start_date)}{" "}
                      to {formatDate(event.end_date)}
                    </div>
                  </Link>
                ))
            )}
            {!loading &&
              events.filter((event) => event.status !== "draft").length ===
                0 && (
                <div className="landing_empty">
                  No hackathons are available yet. Check back when an organizer
                  publishes one.
                </div>
              )}
          </div>
        </section>

        <section className="landing_section" id="how-it-works">
          <div className="landing_section_header">
            <div>
              <h2>One flow, three perspectives</h2>
              <p>Everyone sees the work they need to move forward.</p>
            </div>
          </div>
          <div className="landing_steps">
            <div className="landing_step">
              <strong>01 / PARTICIPANT</strong>
              <h3>Find your challenge</h3>
              <p>
                Register for an open event, create your team, and move from idea
                to submitted project.
              </p>
            </div>
            <div className="landing_step">
              <strong>02 / ORGANIZER</strong>
              <h3>Run the event</h3>
              <p>
                Publish a hackathon, track participation, manage the lifecycle,
                and see progress as work arrives.
              </p>
            </div>
            <div className="landing_step">
              <strong>03 / JUDGE</strong>
              <h3>Make it fair</h3>
              <p>
                Open assigned projects, evaluate clearly, and keep judging
                focused from first review to final score.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
