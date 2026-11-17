import PropTypes from "prop-types";
import StarRating from "../shared/StarRating.jsx";
import { formatDate } from "../../utils/format.js";
import "./HelpingItem.css";

function HelpingItem({ request }) {
  return (
    <article className="helping-item">
      <h3>{request.title}</h3>
      <p className="helping-item-meta">
        For {request.requester.displayName} in {request.area}. Needed by{" "}
        {formatDate(request.neededBy)}. Status: {request.status}.
      </p>
      <p className="helping-item-contact">
        <strong>How to reach them:</strong> {request.contactNote}
      </p>
      {request.rating && (
        <div className="helping-item-thanks">
          <StarRating value={request.rating.stars} />
          {request.rating.note && <p>&ldquo;{request.rating.note}&rdquo;</p>}
        </div>
      )}
    </article>
  );
}

HelpingItem.propTypes = {
  request: PropTypes.shape({
    title: PropTypes.string.isRequired,
    area: PropTypes.string.isRequired,
    neededBy: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    contactNote: PropTypes.string,
    requester: PropTypes.shape({ displayName: PropTypes.string.isRequired })
      .isRequired,
    rating: PropTypes.shape({
      stars: PropTypes.number.isRequired,
      note: PropTypes.string,
    }),
  }).isRequired,
};

export default HelpingItem;
