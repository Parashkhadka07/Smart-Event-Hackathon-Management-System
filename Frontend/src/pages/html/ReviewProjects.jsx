import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../../components/html/sidebar";
import { getAuthHeaders } from "../../utils/auth";
import "../css/dashboard.css";

const ReviewProjects = () => {
  const [submissions, setSubmissions] = useState([]);
  const [scores, setScores] = useState({});
  const [feedback, setFeedback] = useState({});
  const [message, setMessage] = useState("");
  const [loadError, setLoadError] = useState(null);
  const [judgements, setJudgements] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState({});

  const loadSubmissions = async () => {
    setLoadError(null);
    try {
      const response = await axios.get(
        "http://localhost:8000/api/v1/submissions/",
        { headers: getAuthHeaders() },
      );
      const submissionList = response.data.results || response.data || [];
      setSubmissions(submissionList);

      const judgementResponse = await axios.get(
        "http://localhost:8000/api/v1/judgements/",
        { headers: getAuthHeaders() },
      );
      const judgementList = judgementResponse.data.results || judgementResponse.data || [];
      setJudgements(
        Object.fromEntries(
          judgementList.map((judgement) => [judgement.submission, judgement]),
        ),
      );
    } catch (error) {
      setLoadError({
        status: error.response?.status,
        message:
          error.response?.data?.detail ||
          JSON.stringify(error.response?.data) ||
          error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubmissions();
  }, []);

  const submitScore = async (submissionId) => {
    const score = Number(scores[submissionId]);
    if (!Number.isFinite(score) || score < 0 || score > 100) {
      setMessage("Enter a score between 0 and 100.");
      return;
    }
    setSaving((current) => ({ ...current, [submissionId]: true }));
    try {
      const existingJudgement = judgements[submissionId];
      const request = {
        submission: submissionId,
        score,
        feedback: feedback[submissionId] || "",
      };
      const response = existingJudgement
        ? await axios.patch(
            `http://localhost:8000/api/v1/judgements/${existingJudgement.id}/`,
            request,
            { headers: getAuthHeaders() },
          )
        : await axios.post(
            "http://localhost:8000/api/v1/judgements/",
            request,
            { headers: getAuthHeaders() },
          );
      setJudgements((current) => ({
        ...current,
        [submissionId]: response.data,
      }));
      setMessage("Score submitted successfully.");
    } catch (error) {
      setMessage(
        error.response?.data?.detail ||
          JSON.stringify(error.response?.data) ||
          "Unable to submit score.",
      );
    } finally {
      setSaving((current) => ({ ...current, [submissionId]: false }));
    }
  };

  return (
    <div className="dash_layout">
      <Sidebar activePage="review" />
      <main className="dash_main">
        <div className="dash_header">
          <div>
            <h1 className="dash_title">Review Projects</h1>
            <p className="dash_subtitle">
              Score submitted projects and leave feedback for participants.
            </p>
          </div>
        </div>

        {loadError && (
          <div className="error_banner">
            <strong>Couldn't load submissions ({loadError.status ?? "network error"})</strong>
            <div>{loadError.message}</div>
          </div>
        )}

        {message && <p>{message}</p>}

        <div className="member_grid" style={{width:"800px"}}>
          {loading ? (
            <p className="no_results">Loading assigned projects...</p>
          ) : submissions.length === 0 ? (
            <p className="no_results">No submissions are available yet.</p>
          ) : (
            submissions.map((submission) => (
              <div className="panel" key={submission.id}>
                <h3 className="panel_title">{submission.title}</h3>
                <p className="panel_desc">{submission.description}</p>
                <p>Team: {submission.team}</p>
                {submission.github_link && (
                  <a href={submission.github_link} target="_blank" rel="noreferrer">
                    Repository
                  </a>
                )}
                {submission.demo_link && (
                  <a href={submission.demo_link} target="_blank" rel="noreferrer">
                    Live demo
                  </a>
                )}
                <div className="form_row">
                  <label>Score (0-100)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={scores[submission.id] ?? judgements[submission.id]?.score ?? ""}
                    onChange={(event) =>
                      setScores((current) => ({
                        ...current,
                        [submission.id]: event.target.value,
                      }))
                    }
                    required
                  />
                </div>
                <div className="form_row">
                  <label>Feedback</label>
                  <textarea
                    rows="3"
                    value={feedback[submission.id] ?? judgements[submission.id]?.feedback ?? ""}
                    onChange={(event) =>
                      setFeedback((current) => ({
                        ...current,
                        [submission.id]: event.target.value,
                      }))
                    }
                  />
                </div>
                <button
                  className="btn_primary"
                  disabled={saving[submission.id]}
                  onClick={() => submitScore(submission.id)}
                >
                  {saving[submission.id]
                    ? "Saving..."
                    : judgements[submission.id]
                      ? "Update Evaluation"
                      : "Submit Score"}
                </button>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default ReviewProjects;