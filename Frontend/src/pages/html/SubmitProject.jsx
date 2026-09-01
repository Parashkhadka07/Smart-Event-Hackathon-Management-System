import React, { useState } from "react";
import "../css/dashboard.css";
import "../css/submit.css";
import Sidebar from "../../components/html/sidebar";
import { Link2, Video, Save } from "lucide-react";
// note: Github brand icon was removed from lucide — reuse the GithubIcon
// component from Profile.jsx, or swap for a generic Link2/Code icon like below

const SubmitProject = () => {
  const [form, setForm] = useState({
    name: "",
    pitch: "",
    problem: "",
    github: "",
    demo: "",
    video: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: POST to your Django project-submission endpoint
    console.log("Submitting project:", form);
  };

  const handleSaveDraft = () => {
    // TODO: PATCH draft endpoint
    console.log("Draft saved:", form);
  };

  return (
    <div className="dash_layout">
      <Sidebar activePage="submit" onNavigate={() => {}} />

      <main className="dash_main">
        <div className="dash_header">
          <div>
            <h1 className="dash_title">Project Submission</h1>
            <p className="dash_subtitle">
              Fill in your project details for judging in HackFest Global
              2026.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="panel submit_form">
          <h3 className="panel_subtitle">Project Basic Details</h3>

          <div className="form_row">
            <label>Project Name *</label>
            <input
              type="text"
              name="name"
              required
              placeholder="e.g. NeuralCraft AI Engine"
              value={form.name}
              onChange={handleChange}
            />
          </div>

          <div className="form_row">
            <label>Elevator Pitch (max 150 chars) *</label>
            <input
              type="text"
              name="pitch"
              required
              maxLength={150}
              placeholder="One sentence describing what you built"
              value={form.pitch}
              onChange={handleChange}
            />
          </div>

          <div className="form_row">
            <label>Problem Statement & Solution *</label>
            <textarea
              name="problem"
              required
              rows="4"
              placeholder="What problem does this solve, and how?"
              value={form.problem}
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
              name="github"
              required
              placeholder="https://github.com/your-team/project"
              value={form.github}
              onChange={handleChange}
            />
          </div>

          <div className="form_row">
            <label>
              <Link2 size={12} className="inline_icon" /> Live Demo Link
            </label>
            <input
              type="url"
              name="demo"
              placeholder="https://your-demo-link.com"
              value={form.demo}
              onChange={handleChange}
            />
          </div>

          <div className="form_row">
            <label>
              <Video size={12} className="inline_icon" /> Video Presentation
              (2 min) *
            </label>
            <input
              type="url"
              name="video"
              required
              placeholder="Loom / YouTube link"
              value={form.video}
              onChange={handleChange}
            />
          </div>

          <div className="form_actions">
            <button type="button" className="btn_ghost" onClick={handleSaveDraft}>
              <Save size={14} /> Save Draft
            </button>
            <button type="submit" className="btn_primary">
              Submit Final Project
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default SubmitProject;