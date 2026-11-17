import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import PatchCard from "../shared/PatchCard.jsx";
import { formatDate } from "../../utils/format.js";
import "./RequestCard.css";

function RequestCard({ request, currentUser, onHelp, busy }) {
  const isOwn = currentUser && request.requester._id === currentUser._id;

  let action;
  if (!currentUser) {
    action = (
      <Link to="/login" className="btn btn-outline-primary btn-sm">
        Log in to help
      </Link>
    );
  } else if (isOwn) {
    action = <span className="request-card-own">Your request</span>;
  } else {
    action = (
      <button
        type="button"
        className="btn btn-primary btn-sm"
        disabled={busy}
        onClick={() => onHelp(request)}
      >
        I can help
      </button>
    );
  }

  return (
    <PatchCard category={request.category}>
      <h3>{request.title}</h3>
      <p className="request-card-description">{request.description}</p>
      <dl className="request-card-meta">
        <div>
          <dt>Urgency</dt>
          <dd>
            <span className={`request-card-urgency urgency-${request.urgency}`}>
              {request.urgency}
            </span>
          </dd>
        </div>
        <div>
          <dt>Area</dt>
          <dd>{request.area}</dd>
        </div>
        <div>
          <dt>Needed by</dt>
          <dd>{formatDate(request.neededBy)}</dd>
        </div>
        <div>
          <dt>Posted by</dt>
          <dd>{request.requester.displayName}</dd>
        </div>
      </dl>
      <div className="request-card-action">{action}</div>
    </PatchCard>
  );
}

RequestCard.propTypes = {
  request: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    urgency: PropTypes.oneOf(["low", "medium", "high"]).isRequired,
    area: PropTypes.string.isRequired,
    neededBy: PropTypes.string.isRequired,
    requester: PropTypes.shape({
      _id: PropTypes.string.isRequired,
      displayName: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  currentUser: PropTypes.shape({ _id: PropTypes.string.isRequired }),
  onHelp: PropTypes.func.isRequired,
  busy: PropTypes.bool,
};

export default RequestCard;
