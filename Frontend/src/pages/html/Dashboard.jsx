import React from "react";
import "../css/Dashboard.css";
import Sidebar from "../../components/html/sidebar";
import { Search, Upload, Calendar, Users, Code2, Clock } from "lucide-react";

const Dashboard = () => {
  return (
    <div className="dash_layout">
      <Sidebar activePage="dashboard" onNavigate={() => {}} />

      <main className="dash_main">
        {/* Header */}
        <div className="dash_header">
          <div>
            <h1 className="dash_title">Welcome back, Parash! 👋</h1>
            <p className="dash_subtitle">
              HackFest 2026 is currently active. Project submission closes in
              2 days.
            </p>
          </div>
          <div className="dash_header_actions">
            <button className="btn_ghost">
              <Search size={14} /> Find Hackathons
            </button>
            <button className="btn_primary">
              <Upload size={14} /> Submit Project
            </button>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="stat_grid">
          <div className="stat_card">
            <div className="stat_top">
              <span>Registered Events</span>
              <Calendar size={16} className="stat_icon" />
            </div>
            <div className="stat_value">3</div>
            <div className="stat_note">1 Active this week</div>
          </div>

          <div className="stat_card">
            <div className="stat_top">
              <span>Active Team</span>
              <Users size={16} className="stat_icon" />
            </div>
            <div className="stat_value">NeuralCraft</div>
            <div className="stat_note">4 / 4 Members assigned</div>
          </div>

          <div className="stat_card">
            <div className="stat_top">
              <span>Projects Submitted</span>
              <Code2 size={16} className="stat_icon" />
            </div>
            <div className="stat_value">2</div>
            <div className="stat_note">1 Draft Pending</div>
          </div>

          <div className="stat_card">
            <div className="stat_top">
              <span>Next Deadline</span>
              <Clock size={16} className="stat_icon" />
            </div>
            <div className="stat_value stat_value_alert">42h 18m</div>
            <div className="stat_note">HackFest Code Submission</div>
          </div>
        </div>

        {/* Two column: Active event + Team */}
        <div className="dash_grid">
          {/* Active Event */}
          <div className="panel panel_event">
            <div className="panel_top_row">
              <span className="tag_active">Active Hackathon</span>
              <span className="panel_meta">Virtual / Online</span>
            </div>

            <h2 className="panel_title">HackFest Global 2026</h2>
            <p className="panel_desc">
              Build next-gen AI applications utilizing modern APIs, LLMs, and
              cloud infrastructure.
            </p>

            <div className="progress_row">
              <div className="progress_labels">
                <span>Hackathon Phase: Build & Submit</span>
                <span className="progress_phase">Phase 3 of 5</span>
              </div>
              <div className="progress_track">
                <div className="progress_fill" style={{ width: "65%" }} />
              </div>
            </div>

            <div className="phase_grid">
              <div className="phase_box">
                <div className="phase_label">Registration</div>
                <div className="phase_value phase_done">Closed</div>
              </div>
              <div className="phase_box">
                <div className="phase_label">Submission</div>
                <div className="phase_value phase_warn">Closes in 42h</div>
              </div>
              <div className="phase_box">
                <div className="phase_label">Judging</div>
                <div className="phase_value">Starts Aug 12</div>
              </div>
            </div>

            <div className="panel_actions">
              <button className="btn_ghost">View Full Schedule</button>
              <button className="btn_primary">Open Project Wizard</button>
            </div>
          </div>

          {/* Team Widget */}
          <div className="panel panel_team">
            <div className="team_top_row">
              <h3 className="panel_subtitle">My Team: NeuralCraft</h3>
              <span className="tag_leader">Leader</span>
            </div>

            <div className="team_list">
              <div className="team_member">
                <div className="member_left">
                  <img
                    src="https://i.pravatar.cc/60?img=12"
                    alt="Parash"
                    className="member_avatar"
                  />
                  <span>Parash (You)</span>
                </div>
                <span className="member_role">Full Stack</span>
              </div>

              <div className="team_member">
                <div className="member_left">
                  <img
                    src="https://i.pravatar.cc/60?img=32"
                    alt="Alex"
                    className="member_avatar"
                  />
                  <span>Alex Rivera</span>
                </div>
                <span className="member_role">AI / ML Engineer</span>
              </div>

              <div className="team_member">
                <div className="member_left">
                  <img
                    src="https://i.pravatar.cc/60?img=47"
                    alt="Maya"
                    className="member_avatar"
                  />
                  <span>Maya Patel</span>
                </div>
                <span className="member_role">UI/UX Designer</span>
              </div>
            </div>

            <button className="btn_ghost btn_full">
              Manage Team & Invites
            </button>
          </div>
        </div>

        {/* Announcements */}
        <div className="panel panel_announcements">
          <h3 className="panel_subtitle">📣 Event Announcements</h3>

          <div className="announcement">
            <div>
              <span className="announcement_title">
                Mentor Office Hours Schedule Released
              </span>
              <p className="announcement_desc">
                Book 1-on-1 sessions with AI/Cloud mentors from 2 PM to 6 PM
                EST in the Mentorship tab.
              </p>
            </div>
            <span className="announcement_time">2 hours ago</span>
          </div>

          <div className="announcement">
            <div>
              <span className="announcement_title">
                Submission Requirements Checklist
              </span>
              <p className="announcement_desc">
                Ensure your GitHub repository is set to public and includes a
                runnable README or Loom video demo link.
              </p>
            </div>
            <span className="announcement_time">Yesterday</span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;