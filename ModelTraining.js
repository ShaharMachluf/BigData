const {MongoClient} = require("mongodb");
var mysql = require('mysql');
var bigml = require('bigml');
var fs = require('fs');
const mongo_con= require('./mongoDB');
const {RowDataPacket} = require("mysql/lib/protocol/packets");

var cities = {};
var info = {};//will be built like this: {date:brach:flavor:amount} (dict inside dict inside dict)
var connection = new bigml.BigML('SHAHAR6261',
    '68f6776d831d3a4c3aed814e2ef8e329fc0c9ab8');

function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
        currentDate = Date.now();
    } while (currentDate - date < milliseconds);
}


let result;

const setOutput = async (rows) => {
    try{
        if(fs.existsSync("model.csv")){
            fs.unlinkSync("model.csv");
        }
    }
    catch (e){
        console.error(e);
    }
    var csv = "day,month,season,holliday,weather,size,religion,todller,teen,adult,middle,gold,old,flavor,amount\r\n";
    await fs.appendFile("model.csv", csv, (err) => {
        if (err) {
            console.log(err);
        }else{
            console.log("success");
        }
    });
    result = rows;
    for(var i=0; i<result.length;i++){
        cities[result[i].name] = result[i];
    }

    for (date in info) {
        for (branch in info[date]) {
            if (branch === "holliday" || branch === "weather") {
                continue;
            }
            for (flavor in info[date][branch]) {
                const datetime = new Date(date);
                var day = datetime.getDay();//day
                var month = datetime.getMonth();//month
                //season
                if (month >= 4 && month <= 9) {
                    var season = "summer";
                } else if (month == 10 || month == 11) {
                    var season = "fall";
                } else if (month >= 12 || month <= 2) {
                    var season = "winter";
                } else {
                    var season = "spring";
                }
                var holliday;//holliday
                if(info[date]["holliday"]){
                    holliday = "true";
                }
                else {
                    holliday = "false";
                }
                var weather = info[date]["weather"];//weather

                //extract from sql
                var size = cities[branch].size;
                var religion = cities[branch].religion;
                var todller = (cities[branch]["ages_0-5"] == null) ? ((1 / 6) * 100) : ((cities[branch]["ages_0-5"] / size) * 100);
                var teen = (cities[branch]["ages_6-18"] == null) ? ((1 / 6) * 100) : ((cities[branch]["ages_6-18"] / size) * 100);
                var adult = (cities[branch]["ages_19-45"] == null) ? ((1 / 6) * 100) : ((cities[branch]["ages_19-45"] / size) * 100);
                var middle = (cities[branch]["ages_46-55"] == null) ? ((1 / 6) * 100) : ((cities[branch]["ages_46-55"] / size) * 100);
                var gold = (cities[branch]["ages_56-64"] == null) ? ((1 / 6) * 100) : ((cities[branch]["ages_56-64"] / size) * 100);
                var old = (cities[branch]["ages_65-inf"] == null) ? ((1 / 6) * 100) : ((cities[branch]["ages_65-inf"] / size) * 100);
                var row = "," + size + "," + religion + "," + todller + "," + teen + "," + adult + "," + middle + "," + gold + "," + old + ",";

                csv = day + "," + month + "," + season + "," + holliday + "," + weather + row + flavor + "," + info[date][branch][flavor] + "\r\n";

                fs.appendFile("model.csv", csv, (err) => {
                    if (err) {
                        console.log(err);
                    }
                });
            }
        }
    }
}

const uri =
    "mongodb://shahar:1234@ac-ylzmvv4-shard-00-00.fffofzc.mongodb.net:27017,ac-ylzmvv4-shard-00-01.fffofzc.mongodb.net:27017,ac-ylzmvv4-shard-00-02.fffofzc.mongodb.net:27017/?ssl=true&replicaSet=atlas-22nd2n-shard-0&authSource=admin&retryWrites=true&w=majority\n";
// const client = new MongoClient(uri);

var curr_model;

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "םישג7788",
    database: "Cities"
});

