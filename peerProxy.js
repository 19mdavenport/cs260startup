const { WebSocketServer } = require('ws');
const uuid = require('uuid');

function peerProxy(httpServer) {
  // Create a websocket object
  const wss = new WebSocketServer({ noServer: true });

  // Handle the protocol upgrade from HTTP to WebSocket
  httpServer.on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, function done(ws) {
      wss.emit('connection', ws, request);
    });
  });

  // Keep track of all the connections so we can forward messages
  //let connections = [];
  let nextId = 1;
  let waiting = null;
  let games = {};

  wss.on('connection', (ws) => {
    const connection = { id: uuid.v4(), alive: true, ws: ws };
    //connections.push(connection);

    // Forward messages to everyone except the sender
    ws.on('message', function message(data) {
      console.log(data);
      let msg = JSON.parse(data);
      if (msg.type === "join") {
        if (waiting === null) {
          waiting = connection;
        }
        else {
          let opponent = waiting;
          waiting = null;
          let game = { playerOne: opponent, playerTwo: connection, id: nextId, game: Array.from(Array(10), () => new Array(10).fill(0)) };
          games[nextId] = game;
          nextId++;
          let loadGame = { game: game.game, id: game.id, type: "load" };
          let loadGameMessage = JSON.stringify(loadGame);
          ws.send(loadGameMessage);
          opponent.ws.send(loadGameMessage);
        }
      }
      else if (msg.type === "claim") {
        if (!msg.row || !msg.col || !msg.gameId) {
          ws.send(JSON.parse({ message: "Error: bad input", type: "error" }));
          return;
        }
        let game = games[msg.gameId];
        if (game.game[msg.row][msg.col] != 0) {
          ws.send(JSON.parse({ message: "Error: spot already taken", type: "error" }));
          return;
        }
        if (game.playerOne === connection) {
          game.game[msg.row][msg.col] = 1;
        }
        else if (game.playerOne === connection) {
          game.game[msg.row][msg.col] = 2;
        }

        let over = gameOver(game.game);
        if (over === 0) {
          let loadGame = { game: game.game, id: game.id, type: "load" };
          let loadGameMessage = JSON.stringify(loadGame);
          playerOne.ws.send(loadGameMessage);
          playerTwo.ws.send(loadGameMessage);
        }
        else {
          if (over === 1) {
            playerOne.ws.send(JSON.stringify({ message: "You win!", type: "game over" }));
            playerTwo.ws.send(JSON.stringify({ message: "You lose", type: "game over" }));
          }
          else if (over === 1) {
            playerTwo.ws.send(JSON.stringify({ message: "You win!", type: "game over" }));
            playerOne.ws.send(JSON.stringify({ message: "You lose", type: "game over" }));
          }
          games[msg.gameId] = null;
        }
      }
    });

    // Remove the closed connection so we don't try to forward anymore
    ws.on('close', () => {
      for (const gameId in games) {
        let game = games[gameId];
        if (game.playerOne === connection) {
          game.playerTwo.ws.send(JSON.stringify({ message: "Opponent concedes. You win!", type: "game over" }));
          game.playerTwo.ws.terminate();
          games[gameId] = null;
        }
        if (game.playerTwo === connection) {
          game.playerOne.ws.send(JSON.stringify({ message: "Opponent concedes. You win!", type: "game over" }));
          game.playerOne.ws.terminate();
          games[gameId] = null;
        }
      }
    });

    // Respond to pong messages by marking the connection alive
    ws.on('pong', () => {
      connection.alive = true;
    });
  });

  function checkAlive(c) {
    if (!c.alive) {
      c.ws.terminate();
    } else {
      c.alive = false;
      c.ws.ping();
    }
  }

  // Keep active connections alive
  setInterval(() => {
    for (const gameId in games) {
      // Kill any connection that didn't respond to the ping last time
      if (games[gameId] != null) {
        checkAlive(games[gameId].playerOne);
        checkAlive(games[gameId].playerTwo);
      }
    }
    if (waiting != null) {
      checkAlive(waiting);
    }
  }, 10000);
}

function gameOver(game,) {
  debugger;
  let visited = Array.from(Array(10), () => new Array(10).fill(false));
  visit(1, 1, 1, visited, game);
  visit(3, 1, 1, visited, game);
  visit(5, 1, 1, visited, game);
  visit(7, 1, 1, visited, game);
  visit(9, 1, 1, visited, game);

  if (visited[1][9] || visited[3][9] || visited[5][9] || visited[7][9] || visited[9][9]) return 1;

  visited = Array.from(Array(10), () => new Array(10).fill(false));
  visit(1, 1, 2, visited, game);
  visit(1, 3, 2, visited, game);
  visit(1, 5, 2, visited, game);
  visit(1, 7, 2, visited, game);
  visit(1, 9, 2, visited, game);


  if (visited[9][1] || visited[9][3] || visited[9][5] || visited[9][7] || visited[9][9]) return 2;

  return 0;
}

function visit(row, col, player, visited, game) {
  if (row > 9 || row < 1 || col > 9 || col < 1) return;
  if (visited[row][col]) return;
  if (game[row][col] != player) return;

  visited[row][col] = true;

  if ((player == 1 && row % 2 == 1)) {
    if (col < 8) visit(row, col + 2, player, visited, game);
    if (col > 2) visit(row, col - 2, player, visited, game);
  }
  else if (player == 2 && col % 2 == 1) {
    if (row < 8) visit(row + 2, col, player, visited, game);
    if (row > 2) visit(row - 2, col, player, visited, game);
  }
  if (col < 9 && row < 9) visit(row + 1, col + 1, player, visited, game);
  if (col < 9 && row > 1) visit(row + 1, col - 1, player, visited, game);
  if (col > 1 && row < 9) visit(row - 1, col + 1, player, visited, game);
  if (col > 1 && row > 1) visit(row - 1, col - 1, player, visited, game);

}

module.exports = { peerProxy };
