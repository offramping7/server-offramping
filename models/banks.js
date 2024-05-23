const mongoose = require("mongoose");
const { Schema } = mongoose;

const banksSchema = new Schema(
  {
    currency: String,
    bankName: String,
    ipRestricted: {type:Boolean,default:false},
  },
  {
    collection: "banks",
    timestamps: true,
  }
);

module.exports = mongoose.model("Banks", banksSchema);
//one payout opti on as a giant list, applicable to each
