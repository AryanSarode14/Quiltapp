import { useId, useState } from "react";
import PropTypes from "prop-types";
import StarRating from "../shared/StarRating.jsx";
import "./RatingForm.css";

function RatingForm({ helperName, onSubmit }) {
  const [stars, setStars] = useState(0);
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const noteId = useId();

  async function handleSubmit(event) {
    event.preventDefault();
    if (!stars) {
      setError("Choose a star rating.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await onSubmit({ stars, note });
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  }

  return (
    <form className="rating-form" onSubmit={handleSubmit}>
      <h4>Thank {helperName}</h4>
      {error && (
        <div className="alert alert-danger py-2" role="alert">
          {error}
        </div>
      )}
      <StarRating value={stars} onChange={setStars} label="How did it go?" />
      <label htmlFor={noteId} className="form-label mt-2">
        Thank-you note (optional)
      </label>
      <textarea
        id={noteId}
        className="form-control"
        rows={2}
        maxLength={300}
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />
      <button
        type="submit"
        className="btn btn-primary btn-sm mt-2"
        disabled={saving}
      >
        {saving ? "Sending…" : "Send thanks"}
      </button>
    </form>
  );
}

RatingForm.propTypes = {
  helperName: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default RatingForm;
