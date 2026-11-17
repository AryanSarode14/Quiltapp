import PropTypes from "prop-types";
import "./Pagination.css";

function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;
  return (
    <nav className="quilt-pagination" aria-label="Pages">
      <button
        type="button"
        className="btn btn-outline-primary"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        Previous
      </button>
      <span aria-live="polite">
        Page {page} of {totalPages}
      </span>
      <button
        type="button"
        className="btn btn-outline-primary"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        Next
      </button>
    </nav>
  );
}

Pagination.propTypes = {
  page: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};

export default Pagination;
