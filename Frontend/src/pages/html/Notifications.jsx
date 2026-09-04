import "../css/dashboard.css";
import "../css/notifications.css";
import Sidebar from "../../components/html/sidebar";

const Notifications = () => (
  <div className="dash_layout">
    <Sidebar activePage="notifications" onNavigate={() => {}} />
    <main className="dash_main">
      <div className="dash_header">
        <div>
          <h1 className="dash_title">Notification Center</h1>
          <p className="dash_subtitle">
            Updates from your hackathon workspace.
          </p>
        </div>
      </div>
      <div className="panel notif_panel">
        <p className="no_results">You have no new notifications.</p>
      </div>
    </main>
  </div>
);

export default Notifications;
