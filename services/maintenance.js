const PayoutOptions = require("../models/payoutOptions")
const Banks = require("../models/banks")
const BinCodes = require("../models/binCodes")
const Recipients = require("../models/recipients")

const modernizeAllPayoutOptions = async () => {
    const update = {bankSpecificFieldKey:"cardNumber"}
    await PayoutOptions.updateMany({},update)
}

const modernizeAllRecipients = async () => {
    const allDocs = await Recipients.find()
    const listToUpdate = allDocs.map((data)=> {
        const {bankSpecificFieldsMap,nickname} = data
        
        const myMapAsObj = Object.fromEntries(bankSpecificFieldsMap)
        const firstKey = Object.keys(myMapAsObj)[0]
        const firstValue = myMapAsObj[firstKey]
        const update = {bankSpecificFieldValue:firstValue}
        return {docId:data._id,update:update}
    })
    for (const updateObj of listToUpdate) {
        const {docId,update} = updateObj
        await Recipients.findByIdAndUpdate(docId,update)
    }
}//for every single recipient, take its cardNumber, and insert {'cardNumber'}


const makeBanks = async () => {
  const allPayoutOptions = await PayoutOptions.find()
  const bankDefinitions = allPayoutOptions.map((oneDocData) => {
    const {currency,bankName,ipRestricted} = oneDocData
    return {currency,bankName,ipRestricted, createdAt : new Date()}
  })

    const promises  = []
  for (const bankDef of bankDefinitions) {
    const newBank = new Banks(bankDef)
    promises.push(newBank.save())
  }

  return Promise.all(promises)
//   if (isFromIpRestrictedCountry == true) { //userful logic
//   //if isFromIpRestrictedCountry, then payoutoptions must NOT be ip restrictged. 
//   const allPayoutOptions = await PayoutOptions.find({ currency, ipRestricted:false});
//   return allPayoutOptions
//  } else {
//   //if not isFromIpRestrictedCountry, then payoutoptions can be whatever
//   const allPayoutOptions = await PayoutOptions.find({ currency});
//   return allPayoutOptions
//  }

};

const addNewBin = async ({binNumber,bankName}) => {
  const previousResult = await BinCodes.findOne({binNumber})
  if (!!previousResult) return previousResult
  const definition = {createdAt:new Date(),binNumber,bankName,currencyCode:"RUB"}
  const newBinCode = new BinCodes(definition)
  await newBinCode.save()
  return  {added:true}
}


module.exports = {modernizeAllPayoutOptions,modernizeAllRecipients,makeBanks,addNewBin}