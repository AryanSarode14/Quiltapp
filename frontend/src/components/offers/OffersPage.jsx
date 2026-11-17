import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import OfferFilters from "./OfferFilters.jsx";
import OfferCard from "./OfferCard.jsx";
import OfferWeekView from "./OfferWeekView.jsx";
import Pagination from "../shared/Pagination.jsx";
import useAuth from "../../hooks/useAuth.js";
import { apiFetch, toQueryString } from "../../api.js";
import "./OffersPage.css";

// Browse active help offers — owned by Trupal Jageshkumar Patel
const VIEWS = [
  { id: "board", label: "Quilt board" },
  { id: "week", label: "This week" },
];

function OffersPage() {
  const { user } = useAuth();
  const [view, setView] = useState("board");
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    area: "",
    sort: "soonest",
  });
  const [page, setPage] = useState(1);
  const [result, setResult] = useState({ items: [], total: 0, totalPages: 1 });
  const [weekItems, setWeekItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busyId, setBusyId] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;
    setLoading(true);
    const { search, category, area } = filters;
    const request =
      view === "week"
        ? apiFetch(`/api/offers/week?${toQueryString({ search, category, area })}`)
        : apiFetch(`/api/offers?${toQueryString({ ...filters, page })}`);

    request
      .then((data) => {
        if (!active) return;
        if (view === "week") setWeekItems(data);
        else setResult(data);
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
  }, [view, filters, page, reloadKey]);

  function handleFiltersChange(next) {
    setFilters(next);
    setPage(1);
  }

  async function runAction(offer, method, message) {
    setBusyId(offer._id);
    setNotice("");
    try {
      await apiFetch(`/api/offers/${offer._id}/claim`, { method });
      setNotice(message);
      setError("");
      setReloadKey((n) => n + 1);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyId(null);
    }
  }

  const handleClaim = (offer) =>
    runAction(
      offer,
      "POST",
      `Spot claimed. Find how to reach ${offer.offerer.displayName} under My claimed spots.`,
    );

  const handleRelease = (offer) =>
    runAction(offer, "DELETE", "You released your spot.");

  const count = view === "week" ? weekItems.length : result.total;
  const countText =
    view === "week"
      ? `${count} offers in the next 7 days`
      : `${count} active offers`;

  return (
    <section className="offers-page">
      <div className="offers-page-header">
        <div>
          <h1 className="page-title">Offers of help</h1>
          <p className="page-lede">
            Trips and time people are already giving. Claim a spot instead of
            posting a request.
          </p>
        </div>
        <Link to={user ? "/offers/new" : "/login"} className="btn btn-primary">
          Post an offer
        </Link>
      </div>

      <OfferFilters filters={filters} onChange={handleFiltersChange} />

      <div className="offers-page-toolbar">
        <p className="offers-page-count" aria-live="polite">
          {loading ? "Loading offers…" : countText}
        </p>
        <div className="offers-page-views" role="group" aria-label="View offers as">
          {VIEWS.map((v) => (
            <button
              key={v.id}
              type="button"
              className={view === v.id ? "is-active" : ""}
              aria-pressed={view === v.id}
              onClick={() => setView(v.id)}
            >
              {v.label}
            </button>
          ))}
        </div>
      </div>

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

      {view === "week" && !loading && (
        <OfferWeekView
          offers={weekItems}
          currentUser={user}
          onClaim={handleClaim}
          onRelease={handleRelease}
          busyId={busyId}
        />
      )}

      {view === "board" && !loading && result.items.length === 0 && (
        <div className="offers-page-empty">
          <p>No active offers match these filters.</p>
          <button
            type="button"
            className="btn btn-outline-primary"
            onClick={() =>
              handleFiltersChange({ search: "", category: "", area: "", sort: "soonest" })
            }
          >
            Show all offers
          </button>
        </div>
      )}

      {view === "board" && result.items.length > 0 && (
        <>
          <ul className="offers-page-board">
            {result.items.map((offer) => (
              <li key={offer._id}>
                <OfferCard
                  offer={offer}
                  currentUser={user}
                  onClaim={handleClaim}
                  onRelease={handleRelease}
                  busy={busyId === offer._id}
                />
              </li>
            ))}
          </ul>
          <Pagination page={page} totalPages={result.totalPages} onPageChange={setPage} />
        </>
      )}
    </section>
  );
}

OffersPage.propTypes = {};

export default OffersPage;
