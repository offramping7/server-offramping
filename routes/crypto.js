var express = require("express");
var router = express.Router();
const cryptoServices = require("../services/crypto");
const offrampServices = require("../services/offramps");

// router.post("/coinToHtxTransferSuccess/:offrampId", async (req, res, next) => {
//   const { offrampId } = req.params;
//   await cryptoServices.updateOfframp({
//     offrampId,
//     update: { fundingCompleted: true },
//   });
//   res.sendStatus(200);
// }); OBSOLETE RN because we moved all of this flow all to offramps so it is all containewd in one place

//tokenWithdrawalSuccess coinCleanUpCompleted

module.exports = router;
