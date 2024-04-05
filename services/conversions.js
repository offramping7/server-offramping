const coinmarketcapApi = require("../api/coinmarketcap");
const forexApi = require("../api/forex");
const Forex = require("../models/forex")

const { OUR_FEE,INDIRIM } = require("../settings/fees");

const convertToRecipientAmountExactly = async ({
  cryptoValue,
  cryptocurrency,
  recipient,
}) => {
  const TOTAL_FEE =  OUR_FEE


  const resData = await coinmarketcapApi.fetchPrice({ cryptocurrency });
  const coinPrice = resData[cryptocurrency][0].quote["USD"].price

  console.log("coinPrice",coinPrice)
  const usdtFromCrypto = cryptoValue * coinPrice;
  const usdtUser = usdtFromCrypto * (1 - TOTAL_FEE);
  const {dollarValue} = await Forex.findOne({
    currency: recipient.currency,
  });

  const recipientAmount = usdtUser * dollarValue;

  console.log("convertToRecipientAmountExactly the math is",
  {
    cryptoValue,cryptocurrency,coinPrice,usdtFromCrypto,TOTAL_FEE,usdtUser,dollarValue,recipientAmount
  }
  );


  return recipientAmount;
};



const convertToRecipientAmountExactlyAdvanced = async ({
  cryptoValue,
  cryptocurrency,currency,
active}) => {
  //assume that the fee was 0.03?

  //check if first for email

  //

  const TOTAL_FEE =  active === false ? OUR_FEE-INDIRIM : OUR_FEE


  const resData = await coinmarketcapApi.fetchPrice({ cryptocurrency });
  const coinPrice = resData[cryptocurrency][0].quote["USD"].price

  console.log("coinPrice",coinPrice)
  const usdtFromCrypto = cryptoValue * coinPrice;
  const usdtUser = usdtFromCrypto * (1 - TOTAL_FEE);
  const {dollarValue} = await Forex.findOne({
    currency:currency
  });

  const recipientAmount = usdtUser * dollarValue;


  return {
    usdtFromCrypto,uastAfterFee:usdtUser,dollarValue,recipientAmount
  }
};


module.exports = {
  convertToRecipientAmountExactly,convertToRecipientAmountExactlyAdvanced

};
