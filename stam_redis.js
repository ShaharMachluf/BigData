const redis = require('redis');
const REEDIS_PORT = process.env.PORT || 6379;
const client = redis.createClient('127.0.0.1', REEDIS_PORT);


module.exports.ParseDate = async function (d) {
    console.log(d);
    let city = d["branch"];
    let flavors = d["flavor"];
    let balls = d["num_scoops"]
    console.log(city + " city");
    for (let i = 0; i < flavors.length; i++) {
        var curr_amount = await client.GET(flavors[i]);
        console.log(curr_amount + " curr_amount");
        await client.SET(flavors[i], curr_amount - 1);
        var curr_amount_city = await client.HGET(city, flavors[i]);
        console.log(curr_amount_city + " curr_amount_city");
        await client.HSET(city, flavors[i], curr_amount_city - 1);
    }
}


module.exports.getDate = async function () {
    console.log("kan")
    var lemon = await client.GET("Lemon");
    console.log(lemon+"lemon")
    var strw = await client.GET("Strawberry");
    var vanil = await client.GET("Vanilla");
    var halva = await client.GET("Halva");
    var choco = await client.GET("Chocolate");
    console.log(choco+"choco")
    const store = {lemon: lemon, "strw": strw, "vanil": vanil, "halva": halva, "choco": choco};
    console.log(store);
    return JSON.stringify(store);
}

client.connect();

