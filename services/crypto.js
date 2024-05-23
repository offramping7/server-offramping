const cryptoApi = require("../api/cryptoApi");
const AddressCleanUpRequests = require("../models/addressCleanUpRequests");
const operatorServices = require("./operators");
const offrampServices = require("./offramps");
const { THIS_SERVER_URL } = require("../settings/baseUrls");
const { cryptocurrencyFromBlockchain,SEVERAL_BLOCKCHAIN_DATA } = require("../settings/crypto");
const quicknodeApi = require("../api/quicknode")
const tronApi = require("../api/tron")

//binance-smart-chain

const createDepositAddress = async ({ blockchain,cryptocurrency }) => {
  // const useNativeCoins = ['USDT','USDC'].includes(cryptocurrency)
  // const {privateKey,address} = blockchain === 'polygon' ? await quicknodeApi.createDepositAddress({blockchain}) : await tronApi.createDepositAddress({blockchain})
  // return {address,privateKey}
  return
 
};
m
const createCoinTransaction = async ({fromAddress,toAddress,blockchain,privateKey,cryptoValue}) => {
  const transactionHash = await quicknodeApi.sendCoins({fromAddress,
    privateKey,
    toAddress,
    cryptoValue,
    blockchain})
  return
}

const createTokenTransaction = async ({fromAddress,toAddress,blockchain,privateKey}) => {
  const cryptocurrency = cryptocurrencyFromBlockchain[blockchain].token
  //sendTokens
  const transactionHash = await quicknodeApi.sendCoins({fromAddress,
    privateKey,
    toAddress,
    usdtAmount:cryptoValue,
    blockchain,cryptocurrency})
  return
}

module.exports = {
  createDepositAddress,
  createCoinTransaction,createTokenTransaction
};