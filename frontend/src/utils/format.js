// Dates are stored at noon UTC, so format them in UTC to keep the day stable.
export function formatDate(value) {
  if (!value) return "";
  return new Date(value).toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

export function toDateInputValue(value) {
  if (!value) return "";
  return new Date(value).toISOString().slice(0, 10);
}

export function todayInputValue() {
  const now = new Date();
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
}

export function averageStars(feedback) {
  if (!feedback?.length) return null;
  const total = feedback.reduce((sum, item) => sum + item.stars, 0);
  return Math.round((total / feedback.length) * 10) / 10;
}
