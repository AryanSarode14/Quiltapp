import PropTypes from "prop-types";
import FeedbackForm from "./FeedbackForm.jsx";
import StarRating from "../shared/StarRating.jsx";
import { formatDate } from "../../utils/format.js";
import "./ClaimedOfferItem.css";

function ClaimedOfferItem({ offer, currentUserId, onRelease, onFeedback }) {
  const myFeedback = offer.feedback.find((f) => f.userId === currentUserId);
  const isPast =
    offer.status === "completed" || new Date(offer.date) < new Date();

  return (
    <article className="claimed-offer-item">
      <h3>{offer.title}</h3>
      <p className="claimed-offer-item-meta">
        With {offer.offerer.displayName} on {formatDate(offer.date)},{" "}
        {offer.availability}. {offer.area}. Status: {offer.status}.
      </p>
      <p className="claimed-offer-item-contact">
        <strong>How to reach them:</strong> {offer.contactNote}
      </p>

      {myFeedback && (
        <div className="claimed-offer-item-given">
          <span>Your feedback: </span>
          <StarRating value={myFeedback.stars} />
          {myFeedback.comment && <p>&ldquo;{myFeedback.comment}&rdquo;</p>}
        </div>
      )}

      {!myFeedback && isPast && (
        <FeedbackForm
          offererName={offer.offerer.displayName}
          onSubmit={(feedback) => onFeedback(offer, feedback)}
        />
      )}

      {offer.status !== "completed" && (
        <button
          type="button"
          className="btn btn-outline-secondary btn-sm mt-3"
          onClick={() => onRelease(offer)}
        >
          Release my spot
        </button>
      )}
    </article>
  );
}

ClaimedOfferItem.propTypes = {
  offer: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    area: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    availability: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    contactNote: PropTypes.string,
    offerer: PropTypes.shape({ displayName: PropTypes.string.isRequired })
      .isRequired,
    feedback: PropTypes.arrayOf(
      PropTypes.shape({
        userId: PropTypes.string.isRequired,
        stars: PropTypes.number.isRequired,
        comment: PropTypes.string,
      }),
    ).isRequired,
  }).isRequired,
  currentUserId: PropTypes.string.isRequired,
  onRelease: PropTypes.func.isRequired,
  onFeedback: PropTypes.func.isRequired,
};

export default ClaimedOfferItem;
