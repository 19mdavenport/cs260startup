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
    return userCollection.findOne({username: username});
}

async function addGroup(group) {
    const result = await groupCollection.insertOne(group);
    return result;
}

async function getGroups(username) {
    const query = {user: username};
    const cursor = groupCollection.find(query);
    return await cursor.toArray();
}

async function addTask(group) {
    const result = await taskCollection.insertOne(group);
    return result;
}

async function getTasks(username) {
    const query = {user: username};
    const cursor = taskCollection.find(query);
    return await cursor.toArray();
}

async function addProject(group) {
    const result = await projectCollection.insertOne(group);
    return result;
}

async function getProjects(username) {
    const query = {user: username};
    const cursor = projectCollection.find(query);
    return await cursor.toArray();
}




module.exports = { addUser, getUser, addGroup, getGroups, addTask, getTasks, addProject, getProjects };
