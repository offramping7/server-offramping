const mongoose = require("mongoose");
const { Schema } = mongoose;

const payoutOptionsSchema = new Schema(
  {
    currency: String,
    bankName: String,
    ipRestricted: Boolean,
    bankSpecificFieldKeys:[String],//default should be Card Number
    mustBeVerified:{type:Boolean,default:false}
  },
  {
    collection: "payoutOptions",
    timestamps: true,
  }
);

module.exports = mongoose.model("PayoutOptions", payoutOptionsSchema);
//one payout opti on as a giant list, applicable to each
