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
      return res.status(400).json({
        ok: false,
        error: "text required"
      });
    }

    // 1. AI parsing (Groq / rule-based fallback)
    const intent = await parseMood(text);

    // 2. build playlist berdasarkan mood
    const playlist = await buildPlaylist(intent.mood);

    // 3. ambil tracks aman
    const tracks = playlist?.tracks || [];

    // 4. simpan ke state (untuk /current & /next)
    playlistState.setPlaylist(tracks);

    // DEBUG (penting untuk Railway logs)
    console.log("MOOD:", intent.mood);
    console.log("TRACKS:", JSON.stringify(tracks, null, 2));

    // 5. response ke ESP32 (INI FIX UTAMA)
    res.json({
      ok: true,
      input: text,
      intent: intent,
      tracks: tracks,
      playlistSize: tracks.length
    });

  } catch (err) {
    console.error("PLAY ERROR:", err);
    res.status(500).json({
      ok: false,
      error: "server error"
    });
  }
});

/**
 * =========================
 * GET /music/current
 * =========================
 */
router.get("/current", (req, res) => {
  const track = playlistState.getCurrent();

  if (!track) {
    return res.status(404).json({
      ok: false,
      error: "no playlist"
    });
  }

  res.json({
    ok: true,
    track
  });
});

/**
 * =========================
 * GET /music/next
 * =========================
 */
router.get("/next", (req, res) => {
  const track = playlistState.next();

  if (!track) {
    return res.status(404).json({
      ok: false,
      error: "no playlist"
    });
  }

  res.json({
    ok: true,
    track
  });
});

module.exports = router;
