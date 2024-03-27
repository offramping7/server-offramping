const cryptoApi = require("../api/cryptoApi");
const chaingatewayApi = require("../api/chaingatewayApi");

const AddressCleanUpRequests = require("../models/addressCleanUpRequests");
const operatorServices = require("./operators");
const offrampServices = require("./offramps");
const { THIS_SERVER_URL } = require("../settings/baseUrls");
//binance-smart-chain

const createDepositAddress = async ({ recipientId, blockchain }) => {
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
  const callbackUrl = `${THIS_SERVER_URL}/offramps/incomingCoinsWebhook/${address}`;
  await chaingatewayApi.createWebhookEvent({
    address,
    blockchain: blockchain,
    callbackUrl,
  });
  return;
};

const createCoinTransferForFullAmount = async ({fromAddress,toAddress,blockchain,callbackUrl}) => {

}

const createTokenferForFullAmount = async ({}) => {
  
}

module.exports = {
  createDepositAddress,
  createCryptoWebhookEvent,createCoinTransferForFullAmount
};
