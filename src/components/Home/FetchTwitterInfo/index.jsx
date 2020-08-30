import React, { useState, useEffect } from "react";
import axios from "axios";

const FetchTwitterInfo = () => {
  const [results, setResults] = useState([]);

  const fetchData = () => {
    const params = {
      include_email: true,
      include_entities: "false",
      skip_status: true,
    };
    axios
      .get("https://api.twitter.com/1.1/account/verify_credentials.json", {
        params,
        headers: {
          Authorization: `Token Bearer ${process.env.REACT_APP_ACCESS_TOKEN}`,
        },
      })
      .then(({ data }) => {
        console.log(data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const showResults = () => {
    if (results) {
      return results.map((result, i) => {
        return <li>{result}</li>;
      });
    }
  };

  return (
    <div>
      <button onClick={() => fetchData()}> Fetch </button>
    </div>
  );
};

export default FetchTwitterInfo;
