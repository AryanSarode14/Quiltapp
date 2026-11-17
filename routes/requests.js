// /api/requests — owned by Heta Vimaleshkumar Patel
import express from "express";
import requireAuth from "../middleware/requireAuth.js";
import {
  addRating,
  assignHelper,
  createRequest,
  deleteRequest,
  getRequestById,
  listOpenRequests,
  listRequestsByHelper,
  listRequestsByRequester,
  updateRequest,
  updateStatus,
} from "../db/requestsDB.js";
import {
  AREAS,
  CATEGORIES,
  REQUEST_STATUSES,
  URGENCIES,
  URGENCY_RANK,
} from "../utils/constants.js";
import { cleanText, parseDateOnly, parsePage } from "../utils/query.js";

const router = express.Router();

function validateRequest(body) {
  const data = {
    title: cleanText(body.title, 80),
    description: cleanText(body.description, 600),
    category: body.category,
    urgency: body.urgency,
    area: body.area,
    neededBy: parseDateOnly(body.neededBy),
    contactNote: cleanText(body.contactNote, 200),
  };
  const errors = [];
  if (data.title.length < 4)
    errors.push("Add a title of at least 4 characters.");
  if (data.description.length < 10) {
    errors.push("Add a description of at least 10 characters.");
  }
  if (!CATEGORIES.includes(data.category)) errors.push("Choose a category.");
  if (!URGENCIES.includes(data.urgency)) errors.push("Choose an urgency.");
  if (!AREAS.includes(data.area)) errors.push("Choose an area.");
  if (!data.neededBy) errors.push("Choose a needed-by date.");
  if (!data.contactNote) {
    errors.push("Add how your helper can reach you, like a campus email.");
  }
  data.urgencyRank = URGENCY_RANK[data.urgency];
  return { data, errors };
}

const isRequester = (request, user) => request.requester._id.equals(user._id);

async function loadOwnedRequest(req, res) {
  const request = await getRequestById(req.params.id);
  if (!request) {
    res.status(404).json({ error: "That request no longer exists." });
    return null;
  }
  if (!isRequester(request, req.user)) {
    res
      .status(403)
      .json({ error: "Only the person who posted this can change it." });
    return null;
  }
  return request;
}

// Browse open requests (public).
router.get("/", async (req, res, next) => {
  try {
    const result = await listOpenRequests({
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

// The logged-in user's own requests. ?view=completed shows finished ones.
router.get("/mine", requireAuth, async (req, res, next) => {
  try {
    const statuses =
      req.query.view === "completed" ? ["completed"] : ["open", "in progress"];
    res.json(await listRequestsByRequester(req.user._id, statuses));
  } catch (err) {
    next(err);
  }
});

// Requests the logged-in user offered to help with.
router.get("/helping", requireAuth, async (req, res, next) => {
  try {
    res.json(await listRequestsByHelper(req.user._id));
  } catch (err) {
    next(err);
  }
});

router.get("/:id", requireAuth, async (req, res, next) => {
  try {
    const request = await loadOwnedRequest(req, res);
    if (request) res.json(request);
  } catch (err) {
    next(err);
  }
});

router.post("/", requireAuth, async (req, res, next) => {
  try {
    const { data, errors } = validateRequest(req.body);
    if (errors.length) return res.status(400).json({ error: errors.join(" ") });
    res.status(201).json(await createRequest(data, req.user));
  } catch (err) {
    next(err);
  }
});

router.put("/:id", requireAuth, async (req, res, next) => {
  try {
    const request = await loadOwnedRequest(req, res);
    if (!request) return;
    const { data, errors } = validateRequest(req.body);
    if (errors.length) return res.status(400).json({ error: errors.join(" ") });
    res.json(await updateRequest(req.params.id, data));
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", requireAuth, async (req, res, next) => {
  try {
    const request = await loadOwnedRequest(req, res);
    if (!request) return;
    await deleteRequest(req.params.id);
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

// "I can help"
router.post("/:id/help", requireAuth, async (req, res, next) => {
  try {
    const updated = await assignHelper(req.params.id, req.user);
    if (!updated) {
      return res.status(409).json({
        error: "Someone else is already helping, or this is your own request.",
      });
    }
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

router.patch("/:id/status", requireAuth, async (req, res, next) => {
  try {
    const request = await loadOwnedRequest(req, res);
    if (!request) return;
    const { status } = req.body;
    if (!REQUEST_STATUSES.includes(status)) {
      return res
        .status(400)
        .json({ error: "Choose open, in progress, or completed." });
    }
    if (status !== "open" && !request.helper) {
      return res.status(400).json({
        error: "A request needs a helper before it can move past open.",
      });
    }
    res.json(await updateStatus(req.params.id, status));
  } catch (err) {
    next(err);
  }
});

router.post("/:id/rating", requireAuth, async (req, res, next) => {
  try {
    const request = await loadOwnedRequest(req, res);
    if (!request) return;
    const stars = Number(req.body.stars);
    if (!Number.isInteger(stars) || stars < 1 || stars > 5) {
      return res.status(400).json({ error: "Choose 1 to 5 stars." });
    }
    const updated = await addRating(req.params.id, {
      stars,
      note: cleanText(req.body.note, 300),
      createdAt: new Date(),
    });
    if (!updated) {
      return res.status(409).json({
        error: "You can rate a helper once, after the request is completed.",
      });
    }
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

export default router;
