import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ClipboardList,
  Gavel,
  Users,
  UserRound,
} from "lucide-react";
import Sidebar from "../../components/html/sidebar";
import { getAuthHeaders } from "../../utils/auth";
import "../css/dashboard.css";

const API = "http://localhost:8000/api/v1";

const OrganizerWorkspace = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [teams, setTeams] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [judges, setJudges] = useState([]);
  const [teamMembers, setTeamMembers] = useState({});
  const [selectedJudge, setSelectedJudge] = useState("");
  const [tab, setTab] = useState("overview");
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      const headers = { headers: getAuthHeaders() };
      const [
        eventResponse,
        registrationResponse,
        teamResponse,
        submissionResponse,
        assignmentResponse,
        judgeResponse,
      ] = await Promise.all([
        axios.get(`${API}/events/${eventId}/`, headers),
        axios.get(`${API}/registrations/`, headers),
        axios.get(`${API}/teams/`, headers),
        axios.get(`${API}/submissions/`, headers),
        axios.get(`${API}/judge-assignments/`, headers),
        axios.get(`${API}/judges/`, headers),
      ]);
      setEvent(eventResponse.data);
      setRegistrations(
        (registrationResponse.data || []).filter(
          (item) => String(item.event) === String(eventId),
        ),
      );
      setTeams(
        (teamResponse.data || []).filter(
          (item) => String(item.event) === String(eventId),
        ),
      );
      const eventTeams = (teamResponse.data || []).filter(
        (item) => String(item.event) === String(eventId),
      );
      const memberResponses = await Promise.all(
        eventTeams.map((team) =>
          axios.get(`${API}/team-members/?team=${team.id}`, headers),
        ),
      );
      setTeamMembers(
        Object.fromEntries(
          eventTeams.map((team, index) => [
            team.id,
            memberResponses[index].data || [],
          ]),
        ),
      );
      setSubmissions(
        (submissionResponse.data || []).filter((item) =>
          (teamResponse.data || []).some(
            (team) =>
              String(team.id) === String(item.team) &&
              String(team.event) === String(eventId),
          ),
        ),
      );
      setAssignments(
        (assignmentResponse.data || []).filter(
          (item) => String(item.event) === String(eventId),
        ),
      );
      setJudges(judgeResponse.data || []);
    } catch {
      setError("Unable to load this management workspace.");
    }
  }, [eventId]);

  useEffect(() => {
    load();
  }, [load]);

  const assignJudge = async (requestEvent) => {
    requestEvent.preventDefault();
    try {
      await axios.post(
        `${API}/judge-assignments/`,
        { event: eventId, judge: selectedJudge },
        { headers: getAuthHeaders() },
      );
      setSelectedJudge("");
      load();
    } catch (requestError) {
      setError(
        requestError.response?.data?.detail || "Unable to assign judge.",
      );
    }
  };

  if (!event)
    return (
      <div className="dash_layout">
        <Sidebar activePage="hackathons" />
        <main className="dash_main">
          <p className="error_text">{error || "Loading workspace..."}</p>
        </main>
      </div>
    );

  const tabs = {
    overview: "Overview",
    participants: "Participants",
    teams: "Teams",
    judges: "Judges",
    submissions: "Submissions",
  };
  return (
    <div className="dash_layout">
      <Sidebar activePage="hackathons" />
      <main className="dash_main">
        <Link className="back_link" to="/organizer/hackathons">
          <ArrowLeft size={15} /> My hackathons
        </Link>
        <div className="dash_header">
          <div>
            <span className="status_badge">{event.status}</span>
            <h1 className="dash_title">{event.title}</h1>
            <p className="dash_subtitle">Management workspace</p>
          </div>
        </div>
        {error && <p className="error_text">{error}</p>}
        <nav
          className="workspace_tabs"
          aria-label="Hackathon management sections"
        >
          {Object.entries(tabs).map(([key, label]) => (
            <button
              className={tab === key ? "workspace_tab active" : "workspace_tab"}
              key={key}
              onClick={() => setTab(key)}
            >
              {label}
            </button>
          ))}
        </nav>
        {tab === "overview" && (
          <div className="detail_grid">
            <div className="panel detail_section">
              <Users size={18} />
              <h2>Participants</h2>
              <strong>{registrations.length}</strong>
              <p>Registered participants</p>
            </div>
            <div className="panel detail_section">
              <UserRound size={18} />
              <h2>Teams</h2>
              <strong>{teams.length}</strong>
              <p>Teams in this hackathon</p>
            </div>
            <div className="panel detail_section">
              <ClipboardList size={18} />
              <h2>Submissions</h2>
              <strong>{submissions.length}</strong>
              <p>Projects received</p>
            </div>
          </div>
        )}
        {tab === "participants" && (
          <section className="panel">
            <h2>Registered participants</h2>
            {registrations.length === 0 ? (
              <p className="no_results">No participants have registered yet.</p>
            ) : (
              registrations.map((item) => (
                <div className="timeline_row" key={item.id}>
                  <strong>{item.username || item.user}</strong>
                  <span>{item.status}</span>
                </div>
              ))
            )}
          </section>
        )}
        {tab === "teams" && (
          <section className="panel">
            <h2>Teams</h2>
            {teams.length === 0 ? (
              <p className="no_results">No teams have been created yet.</p>
            ) : (
              teams.map((item) => (
                <div className="timeline_row" key={item.id}>
                  <strong>{item.name}</strong>
                  <span>
                    {(teamMembers[item.id] || [])
                      .map((member) => member.username || member.user)
                      .join(", ") || "No members"}
                  </span>
                </div>
              ))
            )}
          </section>
        )}
        {tab === "submissions" && (
          <section className="panel">
            <h2>Submissions</h2>
            {submissions.length === 0 ? (
              <p className="no_results">
                No submissions have been received yet.
              </p>
            ) : (
              submissions.map((item) => (
                <div className="timeline_row" key={item.id}>
                  <strong>{item.title}</strong>
                  <span>{item.status}</span>
                </div>
              ))
            )}
          </section>
        )}
        {tab === "judges" && (
          <section className="panel">
            <h2>
              <Gavel size={18} /> Assigned judges
            </h2>
            {assignments.length === 0 ? (
              <p className="no_results">No judges assigned yet.</p>
            ) : (
              assignments.map((item) => (
                <div className="timeline_row" key={item.id}>
                  <strong>{item.judge_username || item.judge}</strong>
                  <span>{item.active ? "Active" : "Inactive"}</span>
                </div>
              ))
            )}
            <form className="submit_form" onSubmit={assignJudge}>
              <div className="form_row">
                <label>Assign judge</label>
                <select
                  value={selectedJudge}
                  onChange={(requestEvent) =>
                    setSelectedJudge(requestEvent.target.value)
                  }
                  required
                >
                  <option value="">Select a judge</option>
                  {judges
                    .filter(
                      (judge) =>
                        !assignments.some(
                          (item) => String(item.judge) === String(judge.id),
                        ),
                    )
                    .map((judge) => (
                      <option value={judge.id} key={judge.id}>
                        {judge.username}
                      </option>
                    ))}
                </select>
              </div>
              <button className="btn_primary" type="submit">
                Assign Judge
              </button>
            </form>
          </section>
        )}
      </main>
    </div>
  );
};

export default OrganizerWorkspace;
