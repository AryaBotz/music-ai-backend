const axios = require("axios");

async function parseMood(text) {
  const res = await axios.post(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: `
Convert text into JSON only:

{
  "mood": "calm|happy|sad|focus|party",
  "action": "play|next|pause"
}

Return ONLY JSON.
`
        },
        { role: "user", content: text }
      ],
      temperature: 0.2
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`
      }
    }
  );

  return JSON.parse(res.data.choices[0].message.content);
}

module.exports = { parseMood };
