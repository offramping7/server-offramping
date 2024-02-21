const discordApi = require("../api/discord");
const cardsServices = require("./cards")
const notifyServiceOfframp = async ({ recipient, recipientAmount, offrampId }) => {
  const { nickname, bankName, cardNumber, phoneNumber, currency } = recipient;
  let myBinDoc
  let beautifiedCardNumber
  if (!!cardNumber) {
      myBinDoc = await cardsServices.binLookupDoc({cardNumber})
      beautifiedCardNumber = cardNumber.match(/.{1,4}/g).join(" ")
  }
  let waLink
  if (!!phoneNumber) {
    const pureNumber = phoneNumber.replace(/[^a-zA-Z0-9 ]/g, '')
    waLink = "https://wa.me/"+pureNumber
  }
  
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
          value: `${bankNameFromCard} || "none"`,
          inline: true,
        },//bankNameFromCard
        {
          name: "Номер Карты",
          value: `card: ${beautifiedCardNumber || cardNumber}`,
        },
        {
          name: "Телефон",
          value: `phone: ${phoneNumber}`,
        },
        {
          name: "WA для связи:",
          value: `${waLink}`,
        },
        //waLink
        
      ],
    },
  ];
  await discordApi.ping({ embeds });
  return;
};

module.exports = { notifyServiceOfframp };
