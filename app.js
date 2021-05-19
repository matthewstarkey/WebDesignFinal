"use strict";
const sq3 = require('sqlite3');
const sq = require('sqlite');
const express = require('express');
const app = express();
const multer = require('multer');

const NUM_OF_SCENARIOS = 37;
const UNIQUE_ID_ADD = 100;

const SERVER_ERROR = 500;
const CLIENT_ERROR = 400;
const OK = 200;
const PORT_CODE = 8080;

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(multer().none());

app.get("/newGame", async function(req, res) {
  let name = req.query.name;
  let size = req.query.size;
  try {
    let db = await getDBConnection();
    let playerID = await checkName(db, name);
    let data = await setupGameState(db, playerID, name, size);
    await db.close();
    res.json(data);
  } catch (err) {
    res.status(SERVER_ERROR).json({"error": "There was an issue with the server. Error: " + err});
  }

});

app.post("/selectScenario", async function(req, res) {
  let gameID = parseInt(req.body.game_id);
  let scenarioID = parseInt(req.body['scenario-id']);
  try {
    let db = await getDBConnection();
    let scenarioQRY =
    "SELECT given_scenario_ids, selected_scenario_ids FROM game_state WHERE game_id=?";
    let scenario = await db.all(scenarioQRY, [gameID]);
    let selected = JSON.parse(scenario[0].selected_scenario_ids);
    let given = JSON.parse(scenario[0].given_scenario_ids);
    if (!containsGiven(scenarioID, selected) && containsGiven(scenarioID, given)) {
      selected.push(scenarioID);
      selected = JSON.stringify(selected);
      let qry = "UPDATE game_state SET selected_scenario_ids=? WHERE game_id=?";
      await db.run(qry, [selected, gameID]);
      await db.close();
      res.json({"game_id": gameID, "scenario_id": scenarioID});
    } else {
      await db.close();
      let error = {"error": "Could not select scenario ID: " + scenarioID};
      res.status(CLIENT_ERROR).json(error);
    }
  } catch (err) {
    res.status(SERVER_ERROR).json({"error": "There was an issue with the server. Error: " + err});
  }
});

app.post("/bingo", async function(req, res) {
  let gameID = parseInt(req.body.game_id);
  try {
    let db = await getDBConnection();
    let qry =
    "SELECT given_scenario_ids, selected_scenario_ids, player_id FROM game_state WHERE game_id=?";
    let winnerQry = "SELECT winner FROM games WHERE id=?";
    let data = await db.all(qry, [gameID]);
    let winner = await db.all(winnerQry, [gameID]);
    let playerID = data[0].player_id;
    let player = await getPlayer(db, playerID);
    let boardSize = JSON.parse(data[0].given_scenario_ids).length;
    let selectedSize = JSON.parse(data[0].selected_scenario_ids).length;
    await db.close();
    if (player === winner[0].winner) {
      res.status(OK).json({"error": "Game has already been won."});
    } else {
      let response = await checkBingo(boardSize, selectedSize, gameID, playerID);
      res.json(response);
    }
  } catch (err) {
    res.status(SERVER_ERROR).json({"error": "There was an issue with the server. Error: " + err});
  }
});

app.get("/resumeGame", async function(req, res) {
  let gameID = parseInt(req.query.game_id);
  let playerID = parseInt(req.query.player_id);
  try {
    let db = await getDBConnection();
    let qry = "SELECT * FROM game_state WHERE game_id=?";
    let data = await db.all(qry, [gameID]);
    if (data[0].player_id !== playerID) {
      await db.close();
      let error = "Cannot resume game: Player " + playerID + " was not part of game " + gameID;
      res.status(CLIENT_ERROR).json({"error": error});
    } else {
      let name = await getPlayer(db, playerID);
      let response = {
        "game_id": gameID,
        "player": {
          "id": playerID,
          "name": name,
          "board": [],
          "selected_scenarios": JSON.parse(data[0].selected_scenario_ids)
        }
      };
      response.player.board = await generateScenarios(db, JSON.parse(data[0].given_scenario_ids));
      await db.close();
      res.json(response);
    }
  } catch (err) {
    res.status(SERVER_ERROR).json({"error": "There was an issue with the server. Error: " + err});
  }
});

app.use(express.static('public'));
const PORT = process.env.PORT || PORT_CODE;
app.listen(PORT);

/**
 * Helper func to query data from database, inserts new player data to db
 * creates new game state data and then returns JSON back to app node
 * @param {Object} db database object to insert / query data
 * @param {Number} playerID id of player
 * @param {String} name name of player
 * @param {String} size number of squares on game board
 * @returns {Object} JSON of data to send to client
 */
async function setupGameState(db, playerID, name, size) {
  let gameQry = 'INSERT INTO games (winner) VALUES (null)';
  let boardIDs = generateRandomBoardID(size);
  createUniqueIDs(boardIDs);
  let scenarios = await generateScenarios(db, boardIDs);
  let game = await db.run(gameQry);
  let gameID = game.lastID;
  let data = {
    "game_id": gameID,
    "player": {
      "id": playerID,
      "name": name,
      "board": []
    }
  };
  data.player.board = scenarios;
  let boardJSON = JSON.stringify(boardIDs);
  let gameStateQry =
  "INSERT INTO game_state (game_id, player_id, given_scenario_ids) VALUES (?, ?, ?);";
  await db.run(gameStateQry, [gameID, playerID, boardJSON]);
  return data;
}

