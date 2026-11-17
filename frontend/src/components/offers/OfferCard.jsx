import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import PatchCard from "../shared/PatchCard.jsx";
import { formatDate } from "../../utils/format.js";
import { soonLabel } from "./offerDates.js";
import "./OfferCard.css";

function OfferCard({ offer, currentUser, onClaim, onRelease, busy }) {
  const spotsLeft = offer.spots - offer.claims.length;
  const isOwn = currentUser && offer.offerer._id === currentUser._id;
  const hasClaimed =
    currentUser && offer.claims.some((c) => c.userId === currentUser._id);
  const soon = soonLabel(offer.date);

  let action;
  if (!currentUser) {
    action = (
      <Link to="/login" className="btn btn-outline-primary btn-sm">
        Log in to claim a spot
      </Link>
    );
  } else if (isOwn) {
    action = <span className="offer-card-note">Your offer</span>;
  } else if (hasClaimed) {
    action = (
      <button
        type="button"
        className="btn btn-outline-secondary btn-sm"
        disabled={busy}
        onClick={() => onRelease(offer)}
      >
        Release my spot
      </button>
    );
  } else {
    action = (
      <button
        type="button"
        className="btn btn-primary btn-sm"
        disabled={busy || spotsLeft < 1}
        onClick={() => onClaim(offer)}
      >
        Claim a spot
      </button>
    );
  }

  return (
    <PatchCard category={offer.category} className="offer-card">
      {soon && (
        <span className={`offer-card-tag offer-card-tag-${soon.toLowerCase()}`}>
          {soon}
        </span>
      )}
      <h3>{offer.title}</h3>
      <p className="offer-card-description">{offer.description}</p>

      <div className="offer-card-spots-row">
        <span className="offer-card-spots" aria-hidden="true">
          {Array.from({ length: offer.spots }, (_, i) => (
            <span
              key={i}
              className={i < offer.claims.length ? "is-taken" : ""}
            />
          ))}
        </span>
        <span className="offer-card-spots-text">
          {spotsLeft === 0
            ? "No spots left"
            : `${spotsLeft} of ${offer.spots} ${offer.spots === 1 ? "spot" : "spots"} open`}
        </span>
      </div>

      <dl className="offer-card-meta">
        <div>
          <dt>When</dt>
          <dd>
            {formatDate(offer.date)}, {offer.availability}
          </dd>
        </div>
        <div>
          <dt>Area</dt>
          <dd>{offer.area}</dd>
        </div>
        <div>
          <dt>Offered by</dt>
          <dd>{offer.offerer.displayName}</dd>
        </div>
      </dl>
      {hasClaimed && (
        <p className="offer-card-note">
          You have a spot. Contact details are under My claimed spots.
        </p>
      )}
      <div className="offer-card-action">{action}</div>
    </PatchCard>
  );
}

OfferCard.propTypes = {
  offer: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    area: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    availability: PropTypes.string.isRequired,
    spots: PropTypes.number.isRequired,
    claims: PropTypes.arrayOf(
      PropTypes.shape({ userId: PropTypes.string.isRequired }),
    ).isRequired,
    offerer: PropTypes.shape({
      _id: PropTypes.string.isRequired,
      displayName: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  currentUser: PropTypes.shape({ _id: PropTypes.string.isRequired }),
  onClaim: PropTypes.func.isRequired,
  onRelease: PropTypes.func.isRequired,
  busy: PropTypes.bool,
};

export default OfferCard;
