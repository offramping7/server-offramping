const cryptoApi = require("../api/cryptoApi");
const AddressCleanUpRequests = require("../models/addressCleanUpRequests");
const operatorServices = require("./operators");
const offrampServices = require("./offramps");
const { THIS_SERVER_URL } = require("../settings/baseUrls");
//binance-smart-chain

const createDepositAddress = async ({ recipientId, blockchain }) => {
  const address = await cryptoApi.createDepositAddress({
    label: recipientId,
    blockchain: blockchain,
  });
  return address;
};

const createCryptoWebhookEvent = async ({
  address,
  blockchain,
}) => {
  // if (useNativeCoins != true) {
  //   throw new Error(
  //     "createCryptoWebhookEvent is hardcoded for coins. need to use a different cryptoapi webhook for tokens"
  //   );
  // } remove thid hardcoding of UseNativeCoins - we need to use both

  const callbackUrl = `${THIS_SERVER_URL}/offramps/incomingCoinsWebhook/${address}`;
  await cryptoApi.createCoinsWebhookEvent({
    address,
    blockchain: blockchain,
    callbackUrl,
  });
  return;
};

module.exports = {
  createDepositAddress,
  createCryptoWebhookEvent,
};
