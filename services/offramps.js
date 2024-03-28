const recipientServices = require("./recipients");
const dicordServices = require("./discord");
const Offramps = require("../models/offramps");
const Users = require("../models/users")

const cryptoServices = require("./crypto");
const { THIS_SERVER_URL } = require("../settings/baseUrls");
const cryptoApi = require("../api/cryptoApi");
const operatorServices = require("./operators");
const conversionServices = require("./conversions");
const { cryptocurrencyFromBlockchain } = require("../settings/crypto");
const recipients = require("../models/recipients");

const blockchainSettings = {
  bsc: {
    operatorAddressFieldFromBlockchain: "addressBep20",
  },
  polygon: {
    operatorAddressFieldFromBlockchain: "addressMatic",
  },
  tron: {
    operatorAddressFieldFromBlockchain: "addressTrc20",
  },
}; //addressBinanceSmartChain

const cryptoApiWebhookReverseBlockchainNameConvention = {
  "binance-smart-chain": "bsc",
};
//
const OUR_FEE = 0.06;
const SKIM_PROFIT = false



const serviceOfframp = async ({  address,
  blockchain,
  cryptocurrency,
  transactionId,
  amount,
  walletProvider }) => {

  
  
  const myRecipient = await recipientServices.fetchRecipientByAddress({
    address,
    blockchain,
  });
  console.log("myRecipient", myRecipient);
  const cryptoValue = amount;

  const usdtAmount = cryptocurrency === "USDT" ? amount : await conversionServices.convertFromCoinsToUsdt({cryptocurrency:cryptocurrency,cryptoValue:amount})
  const recipientAmount = await conversionServices.convertFromUsdToRecipientAmountExactly({usdtAmount,recipient: myRecipient})


  console.log("here serviceOfframp recipientAmount",recipientAmount);


  const definition = {
    recipient: myRecipient._id,
    cryptoValue,
    servicingCompleted: false,
    fundingCompleted: false,
    recipientAmount: recipientAmount,
    usdtAmount: usdtAmount,
    transactionId,
  };
  const newOfframp = new Offramps(definition);
  await newOfframp.save(); //but we aint done yet w crypto movement..


  const offrampId = newOfframp._id;

  

  if ( cryptocurrency === "USDT") {
    if (blockchain != 'tron') throw new Error("blockchain should be tron only, got", blockchain)
    await cryptoServices.createEnergyRequest({
      address: address,
      callbackUrl:`${THIS_SERVER_URL}/offramp/energyFundedTransferToken/${offrampId}/${address}`,
    });
  } else {
    const myBlockchainSettings = blockchainSettings[blockchain];
    const myOperator = await operatorServices.fetchOnDutyFull();
    console.log({ myOperator });
    const operatorAddressField =
      myBlockchainSettings["operatorAddressFieldFromBlockchain"];
    console.log({ operatorAddressField });
    const toAddress = myOperator[operatorAddressField];
    console.log({ toAddress });
    if (walletProvider === 'cryptoapi') {
      await cryptoServices.createCoinTransferForFullAmountCryptoapi({
        fromAddress: address,
        toAddress: toAddress,
        blockchain:blockchain,
        callbackUrl:`${THIS_SERVER_URL}/offramp/markTransferFinished/${offrampId}`,
      });
    } else if (walletProvider === 'chaingateway'){
      await cryptoServices.createCoinTransfer({
        fromAddress: address,
        privateKey:myRecipient.privateKey,
        toAddress: toAddress,
        blockchain:blockchain,
        callbackUrl:`${THIS_SERVER_URL}/offramp/markTransferFinished/${offrampId}`,
        cryptoValue:amount
      });
    } else {
      throw new Error("errror! in serviceOfframp, walletProvider must be cryptoapi or chaingateway, got:", walletProvider)
    }
    
  }
  await dicordServices.notifyServiceOfframp({
    recipient: myRecipient,
    recipientAmount:recipientAmount,
    offrampId: newOfframp._id,
  });

  await Users.findOneAndUpdate({email:myRecipient.email},{active:true})
  return;
};

const energyFundedTransferToken = async ({offrampId,address}) => {
  const myOfframp = await Offramps.findById(offrampId)
    .populate("recipient")
    .exec();
    const blockchain = 'tron'
  
    const {usdtAmount,recipient} = myOfframp
    const fromAddress = address
    const myBlockchainSettings = blockchainSettings[blockchain];
    const myOperator = await operatorServices.fetchOnDutyFull();
    const operatorAddressField =
      myBlockchainSettings["operatorAddressFieldFromBlockchain"];
    const toAddress = myOperator[operatorAddressField];

    await cryptoServices.createTokenTransfer({
      fromAddress: fromAddress,
      privateKey:recipient.privateKey,
      toAddress: toAddress,
      blockchain:blockchain,
      callbackUrl:`${THIS_SERVER_URL}/offramp/markTransferFinished/${offrampId}`,
      usdtAmount:usdtAmount
    });

}


const updateOfframp = async ({ offrampId, update }) => {
  await Offramps.findByIdAndUpdate(offrampId, update);
  return;
};

const findOfframpById = async ({ offrampId }) => {
  const myOfframp = await Offramps.findById(offrampId);
  return myOfframp;
};

module.exports = {
  serviceOfframp,
  updateOfframp,
  findOfframpById,
  energyFundedTransferToken
};

// await createProfitAndCoinDumpRequest({address:fromAddress,blockchain})
