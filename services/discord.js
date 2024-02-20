const discordApi = require("../api/discord");
const cardsServices = require("./cards")
const notifyServiceOfframp = async ({ recipient, recipientAmount, offrampId }) => {
  const { nickname, bankName, cardNumber, phoneNumber, currency } = recipient;
  const myBinDoc = await cardsServices.binLookupDoc({cardNumber})
  const bankNameFromCard = myBinDoc.bankName
  const embeds = [
    {
      title: "Новый Клиент!",
      description: `Наш Системный ID для этого перевода: ${offrampId}`,
      fields: [
        {
          name: "Валюта для получения",
          value: `${currency}`,
          inline: true,
        },
        {
          name: "Сумма для получения",
          value: `${recipientAmount}`,
          inline: true,
        },
        {
          name: "Имя",
          value: `${nickname}`,
          inline: true,
        },
        {
          name: "Bank",
          value: `${bankName}`,
          inline: true,
        },//
        {
          name: "Bank from card",
          value: `${bankNameFromCard}`,
          inline: true,
        },//bankNameFromCard
        {
          name: "Номер Карты",
          value: `card: ${cardNumber}`,
        },
        {
          name: "Телефон",
          value: `phone: ${phoneNumber}`,
        },
        
      ],
    },
  ];
  await discordApi.ping({ embeds });
  return;
};

module.exports = { notifyServiceOfframp };
