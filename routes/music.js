const express = require("express");
const router = express.Router();

const { parseMood } = require("../services/groq");
const { buildPlaylist } = require("../services/playlist");

// MAIN AI ENDPOINT
router.post("/play", async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: "text required" });
    }

    // 1. Groq AI parse
    const intent = await parseMood(text);

    // 2. playlist engine
    const playlist = await buildPlaylist(intent.mood);

    // 3. response ke ESP32 / frontend
    res.json({
      input: text,
      intent,
      playlist
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server error" });
  }
});

module.exports = router;
