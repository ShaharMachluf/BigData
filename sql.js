var mysql = require('mysql');
const fs = require("fs");
const { parse } = require("csv-parse");
csv = require('csv');
iconv = require("iconv-lite")
const axios = require('axios').default;

//create db
// var con = mysql.createConnection({
//     host: "localhost",
//     user: "root",
//     password: "1234"
//   });
  
// con.connect(function(err) {
//   if (err) throw err;
//   console.log("Connected!");
//   con.query("CREATE DATABASE Cities", function (err, result) {
//     if (err) throw err;
//     console.log("Database created");
//   });
// });

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "1234",
  database: "Cities"
});

//create table
// con.connect(function(err) {
//   if (err) throw err;
//   console.log("Connected!");
//   var sql = "CREATE TABLE Cities (id INT AUTO_INCREMENT PRIMARY KEY, name NVARCHAR(255) NOT NULL UNIQUE, size INT, religion VARCHAR(255), `ages_0-5` INT, `ages_6-18` INT, `ages_19-45` INT, `ages_46-55` INT, `ages_56-64` INT, `ages_65-inf` INT)";
//   con.query(sql, function (err, result) {
//     if (err) throw err;
//     console.log("Table created");
//   });
// });

// var i=0;

// fs.createReadStream("city_ages.csv")
//   .pipe(parse({ delimiter: ",", relax_quotes: true, from_line: 2 ,
//   comment: '#',
//   encoding: 'UTF-8'}))
//   .on("data", function (row) {
//     if (i < 100) {
//       var sql = "INSERT INTO Cities (name, size, `ages_0-5`, `ages_6-18`, `ages_19-45`, `ages_46-55`, `ages_56-64`, `ages_65-inf`)"+ 
//       " VALUES (`"+row[1]+"`, "+row[8]+", "+row[9]+", "+row[10]+", "+row[11]+", "+row[12]+", "+row[13]+", "+row[14]+")";
//       con.query(sql, function (err, result) {
//         if (err) throw err;
//         console.log("1 record inserted");
//       });
//     console.log(row);
//     i++;
//   }
// })
//   .on("error", function (error) {
//     console.log(error.message);
//   });

//get the cities' religion
function religion(page){
axios({
  method: 'get',
  url: `https://boardsgenerator.cbs.gov.il/Handlers/WebParts/YishuvimHandler.ashx?dataMode=Yeshuv&filters={%22Years%22:%222021%22}&filtersearch=&language=Hebrew&mode=GridData&pageNumber=${page}&search=&subject=BaseData`,
  responseType: 'json'
})
  .then(function (response) {
    var obj = response.data;
    var table = obj.Table;
    for (let index = 0; index < 100 && index<table.length; index++) {
      const city = table[index];
      if(city.PepoleNumberJewish=='-'){
        var rel = "arab";
      }else if(city.PepoleNumberArab =='-'){
        var rel = "jewish";
      }else{
        var rel = "mixed";
      }
      var size = 0;
      var people = city.PepoleNumber;
      for (let i = 0; i < people.length; i++) {
        if(people.charAt(i)!=','){
          size*=10;
          size+=parseInt(people.charAt(i));
        }
      }
      if(isNaN(size)){
        continue;
      }
      var sql = "INSERT INTO Cities (name, religion, size) VALUES ('"+city.Name+"', '"+rel+"', "+size+")";
      con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("1 record inserted");
      });
    }
  });
}

// for (let index = 1; index < 6; index++) {
//   religion(index);
// }

//get cities' ages
axios({
  method: 'get',
  url: `https://data.gov.il/api/3/action/datastore_search?resource_id=64edd0ee-3d5d-43ce-8562-c336c24dbc1f&limit=11000`,
  responseType: 'json'
}).then(function (response){
  var obj = response.data.result.records;
  for (var i=1; i<obj.length; ++i){
    var city = obj[i];
    var name = city.שם_ישוב.substring(0,city.שם_ישוב.length-1);
    var todller = isNaN(parseInt(city.גיל_0_5)) ? 0:parseInt(city.גיל_0_5);
    var teen = isNaN(parseInt(city.גיל_6_18)) ? 0 : parseInt(city.גיל_6_18);
    var adult = isNaN(parseInt(city.גיל_19_45)) ? 0 : parseInt(city.גיל_19_45);
    var middle = isNaN(parseInt(city.גיל_46_55)) ? 0 : parseInt(city.גיל_46_55);
    var gold = isNaN(parseInt(city.גיל_56_64)) ? 0 : parseInt(city.גיל_56_64);
    var old = isNaN(parseInt(city.גיל_65_פלוס)) ? 0 : parseInt(city.גיל_65_פלוס);
    var sql = "UPDATE Cities SET `ages_0-5` = "+ todller + 
    ", `ages_6-18` = " + teen + 
    ", `ages_19-45` = " + adult+
    ", `ages_46-55` = "+middle+
    ", `ages_56-64` = "+gold+
    ", `ages_65-inf` = "+old+
    " WHERE name = '"+ name+"';";
    try{
        con.query(sql, function (err, result) {
          // console.log("1 record updated");
        });
      }
      catch(error){
        continue;
      }
  }
})

//send cities to kafka
const uuid = require("uuid");
const Kafka = require("node-rdkafka");

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

producer.on("ready", function(arg) {
  console.log(`producer is ready.`);
});
producer.connect();

var cities = []

con.query("SELECT name FROM Cities", function (err, result, fields) {
  if (err) throw err;
  for(var i=0; i<result.length;i++){
    cities.push(result[i].name);
  }
});

module.exports.publish= function()
{   
  m=JSON.stringify(cities);
  producer.produce(topic, -1, genMessage(m), uuid.v4());  
  //producer.disconnect();   
}