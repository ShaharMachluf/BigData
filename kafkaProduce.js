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
const topic = `${prefix}first-glida`;
const producer = new Kafka.Producer(kafkaConf);
// const client= new Kafka.KafkaClient();

const genMessage = m => new Buffer.alloc(m.length,m);

producer.on("ready", function(arg) {
  console.log(`producer Ariel is ready.`);
});
producer.connect();

module.exports.publish= function(msg)
{
  m=JSON.stringify(msg);
  producer.produce(topic, -1, genMessage(m), uuid.v4());
  //producer.disconnect();
}