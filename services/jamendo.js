const axios = require("axios");

async function searchTracks(tag) {
  const res = await axios.get(
    "https://api.jamendo.com/v3.0/tracks/",
    {
      params: {
        client_id: process.env.JAMENDO_CLIENT_ID,
        format: "json",
        limit: 1,
        tags: tag,
        audioformat: "mp32"
      }
    }
  );

  console.log(
    JSON.stringify(
      res.data.results[0],
      null,
      2
    )
  );

  return [];
}

module.exports = { searchTracks };
