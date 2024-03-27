const CHAINGATEWAY_API_KEY = process.env.CHAINGATEWAY_API_KEY
const axios = require("axios")
const { v4: uuidv4 } = require("uuid");

// //for bsc need to remap, don't forget it
// const chaingatewayReverseBlockchainNameConvention = {
//     "binance-smart-chain": "bsc",
//     "tron":"tron",
//     "polygon":"polygon",
//     "bsc":"bsc"
//   };

const tokenStandardFromBlockchain = {
    "tron":"trc20",//note: as of now, we only ever use trc20 because that's the only time when we transfer leggit usdt
    "bsc":"bep20",
    "ethereum":"erc20",
    "polygon":"erc20"//this is not a typo, polygon tokens are erc20
}
const createDepositAddress = async ({blockchain}) => {
    if (!['tron','polygon'].includes(blockchain)) throw new Error("blockchain must be polygon or tron, got: ", blockchain)
    const url = `https://api.chaingateway.io/v2/${blockchain}/addresses`
    const headers = {
        "Authorization":CHAINGATEWAY_API_KEY,Accept:"application/json"
    }
    const password = uuidv4()//this is not needed for tron only for polygon
    const payload = blockchain == "tron" ? {} : {
        "password": password
    }

 
    const result = await axios.post(url,payload,{headers}).then((res)=>res.data.data)
    const answer = blockchain == 'tron' ? {address:result.address,privateKey:result.privateKey} : {address:result.ethereumaddress,privateKey:password}
    return answer
}


const createWebhookEvent = async ({blockchain,address,callbackUrl}) => {
    // const myBlockchain = chaingatewayReverseBlockchainNameConvention[blockchain]

    const url = `https://api.chaingateway.io/v2/${blockchain}/webhooks`
    const headers = {
        "Authorization":CHAINGATEWAY_API_KEY,Accept:"application/json"
    }
    const payload = { url: callbackUrl}
    if (blockchain === 'polygon') {
        payload['type'] = 'ETH'
        payload['to'] = address
    } 
    if (blockchain === 'tron') {
        payload['from'] = address
    }
    return axios.post(url,payload,{headers}).then((res)=>res.data)
}
//sendTrx on trong => {to,amount,privateKey}
//sendTrx on polygon => {from,to,amount,password,gas}
const createCoinTransfer = async ({blockchain,fromAddress,toAddress,amount,privateKey}) => {
    // const myBlockchain = chaingatewayReverseBlockchainNameConvention[blockchain]
    if (!['polygon','tron'].includes(blockchain)) throw new Error("blockchain must be either polygon or tron, got: ", blockchain)
    const payload = blockchain === 'tron' ? 
    {  
        to: toAddress,
        amount: amount,
        privatekey: privateKey
    } : {
      from:fromAddress,
      to:toAddress,
      amount:amount,
      password:privateKey,
      gas:0.1
     }

    const url = `https://api.chaingateway.io/v2/${blockchain}/transactions`
    //transactions is for native coins likely?

    const headers = {
        "Authorization":CHAINGATEWAY_API_KEY,Accept:"application/json"
    }
    return axios.post(url,payload,{headers}).then((res)=>res.data)

}


const createTokenTransferTrx = async ({blockchain,toAddress,amount,privateKey,fromAddress}) => {
    if (blockchain !== 'tron') throw new Error("this createTokenTransfer is hardcoded for trx only, got:", blockchain)

    const tokenStandard = tokenStandardFromBlockchain[blockchain]

    const url = `https://api.chaingateway.io/v2/${blockchain}/transactions/${tokenStandard}`
    //transactions is for native coins likely?

    const headers = {
        "Authorization":CHAINGATEWAY_API_KEY,Accept:"application/json"
    }
  

      const payload = {
        "from": fromAddress,
        "to": toAddress,
        "privatekey": privateKey,
        "contractaddress": "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t",
        "amount": amount
      }

      return axios.post(url,payload,{headers}).then((res)=>res.data)


}

module.exports = {createDepositAddress,createWebhookEvent,createCoinTransfer,createTokenTransferTrx}