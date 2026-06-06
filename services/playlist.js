let state = {
  playlist: [],
  index: 0
};

function setPlaylist(tracks = []) {
  state.playlist = Array.isArray(tracks)
    ? tracks
    : [];

  state.index = 0;

  console.log(
    "Playlist loaded:",
    state.playlist.length
  );
}

function getCurrent() {
  if (state.playlist.length === 0) {
    return null;
  }

  return state.playlist[state.index];
}

function next() {
  if (state.playlist.length === 0) {
    return null;
  }

  state.index++;

  if (state.index >= state.playlist.length) {
    state.index = 0;
  }

  return state.playlist[state.index];
}

function previous() {
  if (state.playlist.length === 0) {
    return null;
  }

  state.index--;

  if (state.index < 0) {
    state.index = state.playlist.length - 1;
  }

  return state.playlist[state.index];
}

function getPlaylist() {
  return state.playlist;
}

function getIndex() {
  return state.index;
}

module.exports = {
  setPlaylist,
  getCurrent,
  next,
  previous,
  getPlaylist,
  getIndex
};
