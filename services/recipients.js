const cryptoServices = require("./crypto");
const cardsServices = require("./cards");

const Recipients = require("../models/recipients");
const BLOCKCHAIN = "bsc";
const { cryptocurrencyFromBlockchain } = require("../settings/crypto");

const USE_NATIVE_COINS = true;

const createRecipient = async ({
  nickname, bankName, phoneNumber, currency,bankSpecificFieldValue
}) => {


  const blockchain = BLOCKCHAIN;
  const cryptocurrency =
    cryptocurrencyFromBlockchain[blockchain][
      USE_NATIVE_COINS ? "coin" : "token"
    ];

  const definition = {
    nickname,
    bankName,
    phoneNumber,
    currency,
    blockchain,
    cryptocurrency,
    bankSpecificFieldValue
  };
  const newRecipient = new Recipients(definition);
  await newRecipient.save();

  const address = await cryptoServices.createDepositAddress({
      recipientId: newRecipient._id,
      blockchain,
    });
  // await cryptoServices.createCryptoWebhookEvent({
  //   address,
  //   blockchain,
  //   useNativeCoins: USE_NATIVE_COINS,
  // }); MUST BRING BACK LATER±!
  


   
  await updateRecipient({ recipientId: newRecipient._id, update: { address } });
  return { address, blockchain, cryptocurrency }
}
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
