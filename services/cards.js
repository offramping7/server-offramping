const PayoutOptions = require("../models/payoutOptions")
const BinCodes = require("../models/binCodes")

const binLookupDoc = async ({cardNumber}) => {
    if (!cardNumber) {
        return null
    }
    const thisBinCode = cardNumber.replace(/\s/g, '').slice(0,6)
    const myBinCodeDoc = await BinCodes.findOne({thisBinCode}).populate("payoutOption")
    return myBinCodeDoc
}
const binLookupIfSanctioned = async ({cardNumber}) => {
    const myBinCodeDoc = await binLookupDoc({cardNumber})
    if (!myBinCodeDoc.payoutOption) return false
    const {ipRestricted} = myBinCodeDoc.payoutOption
    return ipRestricted

}

const addBinCode = async ({binCode,bankName}) => {
    const myPayoutOption = await PayoutOptions.findOne({bankName})
    const definition = {
        binCode,
        bankName
    }
    if (!!myPayoutOption) {
        definition["payoutOption"] = myPayoutOption._id
    }
    const myNewCode = new BinCodes(definition)
    await myNewCode.save()
    return
}

module.exports = {binLookupDoc,addBinCode,binLookupIfSanctioned}