const mongoose = require("mongoose");
const { Schema } = mongoose;

const offrampsSchema = new Schema(
  {
    cryptoValue: String,
    servicingCompleted: Boolean,
    fundingCompleted: Boolean,
    fiatAmountDelivered: Number || null,
    operator: String || null,
    recipient: { type: Schema.Types.ObjectId, ref: "Recipients" },
    hasProblem: { type: Boolean, default: false },
    problemDescription: String,
    valueCryptoUsed: Number,
    orderNumber: String,
    paymentProofUrl: String,
    recipientAmount: Number,
  },
  {
    collection: "offramps",
    timestamps: true,
  }
);

module.exports = mongoose.model("Offramps", offrampsSchema);
//use the default blockchain of bsc etc here, one blockchain per one recipient
//BUT if there is real need to use TRON, then use migrate_address_to_another_blockchain endpoint request

//for now, dont worry about scale => just go ahead and double add two recipients for every one. one for each blockchain
