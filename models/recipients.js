const mongoose = require("mongoose");
const { Schema } = mongoose;

const recipientsSchema = new Schema(
  {
    address: String,
    blockchain: String,
    cryptocurrency: String,
    nickname: String,
    bankName: String,
    phoneNumber: String,
    cardPhoneNumber:String,
    currency: String,
    bankSpecificFieldValue:String,
  },
  {
    collection: "recipients",
    timestamps: true,
  }
);

module.exports = mongoose.model("Recipients", recipientsSchema);
//use the default blockchain of bsc etc here, one blockchain per one recipient
//BUT if there is real need to use TRON, then use migrate_address_to_another_blockchain endpoint request

//for now, dont worry about scale => just go ahead and double add two recipients for every one. one for each blockchain
