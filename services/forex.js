const coinmarketcapApi = require("../api/coinmarketcap");
const forexApi = require("../api/forex");
const Forex = require("../models/forex")

const initializeAllForex = async () => {
    const forexResult = await forexApi.fetchAll()
    for (const [currency,value] of Object.entries(forexResult)) {
        const definition = {currency,dollarValue:value}
        const newForex = new Forex(definition)
        await newForex.save()
    }

}

const updateAll = async () => {
    const forexResult = await forexApi.fetchAll()
    for (const [currency,value] of Object.entries(forexResult)) {
        try { 
            await Forex.findOneAndUpdate({currency},{dollarValue:value})
        } catch (e) {
            console.log(e)
        }
    }
}




module.exports = {
    initializeAllForex,
    updateAll,
};
