const redis = require('redis');
const REEDIS_PORT = process.env.PORT || 6379;

const client = redis.createClient('127.0.0.1', REEDIS_PORT);

client.connect();

async function redis_get(key) {
    const res = await client.get(key);
    // console.log(res)
    return res;
}

const lemon = redis_get(" Lemon ");
var a;
lemon.then((res) => {
    // console.log(res)
    a = res;
})
// console.log(a)
setTimeout(()=> {
    console.log(a)
}, 500)

module.exports.lemon = redis_get(" Lemon ");