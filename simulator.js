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

const myobject = require('./order.js');
// const axios = require('axios').default;
// const kafka = require('./kafkaProduce');
// const bodyParser = require('body-parser');

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
var cities = [];
var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "1234",
  database: "cities"
});

con.connect(function(err) {
  if (err) throw err;
  con.query("SELECT name FROM cities", function (err, result, fields) {
    if (err) throw err;
    console.log(result);
    for(var i=0; i<95; i++){
      cities[i] = result[i].name;
    }
  });
});
const flavors = ["Chocolate", "Lemon", "Vanilla", "Strawberry", "Halva", "Chocolate"]
const seasons = [1, 2, 2, 2]
const winter = [0, 1, 2, 9, 10, 11]
const summer = [3, 4, 5, 6, 7, 8]
// function religion(page){
//   axios({
//     method: 'get',
//     url: `https://boardsgenerator.cbs.gov.il/Handlers/WebParts/YishuvimHandler.ashx?dataMode=Yeshuv&filters={%22Years%22:%222021%22}&filtersearch=&language=Hebrew&mode=GridData&pageNumber=${page}&search=&subject=BaseData`,
//     responseType: 'json'
//   })
//     .then(function (response) {
//       var obj = response.data;
//       var table = obj.Table;
//       for (let index = 0; index < 100 && index<table.length; index++) {
//         const city = table[index];
//         console.log(city.toString());
//         // if(city.PepoleNumberJewish=='-'){
//         //   var rel = "arab";
//         // }else if(city.PepoleNumberArab =='-'){
//         //   var rel = "jewish";
//         // }else{
//         //   var rel = "mixed";
//         // }
//         var size = 0;
//         var people = city.PepoleNumber;
//         for (let i = 0; i < people.length; i++) {
//           if(people.charAt(i)!=','){
//             size*=10;
//             size+=parseInt(people.charAt(i));
//           }
//         }
//         if(isNaN(size)){
//           continue;
//         }
//       }
//     });
//   }

function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
      currentDate = Date.now();
    } while (currentDate - date < milliseconds);
  }

function make_orders(){
    var r_scoops = Math.floor(Math.random() * 3) + 1;
    var myarray = [];
    // var r_flavor = Math.floor(Math.random() * 5);
    var r_season = Math.floor(Math.random() * 3);
    var r_city = Math.floor(Math.random() * 94); //check it
    var r_year = Math.floor(Math.random() * 5) + 2018; //check the years
    var r_day = Math.floor(Math.random() * 31);
    var r_month = -1;
    if(seasons == 1){
      r_month = Math.floor(Math.random() * 5);
    }
    else if(seasons == 2){ //if summer buy more icecream
      r_month = Math.floor(Math.random() * 5);
    }
    var date = new Date(r_year, r_month, r_day);
    if(date.getDay() >=4){ //in weekend buy more Chocolate
      for(var i=0; i<r_scoops; i++){
        var r_flavor = Math.floor(Math.random() * 6);
        myarray[i] = flavors[r_flavor];
      }
    }
    else{
      for(var i=0; i<r_scoops; i++){
        var r_flavor = Math.floor(Math.random() * 5);
        myarray[i] = flavors[r_flavor];
      }
    }
    let my_order = new myobject.Order(myarray, date, cities[r_city], r_scoops);
    let str = my_order.toString();
    console.log(str);
    //send to kafka

}

// for (let index = 1; index < 6; index++) {
//   religion(index);
// }

for(var i=0; i<1000; i++){
    make_orders();
}
while(true){
    make_orders();
    sleep(2000);
}

