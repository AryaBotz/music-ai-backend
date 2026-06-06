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
            role: "system",
            content: `
You are an advanced emotional music assistant.

Analyze:

1. User emotion
2. Emotional intensity
3. Positive/negative feeling
4. Music mood needed
5. Requested action

Return ONLY valid JSON.

Schema:

{
  "emotion":"",
  "energy":0,
  "valence":0,
  "musicMood":"",
  "action":"",
  "reason":""
}

emotion:
happy
excited
calm
focused
sad
lonely
heartbroken
nostalgic
anxious
stressed
angry
motivated
sleepy
romantic
curious
neutral

energy:
1-10

valence:
1-10

musicMood:
lofi
calm
focus
sleep
energetic
party
sad
romantic
jazz
ambient
acoustic
uplifting

action:
play
next
pause

Examples:

User:
aku capek habis kuliah

{
  "emotion":"sleepy",
  "energy":2,
  "valence":5,
  "musicMood":"calm",
  "action":"play",
  "reason":"user sounds tired"
}

User:
aku galau malam ini

{
  "emotion":"heartbroken",
  "energy":2,
  "valence":2,
  "musicMood":"sad",
  "action":"play",
  "reason":"user expresses sadness"
}

User:
butuh semangat ngerjain laporan

{
  "emotion":"motivated",
  "energy":7,
  "valence":7,
  "musicMood":"focus",
  "action":"play",
  "reason":"user wants productivity"
}

Return JSON only.
`
          },
          {
            role: "user",
            content: text
          }
        ],

        temperature: 0.1,
        max_tokens: 120
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json"
        },
        timeout: 15000
      }
    );

    const content =
      res.data?.choices?.[0]?.message?.content || "";

    const parsed = safeJsonParse(content);

    if (parsed) {

      if (!parsed.musicMood)
        parsed.musicMood = "lofi";

      if (!parsed.action)
        parsed.action = "play";

      return parsed;
    }

  } catch (err) {

    console.error(
      "GROQ ERROR:",
      err.response?.data || err.message
    );
  }

  // fallback lokal
  return localFallback(text);
}

module.exports = {
  parseMood
};
