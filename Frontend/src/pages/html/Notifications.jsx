import React from "react";
import "../css/dashboard.css";
import "../css/notifications.css";
import Sidebar from "../../components/html/sidebar";
import { Users, Clock, Trophy, MessageSquare } from "lucide-react";

const notifications = [
  {
    id: 1,
    icon: Users,
    type: "team",
    text: 'Your team "NeuralCraft" has been registered for HackFest 2026.',
    time: "10m ago",
    unread: true,
  },
  {
    id: 2,
    icon: Clock,
    type: "deadline",
    text: "Project submission deadline is tomorrow at 11:59 PM.",
    time: "2h ago",
    unread: true,
  },
  {
    id: 3,
    icon: Trophy,
    type: "result",
    text: "Judging results for HackFest 2026 are now live on the leaderboard.",
    time: "Yesterday",
    unread: false,
  },
  {
    id: 4,
    icon: MessageSquare,
    type: "mentor",
    text: "Elena Rostova accepted your mentorship session request.",
    time: "2 days ago",
    unread: false,
  },
];

const Notifications = () => {
  return (
    <div className="dash_layout">
      <Sidebar activePage="notifications" onNavigate={() => {}} />

      <main className="dash_main">
        <div className="dash_header">
          <div>
            <h1 className="dash_title">Notification Center</h1>
            <p className="dash_subtitle">
              Stay up to date with team, event, and mentorship activity.
            </p>
          </div>
          <button className="btn_ghost">Mark all as read</button>
        </div>

        <div className="panel notif_panel">
          {notifications.map((n) => {
            const Icon = n.icon;
            return (
              <div
                className={`notif_item notif_${n.type} ${
                  n.unread ? "notif_unread" : ""
                }`}
                key={n.id}
              >
                <div className={`notif_icon_wrap icon_${n.type}`}>
                  <Icon size={16} />
                </div>
                <p className="notif_text">{n.text}</p>
                <span className="notif_time">{n.time}</span>
                {n.unread && <span className="notif_dot" />}
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default Notifications;