/**
 * checks to make sures given scenarioID isnt in selected
 * @param {Number} scenarioID unique id of scenario
 * @param {Array} selected json containing data on scenarios
 * @returns {Boolean} if scenarioID is contained in selected scenarios
 */
function containsGiven(scenarioID, selected) {
  for (let i = 0; i < selected.length; i++) {
    if (selected[i] === scenarioID) {
      return true;
    }
  }
  return false;
}

/**
 * Checks if name is in database, if not creates new player id
 * @param {Object} db database object
 * @param {String} name name of user (that they inputted)
 * @returns {Number} users ID
 */
async function checkName(db, name) {
  let player = await db.all('SELECT id FROM players WHERE name=?', [name]);
  let playerID = null;
  if (player.length >= 1) {
    playerID = player[0].id;
  } else {
    let newPlayer = await db.run('INSERT INTO players (name) VALUES (?)', [name]);
    playerID = newPlayer.lastID;
  }
  return playerID;
}

/**
 * Edits scenarios IDs to be unique on board by adding 100 to equivalent base IDs
 * This is a relatively exhaustive algorithm.
 * @param {Array} scenarios list of scenario IDs
 */
function createUniqueIDs(scenarios) {
  for (let i = 0; i < scenarios.length; i++) {
    let id = scenarios[i];
    let count = 0;

    // here we assume any previous ith elems are now unique
    for (let j = i + 1; j < scenarios.length; j++) {
      if (id === scenarios[j]) {
        count++;
        scenarios[j] += (UNIQUE_ID_ADD * count);
      }
    }
  }
}

/**
 * Generates a random game board depending on size of board
 * contains scenario IDs to be returned to client
 * In order as they should display on board (left -> right)
 * @param {Integer} size number of board children elements
 * @returns {Array} array of board scenarios IDs
 */
function generateRandomBoardID(size) {
  let board = [];

  // first half of board
  for (let i = 0; i < Math.floor(size / 2); i++) {
    let randomInt = getRandomInt(NUM_OF_SCENARIOS) + 2;
    board.push(randomInt);
  }

  // required middle FREE scenario
  board.push(1);

  // second half
  for (let i = 0; i < Math.floor(size / 2); i++) {
    // returns between 2 and 39
    let randomInt = getRandomInt(NUM_OF_SCENARIOS) + 2;
    board.push(randomInt);
  }
  return board;
}

/**
 * takes array of scenario IDS and returns array of scenarios
 * (In same order as IDs in board)
 * @param {Object} db database object to query data from
 * @param {Array} board list of scenario IDs
 * @returns {Array} list of scenario JSON in order of display on board
 */
async function generateScenarios(db, board) {
  let scenario = [];
  for (let i = 0; i < board.length; i++) {
    let id = board[i];
    let text = await getScenarioById(db, id);
    let data = {"id": id, "text": text};
    scenario.push(data);
  }
  return scenario;
}

/**
 * Takes ID of scenario text, converts to real ID and returns scenario text
 * @param {Object} db database object to query
 * @param {Number} id fake Id (sometimes >100) of scenario.
 * @returns {String} text of scenario
 */
async function getScenarioById(db, id) {
  let qry = "SELECT text FROM scenarios WHERE id=?";
  while (id > UNIQUE_ID_ADD) {
    id -= UNIQUE_ID_ADD;
  }
  let text = await db.all(qry, [id]);
  return text[0].text;
}

/**
 * query database for player's name and returns
 * @param {Object} db database object to query
 * @param {Number} playerID id of player
 * @returns {String} name of player
 */
async function getPlayer(db, playerID) {
  let qry = "SELECT name FROM players WHERE id=?";
  let player = await db.all(qry, [playerID]);
  return player[0].name;
}

/**
 * checks if there is a bingo and updates games table in db if bingo
 * @param {Number} boardSize size of whole board
 * @param {Number} selectedSize number of selected squares
 * @param {Number} gameID id of game
 * @param {Number} playerID id of player
 * @returns {JSON} response to send to client
 */
async function checkBingo(boardSize, selectedSize, gameID, playerID) {
  let data = {};
  if (selectedSize < Math.sqrt(boardSize)) {
    data = {
      "game_id": gameID,
      "winner": null
    };
  } else {
    let db = await getDBConnection();
    let player = await getPlayer(db, playerID);
    let qry = "UPDATE games SET winner=? WHERE id=?";
    await db.run(qry, [player, gameID]);
    await db.close();
    data = {
      "game_id": gameID,
      "winner": player
    };
  }
  return data;
}

/**
 * returns a random integer from 0 to inputted max
 * @return {Integer} random integer from 0 - max
 * @param {Integer} max maximum num that can be returned
 */
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

/**
 * Establishes a connection to database storing all game and user data
 * All errors should be caught by the function calling this one.
 * @returns {Object} The database object from the established connections
 */
async function getDBConnection() {
  const db = await sq.open({
    filename: 'zoomingo.db',
    driver: sq3.Database
  });
  return db;
}