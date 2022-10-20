const redis = require('redis');
import {io} from "socket.io-client";

const REEDIS_PORT = process.env.PORT || 6379;

const client = redis.createClient('127.0.0.1', REEDIS_PORT);

client.connect();
// var RedisApp= require('./stam_redis')
const socket = io("http://localhost:3000");
socket.on('connection');
socket.on("data", async (msg) => {
    console.log("Ciiii\n" + msg);
    const msg_obj= (JSON.parse(msg))
    const lemon = msg_obj.lemon;
    document.getElementById("lemon").innerHTML = lemon;
    const strw = msg_obj.strw
    document.getElementById("strw").innerHTML = strw;
    const choco = msg_obj.choco
    document.getElementById("choco").innerHTML = choco;
    const vanila = msg_obj.vanil
    document.getElementById("vanil").innerHTML = vanila;
    const halva = msg_obj.halva
    document.getElementById("halva").innerHTML = halva;
    if (document.getElementById("first").hidden==false){
        show_main_graph(halva,lemon,choco,strw,vanila)
    }
});

const reload = () => {
    location.reload();
}

var refresh_click = document.getElementById("refresh");
refresh_click.addEventListener("click", function () {
    event.preventDefault();
    reload();
})

var click_first = document.getElementById("mlai1");
click_first.addEventListener("click", function () {
    event.preventDefault();
    document.getElementById("first").hidden = false
    document.getElementById("second").hidden = true
    document.getElementById("third").hidden = true
}, false)

var click_second = document.getElementById("stores");
click_second.addEventListener("click", function () {
    event.preventDefault();
    document.getElementById("first").hidden = true
    document.getElementById("second").hidden = false
    document.getElementById("third").hidden = true
}, false)

var click_third = document.getElementById("amen");
click_third.addEventListener("click", function () {
    event.preventDefault();
    document.getElementById("first").hidden = true
    document.getElementById("second").hidden = true
    document.getElementById("third").hidden = false
}, false)


// const seasonname = client.get("season");
const seasonname = "סתיו";
const click_season = document.getElementById("season_click");
click_season.addEventListener("click", function () {
    document.getElementById("season").innerHTML = seasonname;
});

const isHoliday = "לא";
const click_holiday = document.getElementById("holiday_click");
click_holiday.addEventListener("click", function () {
    document.getElementById("holiday").innerHTML = isHoliday;
});


// var lemon = 9752;
// document.getElementById("lemon").innerHTML = lemon;
// const strw = 8743
// document.getElementById("strw").innerHTML = strw;
// const choco = 7895
// document.getElementById("choco").innerHTML = choco;
// const vanila = 5667
// document.getElementById("vanil").innerHTML = vanila;
// const halva = 4223
// document.getElementById("halva").innerHTML = halva;


const click_graph = document.getElementById("enter");
click_graph.addEventListener("click", show_graph213
);

function show_graph213() {
    show_graph21();
    show_graph212();
}

function show_graph21() {
    var xyValues = [
        {x: 1, y: 5},
        {x: 2, y: 8},
        {x: 3, y: 14},
        {x: 4, y: 9},
        {x: 5, y: 23},
        {x: 6, y: 33},
        {x: 7, y: 10}
    ];

    document.getElementById("graph21").innerHTML = new Chart("graph21", {
        type: "scatter",
        data: {
            datasets: [{
                pointRadius: 4,
                pointBackgroundColor: "rgb(0,0,255)",
                data: xyValues
            }]
        },
        options: {
            legend: {display: false},
            scales: {
                xAxes: [{ticks: {min: 1, max: 7}}],
                yAxes: [{ticks: {min: 0, max: 100}}],
            }
        }
    });
}

function show_graph212() {
    var xValues = ["Halva", "Lemon", "Chocolate", "Strawberry", "Vanilla"];
    var yValues = [55, 49, 72, 14, 33];
    var barColors = [
        "#1c207e",
        "#e3f83b",
        "#97582b",
        "#ef1e5d",
        "#ffffff"
    ];

    document.getElementById("graph213").innerHTML = new Chart("graph212", {
        type: "bar",
        data: {
            labels: xValues,
            datasets: [{
                backgroundColor: barColors,
                data: yValues
            }]
        },
        options: {
            legend: {display: false},
            title: {
                display: true,
                text: "מלאי נוכחי בסניף נבחר"
            }
        }
    });
}

function show_main_graph(halva,lemon,choco,strw,vanila){
    var xValues = ["Halva", "Lemon", "Chocolate", "Strawberry", "Vanilla"];
    var yValues = [halva, lemon, choco, strw, vanila];
    var barColors = [
        "#1c207e",
        "#e3f83b",
        "#97582b",
        "#ef1e5d",
        "#ffffff"
    ];

    new Chart("graph1", {
        type: "pie",
        data: {
            labels: xValues,
            datasets: [{
                backgroundColor: barColors,
                data: yValues
            }]
        },
        options: {
            title: {
                display: true,
                text: "גרף מלאי כללי ברשת"
            }
        }
    });
}

var taam2 = document.getElementById("kind");
var taam2_txt = taam2.options[taam2.selectedIndex].text;

var snif2 = document.getElementById("kind2");
var snif2_txt = snif2.options[snif2.selectedIndex].text;

var date_value = document.getElementById("date").value;
// document.getElementById("ddate").innerHTML = date_value;







