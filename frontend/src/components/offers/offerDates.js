// Date helpers for the offers feature. Offer dates are stored at noon UTC,
// so the UTC calendar day is the offer's day.
const DAY_MS = 24 * 60 * 60 * 1000;

export function dateKey(value) {
  return new Date(value).toISOString().slice(0, 10);
}

export function todayKey() {
  const now = new Date();
  return new Date(now.getTime() - now.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 10);
}

export function daysFromToday(value) {
  const offerDay = Date.parse(`${dateKey(value)}T00:00:00Z`);
  const today = Date.parse(`${todayKey()}T00:00:00Z`);
  return Math.round((offerDay - today) / DAY_MS);
}

export function soonLabel(value) {
  const days = daysFromToday(value);
  if (days === 0) return "Today";
  if (days === 1) return "Tomorrow";
  return "";
}

export function buildWeek() {
  const start = Date.parse(`${todayKey()}T12:00:00Z`);
  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(start + i * DAY_MS);
    return {
      key: date.toISOString().slice(0, 10),
      weekday:
        i === 0
          ? "Today"
          : date.toLocaleDateString(undefined, {
              weekday: "long",
              timeZone: "UTC",
            }),
      label: date.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        timeZone: "UTC",
      }),
    };
  });
}
