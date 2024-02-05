const axios = require("axios");
const discord_url = process.env.DISCORD_URL
const ping = async ({ embeds }) => {
  const url = discord_url
  const content = "client!";
  const payload = {
    content,
    embeds,
  };
  return axios
    .post(url, payload)
    .then((res) => {
      console.log("res.data", res.data);
    })
    .catch((err) => {
      console.log("discord ping err", err.response);
      console.log("discord ping err", err.response.data);
    });
};

module.exports = { ping };
