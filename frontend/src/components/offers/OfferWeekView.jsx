import PropTypes from "prop-types";
import WeekOfferChip from "./WeekOfferChip.jsx";
import { buildWeek, dateKey } from "./offerDates.js";
import "./OfferWeekView.css";

// Seven day columns, starting today, each listing that day's offers.
function OfferWeekView({ offers, currentUser, onClaim, onRelease, busyId }) {
  const days = buildWeek();
  const byDay = {};
  offers.forEach((offer) => {
    const key = dateKey(offer.date);
    if (!byDay[key]) byDay[key] = [];
    byDay[key].push(offer);
  });

  return (
    <div
      className="offer-week-view"
      role="region"
      aria-label="Offers this week"
      tabIndex={0}
    >
      <ol className="offer-week-view-days">
        {days.map((day) => {
          const dayOffers = byDay[day.key] || [];
          return (
            <li key={day.key} className="offer-week-view-day">
              <h3>
                {day.weekday}
                <span>{day.label}</span>
              </h3>
              {dayOffers.length === 0 ? (
                <p className="offer-week-view-empty">No offers yet</p>
              ) : (
                <ul>
                  {dayOffers.map((offer) => (
                    <li key={offer._id}>
                      <WeekOfferChip
                        offer={offer}
                        currentUser={currentUser}
                        onClaim={onClaim}
                        onRelease={onRelease}
                        busy={busyId === offer._id}
                      />
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

OfferWeekView.propTypes = {
  offers: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      date: PropTypes.string.isRequired,
    }),
  ).isRequired,
  currentUser: PropTypes.shape({ _id: PropTypes.string.isRequired }),
  onClaim: PropTypes.func.isRequired,
  onRelease: PropTypes.func.isRequired,
  busyId: PropTypes.string,
};

export default OfferWeekView;
