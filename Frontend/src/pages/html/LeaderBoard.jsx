import { useEffect, useState } from "react";
import axios from "axios";
import "../css/dashboard.css";
import "../css/leaderboard.css";
import Sidebar from "../../components/html/sidebar";

const medal = { 1: "🥇", 2: "🥈", 3: "🥉" };

const Leaderboard = () => {
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState("");
  const [rows, setRows] = useState([]);
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
        const data = response.data || [];
        setEvents(data);
        if (data.length > 0) setSelectedEventId(data[0].id);
      } catch (err) {
        console.error("Failed to load events for leaderboard", err);
        setError("Unable to load leaderboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    if (!selectedEventId) return;

    const fetchLeaderboard = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(
          `http://localhost:8000/api/v1/events/${selectedEventId}/leaderboard/`,
          {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          },
        );
        setRows(response.data || []);
      } catch (err) {
        console.error("Failed to load leaderboard", err);
        setRows([]);
        setError("Leaderboard is not available for this event yet.");
      }
    };

    fetchLeaderboard();
  }, [selectedEventId]);

  const podium = rows.slice(0, 3).map((row, index) => ({
    rank: index + 1,
    team: row.team,
    project: row.title,
    score: Number(row.average_score || 0).toFixed(1),
    judges: "Backend score",
  }));

  return (
    <div className="dash_layout">
      <Sidebar activePage="leaderboard" onNavigate={() => {}} />

      <main className="dash_main">
        <div className="dash_header">
          <div>
            <h1 className="dash_title">Live Hackathon Leaderboard</h1>
            <p className="dash_subtitle">
              Scores computed from backend judge data.
            </p>
          </div>
          <select
            className="event_select"
            value={selectedEventId}
            onChange={(e) => setSelectedEventId(e.target.value)}
          >
            {events.map((event) => (
              <option key={event.id} value={event.id}>
                {event.title}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <p className="no_results">Loading leaderboard...</p>
        ) : error ? (
          <p className="no_results">{error}</p>
        ) : rows.length === 0 ? (
          <p className="no_results">
            No submissions have been scored yet for this event.
          </p>
        ) : (
          <>
            <div className="podium_grid">
              {podium.map((p) => (
                <div
                  className={`podium_card podium_rank_${p.rank} ${p.rank === 1 ? "podium_first" : ""}`}
                  key={p.project}
                >
                  <div className="podium_medal">{medal[p.rank]}</div>
                  <span className="podium_label">
                    {p.rank === 1
                      ? "Champion"
                      : `${p.rank === 2 ? "2nd" : "3rd"} Place`}
                  </span>
                  <h3 className="podium_team">{p.project}</h3>
                  <div className="podium_score">
                    {p.score} <span className="podium_score_unit">pts</span>
                  </div>
                  <p className="podium_judges">
                    {p.team} &bull; {p.judges}
                  </p>
                </div>
              ))}
            </div>

            <div className="panel">
              <h3 className="panel_subtitle">Complete Ranking Table</h3>
              <div className="table_wrap">
                <table className="rank_table">
                  <thead>
                    <tr>
                      <th>Rank</th>
                      <th>Team</th>
                      <th>Project</th>
                      <th>Judge Data</th>
                      <th>Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row, index) => (
                      <tr
                        key={row.id}
                        className={index === 0 ? "row_winner" : ""}
                      >
                        <td className="rank_cell">#{index + 1}</td>
                        <td className="team_cell">{row.team}</td>
                        <td>{row.title}</td>
                        <td>Backend score</td>
                        <td className="score_cell">
                          {Number(row.average_score || 0).toFixed(1)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Leaderboard;
