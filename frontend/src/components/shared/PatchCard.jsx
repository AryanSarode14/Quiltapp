import PropTypes from "prop-types";
import { CATEGORY_PATCH } from "../../constants.js";
import "./PatchCard.css";

// A card that looks like a stitched quilt patch, colored by category.
function PatchCard({ category, children, as: Tag = "article", className = "" }) {
  const patch = CATEGORY_PATCH[category] || "patch-stone";
  return (
    <Tag className={`patch-card ${patch} ${className}`}>
      <span className="patch-card-category">{category}</span>
      {children}
    </Tag>
  );
}

PatchCard.propTypes = {
  category: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  as: PropTypes.elementType,
  className: PropTypes.string,
};

export default PatchCard;
