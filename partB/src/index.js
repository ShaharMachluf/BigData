import * as bootstrap from 'bootstrap';

const redis = require('redis');
const REEDIS_PORT = process.env.PORT || 6379;

const client = redis.createClient('127.0.0.1', REEDIS_PORT);
// (async () => {
//     await
client.connect();
// })();

const seasonname = client.get("season");
// const seasonname = "סתיו";
const click_season = document.getElementById("season_click");
click_season.addEventListener("click", function () {
    document.getElementById("season").innerHTML = seasonname;
});

const isHoliday = "כן";
const click_holiday = document.getElementById("holiday_click");
click_holiday.addEventListener("click", function () {
    document.getElementById("holiday").innerHTML = isHoliday;
});
const lemon = 100;
document.getElementById("lemon").innerHTML =
//     client.set('lemon', function (error, response) {
//     if (error) return console.error(error);
//     console.log(response);
// });
    lemon;
const strw = 100
document.getElementById("strw").innerHTML = strw;
const choco = 100
document.getElementById("choco").innerHTML = choco;
const vanila = 100
document.getElementById("vanil").innerHTML = vanila;
const halva = 100
document.getElementById("halva").innerHTML = halva;


const click_graph = document.getElementById("enter");
click_graph.addEventListener("click", show_graph213
);

function show_graph213() {
    show_graph21();
    show_graph212();
}

function show_graph21() {
    var xyValues = [
        {x: 50, y: 7},
        {x: 60, y: 8},
        {x: 70, y: 8},
        {x: 80, y: 9},
        {x: 90, y: 9},
        {x: 100, y: 9},
        {x: 110, y: 10},
        {x: 120, y: 11},
        {x: 130, y: 14},
        {x: 140, y: 14},
        {x: 150, y: 15}
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
                xAxes: [{ticks: {min: 40, max: 160}}],
                yAxes: [{ticks: {min: 6, max: 16}}],
            }
        }
    });
}

function show_graph212() {
    var xValues = ["Italy", "France", "Spain", "USA", "Argentina"];
    var yValues = [55, 49, 44, 24, 15];
    var barColors = ["red", "green", "blue", "orange", "brown"];

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
                text: "World Wine Production 2018"
            }
        }
    });
}

var xValues = ["Italy", "France", "Spain", "USA", "Argentina"];
var yValues = [55, 49, 44, 24, 15];
var barColors = [
    "#b91d47",
    "#00aba9",
    "#2b5797",
    "#e8c3b9",
    "#1e7145"
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
            text: "World Wide Wine Production 2018"
        }
    }
});

var taam2 = document.getElementById("kind");
var taam2_txt = taam2.options[taam2.selectedIndex].text;

var snif2 = document.getElementById("kind2");
var snif2_txt = snif2.options[snif2.selectedIndex].text;

var date_value = document.getElementById("date").value;
document.getElementById("ddate").innerHTML = date_value;







