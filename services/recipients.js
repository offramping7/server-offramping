const cryptoServices = require("./crypto");
const cardsServices = require("./cards");

const Recipients = require("../models/recipients");
const Users = require("../models/users")
const BLOCKCHAIN = "bsc";
const { cryptocurrencyFromBlockchain } = require("../settings/crypto");

const USE_NATIVE_COINS = true;

const createRecipientOnBlockchain = async ({nickname, bankName, phoneNumber, currency,email,bankSpecificFieldsMap,blockchain}) => {
  

  const definition = {
    nickname,
    bankName,
    phoneNumber,
    currency,
    email,
    blockchain,
    bankSpecificFieldsMap
  };
  const newRecipient = new Recipients(definition);
  await newRecipient.save();

  const {address,privateKey} = await cryptoServices.createDepositAddress({
      recipientId: newRecipient._id,
      blockchain,
    });
  await cryptoServices.createCryptoWebhookEvent({
    address,
    blockchain,
  });
  await updateRecipient({ recipientId: newRecipient._id, update: { address,privateKey } });
  return { address, blockchain }
}

const createRecipient = async ({
  nickname, bankName, phoneNumber, currency,email,bankSpecificFieldsMap
}) => {
  createUser({email})
  const blockchains = ['polygon','tron']
  const arguments = blockchains.map((blockchain)=> {
    return {nickname, bankName, phoneNumber, currency,email,bankSpecificFieldsMap,blockchain}
  })
  const promises = arguments.map((argument)=> createRecipientOnBlockchain(argument))
  const finalResults = await Promise.all(promises).then((output) => {
    const {address,blockchain}  = output
    return  {address,blockchain}
  });
  return finalResults
}
const updateRecipient = async ({ recipientId, update }) => {
  await Recipients.findByIdAndUpdate(recipientId, update);
  return;
};

const fetchRecipientByAddress = async ({ address, blockchain }) => {
  const myRecipient = await Recipients.findOne({ address, blockchain });
  return myRecipient;
};

module.exports = { createRecipient, fetchRecipientByAddress };


const createUser = async ({email}) => {
  const definition = {
    email,active:false
  }
  const newUser = new Users(definition)
  await newUser.save()
  return
}

//must always have at least one be the default withdrawalAddress, NEVER EVER have situation where it is not the case
