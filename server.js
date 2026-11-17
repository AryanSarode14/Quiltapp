import "dotenv/config";
import express from "express";
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "passport";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { connectDB } from "./db/connection.js";
import configurePassport from "./auth/passportConfig.js";
import authRouter from "./routes/auth.js";
import requestsRouter from "./routes/requests.js";
import offersRouter from "./routes/offers.js";

const { MONGO_URI, SESSION_SECRET } = process.env;
if (!MONGO_URI || !SESSION_SECRET) {
  throw new Error("MONGO_URI and SESSION_SECRET must be set in .env");
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3000;
const DB_NAME = process.env.DB_NAME || "quilt";
const isProduction = process.env.NODE_ENV === "production";
const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;

const app = express();

// Hosting platforms such as Render sit behind a proxy that terminates HTTPS.
if (isProduction) {
  app.set("trust proxy", 1);
}

app.use(express.json({ limit: "100kb" }));

app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: MONGO_URI,
      dbName: DB_NAME,
      collectionName: "sessions",
    }),
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: isProduction,
      maxAge: ONE_WEEK_MS,
    },
  }),
);

configurePassport(passport);
app.use(passport.initialize());
app.use(passport.session());

app.use("/api/auth", authRouter);
app.use("/api/requests", requestsRouter);
app.use("/api/offers", offersRouter);
app.use("/api", (_req, res) => {
  res.status(404).json({ error: "That API route does not exist." });
});

// Serve the built React app. The frontend and API share one origin,
// so no CORS configuration is needed.
const distPath = path.join(__dirname, "frontend", "dist");
app.use(express.static(distPath));
app.get("*", (_req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Something went wrong on the server." });
});

await connectDB();
app.listen(PORT, () => {
  console.log(`Quilt is running on http://localhost:${PORT}`);
});
