const cryptoServices = require("./crypto");
const cardsServices = require("./cards");

const Recipients = require("../models/recipients");
const BLOCKCHAIN = "bsc";

const { cryptocurrencyFromBlockchain,SEVERAL_BLOCKCHAIN_DATA } = require("../settings/crypto");

const USE_NATIVE_COINS = true;

const createRecipient = async ({
  nickname,
  bankName,
  phoneNumber,
  currency,
  bankSpecificFieldValue,
}) => {
  //[{ address, blockchain, cryptocurrency }]

  const blockchains = SEVERAL_BLOCKCHAIN_DATA.keys();

  const promises = blockchains.map((blockchain) => {
    const blockchainData = SEVERAL_BLOCKCHAIN_DATA[blockchain];
    const cryptocurrency = blockchainData.USE_NATIVE_COINS
      ? blockchainData.coin
      : blockchainData.token;
    return createRecipientForOneBlockchain({
      blockchain,
      cryptocurrency,
      nickname,
      bankName,
      phoneNumber,
      currency,
      bankSpecificFieldValue,
    });
  });

  const addressDataArray = await Promise.all(promises).then((val) => val);
  return addressDataArray
};

const createRecipientForOneBlockchain = async ({
  nickname,
  bankName,
  phoneNumber,
  currency,
  bankSpecificFieldValue,
  blockchain,
  cryptocurrency,
}) => {
  //
  
  const { address, privateKey } = await cryptoServices.createDepositAddress({
    blockchain,cryptocurrency
  });
  const definition = {
    nickname,
    bankName,
    phoneNumber,
    currency,
    blockchain,
    cryptocurrency,
    bankSpecificFieldValue,address,privateKey
  };
  const newRecipient = new Recipients(definition);
  await newRecipient.save();

  return { address,cryptocurrency,blockchain };
};
const updateRecipient = async ({ recipientId, update }) => {
  await Recipients.findByIdAndUpdate(recipientId, update);
  return;
};

const fetchRecipientByAddress = async ({ address }) => {
  const myRecipient = await Recipients.findOne({ address });
  return myRecipient;
};

module.exports = { createRecipient, fetchRecipientByAddress };

//must always have at least one be the default withdrawalAddress, NEVER EVER have situation where it is not the case
