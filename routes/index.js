var express = require("express");
var router = express.Router();
var path = require("path");


router.get("/", async (req, res, next) => {
  res.json("hi"); 
});

router.get("/cryptoapisverifydomain", async (req, res, next) => {
  res.sendFile(path.join(__dirname, '../public/cryptoapisverifydomain.txt'));
  // res.json("hi!");
});

module.exports = router;
