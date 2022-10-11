const redis = require('redis');
const axios = require('axios');
const REEDIS_PORT = process.env.PORT || 6379;

const client = redis.createClient('127.0.0.1', REEDIS_PORT);
client.connect();

async function insert_redis(key, value1, value2) {
    const bdika= await client.hSet(key, value1, value2);
    console.log(bdika);
    return key;
}

function religion(page) {
    axios({
        method: 'get',
        url: `https://boardsgenerator.cbs.gov.il/Handlers/WebParts/YishuvimHandler.ashx?dataMode=Yeshuv&filters={%22Years%22:%222021%22}&filtersearch=&language=Hebrew&mode=GridData&pageNumber=${page}&search=&subject=BaseData`,
        responseType: 'json'
    })
        .then(function (response) {
            var obj = response.data;
            var table = obj.Table;
            for (let index = 0; index < 100 && index < table.length; index++) {
                const city = table[index];
                if (city.PepoleNumberJewish == '-') {
                    var rel = "arab";
                } else if (city.PepoleNumberArab == '-') {
                    var rel = "jewish";
                } else {
                    var rel = "mixed";
                }
                var size = 0;
                var people = city.PepoleNumber;
                for (let i = 0; i < people.length; i++) {
                    if (people.charAt(i) != ',') {
                        size *= 10;
                        size += parseInt(people.charAt(i));
                    }
                }
                if (isNaN(size)) {
                    continue;
                }
                const flav_arr = ["וניל", "תות", "שוקולד", "לימון", "חלבה"];
                for (let index = 0; index < 5; index++) {
                    insert_redis(city.Name, flav_arr[index], 100);
                }
                // var sql = "INSERT INTO Cities (name, religion, size) VALUES ('"+city.Name+"', '"+rel+"', "+size+")";
                // con.query(sql, function (err, result) {
                //     if (err) throw err;
                //     console.log("1 record inserted");
                // });
            }
        });
}

for (let index = 1; index < 6; index++) {
    religion(index);
}

