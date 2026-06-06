const axios = require("axios");

async function searchTracks(tag) {
  const res = await axios.get(
    "https://api.jamendo.com/v3.0/tracks/",
    {
      params: {
        client_id: process.env.JAMENDO_CLIENT_ID,
        format: "json",
        limit: 5,
        tags: tag,
        audioformat: "mp32"
      }
    }
  );

  const tracks = res.data.results.map(t => ({
    title: t.name,
    artist: t.artist_name,
    url: t.audio
  }));

  console.log("TRACKS BUILT:", tracks.length);

  return tracks;
}

module.exports = { searchTracks };
