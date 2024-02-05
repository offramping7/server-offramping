const Offramps = require("../models/offramps");

const fetchLast100 = async () => {
  const results = await Offramps.find({})
    .populate("recipient")
    .sort({ createdAt: -1 })
    .limit(40)
    .exec();
  return results;
};
const fetchExpandedInfo = async ({ offrampId }) => {
  const myOfframp = await Offramps.findById(offrampId)
    .populate("recipient")
    .exec();

  return myOfframp;
};

const submitProof = async ({ offrampId, paymentProofUrl }) => {
  const update = { paymentProofUrl };
  await Offramps.findByIdAndUpdate(offrampId, update);
  return;
};

const markServicingCompleted = async ({
  offrampId,
  orderNumber,
  nickname,
  valueCryptoUsed,
}) => {
  const update = {
    servicingCompleted: true,
    operator: nickname,
    valueCryptoUsed,
    orderNumber,
  };
  await Offramps.findByIdAndUpdate(offrampId, update);
  return { status: 200 };
};

const fetchActiveProblems = async () => {
  const filter = { hasProblem: true };
  const problems = await Offramps.find(filter);
  return problems;
};

const createProblem = async ({ offrampId, problemDescription }) => {
  const update = { hasProblem: true, problemDescription: problemDescription };
  await Offramps.findByIdAndUpdate(offrampId, update);
  return;
};

const solveProblem = async ({ offrampId }) => {
  const filter = { offrampId };
  const update = { hasProblem: false };
  await Offramps.findByIdAndUpdate(offrampId, update);
  return;
};

module.exports = {
  submitProof,
  markServicingCompleted,
  fetchActiveProblems,
  createProblem,
  solveProblem,
  fetchExpandedInfo,
  fetchLast100,
};
