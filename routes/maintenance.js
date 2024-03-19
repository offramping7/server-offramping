var express = require("express");
var router = express.Router();
const maintenanceServices = require("../services/maintenance");


router.post("/modernizeAllPayoutOptions", async (req, res, next) => {
    await maintenanceServices.modernizeAllPayoutOptions()
    res.status(200).send(); 
  });



router.post("/modernizeAllRecipients", async (req, res, next) => {
    await maintenanceServices.modernizeAllRecipients()
    res.status(200).send(); 
  });

module.exports = router;
