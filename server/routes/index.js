const express = require("express");
const axios = require("axios");
require("dotenv").config();

const router = express.Router();

const BASE_URL = "https://api.twitter.com/1.1/";

const OAUTHS = {
  oauth_consumer_key: process.env.CONSUMER_API_KEY,
  oauth_nonce: process.env.OAUTH_NOONCE,
  oauth_signature: process.env.OAUTH_SIGNATURE,
  oauth_signature_method: "HMAC-SHA1",
  oauth_timestamp: new Date().getTime(),
  oauth_token: process.env.ACCESS_TOKEN,
  oauth_version: "1.0",
};

router.get("/", (req, res) => {
  res.status(200).send("API Home");
});
router.get("/fetch-info", async (req, res) => {
  return await getToken()
    .then((data) => {
      console.log(data);
      res.status(200).send(data);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
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
      Authorization: `OAuth oauth_consumer_key=${OAUTHS["oauth_consumer_key"]}, oauth_nonce=${OAUTHS["oauth_nonce"]}, oauth_signature=${OAUTHS["oauth_signature"]}, oauth_signature_method=${OAUTHS["oauth_signature_method"]}, oauth_timestamp=${OAUTHS["oauth_timestamp"]}, oauth_token=${OAUTHS["oauth_token"]}, oauth_version=${OAUTHS["oauth_version"]} `,
    },
  });
};
const getToken = () => {
  const oauthCallback = "http://localhost:5000/api/fetch-info";
  return axios.post(`https://api.twitter.com/oauth/request_token`, {
    oauth_consumer_key: OAUTHS["oauth_consumer_key"],
    oauth_callback: oauthCallback,
  });
};
module.exports = router;
