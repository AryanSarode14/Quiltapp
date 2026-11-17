import express from "express";
import passport from "passport";
import { createUser, findUserByUsername } from "../db/usersDB.js";
import { hashPassword } from "../auth/password.js";

const router = express.Router();

const publicUser = (user) => ({
  _id: user._id,
  username: user.username,
  displayName: user.displayName,
});

router.post("/register", async (req, res, next) => {
  try {
    const username = String(req.body.username ?? "")
      .trim()
      .toLowerCase();
    const displayName = String(req.body.displayName ?? "").trim();
    const password = String(req.body.password ?? "");

    if (!/^[a-z0-9_]{3,30}$/.test(username)) {
      return res.status(400).json({
        error: "Usernames are 3 to 30 letters, numbers, or underscores.",
      });
    }
    if (!displayName || displayName.length > 50) {
      return res
        .status(400)
        .json({ error: "Enter a display name of up to 50 characters." });
    }
    if (password.length < 8) {
      return res
        .status(400)
        .json({ error: "Passwords need at least 8 characters." });
    }
    if (await findUserByUsername(username)) {
      return res.status(409).json({ error: "That username is taken." });
    }

    const { salt, passwordHash } = await hashPassword(password);
    const user = await createUser({
      username,
      displayName,
      salt,
      passwordHash,
    });

    req.login(user, (err) => {
      if (err) return next(err);
      return res.status(201).json({ user: publicUser(user) });
    });
  } catch (err) {
    next(err);
  }
});

router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      return res
        .status(401)
        .json({ error: info?.message || "Login failed. Try again." });
    }
    req.login(user, (loginErr) => {
      if (loginErr) return next(loginErr);
      return res.json({ user: publicUser(user) });
    });
  })(req, res, next);
});

router.post("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.session.destroy(() => {
      res.clearCookie("connect.sid");
      res.json({ ok: true });
    });
  });
});

router.get("/me", (req, res) => {
  res.json({ user: req.user ? publicUser(req.user) : null });
});

export default router;
