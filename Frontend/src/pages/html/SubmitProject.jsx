import { useEffect, useState } from "react";
import "../css/dashboard.css";
import "../css/submit.css";
import Sidebar from "../../components/html/sidebar";
import { Link2 } from "lucide-react";
import axios from "axios";

const SubmitProject = () => {
  const [teams, setTeams] = useState([]);
  const [form, setForm] = useState({
    team: "",
    title: "",
    description: "",
    github_link: "",
    demo_link: "",
  });
  const [teamsError, setTeamsError] = useState(null);
  const [submitError, setSubmitError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchTeams = async () => {
      setTeamsError(null);
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(
          "http://localhost:8000/api/v1/teams/",
          {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          },
        );
        const list = response.data.results || response.data || [];
        setTeams(list);
        if (list.length > 0) {
          setForm((prev) => ({ ...prev, team: list[0].id }));
        }
      } catch (error) {
        setTeamsError({
          status: error.response?.status,
          message:
            error.response?.data?.detail ||
            JSON.stringify(error.response?.data) ||
            error.message,
        });
      }
    };

    fetchTeams();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitting(true);

    const payload = {
      team: form.team,
      title: form.title,
      description: form.description,
      github_link: form.github_link,
      demo_link: form.demo_link || "",
      status: "submitted",
    };

    try {
      const token = localStorage.getItem("accessToken");
      await axios.post("http://localhost:8000/api/v1/submissions/", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Project submitted successfully.");
    } catch (error) {
      setSubmitError({
        status: error.response?.status,
        // DRF errors are usually {field: ["msg"]} or {detail: "msg"} — handle both
        message:
          error.response?.data?.detail ||
          (error.response?.data &&
            Object.entries(error.response.data)
              .map(([field, msgs]) =>
                `${field}: ${Array.isArray(msgs) ? msgs.join(", ") : msgs}`
              )
              .join(" | ")) ||
          error.message,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="dash_layout">
      <Sidebar activePage="submit" onNavigate={() => {}} />

      <main className="dash_main">
        <div className="dash_header">
          <div>
            <h1 className="dash_title">Project Submission</h1>
            <p className="dash_subtitle">
              Submit a real project record to the backend.
            </p>
          </div>
        </div>

        {teamsError && (
          <div className="error_banner">
            <strong>Couldn't load your teams ({teamsError.status ?? "network error"})</strong>
            <div>{teamsError.message}</div>
          </div>
        )}

        {submitError && (
          <div className="error_banner">
            <strong>Submission failed ({submitError.status ?? "network error"})</strong>
            <div>{submitError.message}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="panel submit_form">
          <h3 className="panel_subtitle">Project Basic Details</h3>

          <div className="form_row">
            <label>Team *</label>
            <select
              name="team"
              value={form.team}
              onChange={handleChange}
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
            <label>Project Name *</label>
            <input
              type="text"
              name="title"
              required
              placeholder="Enter your project name"
              value={form.title}
              onChange={handleChange}
            />
          </div>

          <div className="form_row">
            <label>Project Description *</label>
            <textarea
              name="description"
              required
              rows="4"
              placeholder="What problem does this solve, and how?"
              value={form.description}
              onChange={handleChange}
            />
          </div>

          <h3 className="panel_subtitle submit_section_gap">
            Links & Submission
          </h3>

          <div className="form_row">
            <label>
              <Link2 size={12} className="inline_icon" /> GitHub Repository *
            </label>
            <input
              type="url"
              name="github_link"
              required
              placeholder="https://github.com/your-team/project"
              value={form.github_link}
              onChange={handleChange}
            />
          </div>

          <div className="form_row">
            <label>
              <Link2 size={12} className="inline_icon" /> Live Demo Link
            </label>
            <input
              type="url"
              name="demo_link"
              placeholder="https://your-demo-link.com"
              value={form.demo_link}
              onChange={handleChange}
            />
          </div>

          <div className="form_actions">
            <button type="submit" className="btn_primary" disabled={submitting}>
              {submitting ? "Submitting..." : "Submit Final Project"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default SubmitProject;