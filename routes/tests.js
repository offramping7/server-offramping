const cryptoApis = require("../api/cryptoApi")



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
      cryptocurrency,
    active} = req.query; //
    const result = await cryptoApis.convertToRecipientAmountExactlyAdvanced({ cryptoValue,
      cryptocurrency,
    active});
    res.json(result);//createDepositAddress
  });//createCoinTransfer
module.exports = router;
