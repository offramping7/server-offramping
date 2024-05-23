const cryptocurrencyFromBlockchain = {
  bsc: {
    coin: "BNB",
    token: "USDT",
  },
  polygon: {
    coin: "MATIC",
    token: "USDT",
  },
  tron: {
    coin: "TRX",
    token: "USDT",
  },
};
const SEVERAL_BLOCKCHAIN_DATA = {
  
  polygon: { USE_NATIVE_COINS: true, coin: "MATIC", token: "USDT" },
  tron: { USE_NATIVE_COINS: false, coin: "TRX", token: "USDT" },
  // bsc: { USE_NATIVE_COINS: true, coin: "BNB", token: "USDT" },
};
const RPC_SETTINGS = {
  polygon: {
    RPC_URL:
      process.env.QUICKNODE_POLYGON_RPC_URL
  },
};

module.exports = { cryptocurrencyFromBlockchain,SEVERAL_BLOCKCHAIN_DATA,RPC_SETTINGS };
