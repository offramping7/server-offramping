var express = require("express");
var router = express.Router();
var path = require("path");
const forexServices = require("../services/forex")


router.post("/init", async (req, res, next) => {
    await forexServices.initializeAllForex()
    res.json("hi"); 
});


router.post("/update", async (req, res, next) => {
    await forexServices.updateAll()
    res.json("hi"); 
});

module.exports = router;
