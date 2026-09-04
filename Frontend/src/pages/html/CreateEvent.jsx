import { useEffect, useState } from "react";
import axios from "axios";
import { CalendarPlus } from "lucide-react";
import Sidebar from "../../components/html/sidebar";
import { getAuthHeaders } from "../../utils/auth";
import "../css/dashboard.css";

const CreateEvent = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    start_date: "",
    end_date: "",
    status: "draft",
    prize_pool: "0",
  });
  const [judges, setJudges] = useState([]);
  const [selectedJudges, setSelectedJudges] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/v1/judges/", {
        headers: getAuthHeaders(),
      })
      .then(({ data }) => setJudges(data || []))
      .catch(() => setJudges([]));
  }, []);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (event) => {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");

    const payload = {
      ...form,
      start_date: new Date(form.start_date).toISOString(),
      end_date: new Date(form.end_date).toISOString(),
    };

    if (new Date(payload.end_date) <= new Date(payload.start_date)) {
      setError("End date must be after the start date.");
      return;
    }

    try {
      setIsSubmitting(true);
      const { data: createdEvent } = await axios.post(
        "http://localhost:8000/api/v1/events/",
        payload,
        {
          headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
        },
      );

      await Promise.all(
        selectedJudges.map((judge) =>
          axios.post(
            "http://localhost:8000/api/v1/judge-assignments/",
            {
              event: createdEvent.id,
              judge,
            },
            {
              headers: {
                ...getAuthHeaders(),
                "Content-Type": "application/json",
              },
            },
          ),
        ),
      );
      setMessage("Event created successfully.");
      setForm({
        title: "",
        description: "",
        start_date: "",
        end_date: "",
        status: "draft",
        prize_pool: "0",
      });
      setSelectedJudges([]);
    } catch (requestError) {
      if (requestError.response?.status === 401) {
        setError("Your session expired. Please log in again.");
        return;
      }
      const detail = requestError.response?.data;
      setError(
        typeof detail === "object"
          ? JSON.stringify(detail)
          : "Unable to create the event.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="dash_layout">
      <Sidebar activePage="create-event" />
      <main className="dash_main">
        <div className="dash_header">
          <div>
            <h1 className="dash_title">Create Event</h1>
            <p className="dash_subtitle">
              Publish a hackathon for participants and judges.
            </p>
          </div>
        </div>

        <form className="panel submit_form" onSubmit={handleSubmit}>
          <h3 className="panel_subtitle">
            <CalendarPlus size={15} className="inline_icon" /> Event Details
          </h3>

          <div className="form_row">
            <label>Event Name *</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              placeholder="e.g. CodeSprint 2026"
            />
          </div>

          <div className="form_row">
            <label>Description *</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              required
              rows="5"
              placeholder="Describe the challenge, rules, and goals."
            />
          </div>

          <div className="form_row_split">
            <div className="form_row">
              <label>Start Date *</label>
              <input
                type="datetime-local"
                name="start_date"
                value={form.start_date}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form_row">
              <label>End Date *</label>
              <input
                type="datetime-local"
                name="end_date"
                value={form.end_date}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form_row">
            <label>Prize Pool</label>
            <input
              type="number"
              name="prize_pool"
              min="0"
              step="0.01"
              value={form.prize_pool}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form_row">
            <label>Assign Judges</label>
            <select
              multiple
              value={selectedJudges}
              onChange={(event) =>
                setSelectedJudges(
                  Array.from(
                    event.target.selectedOptions,
                    (option) => option.value,
                  ),
                )
              }
            >
              {judges.map((judge) => (
                <option key={judge.id} value={judge.id}>
                  {judge.username}
                </option>
              ))}
            </select>
            {judges.length === 0 && (
              <small>No judge accounts are available yet.</small>
            )}
          </div>

          <div className="form_row">
            <label>Status</label>
            <select name="status" value={form.status} onChange={handleChange}>
              <option value="draft">Draft</option>
              <option value="open">Open for registration</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          {message && <p style={{ color: "green" }}>{message}</p>}
          {error && <p style={{ color: "red" }}>{error}</p>}

          <div className="form_actions">
            <button
              type="submit"
              className="btn_primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating event..." : "Create Event"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default CreateEvent;
