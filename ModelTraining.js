const { MongoClient } = require("mongodb");

const uri =
  "mongodb+srv://shahar:1234@cluster0.fffofzc.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri);

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
                    var holliday = info[date][holliday];//holliday
                    var weather = info[date]["weather"];//weather

                    //todo:sql and then flavor and amount
                }
            }
        }

        fs.writeFileSync("demoB.csv", csv);
      } finally {
        await client.close();
      }
}