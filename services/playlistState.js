
let currentPlaylist = null;
let currentIndex = 0;

// SET playlist baru
function setPlaylist(playlist) {
  currentPlaylist = playlist;
  currentIndex = 0;
}

// ambil track sekarang
function getCurrentTrack() {
  if (!currentPlaylist) return null;
  return currentPlaylist.tracks[currentIndex];
}

// next track
function nextTrack() {
  if (!currentPlaylist) return null;

  currentIndex++;

  if (currentIndex >= currentPlaylist.tracks.length) {
    currentIndex = 0;
  }

  return getCurrentTrack();
}

// optional: reset
function reset() {
  currentPlaylist = null;
  currentIndex = 0;
}

module.exports = {
  setPlaylist,
  getCurrentTrack,
  nextTrack,
  reset
};
