const PayoutOptions = require("../models/payoutOptions")
const BinCodes = require("../models/binCodes")

const binLookupDoc = async ({cardNumber}) => {
    const thisBinCode = cardNumber.replace(/\s/g, '').slice(0,6)
    const myBinCodeDoc = await BinCodes.findOne({thisBinCode}).populate("payoutOption")
    return myBinCodeDoc
}
const binLookupIfSanctioned = async ({cardNumber}) => {
    const myBinCodeDoc = await binLookupDoc({cardNumber})
    const {ipRestricted} = myBinCodeDoc.payoutOption
    return ipRestricted

}

const addBinCode = async ({binCode,bankName}) => {
    const myPayoutOption = await PayoutOptions.findOne({bankName})
    const definition = {
        payoutOption:myPayoutOption._id,
        binCode,
        bankName
    }
    const myNewCode = new BinCodes(definition)
    await myNewCode.save()
    return
}

module.exports = {binLookupDoc,addBinCode,binLookupIfSanctioned}