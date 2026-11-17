// /api/offers — owned by Trupal Jageshkumar Patel
import express from "express";
import requireAuth from "../middleware/requireAuth.js";
import {
  addFeedback,
  claimSpot,
  createOffer,
  deleteOffer,
  getOfferById,
  getOffererStats,
  listActiveOffers,
  listOffersForWeek,
  listOffersByOfferer,
  listOffersClaimedBy,
  releaseSpot,
  updateOffer,
  updateStatus,
} from "../db/offersDB.js";
import { AREAS, CATEGORIES, OFFER_STATUSES } from "../utils/constants.js";
import { cleanText, parseDateOnly, parsePage } from "../utils/query.js";

const router = express.Router();
const MAX_SPOTS = 10;

function validateOffer(body) {
  const data = {
    title: cleanText(body.title, 80),
    description: cleanText(body.description, 600),
    category: body.category,
    area: body.area,
    date: parseDateOnly(body.date),
    availability: cleanText(body.availability, 80),
    spots: Number(body.spots),
    contactNote: cleanText(body.contactNote, 200),
  };
  const errors = [];
  if (data.title.length < 4)
    errors.push("Add a title of at least 4 characters.");
  if (data.description.length < 10) {
    errors.push("Add a description of at least 10 characters.");
  }
  if (!CATEGORIES.includes(data.category)) errors.push("Choose a category.");
  if (!AREAS.includes(data.area)) errors.push("Choose an area.");
  if (!data.date) errors.push("Choose a date.");
  if (!data.availability)
    errors.push("Add when you're available, like 10am to 1pm.");
  if (
    !Number.isInteger(data.spots) ||
    data.spots < 1 ||
    data.spots > MAX_SPOTS
  ) {
    errors.push(`Spots must be a whole number from 1 to ${MAX_SPOTS}.`);
  }
  if (!data.contactNote) {
    errors.push("Add how people who claim a spot can reach you.");
  }
  return { data, errors };
}

const isOfferer = (offer, user) => offer.offerer._id.equals(user._id);

async function loadOwnedOffer(req, res) {
  const offer = await getOfferById(req.params.id);
  if (!offer) {
    res.status(404).json({ error: "That offer no longer exists." });
    return null;
  }
  if (!isOfferer(offer, req.user)) {
    res
      .status(403)
      .json({ error: "Only the person who posted this can change it." });
    return null;
  }
  return offer;
}

// Browse active offers (public).
router.get("/", async (req, res, next) => {
  try {
    const result = await listActiveOffers({
      search: cleanText(req.query.search, 100),
      category: CATEGORIES.includes(req.query.category)
        ? req.query.category
        : "",
      area: AREAS.includes(req.query.area) ? req.query.area : "",
      sort: req.query.sort,
      page: parsePage(req.query.page),
    });
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// Active offers over the next 7 days, for the week calendar (public).
router.get("/week", async (req, res, next) => {
  try {
    const items = await listOffersForWeek({
      search: cleanText(req.query.search, 100),
      category: CATEGORIES.includes(req.query.category)
        ? req.query.category
        : "",
      area: AREAS.includes(req.query.area) ? req.query.area : "",
    });
    res.json(items);
  } catch (err) {
    next(err);
  }
});

// Helper patch totals for the logged-in user.
router.get("/stats", requireAuth, async (req, res, next) => {
  try {
    res.json(await getOffererStats(req.user._id));
  } catch (err) {
    next(err);
  }
});

// The logged-in user's own offers. ?view=past shows completed ones.
router.get("/mine", requireAuth, async (req, res, next) => {
  try {
    const statuses =
      req.query.view === "past" ? ["completed"] : ["active", "full"];
    res.json(await listOffersByOfferer(req.user._id, statuses));
  } catch (err) {
    next(err);
  }
});

// Offers the logged-in user has claimed a spot on.
router.get("/claimed", requireAuth, async (req, res, next) => {
  try {
    res.json(await listOffersClaimedBy(req.user._id));
  } catch (err) {
    next(err);
  }
});

router.get("/:id", requireAuth, async (req, res, next) => {
  try {
    const offer = await loadOwnedOffer(req, res);
    if (offer) res.json(offer);
  } catch (err) {
    next(err);
  }
});

router.post("/", requireAuth, async (req, res, next) => {
  try {
    const { data, errors } = validateOffer(req.body);
    if (errors.length) return res.status(400).json({ error: errors.join(" ") });
    res.status(201).json(await createOffer(data, req.user));
  } catch (err) {
    next(err);
  }
});

router.put("/:id", requireAuth, async (req, res, next) => {
  try {
    const offer = await loadOwnedOffer(req, res);
    if (!offer) return;
    const { data, errors } = validateOffer(req.body);
    if (data.spots < offer.claims.length) {
      errors.push(
        `${offer.claims.length} people have already claimed spots, so you need at least that many.`,
      );
    }
    if (errors.length) return res.status(400).json({ error: errors.join(" ") });
    if (offer.status !== "completed") {
      data.status = offer.claims.length >= data.spots ? "full" : "active";
    }
    res.json(await updateOffer(req.params.id, data));
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", requireAuth, async (req, res, next) => {
  try {
    const offer = await loadOwnedOffer(req, res);
    if (!offer) return;
    await deleteOffer(req.params.id);
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

router.post("/:id/claim", requireAuth, async (req, res, next) => {
  try {
    const updated = await claimSpot(req.params.id, req.user);
    if (!updated) {
      return res.status(409).json({
        error:
          "This offer is full, closed, already claimed by you, or your own.",
      });
    }
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

router.delete("/:id/claim", requireAuth, async (req, res, next) => {
  try {
    const updated = await releaseSpot(req.params.id, req.user._id);
    if (!updated) {
      return res
        .status(409)
        .json({ error: "You don't have a spot on this offer." });
    }
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

router.patch("/:id/status", requireAuth, async (req, res, next) => {
  try {
    const offer = await loadOwnedOffer(req, res);
    if (!offer) return;
    const { status } = req.body;
    if (!OFFER_STATUSES.includes(status)) {
      return res
        .status(400)
        .json({ error: "Choose active, full, or completed." });
    }
    if (status === "active" && offer.claims.length >= offer.spots) {
      return res.status(400).json({
        error:
          "Every spot is claimed. Add spots by editing the offer to reopen it.",
      });
    }
    res.json(await updateStatus(req.params.id, status));
  } catch (err) {
    next(err);
  }
});

router.post("/:id/feedback", requireAuth, async (req, res, next) => {
  try {
    const offer = await getOfferById(req.params.id);
    if (!offer) {
      return res.status(404).json({ error: "That offer no longer exists." });
    }
    const startOfToday = new Date();
    startOfToday.setUTCHours(0, 0, 0, 0);
    const isPast = offer.status === "completed" || offer.date < startOfToday;
    if (!isPast) {
      return res.status(400).json({
        error: "You can leave feedback once the offer is completed.",
      });
    }
    const stars = Number(req.body.stars);
    if (!Number.isInteger(stars) || stars < 1 || stars > 5) {
      return res.status(400).json({ error: "Choose 1 to 5 stars." });
    }
    const updated = await addFeedback(req.params.id, {
      userId: req.user._id,
      displayName: req.user.displayName,
      stars,
      comment: cleanText(req.body.comment, 300),
      createdAt: new Date(),
    });
    if (!updated) {
      return res.status(409).json({
        error: "Only people who claimed a spot can leave feedback, once each.",
      });
    }
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

export default router;
