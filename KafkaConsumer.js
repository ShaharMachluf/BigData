// https://www.cloudkarafka.com/ הפעלת קפקא במסגרת ספק זה

const uuid = require("uuid");
const Kafka = require("node-rdkafka");
const redis = require('redis');
const axios = require('axios');
const kaf_con = require('./stam_redis');
const mongo_con= require('./mongoDB');
const io = require("socket.io")(3000, {
    cors:{
        origin: ["http://localhost:1234"]
    }
});
const REEDIS_PORT = process.env.PORT || 6379;
const glida_flavors = [" Chocolate ", " Lemon ", " Vanilla ", " Strawberry ", " Halva "];
const client = redis.createClient('127.0.0.1', REEDIS_PORT);
client.connect();


const kafkaConf = {
    "group.id": "cloudkarafka-example",
    "metadata.broker.list": "dory-01.srvs.cloudkafka.com:9094, dory-02.srvs.cloudkafka.com:9094, dory-03.srvs.cloudkafka.com:9094",
    "socket.keepalive.enable": true,
    "security.protocol": "SASL_SSL",
    "sasl.mechanisms": "SCRAM-SHA-256",
    "sasl.username": "4ddaxdn5",
    "sasl.password": "76GXA4beiAeGYzQW_MCR-o1Ugi08DL9G",
    "debug": "generic,broker,security"
};
const prefix = "4ddaxdn5-";
const topic = `${prefix}first-glida`
const topics = [topic];
const consumer = new Kafka.KafkaConsumer(kafkaConf, {
    "auto.offset.reset": "beginning"
});

consumer.connect();

consumer.on("error", function (err) {
    console.error(err);
});
consumer.on("ready", function (arg) {
    console.log(`Consumer ready...`);
    consumer.subscribe(topics);
    consumer.consume();
});

io.on("connection", async (socket) => {

    const d= await kaf_con.getDate();
    const d2= await kaf_con.dataBySnif();
    console.log(d);
    socket.emit("data",d);
    socket.emit("data2",d2);

});

consumer.on('data', async function (data) {

    const msg = JSON.parse(data.value);
    console.log(`received message: ${JSON.stringify(msg)}`);
    await kaf_con.ParseDate(msg);
    await mongo_con.run_mongo(msg).catch(console.dir);
    // io.on("connection", (socket) => {
    //     socket.emit("data", data);
    // });


});
consumer.on("disconnected", function (arg) {
    process.exit();
});
consumer.on('event.error', function (err) {
    console.error(err);
    process.exit(1);
});
consumer.on('event.log', function (log) {
    console.log(log);
});

