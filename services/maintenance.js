const PayoutOptions = require("../models/payoutOptions")
const Recipients = require("../models/recipients")

const modernizeAllPayoutOptions = async () => {
    const update = {bankSpecificFieldKeys:["cardNumber"]}
    await PayoutOptions.updateMany({},update)
}

const modernizeAllRecipients = async () => {
    const allDocs = await Recipients.find({})
    const listToUpdate = allDocs.map((data)=> {
        const {cardNumber} = data
    
        const update = {bankSpecificFieldsMap:{cardNumber:cardNumber || 'mistake'}}
        return {docId:data._id,update:update}
    })
    for (const updateObj of listToUpdate) {
        const {docId,update} = updateObj
        await Recipients.findByIdAndUpdate(docId,update)
    }
}//for every single recipient, take its cardNumber, and insert {'cardNumber'}

module.exports = {modernizeAllPayoutOptions,modernizeAllRecipients}