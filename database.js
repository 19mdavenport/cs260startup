const { MongoClient } = require('mongodb');
const config = require('./dbConfig.json');

const url = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}`;
const client = new MongoClient(url);
const db = client.db('startup');
const userCollection = db.collection('user');
const taskCollection = db.collection('task');
const groupCollection = db.collection('group');
const projectCollection = db.collection('project');

// This will asynchronously test the connection and exit the process if it fails
(async function testConnection() {
    await client.connect();
    await db.command({ ping: 1 });
})().catch((ex) => {
    console.log(`Unable to connect to database with ${url} because ${ex.message}`);
    process.exit(1);
});


async function addUser(user) {
    const result = await userCollection.insertOne(user);
    return result;
}

async function getUser(username) {
    const query = {username: username};
    const options = {sort: {username: -1}, limit: 1,};
    const cursor = userCollection.find(query, options);
    return await cursor.toArray();
}


module.exports = { addUser, getUser };
