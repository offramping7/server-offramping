var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");

var path = require("path");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config()
const indexRouter = require("./routes/index");
const offrampRouter = require("./routes/offramps");
const recipientRouter = require("./routes/recipients");

const operatorRouter = require("./routes/operators");
const payoutOptionRouter = require("./routes/payoutOptions");
const operationsRouter = require("./routes/operations");
const testsRouter = require("./routes/tests");
const forexRouter = require("./routes/forex");
const cardRouter = require("./routes/cards");
const maintenanceRouter = require("./routes/maintenance");

const express = require("express");
const app = express();
const port = process.env.PORT || 3001;

const corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  })
);

app.use(cookieParser());
app.use(bodyParser());
// app.use(express.static(path.join(__dirname, "public")));
app.use("/public", express.static("public"));

const mongoDB =
  process.env.MONGODB_CONNECTION_STRING
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.set("debug", true);
const db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB connection error:"));

app.use("/", indexRouter);
app.use("/offramps/", offrampRouter);
app.use("/recipients/", recipientRouter);
app.use("/operators/", operatorRouter);
app.use("/payoutOptions/", payoutOptionRouter);
app.use("/operations/", operationsRouter);
app.use("/forex/", forexRouter);
app.use("/cards/", cardRouter);
app.use("/tests/", testsRouter);
app.use("/maintenance/", maintenanceRouter);

//maintenanceRouter

app.get("/", (req, res) => {
  res.send("Hi whatsup!");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

module.exports = app;
