import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth.js";
import "./RegisterPage.css";

// Register page — owned by Trupal Jageshkumar Patel
function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [fields, setFields] = useState({
    displayName: "",
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function update(name) {
    return (event) => setFields((prev) => ({ ...prev, [name]: event.target.value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    if (fields.password.length < 8) {
      setError("Passwords need at least 8 characters.");
      return;
    }
    setSubmitting(true);
    try {
      await register(fields);
      navigate("/requests", { replace: true });
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  }

  return (
    <section className="register-page">
      <h1 className="page-title">Join Quilt</h1>
      <p className="page-lede">
        Your display name is what neighbors see on your posts. Use your first
        name or a nickname.
      </p>

      <form onSubmit={handleSubmit} className="register-page-form" noValidate>
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}
        <div className="mb-3">
          <label htmlFor="register-name" className="form-label">
            Display name
          </label>
          <input
            id="register-name"
            className="form-control"
            maxLength={50}
            value={fields.displayName}
            onChange={update("displayName")}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="register-username" className="form-label">
            Username
          </label>
          <input
            id="register-username"
            className="form-control"
            autoComplete="username"
            aria-describedby="register-username-help"
            value={fields.username}
            onChange={update("username")}
            required
          />
          <div id="register-username-help" className="form-text">
            3 to 30 letters, numbers, or underscores.
          </div>
        </div>
        <div className="mb-3">
          <label htmlFor="register-password" className="form-label">
            Password
          </label>
          <input
            id="register-password"
            type="password"
            className="form-control"
            autoComplete="new-password"
            aria-describedby="register-password-help"
            value={fields.password}
            onChange={update("password")}
            required
          />
          <div id="register-password-help" className="form-text">
            At least 8 characters.
          </div>
        </div>
        <button type="submit" className="btn btn-primary w-100" disabled={submitting}>
          {submitting ? "Creating account…" : "Create account"}
        </button>
        <p className="register-page-switch">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </form>
    </section>
  );
}

RegisterPage.propTypes = {};

export default RegisterPage;
