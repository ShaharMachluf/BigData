const redis = require('redis');
const REEDIS_PORT = process.env.PORT || 6379;
const client = redis.createClient('127.0.0.1', REEDIS_PORT);
module.exports.dataBySnif = async function (snif, flav) {
    var amount = await client.HGET(snif, flav);
    return amount;
}

client.connect();