let state = {
  playlist: null,
  index: 0,
  updatedAt: null
};

function setPlaylist(p) {
  state.playlist = p;
  state.index = 0;
  state.updatedAt = Date.now();
}

function getCurrent() {
  if (!state.playlist) return null;
  return state.playlist.tracks[state.index];
}

function next() {
  if (!state.playlist) return null;

  state.index++;

  if (state.index >= state.playlist.tracks.length) {
    state.index = 0;
  }

  return getCurrent();
}

module.exports = { setPlaylist, getCurrent, next };
