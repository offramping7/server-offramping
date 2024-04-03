const discordApi = require("../api/discord");
const cardsServices = require("./cards")
const notifyServiceOfframp = async ({ recipient, recipientAmount, offrampId }) => {
  const { nickname, bankName, bankSpecificFieldValue, phoneNumber, currency,cardPhoneNumber } = recipient;
  let bankNameFromCard
  
  // if (!!bankSpecificFieldsMap.cardNumber) {
  //     const myBinDoc = await cardsServices.binLookupDoc({cardNumber:bankSpecificFieldsMap.cardNumber})
  //     bankNameFromCard = myBinDoc?.bankName
  // }
  let waLink
  if (!!phoneNumber) {
    const pureNumber = phoneNumber.replace(/[^a-zA-Z0-9 ]/g, '')//
    waLink = "https://wa.me/"+pureNumber
  }
  const constantFields = [
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
      name: "Телефон",
      value: `phone: ${phoneNumber}`,
    },
    {
      name: "Телефон (SPB)",
      value: `phone: ${cardPhoneNumber}`,
    },
    {
      name: "WA для связи:",
      value: `${waLink || "none"}`,
    },
  ]
  const variableFields = [{
    name: "Account Info:",
    value: bankSpecificFieldValue,
  },]
  

  const embeds = [
    {
      title: "Новый Клиент!",
      description: `Наш Системный ID для этого перевода: ${offrampId}`,
      fields: [...constantFields,...variableFields]
    },
  ];
  await discordApi.ping({ embeds });
  return;
};

module.exports = { notifyServiceOfframp };
