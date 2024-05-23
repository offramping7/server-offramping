const cryptoApis = require("../api/cryptoApi")
const conversionServices = require("../services/conversions")


var express = require("express");
var router = express.Router();


router.post("/createDepositAddress/:blockchain/:label", async (req, res, next) => {
  const { blockchain,label } = req.params; //
  const result = await cryptoApis.createDepositAddress({ blockchain,label });
  res.json(result);//createDepositAddress
});

router.post("/createCoinTransfer", async (req, res, next) => {
    const {fromAddress,toAddress,blockchain,amount,callbackUrl} = req.body; //
    const result = await cryptoApis.createCoinTransfer({ fromAddress,toAddress,blockchain,amount,callbackUrl });
    res.json(result);//createDepositAddress
  });


router.post("/conversions", async (req, res, next) => {
    const {cryptoValue,
      cryptocurrency,currency,
    active} = req.body; //
    const result = await conversionServices.convertToRecipientAmountExactlyAdvanced({ cryptoValue,
      cryptocurrency,currency,
    active});
    res.json(result);//createDepositAddress
  });//createCoinTransfer

  router.get("/demofunc", async (req, res, next) => {
    const ip1 = req.headers['cf-connecting-ip']
  const ip2=      req.headers['x-real-ip']
  const ip3=      req.headers['x-forwarded-for']
  const ip4=  req.connection.remoteAddress
    res.json({ip1,ip2,ip3,ip4});//createDepositAddress
  });//createCoinTransfer



module.exports = router;
