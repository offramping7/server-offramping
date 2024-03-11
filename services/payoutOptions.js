const PayoutOptions = require("../models/payoutOptions");

const fetchPayoutOptions = async ({ currency }) => {
  const allPayoutOptions = await PayoutOptions.find({ currency,ipRestricted:false});
  return allPayoutOptions
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

const addPayoutOption = async ({
  currency,
  bankName,
  cardRequired,
  phoneValidationRequired,
  ipRestricted,
}) => {
  //first check if it exists already => if it does, don't add..
  const oldDoc = await PayoutOptions.findOne({ bankName });
  if (!!oldDoc) {
    return "doc exists";
  }
  const definition = {
    currency,
    bankName,
    cardRequired,
    phoneValidationRequired,
    ipRestricted,
  };
  const newPayoutOption = new PayoutOptions(definition);
  await newPayoutOption.save();
  return "success";
};

const fetchCurrencies = async () => {
  const allPayoutOptions = await PayoutOptions.find();
  const currencies = allPayoutOptions.map((el) => el.currency);
  const filtered = currencies.filter((curr)=> {
    return curr != 'RUB'
  })
  const unique = [...new Set(filtered)];
  return unique;
};

module.exports = { fetchPayoutOptions, addPayoutOption, fetchCurrencies };
