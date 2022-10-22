const {MongoClient} = require("mongodb");
const uuid = require("uuid");
const Kafka = require("node-rdkafka");
var data = require('./weather.json');
var axios = require("axios");
var https = require("https");

const uri =
"mongodb://shahar:1234@ac-ylzmvv4-shard-00-00.fffofzc.mongodb.net:27017,ac-ylzmvv4-shard-00-01.fffofzc.mongodb.net:27017,ac-ylzmvv4-shard-00-02.fffofzc.mongodb.net:27017/?ssl=true&replicaSet=atlas-22nd2n-shard-0&authSource=admin&retryWrites=true&w=majority\n"

// const client = new MongoClient(uri);
var weather = data;

//check if there is a holliday at "date"
function holliday(date) {
    axios({
        method: 'get',
        url: `https://www.hebcal.com/converter?cfg=json&date=${date}&g2h=1&strict=1`,
        responseType: 'json',
        timeout: 60000,
        httpsAgent: new https.Agent({ keepAlive: true })

    })
        .then(function (response) {
            var obj = response.data;
            console.log(obj.events);
            if (obj.events.length > 1) {
                return true;
            }
            return false;
        });
}

module.exports.run_mongo = async function run(m) {
    const client = new MongoClient(uri);
    // await client.connect();
    try {
        //connect to db
        const database = client.db('ice-cream');
        const orders = database.collection('orders');
        var doc = {};
        console.log(m + "shahar");

        let weath = weather.find(o => o.time_obs.slice(0, 10) === m.date.slice(0,10));
        console.log(m.date);
        var hol = holliday(m.date);
        console.log(hol+"CCCCIIIIIIIIIIiiii");
        var we;
        try{
            we= weath.tmp_air_dry
        }
        catch (err){
            we= 10;
        }
        doc = {
            branch: m.branch,
            date: m.date,
            weather: we,
            holiday: hol,
            num_scoops: m.num_scoops,
            flavor: m.flavor
        };//insert details
        //insert document
        const result = await orders.insertOne(doc);
        console.log(`A document was inserted with the _id: ${result.insertedId}`);
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}
//put it in while true (?)
// run().catch(console.dir);
