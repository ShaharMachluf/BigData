// import {Order} from '/order.js'
// class Order {
//   constructor(flavor, date, branch, num_scoops) {
//     this.flavor = flavor;
//     this.date = date;
//     this.branch = branch;
//     this.num_scoops = num_scoops;
//   }

//   toString(order){
//     let str = "";
//     for(var i=0; i<this.num_scoops; i++){
//       str+=this.flavor[i] + " , ";
//     }
//     str += this.date.toString() + " , " + this.branch + "\n";

//     return str;
//   }
// }
const Kafka = require("node-rdkafka");
const uuid = require("uuid");

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
var ind = 0;
const prefix = "4ddaxdn5-";
const topic = `${prefix}first-glida`;
const producer = new Kafka.Producer(kafkaConf);
const myobject = require('./order.js');
const axios = require('axios');
const kafk = require("./kafkaProduce");
// const kafka = require('./kafkaProduce');
// const bodyParser = require('body-parser');

const genMessage = str => new Buffer(`${str}`);

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
const cities = [];
var mysql = require('mysql');
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "םישג7788",
    database: "Cities"
});
function bdika(){
    con.connect(function(err) {
        if (err) throw err;
        con.query("SELECT name FROM cities", function (err, result, fields) {
            if (err) throw err;
            //Return the fields object:
            console.log(result[0].name);
        });
    });
}
// producer.on("ready", function(arg) {
//     console.log(`producer Ariel is ready.`);
// });
// var sendMessage = async (str) => {
//     try {
//         await producer.connect()
//         await producer.produce(
//             topic,-1,str)
//     }
//     catch (err){console.error(err)}
//
// }

console.log("fsdfsaf");
bdika();



// con.query("SELECT name FROM Cities", function (err, result, fields) {
//     if (err) throw err;
//     console.log(fields);
//     for (var i = 0; i < 95; i++) {
//         // cities[i] = result[i].name;
//         cities.push(result[i].name)
//         console.log(cities);
//     }
// });
// console.log(bdika);
// con.connect(function (err) {
//     if (err) throw err;
//     console.log("Connected!");
//     var sql = "SELECT name FROM Cities";
//     con.query(sql, function (err, result) {
//         if (err) throw err;
//         console.log(result);
//     });
// });
const flavors = ["Chocolate", "Lemon", "Vanilla", "Strawberry", "Halva", "Chocolate"]
const seasons = [1, 2, 2, 2]
const winter = [0, 1, 2, 9, 10, 11]
const summer = [3, 4, 5, 6, 7, 8]

// function insert_to_cities(val) {
//     cities.push(val);
// }
//
// function religion(page) {
//     console.log("daszsafsdgdsgdafhadfh");
//     axios({
//         method: 'get',
//         url: `https://boardsgenerator.cbs.gov.il/Handlers/WebParts/YishuvimHandler.ashx?dataMode=Yeshuv&filters={%22Years%22:%222021%22}&filtersearch=&language=Hebrew&mode=GridData&pageNumber=${page}&search=&subject=BaseData`,
//         responseType: 'json'
//     })
//         .then(function (response) {
//             console.log(response);
//             var obj = response.data;
//             console.log(obj);
//             var table = obj.Table;
//             for (let index = 0; index < 100 && index < table.length; index++) {
//                 const city = table[index];
//                 console.log(city.toString());
//                 // if(city.PepoleNumberJewish=='-'){
//                 //   var rel = "arab";
//                 // }else if(city.PepoleNumberArab =='-'){
//                 //   var rel = "jewish";
//                 // }else{
//                 //   var rel = "mixed";
//                 // }
//                 var size = 0;
//                 var people = city.PepoleNumber;
//                 for (let i = 0; i < people.length; i++) {
//                     if (people.charAt(i) != ',') {
//                         size *= 10;
//                         size += parseInt(people.charAt(i));
//                     }
//                 }
//                 if (isNaN(size)) {
//                     continue;
//                 }
//                 insert_to_cities(city.name);
//                 // cities.push(city.Name);
//             }
//         });
// }
//
// console.log("sadadsa");
// for (let index = 1; index < 6; index++) {
//     religion(index);
//     console.log(index);
// }

function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
        currentDate = Date.now();
    } while (currentDate - date < milliseconds);
}

function make_orders() {
    var r_scoops = Math.floor(Math.random() * 3) + 1;
    var myarray = [];
    // var r_flavor = Math.floor(Math.random() * 5);
    var r_season = Math.floor(Math.random() * 3);
    var r_city = Math.floor(Math.random() * 94); //check it
    var r_year = Math.floor(Math.random() * 5) + 2018; //check the years
    var r_day = Math.floor(Math.random() * 31);
    var r_month = -1;
    if (seasons == 1) {
        r_month = Math.floor(Math.random() * 5);
    } else if (seasons == 2) { //if summer buy more icecream
        r_month = Math.floor(Math.random() * 5);
    }
    var date = new Date(r_year, r_month, r_day);
    if (date.getDay() >= 4) { //in weekend buy more Chocolate
        for (var i = 0; i < r_scoops; i++) {
            var r_flavor = Math.floor(Math.random() * 6);
            myarray[i] = flavors[r_flavor];
        }
    } else {
        for (var i = 0; i < r_scoops; i++) {
            var r_flavor = Math.floor(Math.random() * 5);
            myarray[i] = flavors[r_flavor];
        }
    }
    let my_order = new myobject.Order(myarray, date, cities[r_city], r_scoops);
    let str = my_order.toString();
    // console.log(str);
    // console.log(cities);
    //send to kafka

    // sendMessage(str);
    // const genMessage = m => new Buffer.alloc(m.length, m);
    // //
    // producer.on("ready", function (arg) {
    //     console.log(`producer ${arg.name} ready.`);
    // });
    // producer.connect();
    // //
    // module.exports.publish = function (msg) {
    //     m = JSON.stringify(msg);
    //     producer.produce(topic, -1, genMessage(m), uuid.v4());
    // }
    //
    // module.exports.publish(str);
    // kafk.publish(str);
}

for (var i = 0; i < 1000; i++) {
    make_orders();
}
while (true) {
    make_orders();
    sleep(2000);
}

