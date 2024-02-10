const cryptoServices = require("./crypto");
const Recipients = require("../models/recipients");
const Users = require("../models/users")
const BLOCKCHAIN = "bsc";
const { cryptocurrencyFromBlockchain } = require("../settings/crypto");

const USE_NATIVE_COINS = true;
const createRecipient = async ({
  nickname,
  bankName,
  cardNumber,
  phoneNumber,
  currency,email,isProd
}) => {
  const blockchain = BLOCKCHAIN;
  const cryptocurrency =
    cryptocurrencyFromBlockchain[blockchain][
      USE_NATIVE_COINS ? "coin" : "token"
    ];

  const definition = {
    nickname,
    bankName,
    cardNumber,
    phoneNumber,
    currency,
    blockchain,
    cryptocurrency,userEmail:email
  };
  const newRecipient = new Recipients(definition);
  await newRecipient.save();

  let address
  if (isProd != true) {
    address = "0x558e4613aB9A5255d6644E344d9e7103a265c0ff"
  } else {
    address = await cryptoServices.createDepositAddress({
      recipientId: newRecipient._id,
      blockchain,
    });
    await cryptoServices.createCryptoWebhookEvent({
      address,
      blockchain,
      useNativeCoins: USE_NATIVE_COINS,
    });
  }


   
  await updateRecipient({ recipientId: newRecipient._id, update: { address } });
  createUser({email})
  return { address, blockchain, cryptocurrency };
};

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
    email,active
  }
  const newUser = new Users(definition)
  await newUser.save()
  return
}

//must always have at least one be the default withdrawalAddress, NEVER EVER have situation where it is not the case
