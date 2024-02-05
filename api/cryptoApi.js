const axios = require("axios");

const apiKey = process.env.CRYPTOAPI_API_KEY
const MASTERWALLETID = process.env.CRYPTOAPI_MASTERWALLETID
const blockchainNameConventionMapper = {
  bsc: "binance-smart-chain",
};
const createDepositAddress = async ({ label, blockchain }) => {
  const properBlockchain = blockchainNameConventionMapper[blockchain];
  const url = `https://rest.cryptoapis.io/wallet-as-a-service/wallets/${MASTERWALLETID}/${properBlockchain}/mainnet/addresses`;
  const body = {
    data: {
      item: {
        label: label,
      },
    },
  };
  const headers = {
    "Content-Type": "application/json",
    "X-API-Key": apiKey,
  };
  return axios
    .post(url, body, { headers: headers })
    .then((res) => {
      const address = res.data.data.item.address;
      return address;
    })
    .catch((err) => {
      console.log(err.response);
      throw new Error("error with creadting new deposit address");
    });
};

const fetchAddressBalance = async ({ address, blockchain }) => {
  //be careful their naming convention is different!
  const properBlockchain = blockchainNameConventionMapper[blockchain];

  const url = `https://rest.cryptoapis.io/blockchain-data/${properBlockchain}/mainnet/addresses/${address}/tokens`;
  const headers = {
    "Content-Type": "application/json",
    "X-API-Key": apiKey,
  };
  return axios
    .get(url, { headers: headers })
    .then((res) => {
      const data = res.data;
      const balances = data.data.items;
      return balances;
    })
    .catch((err) => {
      console.log(err);
      throw new Error("error with creating new deposit address");
    });
};

const createCoinTransfer = async ({
  fromAddress,
  toAddress,
  blockchain,
  amount,
  callbackUrl,
}) => {
  const properBlockchain = blockchainNameConventionMapper[blockchain];

  const url = `https://rest.cryptoapis.io/wallet-as-a-service/wallets/${MASTERWALLETID}/${properBlockchain}/mainnet/addresses/${fromAddress}/transaction-requests`;
  const body = {
    data: {
      item: {
        amount: amount.toFixed(5).toString(),
        feePriority: "standard",
        recipientAddress: toAddress,
        callbackUrl,
      },
    },
  };
  console.log("body body body body body", body);

  const headers = {
    "Content-Type": "application/json",
    "X-API-Key": apiKey,
  };
  return axios
    .post(url, body, { headers: headers })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      console.log(
        "ERROR ERROR ERROR ERROR ERROR createCoinTransfer createCoinTransfer createCoinTransfer",
        err.response.data,
        err.response.data?.error?.details
      );

      return null;
    });
};

const createCoinTransferForFullAmount = async ({
  fromAddress,
  toAddress,
  blockchain,
  callbackUrl,
}) => {
  const properBlockchain = blockchainNameConventionMapper[blockchain];

  const url = `https://rest.cryptoapis.io/wallet-as-a-service/wallets/${MASTERWALLETID}/${properBlockchain}/mainnet/addresses/${fromAddress}/all-transaction-requests`;
  const body = {
    data: {
      item: {
        feePriority: "standard",
        recipientAddress: toAddress,
        callbackUrl,
      },
    },
  };
  console.log(
    "NOW GOONA TRY THIsS createCoinTransferForFullAmount",
    {
      fromAddress,
      toAddress,
      blockchain,
      callbackUrl,
    },
    body
  );

  const headers = {
    "Content-Type": "application/json",
    "X-API-Key": apiKey,
  };
  return axios
    .post(url, body, { headers: headers })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      console.log(
        "ERROR ERROR ERROR ERROR ERROR createCoinTransferForFullAmount",
        err.response.data
      );
      console.log(
        "ERROR ERROR ERROR ERROR ERROR createCoinTransferForFullAmount  err.response.data.error",
        err.response.data.error
      );
      console.log(
        "ERROR ERROR ERROR ERROR ERROR createCoinTransferForFullAmount  err.response.data.error.details",
        err.response.data.error.details
      );
      return null;
    });
};

