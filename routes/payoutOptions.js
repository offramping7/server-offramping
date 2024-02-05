var express = require("express");
var router = express.Router();
const payoutOptionServices = require("../services/payoutOptions");

router.get("/fetchCurrencies", async (req, res, next) => {
  const result = await payoutOptionServices.fetchCurrencies();
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
