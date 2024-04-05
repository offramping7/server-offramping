const recipientServices = require("./recipients");
const dicordServices = require("./discord");
const Offramps = require("../models/offramps");

const cryptoServices = require("./crypto");
const { THIS_SERVER_URL } = require("../settings/baseUrls");
const cryptoApi = require("../api/cryptoApi");
const operatorServices = require("./operators");
const conversionServices = require("./conversions");
const { cryptocurrencyFromBlockchain } = require("../settings/crypto");

const blockchainSettings = {
  bsc: {
    profitWalletAddress: process.env.PROFIT_WALLET_ADDRESS,
    operatorAddressFieldFromBlockchain: "addressBep20",
  },
}; //addressBinanceSmartChain

const cryptoApiWebhookReverseBlockchainNameConvention = {
  "binance-smart-chain": "bsc",
};
//
const OUR_FEE = 0.06;
const SKIM_PROFIT = false

const serviceOfframp = async ({ address, payload }) => {
  const eventName = payload.data.event; //should == ADDRESS_COINS_TRANSACTION_CONFIRMED
  const { transactionId, unit, amount, direction } = payload.data.item;
  if (direction != "incoming") {
    return;
  }

  const blockchain =
    cryptoApiWebhookReverseBlockchainNameConvention[
      payload.data.item.blockchain
    ];

  console.log("serviceOfframp  data:", {
    transactionId,
    unit,
    amount,
    direction,
    blockchain,
  });
  const myRecipient = await recipientServices.fetchRecipientByAddress({
    address,
    blockchain,
  });
  console.log("myRecipient", myRecipient);
  const cryptoValue = amount;

  const recipientAmount = await conversionServices.convertToRecipientAmountExactly(
    {
      cryptocurrency: cryptocurrencyFromBlockchain[blockchain].coin,
      cryptoValue: amount,
      recipient: myRecipient,

    }
  );//inside here we will also mark off discount or not

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

  if (SKIM_PROFIT == false) {
    await cryptoApi.createCoinTransferForFullAmount({
      fromAddress: address,
      toAddress: toAddress,
      blockchain:myRecipient.blockchain,
      callbackUrl:`${THIS_SERVER_URL}/offramp/proftExtractionFinished/${offrampId}`,
    });
  } else {
    const cryptoValueForHtx = Number(cryptoValue) * (1.0 - OUR_FEE);
    console.log("CRYPTOVALUEFORHTX cryptoValueForHtx I S ", {
      cryptoValueForHtx,
    });
    await cryptoApi.createCoinTransfer({
      fromAddress: address,
      toAddress: toAddress, //blockchainSettings[blockchain]["profitWalletAddress"],
      blockchain: myRecipient.blockchain,
      amount: cryptoValueForHtx,
      callbackUrl: `${THIS_SERVER_URL}/offramps/fundingFinisheExtractProfit/${offrampId}`,
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
  fundingFinishedExtractProfit,
};

// await createProfitAndCoinDumpRequest({address:fromAddress,blockchain})
