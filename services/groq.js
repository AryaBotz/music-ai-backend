const axios = require("axios");

// =========================
// SAFE JSON PARSER
// =========================
function safeJsonParse(text) {
  try {
    return JSON.parse(text);
  } catch (e) {

    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");

    if (start !== -1 && end !== -1) {
      try {
        return JSON.parse(text.substring(start, end + 1));
      } catch (_) {}
    }

    return null;
  }
}

// =========================
// LOCAL FALLBACK
// =========================
function localFallback(text) {

  const t = text.toLowerCase();

  if (
    t.includes("next") ||
    t.includes("selanjutnya") ||
    t.includes("lagu berikutnya")
  ) {
    return {
      emotion: "neutral",
      energy: 5,
      valence: 5,
      musicMood: "lofi",
      action: "next",
      reason: "next track requested"
    };
  }

  if (
    t.includes("pause") ||
    t.includes("berhenti") ||
    t.includes("stop")
  ) {
    return {
      emotion: "neutral",
      energy: 5,
      valence: 5,
      musicMood: "lofi",
      action: "pause",
      reason: "pause requested"
    };
  }

  if (
    t.includes("belajar") ||
    t.includes("ngoding") ||
    t.includes("coding") ||
    t.includes("fokus") ||
    t.includes("laporan")
  ) {
    return {
      emotion: "focused",
      energy: 6,
      valence: 6,
      musicMood: "focus",
      action: "play",
      reason: "focus keywords detected"
    };
  }

  if (
    t.includes("tidur") ||
    t.includes("malam") ||
    t.includes("ngantuk")
  ) {
    return {
      emotion: "sleepy",
      energy: 2,
      valence: 5,
      musicMood: "sleep",
      action: "play",
      reason: "sleep-related keywords"
    };
  }

  if (
    t.includes("santai") ||
    t.includes("chill") ||
    t.includes("lofi")
  ) {
    return {
      emotion: "calm",
      energy: 3,
      valence: 6,
      musicMood: "lofi",
      action: "play",
      reason: "relaxation keywords"
    };
  }

  if (
    t.includes("semangat") ||
    t.includes("energi") ||
    t.includes("gym") ||
    t.includes("olahraga")
  ) {
    return {
      emotion: "motivated",
      energy: 8,
      valence: 8,
      musicMood: "energetic",
      action: "play",
      reason: "high energy keywords"
    };
  }

  if (
    t.includes("galau") ||
    t.includes("putus") ||
    t.includes("sedih")
  ) {
    return {
      emotion: "heartbroken",
      energy: 2,
      valence: 2,
      musicMood: "sad",
      action: "play",
      reason: "sad keywords"
    };
  }

  return {
    emotion: "neutral",
    energy: 5,
    valence: 5,
    musicMood: "lofi",
    action: "play",
    reason: "fallback default"
  };
}

// =========================
// GROQ MAIN
// =========================
async function parseMood(text) {

  try {

    const res = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.1-8b-instant",

        messages: [
          {