function add_order(doc) {
    // console.log(doc);
    // console.log(doc.flavor);
    // console.log(doc.flavor.length);
    for (var i = 0; i < doc.flavor.length; i++) {//count flavors
        if (doc.date in info) {
            if (doc.branch in info[doc.date]) {
                if (doc.flavor[i] in info[doc.date][doc.branch]) {
                    info[doc.date][doc.branch][doc.flavor[i]]++;
                } else {
                    info[doc.date][doc.branch][doc.flavor[i]] = 1;
                }
            } else {
                info[doc.date][doc.branch] = {}
                info[doc.date][doc.branch][doc.flavor[i]] = 1;
            }
        } else {
            info[doc.date] = {};
            info[doc.date][doc.branch] = {}
            info[doc.date][doc.branch][doc.flavor[i]] = 1;
        }
    }

    info[doc.date]["holliday"] = doc.holliday;//insert holliday
    //insert weather
    var temp = parseFloat(doc.weather);
    if (temp <= 9) {
        info[doc.date]["weather"] = "very cold";
    } else if (temp >= 10 && temp <= 17) {
        info[doc.date]["weather"] = "cold";
    } else if (temp >= 18 && temp <= 24) {
        info[doc.date]["weather"] = "cozy";
    } else if (temp >= 25 && temp <= 30) {
        info[doc.date]["weather"] = "hot";
    } else {
        info[doc.date]["weather"] = "very hot";
    }
}

async function CreateCSV() {
    const client = new MongoClient(uri);
    try {
        const database = client.db("ice-cream");
        const orders = database.collection("orders");
        const cursor = orders.find();
        await cursor.forEach(doc => add_order(doc));

        con.query("SELECT * FROM Cities", function (err, out, fields) {
            if (err) throw err;
            //     // console.log(result[0].size);
            setOutput(out);
        })

    } finally {
        await client.close();
    }
}

//when the "train model" button is pressed this is the function that it triggers
async function TrainModel() {
    console.log("fsf")
    await CreateCSV();
    console.log("sdfewtwrt")
    var source = new bigml.Source(connection);
    console.log("om here!!!")
    source.create('./model.csv', function (error, sourceInfo) {
        if (!error && sourceInfo) {
            var dataset = new bigml.Dataset(connection);
            dataset.create(sourceInfo, function (error, datasetInfo) {
                if (!error && datasetInfo) {
                    var model = new bigml.Model(connection);
                    model.create(datasetInfo, function (error, modelInfo) {
                        if (!error && modelInfo) {
                            curr_model = modelInfo;
                            console.log("curr_model" + curr_model)
                            return curr_model;
                        }
                    });
                }
            });
        }
    });
}

//given data predicts the amount
//param data: {date, branch, flavor}
function PredictAmount(data) {
    console.log(data.branch);
    const datetime = new Date(data.date);
    var day = datetime.getDay();//day
    var month = datetime.getMonth();//month
    //season
    if (month >= 4 && month <= 9) {
        var season = "summer";
    } else if (month == 10 || month == 11) {
        var season = "fall";
    } else if (month >= 12 || month <= 2) {
        var season = "winter";
    } else {
        var season = "spring";
    }
    holly=mongo_con.holly(data.date);//holliday
    if(holly){
        holliday = "true";
    }
    else {
        holliday = "false";
    }
    var size = cities[data.branch].size;
    var religion = cities[data.branch].religion;
    var todller = (cities[data.branch]["ages_0-5"] == null) ? ((1 / 6) * 100) : ((cities[data.branch]["ages_0-5"] / size) * 100);
    var teen = (cities[data.branch]["ages_6-18"] == null) ? ((1 / 6) * 100) : ((cities[data.branch]["ages_6-18"] / size) * 100);
    var adult = (cities[data.branch]["ages_19-45"] == null) ? ((1 / 6) * 100) : ((cities[data.branch]["ages_19-45"] / size) * 100);
    var middle = (cities[data.branch]["ages_46-55"] == null) ? ((1 / 6) * 100) : ((cities[data.branch]["ages_46-55"] / size) * 100);
    var gold = (cities[data.branch]["ages_56-64"] == null) ? ((1 / 6) * 100) : ((cities[data.branch]["ages_56-64"] / size) * 100);
    var old = (cities[data.branch]["ages_65-inf"] == null) ? ((1 / 6) * 100) : ((cities[data.branch]["ages_65-inf"] / size) * 100);
    var prediction = new bigml.Prediction(connection);
    prediction.create(curr_model, {'day':day,'month':month,'season':season,'holliday':holliday,'size':size,'religion':religion,'todller':todller,'teen':teen,'adult':adult,'middle':middle,'gold':gold,'old':old,'flavor':data.flavor}, function (error, predictInfo) {
        if (!error && predictInfo) {
            console.log(predictInfo.object.output);
            return predictInfo;
        }else if(error){
            console.error(error);
        }
    });
}


async function main(){
    TrainModel();
    setTimeout(PredictAmount.bind(null,{date:"2023-10-12",branch:'אורות',flavor:"Chocolate"}), 30000)
}

main();
