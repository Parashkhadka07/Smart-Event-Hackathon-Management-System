import { useState, useEffect } from "react";
import axios from "axios";
import "../css/dashboard.css";
import "../css/team.css";
import Sidebar from "../../components/html/sidebar";
import { UserPlus, UserRoundPlus, Trash2 } from "lucide-react";

const Team = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [teamName, setTeamName] = useState("");
  const [eventId, setEventId] = useState("");
  const [events, setEvents] = useState([]);
  const [members, setMembers] = useState({});
  const [participants, setParticipants] = useState([]);
  const [memberUser, setMemberUser] = useState("");
  const [memberTeam, setMemberTeam] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(
          "http://localhost:8000/api/v1/teams/",
          {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          },
        );
        setTeams(response.data || []);
        const memberResponses = await Promise.all(
          (response.data || []).map((team) =>
            axios.get(
              `http://localhost:8000/api/v1/team-members/?team=${team.id}`,
              { headers: token ? { Authorization: `Bearer ${token}` } : {} },
            ),
          ),
        );
        setMembers(
          Object.fromEntries(
            (response.data || []).map((team, index) => [
              team.id,
              memberResponses[index].data || [],
            ]),
          ),
        );
        const participantResponse = await axios.get(
          "http://localhost:8000/api/v1/participants/",
          { headers: token ? { Authorization: `Bearer ${token}` } : {} },
        );
        setParticipants(participantResponse.data || []);
        const eventResponse = await axios.get(
          "http://localhost:8000/api/v1/events/",
          { headers: token ? { Authorization: `Bearer ${token}` } : {} },
        );
        setEvents(
          (eventResponse.data || []).filter((event) => event.status === "open"),
        );
      } catch (err) {
        console.error("Failed to load teams", err);
        setError("No teams are available from the backend yet.");
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, []);

  const createTeam = async (event) => {
    event.preventDefault();
    setIsCreating(true);
    setMessage("");
    try {
      const token = localStorage.getItem("accessToken");
      await axios.post(
        "http://localhost:8000/api/v1/teams/",
        { name: teamName, event: eventId },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setTeamName("");
      setEventId("");
      setError("");
      setMessage("Team created successfully.");
      const response = await axios.get("http://localhost:8000/api/v1/teams/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTeams(response.data || []);
    } catch (err) {
      setError(err.response?.data?.detail || "Unable to create team.");
    } finally {
      setIsCreating(false);
    }
  };

  const addMember = async (event) => {
    event.preventDefault();
    setIsAddingMember(true);
    setMessage("");
    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/team-members/",
        { team: memberTeam, user: memberUser },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        },
      );
      setMembers((current) => ({
        ...current,
        [memberTeam]: [...(current[memberTeam] || []), response.data],
      }));
      setMemberUser("");
      setMessage("Team member added successfully.");
    } catch (requestError) {
      setError(
        requestError.response?.data?.user?.[0] ||
          requestError.response?.data?.detail ||
          "Unable to add this participant.",
      );
    } finally {
      setIsAddingMember(false);
    }
  };

  const removeMember = async (member) => {
    try {
      await axios.delete(
        `http://localhost:8000/api/v1/team-members/${member.id}/`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        },
      );
      setMembers((current) => ({
        ...current,
        [member.team]: (current[member.team] || []).filter(
          (item) => item.id !== member.id,
        ),
      }));
    } catch {
      setError("Unable to remove this participant.");
    }
  };

  return (
    <div className="dash_layout">
      <Sidebar activePage="team" onNavigate={() => {}} />

      <main className="dash_main">
        <div className="dash_header">
          <div>
            <h1 className="dash_title">Team Management</h1>
            <p className="dash_subtitle">
              Real backend team records for your hackathon workflow.
            </p>
          </div>
        </div>

        <div className="panel team_header_card">
          <div>
            <span className="tag_active">Available teams</span>
            <h2 className="panel_title team_header_title">Live Team List</h2>
            <p className="panel_desc">
              Each team row is pulled directly from the backend.
            </p>
          </div>
          <div className="submission_status">
            <span className="submission_label">Record Count</span>
            <span className="submission_badge">{teams.length}</span>
          </div>
        </div>

        {message && <p className="success_text">{message}</p>}

        <form className="panel submit_form" onSubmit={createTeam}>
          <h3 className="panel_subtitle">Create a Team</h3>
          <div className="form_row">
            <label>Team Name *</label>
            <input
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              required
              placeholder="e.g. Nova Labs"
            />
          </div>
          <div className="form_row">
            <label>Open Event *</label>
            <select
              value={eventId}
              onChange={(e) => setEventId(e.target.value)}
              required
            >
              <option value="">Select event</option>
              {events.map((event) => (
                <option value={event.id} key={event.id}>
                  {event.title}
                </option>
              ))}
            </select>
          </div>
          <button className="btn_primary" type="submit" disabled={isCreating}>
            {isCreating ? "Creating team..." : "Create Team"}
          </button>
        </form>

        {teams.length > 0 && (
          <form className="panel submit_form" onSubmit={addMember}>
            <h3 className="panel_subtitle">
              <UserRoundPlus size={15} className="inline_icon" /> Add Team
              Member
            </h3>
            <div className="form_row">
              <label>Team *</label>
              <select
                value={memberTeam}
                onChange={(e) => setMemberTeam(e.target.value)}
                required
              >
                <option value="">Select team</option>
                {teams.map((team) => (
                  <option key={team.id} value={team.id}>
                    {team.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form_row">
              <label>Participant *</label>
              <select
                value={memberUser}
                onChange={(e) => setMemberUser(e.target.value)}
                required
              >
                <option value="">Select participant</option>
                {participants
                  .filter(
                    (participant) =>
                      !(members[memberTeam] || []).some(
                        (member) =>
                          String(member.user) === String(participant.id),
                      ),
                  )
                  .map((participant) => (
                    <option key={participant.id} value={participant.id}>
                      {participant.username}
                    </option>
                  ))}
              </select>
            </div>
            <button
              className="btn_primary"
              type="submit"
              disabled={isAddingMember}
            >
              {isAddingMember ? "Adding member..." : "Add Member"}
            </button>
          </form>
        )}

        <div className="member_grid">
          {loading ? (
            <p className="no_results">Loading teams...</p>
          ) : error ? (
            <p className="no_results">{error}</p>
          ) : teams.length > 0 ? (
            teams.map((team) => (
              <div className="member_card" key={team.id}>
                <span className="leader_badge">Team</span>
                <h3 className="member_card_name">{team.name}</h3>
                <p className="member_card_role">Event ID: {team.event}</p>
                <div className="team_members_list">
                  {(members[team.id] || []).map((member) => (
                    <div className="timeline_row" key={member.id}>
                      <span>{member.username || member.user}</span>
                      {(members[team.id] || []).length > 1 && (
                        <button
                          className="icon_button"
                          type="button"
                          onClick={() => removeMember(member)}
                          aria-label={`Remove ${member.username || "member"}`}
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <div className="skill_tags">
                  <span className="skill_tag">Created</span>
                  <span className="skill_tag">Backend synced</span>
                </div>
              </div>
            ))
          ) : (
            <div className="invite_slot">
              <div className="invite_icon_wrap">
                <UserPlus size={20} />
              </div>
              <h4 className="invite_title">No teams yet</h4>
              <p className="invite_note">
                Create one through the backend or add it to your system.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Team;
