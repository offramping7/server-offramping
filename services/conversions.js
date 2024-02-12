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

  //check if first for email
  console.log("here convertToRecipientAmountExactly ",{
    cryptoValue,
    cryptocurrency,
    recipient,
  });

  const {email} = recipient
  const {active} = await Users.findOne({email})

  //

  const TOTAL_FEE =  active === false ? OUR_FEE-INDIRIM : OUR_FEE


  const cryptoPrice = await coinmarketcapApi.fetchPrice({ cryptocurrency });
  const coinPrice = cryptoPrice["BNB"]

  console.log("coinPrice",coinPrice)
  const usdtFromCrypto = cryptoValue / cryptoPrice;
  const usdtUser = usdtFromCrypto * (1 - TOTAL_FEE);
  const {dollarValue} = await Forex.findOne({
    currency: recipient.currency,
  });

  const recipientAmount = usdtUser * dollarValue;

  console.log("here convertToRecipientAmountExactly ",{email,active,TOTAL_FEE,cryptoValue,usdtFromCrypto,
    usdtUser,
    dollarValue,
    recipientAmount,
  });


  return recipientAmount;
};

module.exports = {
  convertToRecipientAmountExactly,

};
