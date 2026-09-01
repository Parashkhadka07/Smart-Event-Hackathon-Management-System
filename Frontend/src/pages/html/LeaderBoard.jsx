import React from "react";
import "../css/dashboard.css";
import "../css/leaderboard.css";
import Sidebar from "../../components/html/sidebar";

const podium = [
  { rank: 2, team: "Apex Coders", project: "CloudMesh Sentinel", score: 92.0, judges: "3 Judges" },
  { rank: 1, team: "Team NeuralCraft", project: "NeuralCraft AI Engine", score: 98.5, judges: "4 Judges Verified" },
  { rank: 3, team: "DecentralHackers", project: "ZeroVault Web3", score: 89.4, judges: "3 Judges" },
];

const fullTable = [
  { rank: 1, team: "Team NeuralCraft", project: "NeuralCraft AI Engine", judges: "4 / 4 Evaluated", score: 98.5, status: "Verified Winner" },
  { rank: 2, team: "Apex Coders", project: "CloudMesh Sentinel", judges: "3 / 4 Evaluated", score: 92.0, status: "Runner Up" },
  { rank: 3, team: "DecentralHackers", project: "ZeroVault Web3", judges: "3 / 4 Evaluated", score: 89.4, status: "Bronze" },
];

const medal = { 1: "🥇", 2: "🥈", 3: "🥉" };

const Leaderboard = () => {
  return (
    <div className="dash_layout">
      <Sidebar activePage="leaderboard" onNavigate={() => {}} />

      <main className="dash_main">
        <div className="dash_header">
          <div>
            <h1 className="dash_title">Live Hackathon Leaderboard</h1>
            <p className="dash_subtitle">
              Real-time ranking computed from authenticated judge rubric
              scores.
            </p>
          </div>
          <select className="event_select">
            <option>HackFest Global 2026</option>
            <option>Web3 & Decentralized Hack</option>
          </select>
        </div>

        {/* Podium */}
        <div className="podium_grid">
          {podium.map((p) => (
            <div
              className={`podium_card podium_rank_${p.rank} ${
                p.rank === 1 ? "podium_first" : ""
              }`}
              key={p.team}
            >
              <div className="podium_medal">{medal[p.rank]}</div>
              <span className="podium_label">
                {p.rank === 1 ? "Champion" : `${p.rank === 2 ? "2nd" : "3rd"} Place`}
              </span>
              <h3 className="podium_team">{p.project}</h3>
              <div className="podium_score">
                {p.score}{" "}
                <span className="podium_score_unit">pts</span>
              </div>
              <p className="podium_judges">
                {p.team} &bull; {p.judges}
              </p>
            </div>
          ))}
        </div>

        {/* Full Table */}
        <div className="panel">
          <h3 className="panel_subtitle">Complete Ranking Table</h3>
          <div className="table_wrap">
            <table className="rank_table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Team</th>
                  <th>Project</th>
                  <th>Judges</th>
                  <th>Score</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {fullTable.map((row) => (
                  <tr key={row.rank} className={row.rank === 1 ? "row_winner" : ""}>
                    <td className="rank_cell">#{row.rank}</td>
                    <td className="team_cell">{row.team}</td>
                    <td>{row.project}</td>
                    <td>{row.judges}</td>
                    <td className="score_cell">{row.score}</td>
                    <td>
                      <span className={`status_pill status_${row.rank}`}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Leaderboard;