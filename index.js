const express = require('express');
const app = express();
const DB = require('./database.js');

const port = process.argv.length > 2 ? process.argv[2] : 4000;

app.use(express.json());
app.use(express.static('public'));
var apiRouter = express.Router();
app.use(`/api`, apiRouter);

apiRouter.post('/user', (req, res) => {
  if (!req.body.username || !req.body.password || !req.body.email) {
    res.sendStatus(400);
    return;
  }

  const username = req.body.username;

  if (DB.getUser(username).length > 0) {
    res.sendStatus(403);
    return;
  }

  DB.addUser({ username: username, password: req.body.password, email: req.body.email });

  const groups = [{ name: "CS 260", user: username }, { name: "[Class Name]", user: username }];
  groups.forEach((group) => DB.addGroup(group));

  const tasks = [{ group: 1, name: "Startup HTML", due: new Date(2023, 8, 30, 23, 59), user: username },
  { group: 2, name: "Item 2", due: new Date(2023, 10, 11, 23, 59), user: username },
  { group: 2, name: "Item 3", due: new Date(2023, 10, 13, 23, 59), user: username },
  { group: 2, name: "Item 4", due: new Date(2023, 10, 14, 23, 59), user: username },
  { group: 2, name: "Item 5", due: new Date(2023, 10, 15, 23, 59), user: username },
  { group: 2, name: "Item 6", due: new Date(2023, 10, 16, 23, 59), user: username },
  { group: 2, name: "Item 7", due: new Date(2023, 10, 17, 23, 59), user: username },
  { group: 2, name: "Item 8", due: new Date(2023, 10, 18, 23, 59), user: username }];
  tasks.forEach((task) => DB.addTask(task));

  const projects = [{ group: 1, name: "Startup HTML", hours: 3, due: new Date(2023, 9, 28, 23, 59), user: username },
  { group: 2, name: "Item 2", hours: 2, due: new Date(2023, 10, 15, 23, 59), user: username },
  { group: 2, name: "Item 3", hours: 13, due: new Date(2023, 10, 17, 23, 59), user: username },
  { group: 2, name: "Item 4", hours: 4, due: new Date(2023, 10, 19, 23, 59), user: username },
  { group: 2, name: "Item 5", hours: 7, due: new Date(2023, 10, 21, 23, 59), user: username },
  { group: 2, name: "Item 6", hours: 23, due: new Date(2023, 10, 24, 23, 59), user: username }];
  projects.forEach((project) => DB.addProject(project));

  res.sendStatus(200);
});

apiRouter.post('/session', async (req, res) => {
  if (!req.body.username || !req.body.password) {
    res.sendStatus(400);
    return;
  }
  const user = await DB.getUser(req.body.username);

  if (user.length == 0 || user[0].password !== req.body.password) {
    res.sendStatus(401);
    return;
  }
  res.sendStatus(200);
});



apiRouter.put('/group/:username', (req, res) => {
  if (!req.params.username) {
    res.sendStatus(400);
    return;
  }
  let user = DB.getUser(req.params.username);
  if (user.length == 0) {
    res.sendStatus(401);
    return;
  }
  DB.addGroup({name: req.body.name, user: req.params.username});
  res.sendStatus(200);
});

apiRouter.get('/group/:username', async (req, res) => {
  if (!req.params.username) {
    res.sendStatus(400);
    return;
  }
  let user = DB.getUser(req.params.username);
  if (user.length == 0) {
    res.sendStatus(401);
    return;
  }
  res.send(await DB.getGroups(req.params.username));
});




apiRouter.put('/task/:username', (req, res) => {
  if (!req.params.username) {
    res.sendStatus(400);
    return;
  }
  let user = DB.getUser(req.params.username);
  if (user.length == 0) {
    res.sendStatus(401);
    return;
  }
  DB.addTask({ group: req.body.group, name: req.body.name, due: req.body.due, user: req.params.username });
  res.sendStatus(200);
});

apiRouter.get('/task/:username', async (req, res) => {
  if (!req.params.username) {
    res.sendStatus(400);
    return;
  }
  let user = DB.getUser(req.params.username);
  if (user.length == 0) {
    res.sendStatus(401);
    return;
  }
  
  res.send(await DB.getTasks(req.params.username));
});



apiRouter.put('/project/:username', (req, res) => {
  if (!req.params.username) {
    res.sendStatus(400);
    return;
  }
  let user = DB.getUser(req.params.username);
  if (user.length == 0) {
    res.sendStatus(401);
    return;
  }
  DB.addTask({ group: req.body.group, name: req.body.name, hours: req.body.hours, due: req.body.due, user: req.params.username });
  res.sendStatus(200);
});

apiRouter.get('/project/:username', async (req, res) => {
  if (!req.params.username) {
    res.sendStatus(400);
    return;
  }
  let user = DB.getUser(req.params.username);
  if (user.length == 0) {
    res.sendStatus(401);
    return;
  }
  
  res.send(await DB.getProjects(req.params.username));
});




app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});