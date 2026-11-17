import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import RequestFilters from "./RequestFilters.jsx";
import RequestCard from "./RequestCard.jsx";
import Pagination from "../shared/Pagination.jsx";
import useAuth from "../../hooks/useAuth.js";
import { apiFetch, toQueryString } from "../../api.js";
import "./RequestsPage.css";

// Browse open help requests — owned by Heta Vimaleshkumar Patel
function RequestsPage() {
  const { user } = useAuth();
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    area: "",
    sort: "urgency",
  });
  const [page, setPage] = useState(1);
  const [result, setResult] = useState({ items: [], total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busyId, setBusyId] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;
    setLoading(true);
    apiFetch(`/api/requests?${toQueryString({ ...filters, page })}`)
      .then((data) => {
        if (!active) return;
        setResult(data);
        setError("");
      })
      .catch((err) => {
        if (active) setError(err.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [filters, page, reloadKey]);

  function handleFiltersChange(next) {
    setFilters(next);
    setPage(1);
  }

  async function handleHelp(request) {
    setBusyId(request._id);
    setNotice("");
    try {
      await apiFetch(`/api/requests/${request._id}/help`, { method: "POST" });
      setNotice(
        `Thanks for helping! Find how to reach ${request.requester.displayName} under My requests, in the Helping tab.`,
      );
      setReloadKey((n) => n + 1);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyId(null);
    }
  }

  return (
    <section>
      <div className="requests-page-header">
        <div>
          <h1 className="page-title">Open requests</h1>
          <p className="page-lede">
            People nearby who could use a hand. Pick one you can help with.
          </p>
        </div>
        <Link
          to={user ? "/requests/new" : "/login"}
          className="btn btn-primary"
        >
          Post a request
        </Link>
      </div>

      <RequestFilters filters={filters} onChange={handleFiltersChange} />

      {notice && (
        <div className="alert alert-success" role="status">
          {notice}
        </div>
      )}
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <p className="requests-page-count" aria-live="polite">
        {loading ? "Loading requests…" : `${result.total} open requests`}
      </p>

      {!loading && result.items.length === 0 ? (
        <div className="requests-page-empty">
          <p>No open requests match these filters.</p>
          <button
            type="button"
            className="btn btn-outline-primary"
            onClick={() =>
              handleFiltersChange({
                search: "",
                category: "",
                area: "",
                sort: "urgency",
              })
            }
          >
            Show all requests
          </button>
        </div>
      ) : (
        <ul className="requests-page-grid">
          {result.items.map((request) => (
            <li key={request._id}>
              <RequestCard
                request={request}
                currentUser={user}
                onHelp={handleHelp}
                busy={busyId === request._id}
              />
            </li>
          ))}
        </ul>
      )}

      <Pagination
        page={page}
        totalPages={result.totalPages}
        onPageChange={setPage}
      />
    </section>
  );
}

RequestsPage.propTypes = {};

export default RequestsPage;
