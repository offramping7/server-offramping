var express = require("express");
var router = express.Router();
const recipientServices = require("../services/recipients");

router.post("/", async (req, res, next) => {
  const { nickname, bankName, phoneNumber, currency,email,bankSpecificFieldsMap } = req.body;
  console.log(
    "BINGBING BING BING!!!BINGBING BING BING!!!BINGBING BING BING!!!"
  );
  const arrayOfAddressesAndBchains =
    await recipientServices.createRecipient({
      nickname, bankName, phoneNumber, currency,email,bankSpecificFieldsMap
    });
  res.json(arrayOfAddressesAndBchains);
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
