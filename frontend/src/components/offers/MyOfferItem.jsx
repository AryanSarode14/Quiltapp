import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import StarRating from "../shared/StarRating.jsx";
import { OFFER_STATUSES } from "../../constants.js";
import { averageStars, formatDate } from "../../utils/format.js";
import "./MyOfferItem.css";

function MyOfferItem({ offer, onStatusChange, onDelete }) {
  const statusId = `offer-status-${offer._id}`;
  const average = averageStars(offer.feedback);

  return (
    <article className="my-offer-item">
      <div className="my-offer-item-head">
        <div>
          <h3>{offer.title}</h3>
          <p className="my-offer-item-meta">
            {formatDate(offer.date)}, {offer.availability}. {offer.area}.{" "}
            {offer.claims.length} of {offer.spots} spots claimed.
          </p>
        </div>
        <div className="my-offer-item-status">
          <label htmlFor={statusId} className="form-label">
            Status
          </label>
          <select
            id={statusId}
            className="form-select form-select-sm"
            value={offer.status}
            onChange={(e) => onStatusChange(offer, e.target.value)}
          >
            {OFFER_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <h4 className="my-offer-item-subhead">Who claimed a spot</h4>
      {offer.claims.length === 0 ? (
        <p className="my-offer-item-muted">Nobody yet.</p>
      ) : (
        <ul className="my-offer-item-claims">
          {offer.claims.map((claim) => (
            <li key={claim.userId}>
              {claim.displayName}
              <span className="my-offer-item-muted">
                {" "}
                claimed {formatDate(claim.claimedAt)}
              </span>
            </li>
          ))}
        </ul>
      )}

      {offer.feedback.length > 0 && (
        <>
          <h4 className="my-offer-item-subhead">
            Feedback, averaging {average} of 5
          </h4>
          <ul className="my-offer-item-feedback">
            {offer.feedback.map((item) => (
              <li key={item.userId}>
                <StarRating value={item.stars} /> <strong>{item.displayName}</strong>
                {item.comment && <p>&ldquo;{item.comment}&rdquo;</p>}
              </li>
            ))}
          </ul>
        </>
      )}

      <div className="my-offer-item-actions">
        {offer.status !== "completed" && (
          <Link to={`/offers/${offer._id}/edit`} className="btn btn-outline-primary btn-sm">
            Edit
          </Link>
        )}
        <button
          type="button"
          className="btn btn-outline-danger btn-sm"
          onClick={() => onDelete(offer)}
        >
          Delete
        </button>
      </div>
    </article>
  );
}

MyOfferItem.propTypes = {
  offer: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    area: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    availability: PropTypes.string.isRequired,
    spots: PropTypes.number.isRequired,
    status: PropTypes.oneOf(["active", "full", "completed"]).isRequired,
    claims: PropTypes.arrayOf(
      PropTypes.shape({
        userId: PropTypes.string.isRequired,
        displayName: PropTypes.string.isRequired,
        claimedAt: PropTypes.string.isRequired,
      }),
    ).isRequired,
    feedback: PropTypes.arrayOf(
      PropTypes.shape({
        userId: PropTypes.string.isRequired,
        displayName: PropTypes.string.isRequired,
        stars: PropTypes.number.isRequired,
        comment: PropTypes.string,
      }),
    ).isRequired,
  }).isRequired,
  onStatusChange: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default MyOfferItem;
