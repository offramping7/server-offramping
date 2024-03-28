var express = require("express");
var router = express.Router();
const offrampServices = require("../services/offramps");
const cryptoApiWebhookReverseBlockchainNameConvention = {
  "binance-smart-chain": "bsc",
};
const chaingatewayWebhookTypeToCryptocurrencyMap = {
  "TRC20":"USDT",
  "ERC20":"USDT",
  "TRON":"TRX",
  "POLYGON":"MATIC"
}
router.get("/", async (req, res, next) => {
  // const { address } = req.params;
  // const payload = req.body;

  // if (payload.data.item.callbackSecretKey !== "mugiwara") {
  //   console.log("no mugiwara..");
  //   res.sendStatus(200);
  //   return;
  // 
  res.json("ok1");
});

router.post("/incomingCoinsWebhook/:address", async (req, res, next) => {
  const { address } = req.params;
  const payload = req.body;

  // if (payload.data.item.callbackSecretKey !== "mugiwara") {
  //   console.log("no mugiwara..");
  //   res.sendStatus(200);
  //   return;
  // }
  console.log(
    "__CHACHING INCCOMING FROM CRYPTOAPIS!____",
    { address },
    payload
  );
  const { transactionId, amount, direction } = payload.data.item;
  if (direction != "incoming") {
    res.sendStatus(200);
    return;
  }
  const blockchain =
    cryptoApiWebhookReverseBlockchainNameConvention[
      payload.data.item.blockchain
    ];
  const cryptocurrency = "BNB"


  await offrampServices.serviceOfframp({
    address,
    blockchain,
    cryptocurrency,
    transactionId,
    amount,
    walletProvider:"cryptoapi"
  });
  res.sendStatus(200);
});

router.post("/incomingCoinsWebhookChaingateway/:address/:blockchain", async (req, res, next) => {
  const { address,blockchain } = req.params;
  const payload = req.body;
  const { txid, type, amount } = payload;
  const transactionId = txid
  const cryptocurrency = chaingatewayWebhookTypeToCryptocurrencyMap[type]

  console.log(
    "__CHACHING INCCOMING FROM COINGATEWAY!____",
    { address,blockchain },
    payload
  );

  await offrampServices.serviceOfframp({
    address,
    blockchain,
    cryptocurrency,
    transactionId,
    amount,
    walletProvider:"chaingateway"
  });
  res.sendStatus(200);
});



router.post("/energyFundedTransferToken/:offrampId/:address", async (req, res, next) => {
  const { offrampId,address } = req.params;
  console.log("energyFundedTransferToken  finished for", { offrampId });
  await offrampServices.energyFundedTransferToken({
    offrampId,address
  });
  res.sendStatus(200);
});

router.post("/markTransferFinished/:offrampId", async (req, res, next) => {
  const { offrampId } = req.params;
  console.log("profit extraction finished for", { offrampId });
  res.sendStatus(200);
});

module.exports = router;
