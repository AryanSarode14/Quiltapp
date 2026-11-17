// helpOffers collection — owned by Trupal Jageshkumar Patel
import { ObjectId } from "mongodb";
import { getDB } from "./connection.js";
import { PAGE_SIZE } from "../utils/constants.js";
import { escapeRegex } from "../utils/query.js";

const offers = () => getDB().collection("helpOffers");
const toObjectId = (id) => (ObjectId.isValid(id) ? new ObjectId(id) : null);

// Browsers see who offered and how many spots are taken, but not the
// contact note, the names of other claimers, or individual feedback.
const PUBLIC_PROJECTION = {
  contactNote: 0,
  "claims.displayName": 0,
  feedback: 0,
};

const SORTS = {
  soonest: { date: 1 },
  newest: { createdAt: -1 },
  spots: { spots: -1, date: 1 },
};

export async function listActiveOffers({ search, category, area, sort, page }) {
  const filter = { status: "active" };
  if (category) filter.category = category;
  if (area) filter.area = area;
  if (search) {
    const pattern = new RegExp(escapeRegex(search), "i");
    filter.$or = [{ title: pattern }, { description: pattern }];
  }

  const [items, total] = await Promise.all([
    offers()
      .find(filter, { projection: PUBLIC_PROJECTION })
      .sort(SORTS[sort] || SORTS.soonest)
      .skip((page - 1) * PAGE_SIZE)
      .limit(PAGE_SIZE)
      .toArray(),
    offers().countDocuments(filter),
  ]);

  return {
    items,
    total,
    page,
    totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)),
  };
}

export async function listOffersByOfferer(userId, statuses) {
  return offers()
    .find({ "offerer._id": userId, status: { $in: statuses } })
    .sort({ date: -1 })
    .limit(200)
    .toArray();
}

export async function listOffersClaimedBy(userId) {
  return offers()
    .find({ "claims.userId": userId })
    .project({ "claims.displayName": 0 })
    .sort({ date: -1 })
    .limit(200)
    .toArray();
}

export async function getOfferById(id) {
  const _id = toObjectId(id);
  return _id ? offers().findOne({ _id }) : null;
}

export async function createOffer(data, user) {
  const now = new Date();
  const doc = {
    ...data,
    status: "active",
    offerer: { _id: user._id, displayName: user.displayName },
    claims: [],
    feedback: [],
    createdAt: now,
    updatedAt: now,
  };
  const result = await offers().insertOne(doc);
  return { _id: result.insertedId, ...doc };
}

export async function updateOffer(id, data) {
  return offers().findOneAndUpdate(
    { _id: toObjectId(id) },
    { $set: { ...data, updatedAt: new Date() } },
    { returnDocument: "after" },
  );
}

export async function deleteOffer(id) {
  const result = await offers().deleteOne({ _id: toObjectId(id) });
  return result.deletedCount === 1;
}

// Atomic: the filter only matches while a spot is free, so the offer
// can never be over-claimed.
export async function claimSpot(id, user) {
  const updated = await offers().findOneAndUpdate(
    {
      _id: toObjectId(id),
      status: "active",
      "offerer._id": { $ne: user._id },
      "claims.userId": { $ne: user._id },
      $expr: { $lt: [{ $size: "$claims" }, "$spots"] },
    },
    {
      $push: {
        claims: {
          userId: user._id,
          displayName: user.displayName,
          claimedAt: new Date(),
        },
      },
      $set: { updatedAt: new Date() },
    },
    { returnDocument: "after" },
  );
  if (updated && updated.claims.length >= updated.spots) {
    return offers().findOneAndUpdate(
      { _id: updated._id },
      { $set: { status: "full" } },
      { returnDocument: "after" },
    );
  }
  return updated;
}

export async function releaseSpot(id, userId) {
  const updated = await offers().findOneAndUpdate(
    {
      _id: toObjectId(id),
      status: { $ne: "completed" },
      "claims.userId": userId,
    },
    { $pull: { claims: { userId } }, $set: { updatedAt: new Date() } },
    { returnDocument: "after" },
  );
  if (updated && updated.status === "full") {
    return offers().findOneAndUpdate(
      { _id: updated._id },
      { $set: { status: "active" } },
      { returnDocument: "after" },
    );
  }
  return updated;
}

export async function updateStatus(id, status) {
  return offers().findOneAndUpdate(
    { _id: toObjectId(id) },
    { $set: { status, updatedAt: new Date() } },
    { returnDocument: "after" },
  );
}

export async function addFeedback(id, feedback) {
  return offers().findOneAndUpdate(
    {
      _id: toObjectId(id),
      "claims.userId": feedback.userId,
      "feedback.userId": { $ne: feedback.userId },
    },
    { $push: { feedback }, $set: { updatedAt: new Date() } },
    { returnDocument: "after" },
  );
}

// Active offers in the next 7 days, for the week calendar view.
export async function listOffersForWeek({ search, category, area }) {
  const start = new Date();
  start.setUTCHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + 7);

  const filter = { status: "active", date: { $gte: start, $lt: end } };
  if (category) filter.category = category;
  if (area) filter.area = area;
  if (search) {
    const pattern = new RegExp(escapeRegex(search), "i");
    filter.$or = [{ title: pattern }, { description: pattern }];
  }

  return offers()
    .find(filter, { projection: PUBLIC_PROJECTION })
    .sort({ date: 1 })
    .limit(200)
    .toArray();
}

// Totals used to award helper patches on the My offers page.
export async function getOffererStats(userId) {
  const [row] = await offers()
    .aggregate([
      { $match: { "offerer._id": userId } },
      {
        $group: {
          _id: null,
          totalOffers: { $sum: 1 },
          completed: {
            $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] },
          },
          peopleHelped: {
            $sum: {
              $cond: [
                { $eq: ["$status", "completed"] },
                { $size: "$claims" },
                0,
              ],
            },
          },
          feedbackCount: { $sum: { $size: "$feedback" } },
          starTotal: { $sum: { $sum: "$feedback.stars" } },
        },
      },
    ])
    .toArray();

  if (!row) {
    return {
      totalOffers: 0,
      completed: 0,
      peopleHelped: 0,
      feedbackCount: 0,
      averageStars: null,
    };
  }
  return {
    totalOffers: row.totalOffers,
    completed: row.completed,
    peopleHelped: row.peopleHelped,
    feedbackCount: row.feedbackCount,
    averageStars: row.feedbackCount
      ? Math.round((row.starTotal / row.feedbackCount) * 10) / 10
      : null,
  };
}
