var express = require("express");
var router = express.Router();
const recipientServices = require("../services/recipients");

router.post("/", async (req, res, next) => {
  const { nickname, bankName, cardNumber, phoneNumber, currency, } = req.body;
  const isProd = req.body.isProd || true
  console.log(
    "BINGBING BING BING!!!BINGBING BING BING!!!BINGBING BING BING!!!"
  );
  const { address, blockchain, cryptocurrency } =
    await recipientServices.createRecipient({
      nickname,
      bankName,
      cardNumber,
      phoneNumber,
      currency,isProd
    });
  res.json({ address, blockchain, cryptocurrency });
});

module.exports = router;
