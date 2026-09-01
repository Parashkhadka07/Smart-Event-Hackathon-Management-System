import React, { useState } from "react";
import "../css/dashboard.css";
import "../css/discover.css";
import Sidebar from "../../components/html/sidebar";
import { Search, Calendar, Globe, Users, Trophy, MapPin } from "lucide-react";

const events = [
  {
    id: 1,
    name: "HackFest Global 2026",
    org: "Apex Tech Systems",
    status: "REGISTRATION OPEN",
    statusType: "open",
    date: "Aug 10 - Aug 14, 2026",
    location: "Online",
    participants: 482,
    prize: "$15,000",
    desc: "Build generative AI applications, agentic workflows, and high-performance serverless apps.",
  },
  {
    id: 2,
    name: "Web3 & Decentralized Hack",
    org: "Blockchain DAO",
    status: "UPCOMING",
    statusType: "upcoming",
    date: "Sep 01 - Sep 05, 2026",
    location: "SF Tech Hub",
    participants: 210,
    prize: "$25,000",
    desc: "Develop smart contracts, zero-knowledge proof tools, and decentralized social platforms.",
  },
  {
    id: 3,
    name: "DevOps & Cloud Sprint",
    org: "CloudNative Guild",
    status: "COMPLETED",
    statusType: "completed",
    date: "Jul 15 - Jul 18, 2026",
    location: "Online",
    participants: 640,
    prize: "$10,000",
    desc: "Automated infrastructure deployment, Kubernetes operators, and observability tooling.",
  },
];

const Discover = () => {
  const [query, setQuery] = useState("");

  const filtered = events.filter((e) =>
    e.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="dash_layout">
      <Sidebar activePage="discover" onNavigate={() => {}} />

      <main className="dash_main">
        <div className="dash_header">
          <div>
            <h1 className="dash_title">Discover Hackathons & Events</h1>
            <p className="dash_subtitle">
              Explore upcoming global hackathons, filter by technologies,
              prizes, and schedule.
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="panel filter_bar">
          <div className="search_box">
            <Search size={14} className="search_icon" />
            <input
              type="text"
              placeholder="Search hackathons, topics, tech..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <div className="filter_selects">
            <select>
              <option>All Categories</option>
              <option>AI / Machine Learning</option>
              <option>Web3 & Blockchain</option>
              <option>Cloud & DevOps</option>
            </select>
            <select>
              <option>Status: All</option>
              <option>Ongoing / Registration Open</option>
              <option>Upcoming</option>
              <option>Completed</option>
            </select>
            <select>
              <option>Location: All</option>
              <option>Online / Virtual</option>
              <option>In-Person</option>
            </select>
          </div>
        </div>

        {/* Event Grid */}
        <div className="event_grid">
          {filtered.map((event) => (
            <div className="event_card" key={event.id}>
              <div className={`event_banner banner_${event.statusType}`}>
                <span className={`event_status status_${event.statusType}`}>
                  {event.status}
                </span>
                <div>
                  <h3 className="event_name">{event.name}</h3>
                  <span className="event_org">Organized by {event.org}</span>
                </div>
              </div>

              <div className="event_body">
                <div className="event_meta_row">
                  <span>
                    <Calendar size={12} /> {event.date}
                  </span>
                  <span>
                    <MapPin size={12} /> {event.location}
                  </span>
                </div>
                <div className="event_meta_row">
                  <span>
                    <Users size={12} /> {event.participants} Participants
                  </span>
                  <span className="event_prize">
                    <Trophy size={12} /> {event.prize} Prizes
                  </span>
                </div>
                <p className="event_desc">{event.desc}</p>
              </div>

              <div className="event_footer">
                <button className="btn_ghost btn_full">
                  {event.statusType === "completed"
                    ? "View Winners"
                    : "View Details & Register"}
                </button>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <p className="no_results">No events match your search.</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default Discover;