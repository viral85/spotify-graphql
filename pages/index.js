import gql from "graphql-tag";
import Link from "next/link";
import { useQuery } from "@apollo/client";
import { initializeApollo } from "../apollo/client";
import { useState } from "react/cjs/react.development";
import Router, { useRouter } from "next/router";
// require("isomorphic-fetch");

const playlistsQuery = gql`
  query PlaylistsQuery {
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
  }
`;

const Playlists = () => {
  const {
    data: { playlists },
  } = useQuery(playlistsQuery);

  return (
    <>
      <h1 className="heading">
        <span>Spotify</span> Playlists
      </h1>
      <div className="playlists">
        {playlists && playlists.length
          ? playlists.map((playlist) => {
              return (
                <div
                  className="playlist"
                  onClick={() => window.open(playlist.external_url)}
                >
                  <div className="playlist_tracks_count">
                    Tracks: {playlist.tracks.length}
                  </div>
                  <h1 className="playlist_name">
                    <span>{playlist.name}</span>
                  </h1>
                  <img src={playlist.image} className="playlist_image" />
                </div>
              );
            })
          : null}
      </div>
    </>
  );
};

export async function getStaticProps() {
  const apolloClient = initializeApollo();

  await apolloClient.query({
    query: playlistsQuery,
  });

  return {
    props: {
      initialApolloState: apolloClient.cache.extract(),
    },
  };
}

export default Playlists;
