const express = require("express");
const router = express.Router();

const { parseMood } = require("../services/groq");
const { buildPlaylist } = require("../services/playlist");
const playlistState = require("../services/playlistState");

/**
 * =========================
 * POST /music/play
 * AI → mood → playlist → save state
 * =========================
 */
router.post("/play", async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: "text required" });
    }

    // 1. AI parse mood
    const intent = await parseMood(text);

    // 2. build playlist from mood
    const playlist = await buildPlaylist(intent.mood);

    // 3. SAVE STATE (INI PENTING)
    playlistState.setPlaylist(playlist);

    // 4. return response
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


/**
 * =========================
 * GET /music/current
 * ambil lagu sekarang
 * =========================
 */
router.get("/current", (req, res) => {
  const track = playlistState.getCurrentTrack();

  if (!track) {
    return res.status(404).json({
      error: "no active playlist"
    });
  }

  res.json(track);
});


/**
 * =========================
 * GET /music/next
 * pindah ke lagu berikutnya
 * =========================
 */
router.get("/next", (req, res) => {
  const track = playlistState.nextTrack();

  if (!track) {
    return res.status(404).json({
      error: "no active playlist"
    });
  }

  res.json(track);
});

module.exports = router;
