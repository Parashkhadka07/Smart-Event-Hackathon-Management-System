import React, { useState } from "react";
import "../css/dashboard.css";
import "../css/team.css";
import Sidebar from "../../components/html/sidebar";
import { Copy, UserPlus, Check } from "lucide-react";

const members = [
  {
    name: "Parash Sharma",
    role: "Full Stack Developer",
    avatar: "https://i.pravatar.cc/100?img=12",
    leader: true,
    skills: ["Django", "React", "PostgreSQL"],
  },
  {
    name: "Alex Rivera",
    role: "AI / ML Specialist",
    avatar: "https://i.pravatar.cc/100?img=32",
    leader: false,
    skills: ["PyTorch", "LangChain"],
  },
  {
    name: "Maya Patel",
    role: "UI/UX Designer",
    avatar: "https://i.pravatar.cc/100?img=47",
    leader: false,
    skills: ["Figma", "Tailwind"],
  },
];

const Team = () => {
  const [copied, setCopied] = useState(false);
  const inviteCode = "T-NEURAL-2026";

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="dash_layout">
      <Sidebar activePage="team" onNavigate={() => {}} />

      <main className="dash_main">
        <div className="dash_header">
          <div>
            <h1 className="dash_title">Team Management</h1>
            <p className="dash_subtitle">
              Manage team members, assign skill roles, and copy instant join
              codes.
            </p>
          </div>
          <button className="btn_ghost" onClick={handleCopy}>
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? "Copied!" : "Copy Team Invite Code"}
          </button>
        </div>

        {/* Team Header Card */}
        <div className="panel team_header_card">
          <div>
            <span className="tag_active">Active Project Team</span>
            <h2 className="panel_title team_header_title">Team NeuralCraft</h2>
            <p className="panel_desc">
              Project: Generative Knowledge Engine for Developers
            </p>
          </div>
          <div className="submission_status">
            <span className="submission_label">Submission Status</span>
            <span className="submission_badge">Draft Pending</span>
          </div>
        </div>

        {/* Members Grid */}
        <div className="member_grid">
          {members.map((m) => (
            <div className="member_card" key={m.name}>
              {m.leader && <span className="leader_badge">Leader</span>}
              <img src={m.avatar} alt={m.name} className="member_card_avatar" />
              <h3 className="member_card_name">{m.name}</h3>
              <p className="member_card_role">{m.role}</p>
              <div className="skill_tags">
                {m.skills.map((s) => (
                  <span key={s} className="skill_tag">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          ))}

          <div className="invite_slot">
            <div className="invite_icon_wrap">
              <UserPlus size={20} />
            </div>
            <h4 className="invite_title">Invite Teammate</h4>
            <p className="invite_note">1 slot available (Max 4)</p>
            <button className="btn_ghost btn_small" onClick={handleCopy}>
              Send Code
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Team;