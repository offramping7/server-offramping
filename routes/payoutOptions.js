var express = require("express");
var router = express.Router();
const payoutOptionServices = require("../services/payoutOptions");
var geoip = require('geoip-country');
const westernCountries= require("../settings/westernCountries.json")
router.get("/fetchCurrencies", async (req, res, next) => {
  const result = await payoutOptionServices.fetchCurrencies();
  res.json(result);
});
//const ip1 = req.headers['cf-connecting-ip']
// const ip2=      req.headers['x-real-ip']
// const ip3=      req.headers['x-forwarded-for']
// const ip4=  req.connection.remoteAddress

router.get("/fetchPayoutOptionsTest/:currency", async (req, res, next) => {
  const { currency } = req.params; //
  const ip1 = req.headers['cf-connecting-ip']
  const ip2=      req.headers['x-real-ip']
  const ip3=      req.headers['x-forwarded-for']
  const ip4=  req.connection.remoteAddress
  const ip = ip1
  var geo = geoip.lookup(ip);
  const country = geo.country
  const isFromIpRestrictedCountry = westernCountries.includes(country)
  const result = await payoutOptionServices.fetchPayoutOptions({ currency,isFromIpRestrictedCountry });
  res.json(result);
});

router.get("/fetchPayoutOptions/:currency", async (req, res, next) => {
  const { currency } = req.params; //
  const result = await payoutOptionServices.fetchPayoutOptions({ currency });
  res.json(result);
});

router.post("/createPayoutOption", async (req, res, next) => {
  const {
    currency,
    bankName,
    cardRequired,
    phoneValidationRequired,
    ipRestricted,
  } = req.body;
  const result = await payoutOptionServices.addPayoutOption({
    currency,
    bankName,
    cardRequired,
    phoneValidationRequired,
    ipRestricted,
  });
  res.json(result);
});

module.exports = router;
