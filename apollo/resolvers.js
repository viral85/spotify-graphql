import fetch from "node-fetch";

function errorMsg(error) {
  if (error) {
    const { status = "", message = "no details" } = error;
    return `Error: ${status}: ${message}`;
  }
  return "An unknown error!";
}

function throwExceptionOnError(data) {
  if (data.error) {
    throw new Error(errorMsg(data.error));
  }
}

const headers = {
  Accept: "application/json",
  Authorization: "",
};

const client_credentials = require("./client_cred");

let awaitingAuthorization;

const spotifyProxy = () => {
  if (awaitingAuthorization && !client_credentials.isExpired()) {
    // use existing promise, if not expired
    return awaitingAuthorization;
  }
  if (!awaitingAuthorization || client_credentials.isExpired()) {
    awaitingAuthorization = new Promise((resolve, reject) => {
      client_credentials
        .authenticate()
        .then((token) => {
          headers.Authorization = "Bearer " + token.access_token;
          resolve(headers);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  return awaitingAuthorization;
};

const spotifyJsonToPlaylist = (playlist, tracks = []) => {
  return {
    ...playlist,
    image: playlist.images[0] ? playlist.images[0].url : "",
    external_url: playlist.external_urls.spotify || "",
    tracks: tracks.map((track) => ({
      id: track?.track?.id,
      name: track?.track?.name,
      track: track?.track?.external_urls?.spotify,
      thumbnail:
        track?.video_thumbnail?.url ||
        track?.track?.album?.images[0]?.url ||
        "",
    })),
  };
};

const haveHeadersWithAuthToken = async () => {
  return await spotifyProxy();
};

export const resolvers = {
  Query: {
    async playlists(_parent, _args, _context, _info) {
      const response = await fetch(
        `https://api.spotify.com/v1/browse/featured-playlists`,
        {
          headers: await haveHeadersWithAuthToken(),
        }
      );
      const data = await response.json();
      // console.log({ data: data.playlists.items[0].images[0] });
      return (data.playlists.items || []).map(async (item) => {
        const res = await fetch(
          `https://api.spotify.com/v1/playlists/${item.id}`,
          {
            headers: await haveHeadersWithAuthToken(),
          }
        );
        const data = await res.json();
        // console.log({ data: data.tracks.items[0].track.album.images });
        return spotifyJsonToPlaylist(item, data.tracks.items);
      });
    },
  },
};
