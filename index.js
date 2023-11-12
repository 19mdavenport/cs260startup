const express = require('express');
const app = express();

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
  users[req.body.username] = req.body;

  users[req.body.username].groups = [{ id: 1, name: "CS 260" }, { id: 2, name: "[Class Name]" }];

  users[req.body.username].tasks = [{ id: 1, group: 1, name: "Startup HTML", due: new Date(2023, 8, 30, 23, 59) },
  { id: 2, group: 2, name: "Item 2", due: new Date(2023, 10, 11, 23, 59) },
  { id: 3, group: 2, name: "Item 3", due: new Date(2023, 10, 13, 23, 59) },
  { id: 4, group: 2, name: "Item 4", due: new Date(2023, 10, 14, 23, 59) },
  { id: 5, group: 2, name: "Item 5", due: new Date(2023, 10, 15, 23, 59) },
  { id: 6, group: 2, name: "Item 6", due: new Date(2023, 10, 16, 23, 59) },
  { id: 7, group: 2, name: "Item 7", due: new Date(2023, 10, 17, 23, 59) },
  { id: 8, group: 2, name: "Item 8", due: new Date(2023, 10, 18, 23, 59) }];

  users[req.body.username].projects = [{ id: 1, group: 1, name: "Startup HTML", hours: 3, due: new Date(2023, 9, 28, 23, 59) },
  { id: 2, group: 2, name: "Item 2", hours: 2, due: new Date(2023, 10, 15, 23, 59) },
  { id: 3, group: 2, name: "Item 3", hours: 13, due: new Date(2023, 10, 17, 23, 59) },
  { id: 4, group: 2, name: "Item 4", hours: 4, due: new Date(2023, 10, 19, 23, 59) },
  { id: 5, group: 2, name: "Item 5", hours: 7, due: new Date(2023, 10, 21, 23, 59) },
  { id: 6, group: 2, name: "Item 6", hours: 23, due: new Date(2023, 10, 24, 23, 59) }];

  res.sendStatus(200);
});

apiRouter.post('/session', (req, res) => {
  if (!req.body.username || !req.body.password) {
    res.sendStatus(400);
    return;
  }
  let user = users[req.body.username];

  if(!user || user.password !== req.body.password) {
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
  let user = users[req.params.username];
  if(!user) {
    res.sendStatus(401);
    return;
  }
  user.groups.push(req.body);
  res.sendStatus(200);
});

apiRouter.get('/group/:username', (req, res) => {
  if (!req.params.username) {
    res.sendStatus(400);
    return;
  }
  let user = users[req.params.username];
  if(!user) {
    res.sendStatus(401);
    return;
  }
  res.send(user.groups);
});




apiRouter.put('/task/:username', (req, res) => {
  if (!req.params.username) {
    res.sendStatus(400);
    return;
  }
  let user = users[req.params.username];
  if(!user) {
    res.sendStatus(401);
    return;
  }
  user.tasks.push(req.body);
  res.sendStatus(200);
});

apiRouter.get('/task/:username', (req, res) => {
  if (!req.params.username) {
    res.sendStatus(400);
    return;
  }
  let user = users[req.params.username];
  if(!user) {
    res.sendStatus(401);
    return;
  }
  res.send(user.tasks);
});



apiRouter.put('/project/:username', (req, res) => {
  if (!req.params.username) {
    res.sendStatus(400);
    return;
  }
  let user = users[req.params.username];
  if(!user) {
    res.sendStatus(401);
    return;
  }
  user.projects.push(req.body);
  res.sendStatus(200);
});

apiRouter.get('/project/:username', (req, res) => {
  if (!req.params.username) {
    res.sendStatus(400);
    return;
  }
  let user = users[req.params.username];
  if(!user) {
    res.sendStatus(401);
    return;
  }
  res.send(user.projects);
});




app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

let users = {};