const CHAINGATEWAY_API_KEY = process.env.CHAINGATEWAY_API_KEY
const axios = require("axios")

const generateDepositAddressBSC = async ({password}) => {
    const url = "https://api.chaingateway.io/v2/bsc/addresses"
    const headers = {
        "Authorization":CHAINGATEWAY_API_KEY
    }
    const payload = {
        "password": password
    }
    return axios.post(url,payload,{headers}).then((res)=>res.data.bscaddress)
}


const createWebhookEvent = async ({blockchain,address,callbackUrl}) => {
    // const myBlockchain = chaingatewayReverseBlockchainNameConvention[blockchain]
    if (blockchain !== "tron") throw new Error("error! chaingateway's createWebhookEvent si hardcoded for tron right now")

    const url = `https://api.chaingateway.io/v2/${blockchain}/webhooks`
    const headers = {
        "Authorization":CHAINGATEWAY_API_KEY,Accept:"application/json"
    }
    const payload = { url: callbackUrl}
    // if (blockchain === 'polygon') {
    //     payload['type'] = 'ETH'
    //     payload['to'] = address
    // } 
    if (blockchain === 'tron') {
        payload['from'] = address
    }
    return axios.post(url,payload,{headers}).then((res)=>res.data)
} 

module.exports = {generateDepositAddressBSC,createWebhookEvent}