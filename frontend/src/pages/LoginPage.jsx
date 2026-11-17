import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth.js";
import "./LoginPage.css";

// Login page — owned by Trupal Jageshkumar Patel
function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(username, password);
      navigate(location.state?.from || "/requests", { replace: true });
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  }

  return (
    <section className="login-page">
      <h1 className="page-title">Log in</h1>
      <p className="page-lede">Welcome back. Pick up where you left off.</p>

      <form onSubmit={handleSubmit} className="login-page-form" noValidate>
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}
        <div className="mb-3">
          <label htmlFor="login-username" className="form-label">
            Username
          </label>
          <input
            id="login-username"
            className="form-control"
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="login-password" className="form-label">
            Password
          </label>
          <input
            id="login-password"
            type="password"
            className="form-control"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="btn btn-primary w-100"
          disabled={submitting}
        >
          {submitting ? "Logging in…" : "Log in"}
        </button>
        <p className="login-page-switch">
          New to Quilt? <Link to="/register">Create an account</Link>
        </p>
      </form>
    </section>
  );
}

LoginPage.propTypes = {};

export default LoginPage;
