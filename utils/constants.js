export const CATEGORIES = [
  "Groceries",
  "Package pickup",
  "Borrow an item",
  "Rides",
  "Meals",
  "Moving help",
  "Tech help",
  "Other",
];

export const AREAS = [
  "North Campus",
  "South Campus",
  "East Village",
  "West End",
  "Riverside",
  "Downtown",
  "University Heights",
  "Lakeside",
];

export const URGENCY_RANK = { low: 1, medium: 2, high: 3 };
export const URGENCIES = Object.keys(URGENCY_RANK);

export const REQUEST_STATUSES = ["open", "in progress", "completed"];
export const OFFER_STATUSES = ["active", "full", "completed"];

export const PAGE_SIZE = 12;
