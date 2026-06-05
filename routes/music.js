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

    // 1. AI parsing (Groq)
    const intent = await parseMood(text);

    // 2. build playlist from mood
    const playlist = await buildPlaylist(intent.mood);

    // 3. save state
    playlistState.setPlaylist(playlist);

    res.json({
      ok: true,
      input: text,
      intent: intent,
      playlistSize: playlist?.tracks?.length || 0
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      ok: false,
      error: "server error"
    });
  }
});


/**
 * =========================
 * GET /music/current
 * return current track (JSON CLEAN)
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
    track: {
      title: track.title,
      artist: track.artist,
      url: track.url
    }
  });
});


/**
 * =========================
 * GET /music/next
 * move index + return next track
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
    track: {
      title: track.title,
      artist: track.artist,
      url: track.url
    }
  });
});

module.exports = router;
