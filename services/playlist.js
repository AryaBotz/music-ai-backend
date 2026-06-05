const moodMap = require("../utils/moodMap");
const { searchTracks } = require("./jamendo");

async function buildPlaylist(mood) {
  const genres = moodMap[mood] || ["pop"];

  const tag = genres[0];

  const tracks = await searchTracks(tag);

  return {
    mood,
    tag,
    tracks
  };
}

module.exports = { buildPlaylist };
