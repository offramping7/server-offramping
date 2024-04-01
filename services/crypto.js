const cryptoApi = require("../api/cryptoApi");
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
  const address = "faux"+makeid(5)
  return address;
};


function makeid(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}


const createCryptoWebhookEvent = async ({
  address,
  blockchain,
  useNativeCoins,
}) => {
  if (useNativeCoins != true) {
    throw new Error(
      "createCryptoWebhookEvent is hardcoded for coins. need to use a different cryptoapi webhook for tokens"
    );
  }
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
