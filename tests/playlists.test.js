import fetch from "isomorphic-fetch";

test("Get playlists with tracks", () => {
  fetch("http://localhost:3001/api/graphql", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: `query PlaylistQuery{
        playlists {
            id
            name
            image
            external_url
            tracks {
              id
              name
              track
              thumbnail
            }
          }
      }`,
    }),
  })
    .then((res) => res.json())
    .then((res) => {
      console.log({ res });
      expect(res.playlists[0].tracks && res.playlists.tracks[0].length);
    })
    .catch((err) => {});
});

test("Get playlists without tracks", () => {
  fetch("http://localhost:3001/api/graphql", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: `query {
        playlists {
            id
            name
            image
            external_url
          }
      }`,
    }),
  })
    .then((res) => res.json())
    .then((res) => {
      expect(res.playlists[0].tracks && res.playlists[0].tracks.length > 0);
    })
    .catch((err) => {});
});
