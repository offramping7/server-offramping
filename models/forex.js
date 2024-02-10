const mongoose = require("mongoose");
const { Schema } = mongoose;

const forexSchema = new Schema(
  {
    dollarValue: Number,
    currency: String,
  },
  {
    collection: "forex",
    timestamps: true,
  }
);

module.exports = mongoose.model("Forex", forexSchema);
