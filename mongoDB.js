const { MongoClient } = require("mongodb");
const uuid = require("uuid");
const Kafka = require("node-rdkafka");
var data = require('./weather.json');

const uri =
  "mongodb+srv://shahar:1234@cluster0.fffofzc.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri);
var weather = data;

//check if there is a holliday at "date"
function holliday(date){
    axios({
        method: 'get',
        url: `https://www.hebcal.com/converter?cfg=json&date=${date}&g2h=1&strict=1`,
        responseType: 'json'
      })
        .then(function (response) {
            var obj = response.data;
            if(obj.events.length > 1){
                return true;
            }
            return false;
        });
}

async function run() {
  try {
    //connect to db
    const database = client.db('ice-cream');
    const movies = database.collection('orders');
    var doc={};

    //connect to kafka
    const kafkaConf = {
        "group.id": "cloudkarafka-example",
        "metadata.broker.list": "	dory.srvs.cloudkafka.com",
        "socket.keepalive.enable": true,
        "security.protocol": "SASL_SSL",
        "sasl.mechanisms": "SCRAM-SHA-256",
        "sasl.username": "4ddaxdn5",
        "sasl.password": "76GXA4beiAeGYzQW_MCR-o1Ugi08DL9G",
        "debug": "generic,broker,security"
    };
      
      const prefix = "mo0oa5gi-";
      const topic = `${prefix}new`;
      const producer = new Kafka.Producer(kafkaConf);
      
      const genMessage = m => new Buffer.alloc(m.length,m);
      //const prefix = process.env.CLOUDKARAFKA_USERNAME;
      
      const topics = [topic];
      const consumer = new Kafka.KafkaConsumer(kafkaConf, {
        "auto.offset.reset": "beginning"
      });
      
      consumer.on("error", function(err) {
        console.error(err);
      });
      consumer.on("ready", function(arg) {
        console.log(`Consumer ${arg.name} ready`);
        consumer.subscribe(topics);
        consumer.consume();
      });
      consumer.on("data", function(m) {
       console.log(m.value.toString());
       let weath = obj.find(o => o.time_obs === m.value.date);
       var hol = holliday(m.value.date);
       doc = {
        branch: m.value.branch, 
        date: m.value.date,
        weather: weath,
        holliday: hol,  
        num_scoops: m.value.num_scoops, 
        flavor: m.value.flavor
       };//insert details
      });
      consumer.on("disconnected", function(arg) {
        process.exit();
      });
      consumer.on('event.error', function(err) {
        console.error(err);
        process.exit(1);
      });
      consumer.connect();
      //insert document
      const result = await haiku.insertOne(doc);
       console.log(`A document was inserted with the _id: ${result.insertedId}`);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
//put it in while true (?)
run().catch(console.dir);