const createTokenTransfer = async ({
  //   recipientAddress,
  //   cryptoAmount,
  //   senderAddress,
  //   callbackUrl,
  //   tokenContract,
  cryptoAmount,
  contractAddress,
  blockchain,
  fromAddress,
  toAddress,
  callbackUrl,
}) => {
  const properBlockchain = blockchainNameConventionMapper[blockchain];

  const cryptoApiEndpointEnding =
    properBlockchain === "tron"
      ? "feeless-token-transaction-requests"
      : "token-transaction-requests";
  const body = {
    data: {
      item: {
        amount: cryptoAmount,
        callbackUrl: callbackUrl,
        recipientAddress: toAddress,
        tokenIdentifier: contractAddress,
      },
    },
  };

  if (properBlockchain == "tron") {
    body.data.item.feeLimit = "1000000000";
  } else {
    body.data.item.feePriority = "standard";
  }
  const url = `https://rest.cryptoapis.io/wallet-as-a-service/wallets/${MASTERWALLETID}/${properBlockchain}/mainnet/addresses/${fromAddress}/${cryptoApiEndpointEnding}`;

  const headers = {
    "Content-Type": "application/json",
    "X-API-Key": apiKey,
  };
  return axios
    .post(url, body, { headers: headers })
    .then((res) => {
      console.log("finished", res.data);
      return res.data;
    })
    .catch((err) => {
      console.log(err.response.data);
      throw new Error("error with transactionn token requests");
    });
};

const createTokenWebhookEvent = async ({
  address,
  blockchain,
  callbackUrl,
}) => {
  const properBlockchain = blockchainNameConventionMapper[blockchain];

  console.log("callbackUrl is:", callbackUrl);
  const url = `https://rest.cryptoapis.io/blockchain-events/${properBlockchain}/mainnet/subscriptions/address-tokens-transactions-confirmed`;
  const body = {
    data: {
      item: {
        address: address,
        // allowDuplicates: true,
        callbackUrl: callbackUrl,
        // receiveCallbackOn: 3,
      },
    },
  };
  const headers = {
    "Content-Type": "application/json",
    "X-API-Key": apiKey,
  };
  return axios
    .post(url, body, { headers: headers })
    .then((res) => {
      console.log(res);
      console.log(res.data);
      console.log(res.data.data);
      console.log(res.data.data.item);
      const isActive = res.data.data.item.isActive;

      return isActive;
    })
    .catch((err) => {
      console.log(err);
      console.log(err.response);
      console.log(err.response.data);
      console.log(err.response.data.error);
      console.log(err.response.data.error.details);

      throw new Error(callbackUrl);
    });
};
const createCoinsWebhookEvent = async ({
  address,
  blockchain,
  callbackUrl,
}) => {
  const properBlockchain = blockchainNameConventionMapper[blockchain];

  console.log("callbackUrl is:", callbackUrl);
  const url = `https://rest.cryptoapis.io/blockchain-events/${properBlockchain}/mainnet/subscriptions/address-coins-transactions-confirmed`;
  const body = {
    data: {
      item: {
        address: address,
        // allowDuplicates: true,
        callbackUrl: callbackUrl,
        callbackSecretKey: "mugiwara",
        // receiveCallbackOn: 3,
      },
    },
  };
  const headers = {
    "Content-Type": "application/json",
    "X-API-Key": apiKey,
  };
  return axios
    .post(url, body, { headers: headers })
    .then((res) => {
      console.log(res);
      console.log(res.data);
      console.log(res.data.data);
      console.log(res.data.data.item);
      const isActive = res.data.data.item.isActive;

      return isActive;
    })
    .catch((err) => {
      console.log(err);
      console.log(err.response);
      console.log(err.response.data);
      console.log(err.response.data.error);
      console.log(err.response.data.error.details);

      throw new Error(callbackUrl);
    });
};

module.exports = {
  createDepositAddress,
  fetchAddressBalance,
  createCoinTransfer,
  createTokenTransfer,
  createTokenWebhookEvent,
  createCoinsWebhookEvent,
  createCoinTransferForFullAmount,
};
