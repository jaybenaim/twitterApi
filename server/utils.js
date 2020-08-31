const qs = require("querystring");
const request = require("request");

const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});
const util = require("util");
require("dotenv").config();

const get = util.promisify(request.get);
const post = util.promisify(request.post);

const consumer_key = process.env.CONSUMER_API_KEY; // Add your API key if not set in environment variable
const consumer_secret = process.env.CONSUMER_SECRET_KEY; // Add your API secret key if not set in environment variable

const requestTokenURL = new URL("https://api.twitter.com/oauth/request_token");
const accessTokenURL = new URL("https://api.twitter.com/oauth/access_token");
const authorizeURL = new URL("https://api.twitter.com/oauth/authorize");
const endpointURL = new URL("https://api.twitter.com/1.1/users/show.json");
const bearerTokenURL = new URL("https://api.twitter.com/oauth2/token");

async function input(prompt) {
  return new Promise(async (resolve, reject) => {
    readline.question(prompt, (out) => {
      resolve(out);
    });
  });
}
async function accessToken({ oauth_token, oauth_token_secret }, verifier) {
  const oAuthConfig = {
    consumer_key: consumer_key,
    consumer_secret: consumer_secret,
    token: oauth_token,
    token_secret: oauth_token_secret,
    verifier: verifier,
  };

  const req = await post({
    url: accessTokenURL,
    oauth: oAuthConfig,
  });
  if (req.body) {
    return qs.parse(req.body);
  } else {
    throw new Error("Cannot get an OAuth request token");
  }
}

async function requestToken() {
  const oAuthConfig = {
    callback: "oob",
    consumer_key: consumer_key,
    consumer_secret: consumer_secret,
  };

  const req = await post({
    url: requestTokenURL,
    oauth: oAuthConfig,
  });
  if (req.body) {
    console.log(req.body);
    return qs.parse(req.body);
  } else {
    throw new Error("Cannot get an OAuth request token");
  }
}
async function getBearerToken() {
  const oAuthConfig = {
    callback: "oob",
    consumer_key: consumer_key,
    consumer_secret: consumer_secret,
  };

  const req = await post({
    url: bearerTokenURL,
    params: {
      consumer_key: consumer_key,
      consumer_secret: consumer_secret,
    },
  });
  if (req.body) {
    console.log(req.body);
    return qs.parse(req.body);
  } else {
    throw new Error("Cannot get an OAuth request token");
  }
}

async function getRequest({ oauth_token, oauth_token_secret }, params) {
  const oAuthConfig = {
    consumer_key: consumer_key,
    consumer_secret: consumer_secret,
    token: oauth_token,
    token_secret: oauth_token_secret,
  };
  const bearerToken = getBearerToken();

  const req = await get({
    url: endpointURL,
    // oauth: oAuthConfig,
    headers: {
      Authorization: `Bearer ${bearerToken}`,
    },
    qs: params,
    json: true,
  });
  if (req.body) {
    console.log(req.body);
    return req.body;
  } else {
    throw new Error("Cannot get an OAuth request token");
  }
}

(async () => {
  try {
    // Get request token
    const oAuthRequestToken = await requestToken();

    // Get authorization
    authorizeURL.searchParams.append(
      "oauth_token",
      oAuthRequestToken.oauth_token
    );
    console.log("Please go here and authorize:", authorizeURL.href);
    const pin = await input("Paste the PIN here: ");

    // Get the access token
    const oAuthAccessToken = await accessToken(oAuthRequestToken, pin.trim());

    const username = await input("What username do you want to look up? ");
    const params = {
      usernames: username,
    };

    // Make the request
    const response = await getRequest(oAuthAccessToken, params);
    console.log("Bio: ");
    console.log(response.data);
    if (response.data) {
      console.log(response.data[0].description);
      console.log("Location: ");
      console.log(response.data[0].location);
    } else {
      process.exit();
    }
  } catch (e) {
    console.error(e);
    process.exit(-1);
  }
  process.exit();
})();
