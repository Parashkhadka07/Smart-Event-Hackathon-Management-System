import { useEffect, useState } from "react";
import "../css/dashboard.css";
import "../css/profile.css";
import Sidebar from "../../components/html/sidebar";
import { Globe, Pencil, Camera } from "lucide-react";
import axios from "axios";
import { getAuthHeaders, getStoredUser } from "../../utils/auth";

const GithubIcon = (props) => (
  <svg
    viewBox="0 0 24 24"
    width={16}
    height={16}
    fill="currentColor"
    {...props}
  >
    <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56 0-.27-.01-1.17-.02-2.12-3.2.7-3.88-1.36-3.88-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.23-1.28-5.23-5.68 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.24 2.76.12 3.05.74.8 1.19 1.83 1.19 3.09 0 4.41-2.69 5.38-5.25 5.67.41.36.78 1.06.78 2.15 0 1.55-.01 2.8-.01 3.18 0 .31.21.67.8.56A10.52 10.52 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5Z" />
  </svg>
);

const LinkedinIcon = (props) => (
  <svg
    viewBox="0 0 24 24"
    width={16}
    height={16}
    fill="currentColor"
    {...props}
  >
    <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45Z" />
  </svg>
);

const Profile = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [form, setForm] = useState({
    name: "",
    role: "",
    bio: "Full stack developer building hackathon tools.",
    github: "",
    linkedin: "",
    website: "",
  });
  const [stats, setStats] = useState({ events: 0, projects: 0 });
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/v1/me/", {
          headers: getAuthHeaders(),
        });

        const currentUser = response.data;
        const currentRole =
          currentUser?.role || getStoredUser().role || "participant";

        const [registrations, teams, submissions] = await Promise.all([
          axios.get("http://localhost:8000/api/v1/registrations/", {
            headers: getAuthHeaders(),
          }),
          axios.get("http://localhost:8000/api/v1/teams/", {
            headers: getAuthHeaders(),
          }),
          axios.get("http://localhost:8000/api/v1/submissions/", {
            headers: getAuthHeaders(),
          }),
        ]);
        setStats({
          events: registrations.data.length,
          projects: submissions.data.length,
          teams: teams.data.length,
        });

        setUserProfile(
          currentUser || { username: getStoredUser().name, role: currentRole },
        );
        setForm((prev) => ({
          ...prev,
          name: currentUser?.username || getStoredUser().name,
          role: currentRole,
        }));
      } catch {
        console.error("Unable to load profile data");
        const fallback = getStoredUser();
        setForm((prev) => ({
          ...prev,
          name: fallback.name,
          role: fallback.role,
        }));
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(
        "http://localhost:8000/api/v1/me/",
        {
          username: form.name,
          email: userProfile?.email,
        },
        { headers: getAuthHeaders() },
      );
      setUserProfile(data);
      localStorage.setItem("username", data.username);
    } catch {
      setErrorMessage("Unable to save profile changes.");
    }
  };

  return (
    <div className="dash_layout">
      <Sidebar activePage="profile" onNavigate={() => {}} />

      <main className="dash_main">
        {/* Header */}
        <div className="dash_header">
          <div>
            <h1 className="dash_title">Profile & Settings</h1>
            <p className="dash_subtitle">
              Manage your public profile and account preferences.
            </p>
          </div>
        </div>

        <div className="profile_grid">
          {/* Left: Avatar + quick stats */}
          <div className="panel profile_side">
            <div className="avatar_wrap">
              <div className="profile_avatar" aria-label="User avatar" >
                {(form.name || "U").slice(0, 1).toUpperCase()}
              </div>
              <button className="avatar_edit_btn" type="button">
                <Camera size={14} />
              </button>
            </div>

            <h2 className="profile_name">{form.name}</h2>
            
            <span className="tag_leader profile_tag">
              {(userProfile?.role || form.role || "participant").toUpperCase()}
            </span>

            <div className="profile_stats">
              <div className="profile_stat">
                <div className="profile_stat_value">{stats.events}</div>
                <div className="profile_stat_label">Events</div>
              </div>
              <div className="profile_stat">
                <div className="profile_stat_value">{stats.projects}</div>
                <div className="profile_stat_label">Projects</div>
              </div>
              <div className="profile_stat">
                <div className="profile_stat_value">{stats.teams}</div>
                <div className="profile_stat_label">Teams</div>
              </div>
            </div>

            <div className="profile_links">
              <a href={form.github} target="_blank" rel="noreferrer">
                <GithubIcon />
              </a>
              <a href={form.linkedin} target="_blank" rel="noreferrer">
                <LinkedinIcon />
              </a>
              {form.website && (
                <a href={form.website} target="_blank" rel="noreferrer">
                  <Globe size={16} />
                </a>
              )}
            </div>
          </div>

          {/* Right: Editable form */}
          <div className="panel profile_form_panel">
            <h3 className="panel_subtitle">
              <Pencil size={14} className="inline_icon" /> Edit Details
            </h3>

            <form onSubmit={handleSave} className="profile_form">
              {errorMessage && <p className="error_text">{errorMessage}</p>}
              <div className="form_row">
                <label>Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                />
              </div>

              <div className="form_row">
                <label>Headline / Role</label>
                <input type="text" name="role" value={form.role} readOnly />
              </div>

              <div className="form_row">
                <label>Bio</label>
                <textarea
                  name="bio"
                  rows="4"
                  value={form.bio}
                  onChange={handleChange}
                />
              </div>

              <div className="form_row_split">
                <div className="form_row">
                  <label>GitHub Profile</label>
                  <input
                    type="text"
                    name="github"
                    value={form.github}
                    onChange={handleChange}
                  />
                </div>
                <div className="form_row">
                  <label>LinkedIn Profile</label>
                  <input
                    type="text"
                    name="linkedin"
                    value={form.linkedin}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form_row">
                <label>Personal Website (optional)</label>
                <input
                  type="text"
                  name="website"
                  placeholder="https://..."
                  value={form.website}
                  onChange={handleChange}
                />
              </div>

              <div className="form_actions">
                <button type="button" className="btn_ghost">
                  Cancel
                </button>
                <button type="submit" className="btn_primary">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
