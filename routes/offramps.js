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


router.post("/incomingCoinsOnPolygon", async (req, res, next) => {
  const payloads = req.body;

  console.log(
    "__CHACHING INCCOMING ",    payloads
  );
  
  await offrampServices.serviceQuicknodeWebhook(payloads);
  res.sendStatus(200);
});
// {
//   accessList: [],
//   blockHash: '0x91178d47ea75c19123b0d2c09d9960fab232796f0a2b557c219932aba9f2d058',
//   blockNumber: '0x36a31c4',
//   chainId: '0x89',
//   from: '0xc6110bcf3749530c0a8f5edf064bb96631de8757',
//   gas: '0x5208',
//   gasPrice: '0x894a37cb8',
//   hash: '0x598642b62792885e4b965be179841d4d65417b68d0694d8d8a1d709a43d63883',
//   input: '0x',
//   maxFeePerGas: '0x918a063b0',
//   maxPriorityFeePerGas: '0x6fc23ac00',
//   nonce: '0xb1',
//   r: '0xd990b05b9d0da934c66210a9daa7251f282317b2bfc470c11de05770db494f03',
//   s: '0x1d89eb79a0d44a641b043b59eb6deee36a34533761e01cf01a155bae79a8d073',
//   to: '0x2727510c8fca9c3628f1ed711d0e401f522f5bfb',
//   transactionIndex: '0x51',
//   type: '0x2',
//   v: '0x0',
//   value: '0xde0b6b3a7640000'
// }

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
