var express = require("express");
var router = express.Router();
const recipientServices = require("../services/recipients");

router.post("/", async (req, res, next) => {
  const { nickname, bankName, phoneNumber, currency,email,bankSpecificFieldValue } = req.body;
  console.log(
    "BINGBING BING BING!!!BINGBING BING BING!!!BINGBING BING BING!!!"
  );
  const { address, blockchain, cryptocurrency } =
    await recipientServices.createRecipient({
      nickname, bankName, phoneNumber, currency,email,bankSpecificFieldValue
    });
  res.json({ address, blockchain, cryptocurrency });
});


router.get("/address/:address", async (req, res, next) => {
  const { address } = req.params;
  
  const result =
    await recipientServices.fetchRecipientByAddress({
      address
    });
  res.json(result);
});


// router.post("/testCreate", async (req, res, next) => {
//   const { nickname, bankName, cardNumber, phoneNumber, currency,email } = req.body;
//   const isProd = req.body.isProd || true
//   console.log(
//     "BINGBING BING BING!!!BINGBING BING BING!!!BINGBING BING BING!!!"
//   );
//   const ip1 = req.headers['cf-connecting-ip']
//   const ip2=      req.headers['x-real-ip']
//   const ip3=      req.headers['x-forwarded-for']
//   const ip4=  req.connection.remoteAddress
//   const ip = ip1
//   var geo = geoip.lookup(ip);
//   const country = geo.country
//   const isFromIpRestrictedCountry = westernCountries.includes(country)

//   const { address, blockchain, cryptocurrency } =
//     await recipientServices.createRecipient({
//       nickname,
//       bankName,
//       cardNumber,
//       phoneNumber,
//       currency,email,isProd,isFromIpRestrictedCountry
//     });
//   res.json({ address, blockchain, cryptocurrency });
// });

module.exports = router;
