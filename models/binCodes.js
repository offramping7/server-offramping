const mongoose = require("mongoose");
const { Schema } = mongoose;

const binCodesSchema = new Schema(
  {
    binNumber: String,
    bankName: String,
    currencyCode: String,
    payoutOption: { type: Schema.Types.ObjectId, ref: "PayoutOptions" },

  },
  {
    collection: "binCodes",
    timestamps: true,
  }
);

module.exports = mongoose.model("BinCodes", binCodesSchema);
//one payout opti on as a giant list, applicable to each
