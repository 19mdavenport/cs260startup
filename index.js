const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();

const port = process.argv.length > 2 ? process.argv[2] : 4000;

app.use(express.json());
app.use(cookieParser());
app.use(express.static('ui/public'));
var apiRouter = express.Router();
app.use(`/api`, apiRouter);

apiRouter.post('/user', (req, res) => {
  if (!req.body.username || !req.body.password || !req.body.email) {
    res.sendStatus(400);
  }
  users[req.body.username] = req.body;

  users[req.body.username].groups = [{ id: 1, name: "CS 260" }, { id: 2, name: "[Class Name]" }];

  users[req.body.username].tasks = [{ id: 1, group: 1, name: "Startup HTML", due: new Date(2023, 8, 30, 23, 59) },
  { id: 2, group: 2, name: "Item 2", due: new Date(2023, 9, 30, 23, 59) },
  { id: 3, group: 2, name: "Item 3", due: new Date(2023, 9, 31, 23, 59) },
  { id: 4, group: 2, name: "Item 4", due: new Date(2023, 10, 1, 23, 59) },
  { id: 5, group: 2, name: "Item 5", due: new Date(2023, 10, 2, 23, 59) },
  { id: 6, group: 2, name: "Item 6", due: new Date(2023, 10, 3, 23, 59) },
  { id: 7, group: 2, name: "Item 7", due: new Date(2023, 10, 4, 23, 59) },
  { id: 8, group: 2, name: "Item 8", due: new Date(2023, 10, 5, 23, 59) }];

  users[req.body.username].projects = [{ id: 1, group: 1, name: "Startup HTML", hours: 3, due: new Date(2023, 9, 28, 23, 59) },
  { id: 2, group: 2, name: "Item 2", hours: 2, due: new Date(2023, 10, 3, 23, 59) },
  { id: 3, group: 2, name: "Item 3", hours: 13, due: new Date(2023, 10, 5, 23, 59) },
  { id: 4, group: 2, name: "Item 4", hours: 4, due: new Date(2023, 10, 7, 23, 59) },
  { id: 5, group: 2, name: "Item 5", hours: 7, due: new Date(2023, 10, 9, 23, 59) },
  { id: 6, group: 2, name: "Item 6", hours: 23, due: new Date(2023, 10, 11, 23, 59) }];

});

apiRouter.get('/session', (req, res) => {
  if (!req.body.username || !req.body.password) {
    res.sendStatus(400);
  }
  let user = users[req.body.username];

  if(!user || user.password !== req.body.password) {
    res.sendStatus(401);
  }
});



apiRouter.put('/group/:username', (req, res) => {
  if (!req.body.username) {
    res.sendStatus(400);
  }
  let user = users[req.body.username];
  if(!user) {
    res.sendStatus(401);
  }
  user.groups.push(req.body)
});

apiRouter.get('/group/:username', (req, res) => {
  if (!req.body.username) {
    res.sendStatus(400);
  }
  let user = users[req.body.username];
  if(!user) {
    res.sendStatus(401);
  }
  res.send(user.group)
});




apiRouter.put('/task/:username', (req, res) => {
  if (!req.body.username) {
    res.sendStatus(400);
  }
  let user = users[req.body.username];
  if(!user) {
    res.sendStatus(401);
  }
  user.tasks.push(req.body)
});

apiRouter.get('/task/:username', (req, res) => {
  if (!req.body.username) {
    res.sendStatus(400);
  }
  let user = users[req.body.username];
  if(!user) {
    res.sendStatus(401);
  }
  res.send(user.tasks)
});



apiRouter.put('/project/:username', (req, res) => {
  if (!req.body.username) {
    res.sendStatus(400);
  }
  let user = users[req.body.username];
  if(!user) {
    res.sendStatus(401);
  }
  user.projects.push(req.body)
});

apiRouter.get('/project/:username', (req, res) => {
  if (!req.body.username) {
    res.sendStatus(400);
  }
  let user = users[req.body.username];
  if(!user) {
    res.sendStatus(401);
  }
  res.send(user.projects)
});



// app.use((_req, res) => {
//   res.sendFile('index.html', { root: 'ui/public' });
// });

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

let users = {};