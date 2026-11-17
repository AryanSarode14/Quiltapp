import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ClaimedOfferItem from "./ClaimedOfferItem.jsx";
import useAuth from "../../hooks/useAuth.js";
import { apiFetch } from "../../api.js";
import "./ClaimedOffersPage.css";

// Offers you claimed a spot on — owned by Trupal Jageshkumar Patel
function ClaimedOffersPage() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;
    setLoading(true);
    apiFetch("/api/offers/claimed")
      .then((data) => {
        if (!active) return;
        setItems(data);
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
  }, [reloadKey]);

  const reload = () => setReloadKey((n) => n + 1);

  async function handleRelease(offer) {
    if (!window.confirm(`Release your spot on “${offer.title}”?`)) return;
    try {
      await apiFetch(`/api/offers/${offer._id}/claim`, { method: "DELETE" });
      reload();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleFeedback(offer, feedback) {
    await apiFetch(`/api/offers/${offer._id}/feedback`, {
      method: "POST",
      body: feedback,
    });
    reload();
  }

  return (
    <section>
      <h1 className="page-title">My claimed spots</h1>
      <p className="page-lede">
        Offers you joined. Reach out using the contact note, and leave feedback
        once it&rsquo;s done.
      </p>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {loading && <p role="status">Loading…</p>}
      {!loading && items.length === 0 && (
        <div className="claimed-offers-page-empty">
          <p>You haven&rsquo;t claimed any spots yet.</p>
          <Link to="/offers" className="btn btn-outline-primary">
            Browse offers
          </Link>
        </div>
      )}

      <ul className="claimed-offers-page-list">
        {!loading &&
          items.map((offer) => (
            <li key={offer._id}>
              <ClaimedOfferItem
                offer={offer}
                currentUserId={user._id}
                onRelease={handleRelease}
                onFeedback={handleFeedback}
              />
            </li>
          ))}
      </ul>
    </section>
  );
}

ClaimedOffersPage.propTypes = {};

export default ClaimedOffersPage;
