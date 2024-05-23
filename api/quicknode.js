const { Web3 } = require("web3");
const {RPC_SETTINGS} = require("../settings/crypto")
var ethers = require('ethers');  
var crypto = require('crypto');


const sendCoins = async ({
  fromAddress,
  privateKey,
  toAddress,
  cryptoValue,
  blockchain,
}) => {
  const web3 = new Web3(RPC_SETTINGS[blockchain].RPC_URL);
  const gasPrice = 500000000000
  const cryptoValueAfterFee = cryptoValue-gasPrice*1.01
  const params = {
    to: toAddress,
    from: fromAddress,
    value: web3.utils.toWei(`${cryptoValueAfterFee}`, "ether"),
    //gas: 21000, //web3.utils.toHex(21000), // optional
    gasPrice: gasPrice, //web3.utils.toHex(1),
    //   return Web3.utils.toHex(Number(res));
    // }),
  };
  console.log("sendCoins params", params);
  const signedTx = await web3.eth.accounts.signTransaction(params, privateKey);
  console.log("sendCoins signedTx", signedTx);
  const result = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
  console.log("sendCoins hash", result.transactionHash);
  return result.transactionHash;
};

const getBalance = async ({ address, blockchain }) => {
  const web3 = new Web3(RPC_SETTINGS[blockchain].RPC_URL);
  const balanceRaw = await web3.eth.getBalance(address); //Will give value in.
  const factor = BigInt("1000000000000000000");
  const balanceEth = balanceRaw / factor;
  return Number(balanceEth);
};


const generateAddress =  () => {
    // const web3 = new Web3(RPC_SETTINGS[blockchain].RPC_URL);
    const id = crypto.randomBytes(32).toString('hex');
    const privateKey = "0x"+id;
    console.log("SAVE BUT DO NOT SHARE THIS:", privateKey);

    const wallet = new ethers.Wallet(privateKey);
    console.log("Address: " + wallet.address);
    const address = wallet.address
   
    return {address,privateKey}
  };

module.exports = { sendCoins, getBalance,generateAddress };
