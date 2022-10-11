var mysql = require('mysql');
const myobject = require("./order");
// const myobject = require('./order.js');
// const kafk = require("./kafkaProduce");
const cities = [];
const flavors = ["Chocolate", "Lemon", "Vanilla", "Strawberry", "Halva", "Chocolate"]
const seasons = [1, 2, 2, 2]
const winter = [0, 1, 2, 9, 10, 11]
const summer = [3, 4, 5, 6, 7, 8]
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "םישג7788",
    database: "Cities"
});

con.connect(function (err) {
    if (err) throw err;
    con.query("SELECT name FROM cities", function (err, result, fields) {
        if (err) throw err;
        //Return the fields object:
        console.log(result[0].name);
        for (var i = 0; i < 95; i++) {
            cities[i] = result[i].name;
        }
        console.log(cities);
    });
});

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
    console.log(str)
    // setTimeout(kafk.publish(str),1000);
}


function bdika1(){
    for (var i = 0; i < 1000; i++) {
        make_orders();
    }
}


function bdika() {
    while (true) {
        make_orders();
        sleep(2000);

    }
}
setTimeout(bdika1, 1000)
setTimeout(bdika, 1000)

