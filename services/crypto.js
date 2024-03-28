const cryptoApi = require("../api/cryptoApi");
const chaingatewayApi = require("../api/chaingateway");
const itrxApi = require("../api/itrx")
const AddressCleanUpRequests = require("../models/addressCleanUpRequests");
const operatorServices = require("./operators");
const offrampServices = require("./offramps");
const { THIS_SERVER_URL } = require("../settings/baseUrls");
//binance-smart-chain

const createDepositAddress = async ({  blockchain }) => {
  // const address = await cryptoApi.createDepositAddress({
  //   label: recipientId,
  //   blockchain: blockchain,
  // });
  const {address,privateKey} = await chaingatewayApi.createDepositAddress({
    blockchain: blockchain,
  });
  return {address,privateKey};
};

const createCryptoWebhookEvent = async ({
  address,
  blockchain,
  // useNativeCoins,
}) => {
  // if (useNativeCoins != true) {
  //   throw new Error(
  //     "createCryptoWebhookEvent is hardcoded for coins. need to use a different cryptoapi webhook for tokens"
  //   );
  // }
  const callbackUrl = `${THIS_SERVER_URL}/offramps/incomingCoinsWebhookChaingateway/${address}/${blockchain}`;
  await chaingatewayApi.createWebhookEvent({
    address,
    blockchain: blockchain,
    callbackUrl,
  });
  return;
};

const createCoinTransfer = async ({fromAddress,privateKey,toAddress,blockchain,cryptoValue}) => {
  let networkFee
  switch (blockchain) {
    case ("tron"):
      networkFee = 0.28
    case ("polygon"):
      networkFee = 0.01
    default:
      networkFee = 0.01
      // throw new Error("createCoinTransfer blockchain must be either tron or polygon, got:", blockchain)
  }
  const cryptoValueForWithdrawal = cryptoValue - networkFee
  await chaingatewayApi.createCoinTransfer({fromAddress,privateKey,toAddress,blockchain,cryptoValue:cryptoValueForWithdrawal})
  return
}
const createEnergyRequest = async ({address,callbackUrl}) => {
  await itrxApi.requestEnergy({address,callbackUrl})
  return
}

const createTokenTransfer = async ({fromAddress,privateKey,toAddress,blockchain,usdtAmount}) => {
  await chaingatewayApi.createTokenTransferTrx({fromAddress,privateKey,toAddress,blockchain,usdtAmount})
}


const createCoinTransferForFullAmountCryptoapi = async ({fromAddress,toAddress,blockchain,callbackUrl}) => {
  await cryptoApi.createCoinTransferForFullAmount({fromAddress,toAddress,blockchain,callbackUrl})
  return
}

module.exports = {
  createDepositAddress,
  createCryptoWebhookEvent,createCoinTransfer,createTokenTransfer,createEnergyRequest,createCoinTransferForFullAmountCryptoapi
};
