var express = require("express");
var router = express.Router();
const operatorServices = require("../services/operators");

router.post("/", async (req, res, next) => {
  const { nickname, addressTrc20, addressErc20, addressBep20 } = req.body;
  await operatorServices.createOperator({
    nickname,
    addressTrc20,
    addressErc20,
    addressBep20,
  });
  res.sendStatus(200);
});

router.post("/makeOnDuty/:nickname", async (req, res, next) => {
  const { nickname } = req.params;
  await operatorServices.makeOnDuty({
    nickname,
  });
  res.sendStatus(200);
});


  router.get("/fetchOnDutyFull", async (req, res, next) => {
    const result = await operatorServices.fetchOnDutyFull();
    res.json(result);
  });
  

router.get("/fetchOnDuty", async (req, res, next) => {
  const result = await operatorServices.fetchOnDuty();
  res.json(result);
});

//tokenWithdrawalSuccess coinCleanUpCompleted

module.exports = router;
