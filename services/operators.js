const Operators = require("../models/operators");

const createOperator = async ({
  nickname,
  addressTrc20,
  addressErc20,
  addressBep20,
}) => {
  const definition = {
    nickname,
    addressTrc20,
    addressErc20,
    addressBep20,
    onDuty: false,
  };
  const newOperator = new Operators(definition);
  await newOperator.save();
  return;
};

const makeOnDuty = async ({ nickname }) => {
  //first everyoen who is not this guy we stop their shift
  const filterNegative = { nickname: { $ne: nickname } };
  const updateNegative = { onDuty: false };
  await Operators.updateMany(filterNegative, updateNegative);
  //second, this guys shift should start
  await Operators.findOneAndUpdate({ nickname }, { onDuty: true });
  return;
};

const fetchOnDuty = async () => {
  const myOperator = await Operators.findOne({ onDuty: true });
  return myOperator.nickname;
};

const fetchOnDutyFull = async () => {
  const myOperator = await Operators.findOne({ onDuty: true });
  return myOperator;
};

const getAll = async () => {
  const allOperators = await Operators.find({});
  const nicknames = allOperators.map((data) => data.nickname);
  return nicknames;
};
module.exports = { createOperator, makeOnDuty, fetchOnDuty, fetchOnDutyFull,getAll };
