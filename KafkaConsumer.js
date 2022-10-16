// https://www.cloudkarafka.com/ הפעלת קפקא במסגרת ספק זה

const uuid = require("uuid");
const Kafka = require("node-rdkafka");

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
    console.log(`received message: ${data.value}`);
    console.log(data.value.toString());
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

