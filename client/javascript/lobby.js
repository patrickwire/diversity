var gamejs = require('gamejs');
var GameView = require('game').View;
var IntroView = require('intro').View;
var state = require('gamestate');
var constants =require('constants');

exports.View = function(display,realdisplay) {

  var registered = false;
  var numPlayers;
  var ourID;

  state.server.connect();
  state.server.onmessage = function(data) {
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
        state.loadView(IntroView);
        break;
      default:
        alert("Unknown message");
    }
  };

  this.onTick = function() {
    display.clear();

    if (!registered) {
      display.blit((new gamejs.font.Font('30px Sans-serif')).render('Registering at server',"rgba(255,255,255,1)"));
    } else {
      var message = 'Waiting for other players...';
      if (numPlayers > 1) {
        //display.blit((new gamejs.font.Font('20px Sans-serif')).render("Press enter to start","rgba(255,255,255,1)"), [50, 50]);
        message += " (" + numPlayers + " in Pool)";
      }
      display.blit((new gamejs.font.Font('30px Sans-serif')).render(message,"rgba(255,255,255,1)"));

    }
      realdisplay.clear();
      var image = gamejs.image.load(constants.graphics.splash);
      var surface = new gamejs.Surface(600, 360);
      surface.blit(image, [0, 0]);
      realdisplay.blit(surface, [0,0]);
      realdisplay.blit(display,[0,0],new gamejs.Rect([0,0], [992, 992]));
  };

  this.onEvent = function(event) {
    if (event.type === gamejs.event.KEY_DOWN &&
        event.key === gamejs.event.K_ENTER) {
      if (numPlayers >= 2) {
        state.server.connection.send(JSON.stringify({type: "StartGame"}));
      }
    }
  };

  return this;
};
