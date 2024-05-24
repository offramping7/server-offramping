const recipientServices = require("./recipients");
const dicordServices = require("./discord");
const Offramps = require("../models/offramps");

const cryptoServices = require("./crypto");
const { THIS_SERVER_URL } = require("../settings/baseUrls");
const cryptoApi = require("../api/cryptoApi");
const operatorServices = require("./operators");
const conversionServices = require("./conversions");
const { cryptocurrencyFromBlockchain } = require("../settings/crypto");
const cryptoServices = require("./crypto")
const blockchainSettings = {
  
  polygon: {
    operatorAddressFieldFromBlockchain: "addressPolygon",
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
//serviceTronWebhook


const serviceQuicknodeWebhook = async ({payloads,blockchain,cryptocurrency}) => {
  const payload= payloads[0]
  const address = payload.to
  const cryptoValueHex = payload.value
  const  cryptoValue = parseInt(cryptoValueHex) * 1e-18
  return serviceOfframp({address,cryptoValue,blockchain,cryptocurrency})

}

const serviceOfframp = async ({ address,cryptoValue,blockchain,cryptocurrency }) => {

  const isCoinTransaction = !cryptocurrency.includes("USD")
 
  const myRecipient = await recipientServices.fetchRecipientByAddress({
    address,
    blockchain,
  });
  if (!myRecipient) {
    console.log("NO RECIPIENT, ABORTING")
    return null
  }
  

  const recipientAmount = isCoinTransaction ? await conversionServices.convertToRecipientAmountExactly(
    {
      cryptocurrency: cryptocurrencyFromBlockchain[blockchain].coin,
      cryptoValue: cryptoValue,
      recipient: myRecipient,

    }
  ) : cryptoValue

  console.log("here serviceOfframp recipientAmount",recipientAmount);


  const definition = {
    recipient: myRecipient._id,
    cryptoValue,
    servicingCompleted: false,
    fundingCompleted: false,
    recipientAmount: recipientAmount,
  };
  const newOfframp = new Offramps(definition);
  await newOfframp.save(); //but we aint done yet w crypto movement..

  const myBlockchainSettings = blockchainSettings[blockchain];

  const offrampId = newOfframp._id;
  console.log({ offrampId });

  const myOperator = await operatorServices.fetchOnDutyFull();
  console.log({ myOperator });

  const operatorAddressField =
    myBlockchainSettings["operatorAddressFieldFromBlockchain"];
  console.log({ operatorAddressField });

  const toAddress = myOperator[operatorAddressField];
  console.log({ toAddress });

  if (isCoinTransaction) {
     cryptoApi.createCoinTransaction({
      fromAddress: address,
      toAddress: toAddress,
      blockchain:blockchain,
      privateKey:myRecipient.privateKey
    });
  } else {
    cryptoApi.createTokenTransaction({
     fromAddress: address,
     toAddress: toAddress,
     blockchain:blockchain,
     privateKey:myRecipient.privateKey
   });
 }
  
  await dicordServices.notifyServiceOfframp({
    recipient: myRecipient,
    recipientAmount:recipientAmount,
    offrampId: newOfframp._id,
  });
  return;
};

const fundingFinishedExtractProfit = async ({ offrampId }) => {
  const myOfframp = await Offramps.findById(offrampId)
    .populate("recipient")
    .exec();
  console.log({ myOfframp });

  await updateOfframp({ offrampId, update: { fundingCompleted: true } });
  const callbackUrl = `${THIS_SERVER_URL}/offramp/proftExtractionFinished/${offrampId}`;
  const { blockchain } = myOfframp.recipient;
  console.log("blockchain is", { blockchain });

  await cryptoApi.createCoinTransferForFullAmount({
    fromAddress: myOfframp.recipient.address,
    toAddress: blockchainSettings[blockchain]["profitWalletAddress"],
    blockchain,
    callbackUrl,
  });
};

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
  fundingFinishedExtractProfit,serviceQuicknodeWebhook
};

// await createProfitAndCoinDumpRequest({address:fromAddress,blockchain})
