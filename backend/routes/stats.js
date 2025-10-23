import express from "express";
import { db } from "../config/firebase.js";

const router = express.Router();


// Remove any properties whose values is undefind
function pruneUndefined(obj) {
  if (!obj || typeof obj !== "object") return obj;
  const out = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v !== undefined) out[k] = v;
  }
  return out;
}

// Create or update a user's latest stats for a game type
router.post("/", async (req, res) => {
  try {
    const {
      userId,
      gameType,
      score,
      totalQuestions,
      correctAnswers,
      durationSec,
      metadata,
    } = req.body || {};

    if (!userId || typeof userId !== "string") {
      return res.status(400).json({ error: "Missing or invalid 'userId'" });
    }
    if (!gameType || typeof gameType !== "string") {
      return res.status(400).json({ error: "Missing or invalid 'gameType'" });
    }
    if (typeof score !== "number") {
      return res.status(400).json({ error: "Missing or invalid 'score'" });
    }

    const payload = pruneUndefined({
      score,
      totalQuestions: typeof totalQuestions === "number" ? totalQuestions : undefined,
      correctAnswers: typeof correctAnswers === "number" ? correctAnswers : undefined,
      durationSec: typeof durationSec === "number" ? durationSec : undefined,
      metadata: metadata && typeof metadata === "object" ? pruneUndefined(metadata) : undefined,
      updatedAt: new Date().toISOString(),
    });

    // Store latest per game type on the user document
    await db
      .collection("scores")
      .doc(userId)
      .set({ [gameType]: payload }, { merge: true });

    // Also append to a history subcollection for audit/leaderboards
    try {
      await db
        .collection("scores")
        .doc(userId)
        .collection("history")
        .add(pruneUndefined({ gameType, ...payload, createdAt: new Date().toISOString() }));
    } catch (historyErr) {
      // Non-fatal; continue
      console.warn("Failed to append to history:", historyErr?.message || historyErr);
    }

    return res.json({ success: true });
  } catch (err) {
    console.error("Error saving stats", err);
    return res.status(500).json({ error: "Could not save stats" });
  }
});

// Get a user's aggregated stats (latest per game type). Optionally include recent history.
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const includeHistory = String(req.query.includeHistory || "false").toLowerCase() === "true";
    const historyLimit = Math.min(parseInt(req.query.historyLimit, 10) || 10, 100);

    if (!userId || typeof userId !== "string") {
      return res.status(400).json({ error: "Missing or invalid 'userId'" });
    }

    const doc = await db.collection("scores").doc(userId).get();
    const data = doc.exists ? doc.data() : {};

    if (!includeHistory) {
      return res.json(data || {});
    }

    try {
      const historySnap = await db
        .collection("scores")
        .doc(userId)
        .collection("history")
        .orderBy("createdAt", "desc")
        .limit(historyLimit)
        .get();

      const history = historySnap.docs.map((d) => ({ id: d.id, ...d.data() }));
      return res.json({ ...data, _history: history });
    } catch (historyErr) {
      // If history fails, still return the main data
      console.warn("Failed to load history:", historyErr?.message || historyErr);
      return res.json(data || {});
    }
  } catch (err) {
    console.error("Error loading stats", err);
    return res.status(500).json({ error: "Could not load stats" });
  }
});

export default router;
