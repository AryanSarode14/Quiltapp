import { useState } from "react";
import PropTypes from "prop-types";
import { AREAS, CATEGORIES } from "../../constants.js";
import "./RequestFilters.css";

function RequestFilters({ filters, onChange }) {
  const [searchText, setSearchText] = useState(filters.search);

  function handleSearch(event) {
    event.preventDefault();
    onChange({ ...filters, search: searchText.trim() });
  }

  function handleSelect(name) {
    return (event) => onChange({ ...filters, [name]: event.target.value });
  }

  function handleClear() {
    setSearchText("");
    onChange({ search: "", category: "", area: "", sort: "urgency" });
  }

  return (
    <form className="request-filters" onSubmit={handleSearch} role="search">
      <div className="request-filters-search">
        <label htmlFor="request-search" className="form-label">
          Search requests
        </label>
        <div className="input-group">
          <input
            id="request-search"
            type="search"
            className="form-control"
            placeholder="Try “package” or “ride”"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <button type="submit" className="btn btn-primary">
            Search
          </button>
        </div>
      </div>

      <div>
        <label htmlFor="request-category" className="form-label">
          Category
        </label>
        <select
          id="request-category"
          className="form-select"
          value={filters.category}
          onChange={handleSelect("category")}
        >
          <option value="">All categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="request-area" className="form-label">
          Area
        </label>
        <select
          id="request-area"
          className="form-select"
          value={filters.area}
          onChange={handleSelect("area")}
        >
          <option value="">All areas</option>
          {AREAS.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="request-sort" className="form-label">
          Sort by
        </label>
        <select
          id="request-sort"
          className="form-select"
          value={filters.sort}
          onChange={handleSelect("sort")}
        >
          <option value="urgency">Most urgent first</option>
          <option value="neededBy">Needed soonest</option>
          <option value="newest">Newest</option>
        </select>
      </div>

      <div className="request-filters-clear">
        <button type="button" className="btn btn-link" onClick={handleClear}>
          Clear filters
        </button>
      </div>
    </form>
  );
}

RequestFilters.propTypes = {
  filters: PropTypes.shape({
    search: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    area: PropTypes.string.isRequired,
    sort: PropTypes.string.isRequired,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
};

export default RequestFilters;
