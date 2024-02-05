const axios = require("axios");

const fetchUsdToCurrency = async ({ currency }) => {
  const headers = { "X-CMC_PRO_API_KEY": process.env.FREECURRENCYAPIKEY };
  const url = "https://forexbirdeme.com"; //here should fetch forex BUT for USD as base only and then return the answer for the currecy
  return axios
    .get(url, { headers })
    .then((res) => res.data.data)
    .catch((err) => {
      console.log(err.response.data);
    });
};

module.exports = { fetchUsdToCurrency };
