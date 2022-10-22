const {MongoClient} = require("mongodb");

// Replace the uri string with your MongoDB deployment's connection string.
const uri = "mongodb://shahar:1234@ac-ylzmvv4-shard-00-00.fffofzc.mongodb.net:27017,ac-ylzmvv4-shard-00-01.fffofzc.mongodb.net:27017,ac-ylzmvv4-shard-00-02.fffofzc.mongodb.net:27017/?ssl=true&replicaSet=atlas-22nd2n-shard-0&authSource=admin&retryWrites=true&w=majority\n";

const client = new MongoClient(uri);

async function run() {
    try {
        const database = client.db("insertDB");
        const haiku = database.collection("haiku");
        // create a document to insert
        const doc = {
            title: "Record of a Shriveled Datum",
            content: "No bytes, no problem. Just insert a document, in MongoDB",
        }
        const result = await haiku.insertOne(doc);

        console.log(`A document was inserted with the _id: ${result.insertedId}`);
    } finally {
        await client.close();
    }
}
run().catch(console.dir);
