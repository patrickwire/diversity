var gamejs = require('gamejs');
var GameView = require('game').View;
var state = require('gamestate');

exports.View = function(display) {

  var registered = false;
  var numPlayers;
  var ourID;

  var connection = new WebSocket('ws://' + window.location.hostname + ':8080');
  connection.onopen = function() {console.log("onopen");};
  connection.onmessage = function(message) {
    var data = JSON.parse(message.data);
    console.log(message.data);
    switch (data.type) {
      case "RegistrationSuccessful":
        registered = true;
        numPlayers = data.currentPlayersWaiting;
        ourId = data.id;
        break;
      case "PlayersWaitingUpdate":
        numPlayers = data.currentPlayersWaiting;
        break;
      case "GameAlreadyRunning":
        alert("Game is already running, sorry");
        break;
      case "GameStarting":
        alert("not implemented");
        break;
      default:
        alert("Unknown message");
    }
  };
  connection.onclose = function() {throw "connection should not be closed";};
  connection.onerror = function() {throw "errors should not occur";};

  this.onTick = function() {
    display.clear();

    if (!registered) {
      display.blit((new gamejs.font.Font('30px Sans-serif')).render('Registering at server'));
    } else {
      var message = 'Waiting for other players...';
      if (numPlayers > 1) {
        message += " (" + numPlayers + " in Pool)";
      }
      display.blit((new gamejs.font.Font('30px Sans-serif')).render(message));

      display.blit((new gamejs.font.Font('20px Sans-serif')).render("Press enter to start"), [50, 50]);
    }
  };

  this.onEvent = function(event) {
    if (event.type === gamejs.event.KEY_DOWN &&
        event.key === gamejs.event.K_ENTER) {
      if (numPlayers >= 2) {
        connection.send(JSON.stringify({type: "StartGame"}));
        state.loadView(GameView);
      }
    }
  };

  return this;
};
