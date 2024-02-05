const discordApi = require("../api/discord");

const notifyServiceOfframp = async ({ recipient, cryptoAmount, offrampId }) => {
  const { nickname, bankName, cardNumber, phoneNumber, currency } = recipient;

  const embeds = [
    {
      title: "New Offramp Request!",
      description: `offrampId : ${offrampId}`,
      fields: [
        {
          name: "Currency",
          value: `${currency}`,
          inline: true,
        },
        {
          name: "USDT amount",
          value: `${cryptoAmount}`,
          inline: true,
        },
        {
          name: "Name",
          value: `${nickname}`,
          inline: true,
        },
        {
          name: "Bank",
          value: `${bankName}`,
          inline: true,
        },
        {
          name: "Card Info",
          value: `card: ${cardNumber}`,
        },
        {
          name: "Phone Number",
          value: `phone: ${phoneNumber}`,
        },
        
      ],
    },
  ];
  const channel = "client";
  await discordApi.ping({ embeds, channel });
  return;
};

module.exports = { notifyServiceOfframp };
