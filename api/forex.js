const axios = require("axios");

const fetchAll = async () => {
  const apiKey = process.env.FREECURRENCYAPIKEY
  if (!apiKey) {
    throw new Error("freecurrapi apikeuy undefiend!")
  }
  const url = "https://api.freecurrencyapi.com/v1/latest?apikey="+apiKey; //here should fetch forex BUT for USD as base only and then return the answer for the currecy
  return axios
    .get(url)
    .then((res) => res.data.data)
    .catch((err) => {
      console.log(err);
    });
};

module.exports = { fetchAll };
