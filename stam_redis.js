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
    var lemon = await client.GET("Lemon");
    var strw = await client.GET("Strawberry");
    var vanil = await client.GET("Vanilla");
    var halva = await client.GET("Halva");
    var choco = await client.GET("Chocolate");
    const store = {lemon: lemon, "strw": strw, "vanil": vanil, "halva": halva, "choco": choco};
    return JSON.stringify(store);
}

module.exports.dataBySnif = async function () {
    var cities = [
        'אבו גוש', 'אבו סנאן', 'אבו קורינאת (יישוב)',
        'אבו תלול', 'אבטין', 'אבטליון',
        'אביאל', 'אביבים', 'אביגדור',
        'אביחיל', 'אביטל', 'אביעזר',
        'אבירים', 'אבן יהודה', 'אבן מנחם',
        'אבן ספיר', 'אבן שמואל', 'אבני איתן',
        'אבני חפץ', 'אבנת', 'אבשלום',
        'אדורה', 'אדירים', 'אדמית',
        'אדרת', 'אודים', 'אודם',
        'אוהד', 'אום אל-פחם', 'אום אל-קוטוף',
        'אום בטין', 'אומן', 'אומץ',
        'אופקים', 'אור הגנוז', 'אור הנר',
        'אור יהודה', 'אור עקיבא', 'אורה',
        'אורות', 'אורטל', 'אורים',
        'אורנים', 'אורנית', 'אושה',
        'אזור', 'אחווה', 'אחוזם',
        'אחוזת ברק', 'אחיהוד', 'אחיטוב',
        'אחיסמך', 'אחיעזר', 'איבים',
        'אייל', 'איילת השחר', 'אילון',
        'אילות', 'אילנייה', 'אילת',
        'אירוס', 'איתמר', 'איתן',
        'איתנים', 'אכסאל', 'אל -עזי',
        'אל -עריאן', 'אל -רום', 'אל סייד',
        'אלומה', 'אלומות', 'אלון הגליל',
        'אלון מורה', 'אלון שבות', 'אלוני אבא',
        'אלוני הבשן', 'אלוני יצחק', 'אלונים',
        'אלי-עד', 'אליאב', 'אליכין',
        'אליפז', 'אליפלט', 'אליקים',
        'אלישיב', 'אלישמע', 'אלמגור',
        'אלמוג', 'אלעד', 'אלעזר',
        'אלפי מנשה', 'אלקוש', 'אלקנה',
        'אמונים', 'אמירים'
    ];
    const flavors = ["Chocolate", "Lemon", "Vanilla", "Strawberry", "Halva"];
    var store={}
    for (var i=0; i<cities.length; i++){
        for (var j=0; j<flavors.length; j++){
            var city= cities[i];
            var flav= flavors[j];
            var city_flav= {city:flav};
            var amount = await client.HGET(city, flav);
            store[city_flav]=amount;
        }
    }
    return JSON.stringify(store);
}

client.connect();

