const coinmarketcapApi = require("../api/coinmarketcap");
const forexApi = require("../api/forex");
const { OUR_FEE } = require("../settings/fees");

const convertToRecipientAmountExactly = async ({
  cryptoValue,
  cryptocurrency,
  recipientCurrency,
}) => {
  //assume that the fee was 0.03?
  const cryptoPrice = await coinmarketcapApi.fetchPrice({ cryptocurrency });
  const usdtFromCryptoPreTxFee = cryptoValue / cryptoPrice;
  const usdtFromCryptoPostTxFee = usdtFromCryptoPreTxFee + 0.03;
  const usdtUser = usdtFromCryptoPostTxFee * (1 - OUR_FEE);
  const usdValueInRecipientCurrency = await forexApi.fetchUsdToCurrency({
    currency: recipientCurrency,
  });

  const recipientAmount = usdtUser * usdValueInRecipientCurrency;
  return recipientAmount;
};

const convertToRecipientAmountFake = async ({
  cryptoValue,
  cryptocurrency,
  recipientCurrency,
}) => {
  const recipientAmount = 100;
  return recipientAmount;
};
module.exports = {
  convertToRecipientAmountExactly,
  convertToRecipientAmountFake,
};
