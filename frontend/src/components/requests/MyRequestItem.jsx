import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import RatingForm from "./RatingForm.jsx";
import StarRating from "../shared/StarRating.jsx";
import { REQUEST_STATUSES } from "../../constants.js";
import { formatDate } from "../../utils/format.js";
import "./MyRequestItem.css";

function MyRequestItem({ request, onStatusChange, onDelete, onRate }) {
  const statusId = `status-${request._id}`;
  const needsRating =
    request.status === "completed" && request.helper && !request.rating;

  return (
    <article className="my-request-item">
      <div className="my-request-item-head">
        <div>
          <h3>{request.title}</h3>
          <p className="my-request-item-meta">
            {request.category}, {request.area}. Needed by{" "}
            {formatDate(request.neededBy)}.
          </p>
        </div>
        <div className="my-request-item-status">
          <label htmlFor={statusId} className="form-label">
            Status
          </label>
          <select
            id={statusId}
            className="form-select form-select-sm"
            value={request.status}
            onChange={(e) => onStatusChange(request, e.target.value)}
          >
            {REQUEST_STATUSES.map((s) => (
              <option
                key={s}
                value={s}
                disabled={s !== "open" && !request.helper}
              >
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <p className="my-request-item-helper">
        {request.helper
          ? `Helper: ${request.helper.displayName}`
          : "No helper yet. Your request is visible on the board."}
      </p>

      {request.rating && (
        <div className="my-request-item-rating">
          <StarRating value={request.rating.stars} />
          {request.rating.note && <p>&ldquo;{request.rating.note}&rdquo;</p>}
        </div>
      )}

      {needsRating && (
        <RatingForm
          helperName={request.helper.displayName}
          onSubmit={(rating) => onRate(request, rating)}
        />
      )}

      <div className="my-request-item-actions">
        {request.status !== "completed" && (
          <Link
            to={`/requests/${request._id}/edit`}
            className="btn btn-outline-primary btn-sm"
          >
            Edit
          </Link>
        )}
        <button
          type="button"
          className="btn btn-outline-danger btn-sm"
          onClick={() => onDelete(request)}
        >
          Delete
        </button>
      </div>
    </article>
  );
}

MyRequestItem.propTypes = {
  request: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    area: PropTypes.string.isRequired,
    neededBy: PropTypes.string.isRequired,
    status: PropTypes.oneOf(["open", "in progress", "completed"]).isRequired,
    helper: PropTypes.shape({ displayName: PropTypes.string.isRequired }),
    rating: PropTypes.shape({
      stars: PropTypes.number.isRequired,
      note: PropTypes.string,
    }),
  }).isRequired,
  onStatusChange: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onRate: PropTypes.func.isRequired,
};

export default MyRequestItem;
