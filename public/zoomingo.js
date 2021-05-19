"use strict";
(function() {
  const TIME_DELAY = 10000;

  window.addEventListener('load', init);

  /**
   * Initiziales events post window loading
   * checks if user has already visisted page on browser
   * if so: gives option to resume most recent game
   */
  function init() {
    id("new-game").addEventListener('click', startGame);
    id("size-select").addEventListener('change', editBoardSize);
    id('reset').addEventListener('click', resetBoard);
    let resume = id('resume');
    let bingo = id('bingo');
    bingo.addEventListener('click', fetchBingo);
    bingo.disabled = true;
    resume.addEventListener('click', resumeGame);
    let gameID = window.localStorage.getItem('game_id');
    let playerID = window.localStorage.getItem('player_id');
    if (gameID && playerID) {
      resume.disabled = false;
    }
  }

  /**
   * checks if user correctly put data on game
   * if so adds data to backend and fetches a gameboard
   * Will always generate a new user in backend database
   */
  function startGame() {
    let isValidInput = checkIfValidInputs();
    if (isValidInput) {
      editBoardSize();
      id('bingo').disabled = false;
      id('resume').disabled = true;
      id('name').disabled = true;
      id('size-select').disabled = true;
      id('new-game').disabled = true;
      let URL = "/newGame";
      let numOfSqs = getSelected(id("size-select"));
      let name = id("name").value;
      let params = "?name=" + name + "&size=" + numOfSqs;
      fetch(URL + params)
        .then(checkStatus)
        .then(data => data.json())
        .then(checkSquares)
        .catch(displayError);
    }
  }

  /**
   * Edits game board to selected size whenever is changed
   * (before game starts OR if user resumes game)
   * Doesn't handle any selecting functions on board
   * Only displays blank cards
   */
  function editBoardSize() {
    let select = id("size-select");
    let board = id("board");
    board.innerHTML = "";
    let numOfSqs = getSelected(select);
    for (let i = 0; i < numOfSqs; i++) {
      let square = document.createElement('div');
      let text = document.createElement('p');
      text.textContent = " ";
      square.classList.add("square");
      text.classList.add("scenario");
      text.addEventListener('click', selectSquare);
      square.appendChild(text);
      board.appendChild(square);
      let className = "square-" + numOfSqs;
      square.classList.add(className);
    }
  }

  /**
   * Takes returned board data and places onto squares and into local storage
   * @param {JSON} gameData JSON data on player, board, and game
   */
  function populateSquares(gameData) {
    window.localStorage.setItem('game_id', gameData.game_id);
    window.localStorage.setItem('player_id', gameData.player.id);
    let textSquares = qsa(".scenario");
    let board = gameData.player.board;
    for (let i = 0; i < textSquares.length; i++) {
      textSquares[i].addEventListener('click', selectSquare);
      textSquares[i].textContent = board[i].text;
      textSquares[i].id = board[i].id;
    }
  }

  /**
   * updates backend with users input, visually updates DOM
   * to display they made a click on square
   */
  function selectSquare() {
    let data = new FormData();
    let square = this;
    data.append("game_id", window.localStorage.getItem("game_id"));
    data.append("scenario-id", square.id);
    fetch("/selectScenario", {method: "POST", body: data})
      .then(checkStatus)
      .then(function() {
        square.removeEventListener('click', selectSquare);
        square.parentNode.classList.add("selected");
      })
      .catch(displayError);
  }

  /**
   * fetches users winning data (whether they won or not)
   */
  function fetchBingo() {
    let data = new FormData();
    data.append('game_id', window.localStorage.getItem("game_id"));
    fetch("/bingo", {method: "POST", body: data})
      .then(checkStatus)
      .then(resp => resp.json())
      .then(resp => displayWin(resp))
      .catch(displayError);
  }

  /**
   * fetches users gamedata from localstorage (most recent player on browser)
   */
  function resumeGame() {
    let gameID = window.localStorage.getItem('game_id');
    let playerID = window.localStorage.getItem('player_id');
    let URL = "/resumeGame?game_id=" + gameID + "&player_id=" + playerID;
    fetch(URL)
      .then(checkStatus)
      .then(resp => resp.json())
      .then(resp => continueGame(resp))
      .catch(displayError);
  }

  /**
   * Continues game from data
   * @param {JSON} gameData data on game board and player
   */
  function continueGame(gameData) {
    let board = gameData.player.board;
    let options = id("size-select").children;
    for (let i = 0; i < options.length; i++) {
      let optionValue = parseInt(options[i].value);
      if (optionValue === board.length) {
        options[i].selected = true;
      }
    }
    editBoardSize();
    populateSquares(gameData);
    let selectedBoard = gameData.player.selected_scenarios;
    let textSquares = qsa(".scenario");
    for (let i = 0; i < selectedBoard.length; i++) {
      for (let j = 0; j < textSquares.length; j++) {
        if (parseInt(textSquares[j].id) === selectedBoard[i]) {
          textSquares[j].parentNode.classList.add('selected');
        }
      }
    }
    id('name').value = gameData.player.name;
    id('resume').disabled = true;
    id('name').disabled = true;
    id('size-select').disabled = true;
    id('new-game').disabled = true;
  }

  /**
   * displays winner data if there is a winner. Else displays
   * that user has not yet won
   * @param {JSON} data game data on winner
   */
  function displayWin(data) {
    if (data.winner) {
      let msg = document.createElement('h2');
      msg.id = "win";
      msg.textContent = "Congrats, " + data.winner + ". You won! :)";
      let body = id('main-container');
      body.appendChild(msg);
      let textSquares = qsa(".scenario");
      for (let i = 0; i < textSquares.length; i++) {
        textSquares[i].removeEventListener('click', selectSquare);
      }
      id('name').disabled = false;
      id('size-select').disabled = false;
      id('new-game').disabled = false;
      id('bingo').disabled = true;
      setTimeout(function() {
        body.removeChild(msg);
      }, TIME_DELAY);
    } else {
      let msg = document.createElement('h2');
      msg.id = "loss";
      msg.textContent = "Sorry you did not win. You need more squares for a bingo.";
      let body = id('main-container');
      body.appendChild(msg);
      setTimeout(function() {
        body.removeChild(msg);
      }, TIME_DELAY);
    }
  }

  /**
   * displays error to screen
   */
  function displayError() {
    let msg = id('error');
    msg.textContent = "There was an error in server. Please try again later";
    msg.classList.remove('hidden');
    setTimeout(function() {
      msg.classList.add('hidden');
    }, TIME_DELAY);
  }

  /**
   * Resets game board and removes any locally stored data
   */
  function resetBoard() {
    id('error').classList.add('hidden');
    let body = id('main-container');
    if (id('loss')) {
      body.removeChild(id('loss'));
    } else if (id('win')) {
      body.removeChild(id('win'));
    }
    let board = id('board');
    board.innerHTML = "";
    id('name').disabled = false;
    id('size-select').disabled = false;
    id('resume').disabled = true;
    id('new-game').disabled = false;
    id('bingo').disabled = true;
    let storage = window.localStorage;
    storage.removeItem('game_id');
    storage.removeItem('player_id');
    id('error').classList.add('hidden');
  }

  // HELPER FUNCTIONS

  /**
   * checks if backend sent correct amount of scenarios
   * throws error if incorrect amount and displays error
   * if correct will display scenarios to board
   * @param {JSON} data gameboard data from newGame node
   */
  function checkSquares(data) {
    let requiredSquares = getSelected(id("size-select"));
    let board = data.player.board;
    if (parseInt(board.length) !== parseInt(requiredSquares)) {
      throw Error;
    } else {
      populateSquares(data);
    }
  }

  /**
   * iterates through select object and returns selected option's value
   * @param {Object} select select Object to iterate
   * @return {Number} value of selected option, in case of zoomingo always a num
   */
  function getSelected(select) {
    let options = select.children;
    for (let elem of options) {
      if (elem.selected) {
        return elem.value;
      }
    }
  }

  /**
   * Checks if there is valid inputs before game starts
   * @return {Boolean} Whether input was valid
   */
  function checkIfValidInputs() {
    let error = id('error');
    let nameLength = id("name").value.length;
    error.classList.add('hidden');
    let numOfSqs = getSelected(id("size-select"));
    if (numOfSqs === "0") {
      error.textContent = "Error: Please select a board size";
      error.classList.remove('hidden');
      id("board").innerHTML = "";
    } else if (nameLength === 0) {
      error.textContent = "Error: Please enter a name";
      error.classList.remove('hidden');
    } else {
      return true;
    }
    return false;
  }

  /**
   * Checks if data from server is valid
   * @return {Object} valid request promise from fetch
   * @param {Object} request from API server
   */
  function checkStatus(request) {
    if (request.ok) {
      return request;
    }
    throw Error("Error in request: " + request.statusText);
  }

  /**
   * returns the all objects under query of name
   * @param {String} name name of class/obj to request
   * @returns {Array} array of object that correlate to name
   */
  function qsa(name) {
    return document.querySelectorAll(name);
  }

  /**
   * Returns object with given id name
   * @param {String} name id name of wanted object
   * @returns {Object} DOM element that matches name
   */
  function id(name) {
    return document.getElementById(name);
  }
})();