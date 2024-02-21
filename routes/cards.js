//addBinCode
var express = require("express");
var router = express.Router();
var path = require("path");
const cardsServices = require("../services/cards")

router.get("/", async (req, res, next) => {
  res.json("ok"); 
});

router.post("/addBinCode", async (req, res, next) => {
    const {bankName,binNumber,countryCode,currencyCode} = req.body
    await cardsServices.addBinCode({bankName,binNumber,countryCode,currencyCode})
  res.sendStatus(200)
  // res.json("hi!");
});

module.exports = router;
