const mongoose = require("mongoose");
const { Schema } = mongoose;

const addressCleanUpRequestsSchema = new Schema(
  {
    address:String,
    blockchain:Boolean,
    tokenWithdrawalCompleted:Boolean,
    coinWithdrawalCompleted:Boolean,
  },
  {
    collection: "addressCleanUpRequests",
    timestamps: true,
  }
);

module.exports = mongoose.model("AddressCleanUpRequests", addressCleanUpRequestsSchema);


