import PropTypes from "prop-types";
import { CATEGORY_PATCH } from "../../constants.js";
import "./WeekOfferChip.css";

// A compact offer for one day column of the week calendar.
function WeekOfferChip({ offer, currentUser, onClaim, onRelease, busy }) {
  const spotsLeft = offer.spots - offer.claims.length;
  const isOwn = currentUser && offer.offerer._id === currentUser._id;
  const hasClaimed =
    currentUser && offer.claims.some((c) => c.userId === currentUser._id);
  const patch = CATEGORY_PATCH[offer.category] || "patch-stone";

  let action = null;
  if (currentUser && !isOwn) {
    action = hasClaimed ? (
      <button
        type="button"
        className="btn btn-link btn-sm p-0"
        disabled={busy}
        onClick={() => onRelease(offer)}
      >
        Release spot
      </button>
    ) : (
      <button
        type="button"
        className="btn btn-primary btn-sm"
        disabled={busy || spotsLeft < 1}
        onClick={() => onClaim(offer)}
      >
        Claim
      </button>
    );
  }

  return (
    <article className={`week-offer-chip ${patch}`}>
      <span className="week-offer-chip-category">{offer.category}</span>
      <h4>{offer.title}</h4>
      <p className="week-offer-chip-meta">
        {offer.availability}
        <br />
        {offer.area}, with {offer.offerer.displayName}
      </p>
      <div className="week-offer-chip-footer">
        <span>
          {spotsLeft} of {offer.spots} open
        </span>
        {action}
        {hasClaimed && <span className="week-offer-chip-mine">You&rsquo;re in</span>}
      </div>
    </article>
  );
}

WeekOfferChip.propTypes = {
  offer: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    area: PropTypes.string.isRequired,
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

export default WeekOfferChip;
