var gamejs = require('gamejs');
var MapDB = require('mapDB').MapDB;
var constants = require('constants');

gamestate = exports;

exports.currentView = null;
exports.display = null;
exports.mapDB = null;

exports.loadView = function(View) {
    exports.currentView = new View(exports.display);
    gamejs.onEvent(exports.currentView.onEvent);
    gamejs.onTick(exports.currentView.onTick);
};


exports.initialize = function() {
    exports.display = gamejs.display.setMode([constants.map.width, constants.map.height]);
    exports.mapDB = new MapDB(constants.tmxFile);
};

exports.server = {
    connection: null,
    onerror: null,
    onmessage: null,
    onclose: null,
    ourId: null
};
exports.server.connect = function() {
    exports.server.connection = new WebSocket('ws://' + window.location.hostname + ':8080');
    exports.server.connection.onmessage = function(message) {
        var data = JSON.parse(message.data);
        if (data.type === "RegistrationSuccessful") {
            exports.server.ourId = data.id;
        }

        if (exports.server.onmessage) {
            exports.server.onmessage(data);
        } else {
            alert("Got message but nobody listens!");
        }
    };
    exports.server.connection.onerror = function(error) {
        alert("Got error!");
        if (exports.server.onerror) {
            exports.server.onerror();
        }
    };
    exports.server.connection.onclose = function(close) {
        alert("Got close!");
        if (exports.server.onclose) {
            exports.server.onclose();
        }
    };
};

