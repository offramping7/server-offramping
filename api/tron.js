const TronWeb = require("tronweb");
const TRON_GRID_API_KEY = process.env.TRON_GRID_API_KEY;
const TRON_LINK_PRIVATE_KEY = process.env.TRON_LINK_PRIVATE_KEY;
const tokenContractFromCryptocurrency = {
  "USDT":"TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t"
}
const sendCoins = async ({
  // fromAddress,
  toAddress,
  cryptoValue,
  blockchain,
}) => {
  if (blockchain != "tron") {
    throw new Error("blockchain must be tron, got", blockchain);
  }
  const pk = TRON_LINK_PRIVATE_KEY;

  const tronWeb = new TronWeb({
    fullHost: "https://api.trongrid.io",
    headers: { "TRON-PRO-API-KEY": TRON_GRID_API_KEY },
    privateKey: pk,
  });
  const transactionObj = await tronWeb.transactionBuilder.sendTrx(
    toAddress,
    cryptoValue * 1000000 //in suns which is 1 million itmes smaller
    // fromAddress //from optional - blank means infer it form private key
  );
  console.log(transactionObj);
  let signedTransaction;
  try {
    signedTransaction = await tronWeb.trx.sign(
      transactionObj,
      TRON_LINK_PRIVATE_KEY
    );
  } catch (err1) {
    console.log("err1");
    console.log(err1);
  }
  console.log("signedTransaction", signedTransaction);
  if (!signedTransaction) {
    throw new Error("signedTransaction is null!");
  }
  try {
    const result = await tronWeb.trx.sendRawTransaction(signedTransaction);
    console.log("final resul", result);
  } catch (err2) {
    console.log("err2");
    console.log(err2);
  }
  return result;
};

const sendTokens = async ({
  fromAddress,
  toAddress,
  usdtAmount,
  blockchain,privateKey,cryptocurrency
}) => {

  const contractAddress = tokenContractFromCryptocurrency[cryptocurrency]
  if (blockchain != "tron") {
    throw new Error("blockchain must be tron, got", blockchain);
  }
  const pk = privateKey;

  const tronWeb = new TronWeb({
    fullHost: "https://api.trongrid.io",
    headers: { "TRON-PRO-API-KEY": TRON_GRID_API_KEY },
    privateKey: pk,
  });

  const { abi } = await tronWeb.trx.getContract(contractAddress);

  const contract = tronWeb.contract(abi.entrys, contractAddress);

  const hash = await contract.methods.transfer(toAddress, usdtAmount).send();
  console.log("hash:", hash);
  return hash;
};

//lets try with build and sign transaction?

module.exports = { sendCoins, sendTokens };
