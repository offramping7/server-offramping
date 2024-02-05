const PayoutOptions = require("../models/payoutOptions");

const fetchPayoutOptions = async ({ currency }) => {
  const ipRestricted = await checkIfIpRestricted();
  const allPayoutOptions = await PayoutOptions.find({ currency, ipRestricted });
  return allPayoutOptions;
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
  const unique = [...new Set(currencies)];
  return unique;
};

module.exports = { fetchPayoutOptions, addPayoutOption, fetchCurrencies };

const checkIfIpRestricted = async () => {
  return false;
};
