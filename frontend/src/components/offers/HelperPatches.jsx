import { useEffect, useState } from "react";
import { apiFetch } from "../../api.js";
import "./HelperPatches.css";

// Patches a helper earns for offers they've completed — owned by Trupal
const PATCHES = [
  {
    id: "first",
    name: "First stitch",
    tone: "patch-moss",
    goal: "Complete 1 offer",
    progress: (s) => [s.completed, 1],
  },
  {
    id: "patchwork",
    name: "Patchwork",
    tone: "patch-marigold",
    goal: "Complete 5 offers",
    progress: (s) => [s.completed, 5],
  },
  {
    id: "quilt",
    name: "Full quilt",
    tone: "patch-rose",
    goal: "Help 10 people",
    progress: (s) => [s.peopleHelped, 10],
  },
  {
    id: "golden",
    name: "Golden thread",
    tone: "patch-sky",
    goal: "Average 4.5 stars from 3+ reviews",
    progress: (s) => [s.feedbackCount >= 3 && s.averageStars >= 4.5 ? 1 : 0, 1],
  },
];

function HelperPatches() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    apiFetch("/api/offers/stats")
      .then((data) => {
        if (active) setStats(data);
      })
      .catch((err) => {
        if (active) setError(err.message);
      });
    return () => {
      active = false;
    };
  }, []);

  if (error) return null;
  if (!stats) {
    return (
      <p className="helper-patches-loading" role="status">
        Loading your patches…
      </p>
    );
  }

  return (
    <section className="helper-patches" aria-labelledby="helper-patches-title">
      <div className="helper-patches-summary">
        <h2 id="helper-patches-title">Your helper patches</h2>
        <p>
          {stats.completed} offers completed, {stats.peopleHelped} people helped
          {stats.averageStars !== null &&
            `, ${stats.averageStars} average stars from ${stats.feedbackCount} reviews`}
          .
        </p>
      </div>
      <ul className="helper-patches-list">
        {PATCHES.map((patch) => {
          const [current, target] = patch.progress(stats);
          const earned = current >= target;
          return (
            <li
              key={patch.id}
              className={`helper-patch ${patch.tone} ${earned ? "is-earned" : "is-locked"}`}
            >
              <span className="helper-patch-name">{patch.name}</span>
              <span className="helper-patch-goal">
                {earned
                  ? "Earned"
                  : `${patch.goal} (${Math.min(current, target)}/${target})`}
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

HelperPatches.propTypes = {};

export default HelperPatches;
