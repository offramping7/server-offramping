const coinmarketcapApi = require("../api/coinmarketcap");
const forexApi = require("../api/forex");
const Users = require("../models/users")
const Forex = require("../models/forex")

const { OUR_FEE,INDIRIM } = require("../settings/fees");

const convertToRecipientAmountExactly = async ({
  cryptoValue,
  cryptocurrency,
  recipient,
}) => {
  //assume that the fee was 0.03?

  //check if first for userEmail
  const {userEmail} = recipient
  const {active} = await Users.findOne({userEmail})

  //

  const TOTAL_FEE = active ? OUR_FEE : OUR_FEE-INDIRIM


  const cryptoPrice = await coinmarketcapApi.fetchPrice({ cryptocurrency });
  const usdtFromCrypto = cryptoValue / cryptoPrice;
  const usdtUser = usdtFromCrypto * (1 - TOTAL_FEE);
  const {dollarValue} = await Forex.findOne({
    currency: recipient.currency,
  });

  const recipientAmount = usdtUser * dollarValue;
  return recipientAmount;
};

module.exports = {
  convertToRecipientAmountExactly,

};
