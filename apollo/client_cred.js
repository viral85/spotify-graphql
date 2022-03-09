import fetch from "node-fetch";

// load secrets from .env file and store in process.env
import dotenv from "dotenv";
dotenv.config();

const CLIENT_ID = "38b020f0c9d446919a909ce5477b8c00";
const CLIENT_SECRET = "8a49988b78244d1ba578c1adc7a6c79a";

const authorizationHeader = () =>
  "Basic " + new Buffer(CLIENT_ID + ":" + CLIENT_SECRET).toString("base64");

const authOptions = {
  url: "https://accounts.spotify.com/api/token",
};

//
let expireTime = 0;

module.exports = {
  isExpired: () => {
    if (expireTime) {
      return Date.now() > expireTime;
    }
    return false;
  },
  authenticate: () => {
    const options = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
        Authorization: authorizationHeader(),
      },
      method: "POST",
      body: "grant_type=client_credentials",
    };

    return fetch(authOptions.url, options)
      .then((response) => {
        return response.json();
      })
      .then((token) => {
        const time = Date.now();
        const expires_in = Number.parseInt(token.expires_in, 10);

        expireTime = time + expires_in * 1000; //

        return token;
      });
  },
};
