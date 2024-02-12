var express = require("express");
var router = express.Router();
const offrampServices = require("../services/offramps");

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
    "__CHACHING INCCOMING FROM CRYPTO APIS____",
    { address },
    payload
  );

  await offrampServices.serviceOfframp({
    address,
    payload,
  });
  res.sendStatus(200);
});

router.post(
  "/fundingFinishedExtractProfit/:offrampId",
  async (req, res, next) => {
    const { offrampId } = req.params;
    console.log(
      "BINBBNGBING! CALL FOR fundingFinishedExtractProfit",
      {
        offrampId,
      },
      req.body
    );
    await offrampServices.fundingFinishedExtractProfit({
      offrampId,
    });
    res.sendStatus(200);
  }
);

router.post("/proftExtractionFinished/:offrampId", async (req, res, next) => {
  const { offrampId } = req.params;
  console.log("profit extraction finished for", { offrampId });
  res.sendStatus(200);
});

module.exports = router;
