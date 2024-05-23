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

router.post("/makeBanks", async (req, res, next) => {
    
    await maintenanceServices.makeBanks();
    res.json();//createDepositAddress
  });//createCoinTransfer


router.post("/addNewBin", async (req, res, next) => {
    const {binNumber,bankName} = req.body
    const result = await maintenanceServices.addNewBin({binNumber,bankName});
    res.json(result);//createDepositAddress
  });//createCoinTransfer
module.exports = router;
