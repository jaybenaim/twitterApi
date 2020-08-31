const express = require("express");
const axios = require("axios");
const Twitter = require("twitter");

require("dotenv").config();

const router = express.Router();

const BASE_URL = "https://api.twitter.com/1.1/";

const OAUTHS = {
  oauth_consumer_key: process.env.CONSUMER_API_KEY,
  oauth_consumer_secret: process.env.CONSUMER_SECRET_KEY,
  oauth_nonce: process.env.OAUTH_NOONCE,
  oauth_signature: process.env.OAUTH_SIGNATURE,
  oauth_signature_method: "HMAC-SHA1",
  oauth_timestamp: new Date().getTime(),
  access_token: process.env.ACCESS_TOKEN,
  token_secret: process.env.TOKEN_SECRET,
  oauth_version: "1.0",
};

router.get("/", (req, res) => {
  res.status(200).send("API Home");
});
router.get("/fetch-info", (req, res) => {
  return newTwitterCall(res);
});

const verifyAccount = async () => {
  const params = {
    include_email: true,
    include_entities: "false",
    skip_status: true,
  };

  return await axios.get(`${BASE_URL}account/verify_credentials.json`, {
    params,
    headers: {
      Authorization: `OAuth oauth_consumer_key=${OAUTHS["oauth_consumer_key"]}, oauth_nonce=${OAUTHS["oauth_nonce"]}, oauth_signature=${OAUTHS["oauth_signature"]}, oauth_signature_method=${OAUTHS["oauth_signature_method"]}, oauth_timestamp=${OAUTHS["oauth_timestamp"]},"access_token=${OAUTHS["access_token"]}, oauth_version=${OAUTHS["oauth_version"]} `,
    },
  });
};
const getToken = () => {
  async function getRequest() {
    // Edit query parameters below
    const params = {
      query: "from:twitterdev -is:retweet",
      "tweet.fields": "author_id",
    };

    const res = await axios.get("", endpointUrl, params, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    if (res.body) {
      return res.body;
    } else {
      throw new Error("Unsuccessful request");
    }
  }
};

const newTwitterCall = (res) => {
  console.log(encodeURIComponent("Jblil_rabbit"));
  const client = new Twitter({
    consumer_key: OAUTHS["oauth_consumer_key"],
    consumer_secret: OAUTHS["oauth_consumer_secret"],
    access_token_key: OAUTHS["access_token"],
    access_token_secret: OAUTHS["token_secret"],
  });
  const params = {
    include_email: true,
    include_entities: "false",
    skip_status: true,
  };
  return client.get("statuses/filter", function (error, tweets, response) {
    if (!error) res.send(tweets);
    // console.log(tweets); // The favorites.
    // console.log(response); // Raw response object.
    res.send(error);
  });
};
module.exports = router;
