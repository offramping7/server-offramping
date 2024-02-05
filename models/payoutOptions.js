const mongoose = require("mongoose");
const { Schema } = mongoose;

const payoutOptionsSchema = new Schema(
  {
    currency: String,
    bankName: String,
    cardRequired: Boolean,
    phoneValidationRequired: Boolean,
    ipRestricted: Boolean,
  },
  {
    collection: "payoutOptions",
    timestamps: true,
  }
);

module.exports = mongoose.model("PayoutOptions", payoutOptionsSchema);
//one payout opti on as a giant list, applicable to each
