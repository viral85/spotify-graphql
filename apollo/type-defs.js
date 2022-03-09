import { gql } from "@apollo/client";

export const typeDefs = gql`
  type Playlist {
    id: ID
    name: String
    image: String
    tracks: [Track]
    external_url: String 
  }

  type Track{
      id: ID
      name: String
      track: String
      thumbnail: String
  }

  type Query {
    playlists: [Playlist]
  }
`;
