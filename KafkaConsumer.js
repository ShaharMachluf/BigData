// https://www.cloudkarafka.com/ הפעלת קפקא במסגרת ספק זה

const uuid = require("uuid");
const Kafka = require("node-rdkafka");
const redis = require('redis');
const axios = require('axios');
const REEDIS_PORT = process.env.PORT || 6379;
const glida_flavors = [" Chocolate ", " Lemon ", " Vanilla ", " Strawberry ", " Halva "];
const client = redis.createClient('127.0.0.1', REEDIS_PORT);
client.connect();

async function update_redis(key, value) {
    console.log(key, value);
    var curr= await client.hGet(key,value);
    console.log(curr);
    var bdika= await client.hSet(key, value, curr-1);
    console.log(bdika);
    return key;
}


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
const topic= `${prefix}first-glida`
const topics = [topic];
const consumer = new Kafka.KafkaConsumer(kafkaConf, {
    "auto.offset.reset": "beginning"
});

consumer.connect();

consumer.on("error", function(err) {
    console.error(err);
});
consumer.on("ready", function(arg) {
    console.log(`Consumer ready...`);
    consumer.subscribe(topics);
    consumer.consume();
    console.log(`Ciiii...`);
});

consumer.on('data', function(data) {
    // console.log(`received message: ${data.value}`);
    var msg=data.value.toString()
    console.log(data.value.toString());
    var msg_split= msg.split(",");
    // console.log(msg_split);
    var flavs_to_reduce=[];
    var city_to_reduce=msg_split[msg_split.length-1]
    city_to_reduce= city_to_reduce.slice(0,city_to_reduce.length-3);
    for (var i = 0; i < msg_split.length; i++) {
        if (glida_flavors.includes(msg_split[i])){
            flavs_to_reduce.push(msg_split[i].slice(0,msg_split[i].length-1));
        }
    }
    console.log(flavs_to_reduce, city_to_reduce);
    for (var j=0; j<flavs_to_reduce.length; j++){
        update_redis(city_to_reduce,flavs_to_reduce[j]);
    }
});
consumer.on("disconnected", function(arg) {
    process.exit();
});
consumer.on('event.error', function(err) {
    console.error(err);
    process.exit(1);
});
consumer.on('event.log', function(log) {
    console.log(log);
});

