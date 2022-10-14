const { MongoClient } = require("mongodb");
var mysql = require('mysql');
var bigml = require('bigml');

const uri =
  "mongodb+srv://shahar:1234@cluster0.fffofzc.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri);

var curr_model;

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "1234",
    database: "Cities"
  });

var info = {};//will be built like this: {date:brach:flavor:amount} (dict inside dict inside dict)

function add_order(doc){
    for(var i=0; i<doc.flavor.length; i++){//count flavors
        if(doc.flavor[i] in info[doc.date][doc.branch]){
            info[doc.date][doc.branch][doc.flavor[i]]++;
        }
        else{
            info[doc.date][doc.branch][doc.flavor[i]] = 1;
        }
    }
    info[doc.date]["holliday"] = doc.holliday;//insert holliday
    //insert weather
    var temp = parseFloat(doc.weather);
    if(temp <= 9){
        info[doc.date]["weather"] = "very cold";
    }else if(temp>=10 && temp<=17){
        info[doc.date]["weather"] = "cold";
    }else if(temp>=18 && temp<=24){
        info[doc.date]["weather"] = "cozy";
    }else if(temp>=25 && temp<=30){
        info[doc.date]["weather"] = "hot";
    }else{
        info[doc.date]["weather"] = "very hot";
    }    
}

async function CreateCSV(){
    try {
        const database = client.db("ice-cream");
        const orders = database.collection("orders");
        const cursor = orders.find();
        await cursor.forEach(doc => add_order(doc));
        
        var csv = "day,month,season,holliday,weather,size,religion,todller,teen,adult,middle,gold,old,flavor,amount\r\n";
        
        for(date in info){
            for(branch in info[date]){
                for(flavor in info[date][branch]){
                    const datetime = new Date(date);
                    var day = datetime.getDay();//day
                    var month = datetime.getMonth();//month
                    //season
                    if(month>=4 && month<=9){
                        var season = "summer";
                    }else if(month==10||month==11){
                        var season = "fall";
                    }else if(month>=12||month<=2){
                        var season = "winter";
                    }else{
                        var season = "spring";
                    }
                    var holliday = info[date]["holliday"];//holliday
                    var weather = info[date]["weather"];//weather

                    //extract from sql
                    var size;
                    var religion;
                    var todller;
                    var teen;
                    var adult;
                    var middle;
                    var gold;
                    var old;
                    con.connect(function(err) {
                        if (err) throw err;
                        con.query("SELECT * FROM Cities WHERE name = '"+branch+"'", function (err, result, fields) {
                          if (err) throw err;
                          size = result[0].size;
                          religion = result[0].religion;
                          todller = (result[0]["ages_0-5"] == null) ? ((1/6) * 100) : ((result[0]["ages_0-5"]/size) * 100);
                          teen = (result[0]["ages_6-18"] == null) ? ((1/6) * 100) : ((result[0]["ages_0-5"]/size) * 100);
                          adult = (result[0]["ages_19-45"] == null) ? ((1/6) * 100) : ((result[0]["ages_0-5"]/size) * 100);
                          middle = (result[0]["ages_46-55"] == null) ? ((1/6) * 100) : ((result[0]["ages_0-5"]/size) * 100);
                          gold = (result[0]["ages_56-64"] == null) ? ((1/6) * 100) : ((result[0]["ages_0-5"]/size) * 100);
                          old = (result[0]["ages_65-inf"] == null) ? ((1/6) * 100) : ((result[0]["ages_0-5"]/size) * 100);
                        });
                      });
                    csv+=day+","+month+","+season+","+holliday+","+weather+","+size+","+religion+","+todller+","+teen+","+adult+","+middle+","+gold+","+old+","+flavor+","+info[date][branch][flavor]+"\r\n";
                }
            }
        }
        fs.writeFileSync("model.csv", csv);
      } finally {
        await client.close();
      }
}

//when the "train model" button is pressed this is the function that it triggers
function TrainModel(){
    var connection = new bigml.BigML('SHAHAR6261',
                             '68f6776d831d3a4c3aed814e2ef8e329fc0c9ab8');
    CreateCSV();
    var source = new bigml.Source();
    source.create('./model.csv', function(error, sourceInfo) {
      if (!error && sourceInfo) {
        var dataset = new bigml.Dataset();
        dataset.create(sourceInfo, function(error, datasetInfo) {
          if (!error && datasetInfo) {
            var model = new bigml.Model();
            model.create(datasetInfo, function (error, modelInfo) {
              if (!error && modelInfo) {
                curr_model = modelInfo;
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
function PredictAmount(data){
    var prediction = new bigml.Prediction();
                prediction.create(modelInfo, data, function(error, predictInfo){
                    if(!error && predictInfo){
                        return predictInfo;
                    }
                });
}