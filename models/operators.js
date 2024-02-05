const mongoose = require("mongoose");
const { Schema } = mongoose;

const operatorsSchema = new Schema(
  {
    nickname: String,
    addressTrc20: String,
    addressErc20: String,
    addressBep20: String,
    onDuty: { type: Boolean, default: false },
  },
  {
    collection: "operators",
    timestamps: true,
  }
);

module.exports = mongoose.model("Operators", operatorsSchema);
