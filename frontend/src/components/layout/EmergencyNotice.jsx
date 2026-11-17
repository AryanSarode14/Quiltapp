import PropTypes from "prop-types";
import "./EmergencyNotice.css";

function EmergencyNotice({ compact = false }) {
  return (
    <p className={`emergency-notice ${compact ? "emergency-notice-compact" : ""}`}>
      Quilt is for everyday favors. In an emergency, call{" "}
      <a href="tel:911">911</a>.
    </p>
  );
}

EmergencyNotice.propTypes = {
  compact: PropTypes.bool,
};

export default EmergencyNotice;
