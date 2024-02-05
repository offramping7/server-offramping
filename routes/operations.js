var express = require("express");
var router = express.Router();
const operationServices = require("../services/operations");

//fetchOfframpExpandedInfo
//fetchLast100
router.get("/fetchLast100", async (req, res, next) => {
  const result = await operationServices.fetchLast100();
  res.json(result);
});

router.get("/fetchOfframpExpandedInfo/:offrampId", async (req, res, next) => {
  const { offrampId } = req.params;
  const result = await operationServices.fetchExpandedInfo({ offrampId });
  res.json(result);
});

router.post("/submitProof/:offrampId", async (req, res, next) => {
  const { offrampId } = req.params;
  const { paymentProofUrl } = req.body;
  await operationServices.submitProof({ offrampId, paymentProofUrl }); //this shouldn't close the trade, that should eb the different one
  res.sendStatus(200);
});

router.post("/markServicingCompleted/:offrampId", async (req, res, next) => {
  const { offrampId } = req.params;
  const { orderNumber, nickname, valueCryptoUsed } = req.body;
  await operationServices.markServicingCompleted({
    offrampId,
    orderNumber,
    nickname,
    valueCryptoUsed,
  }); //this shouldn' t close the trade, that should eb the different one
  res.sendStatus(200);
});

router.get("/fetchActiveProblems", async (req, res, next) => {
  const results = await operationServices.fetchActiveProblems();
  res.json(results);
});

router.post("/createProblem/:offrampId", async (req, res, next) => {
  const { offrampId } = req.params;
  const { problemDescription } = req.body;
  await operationServices.createProblem({ offrampId, problemDescription });
  res.sendStatus(200);
});

router.post("/solveProblem/:offrampId", async (req, res, next) => {
  const { offrampId } = req.params;
  await operationServices.solveProblem({ offrampId });
  res.sendStatus(200);
});

module.exports = router;
