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

module.exports = {generateDepositAddressBSC}