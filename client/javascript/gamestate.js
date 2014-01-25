var gamejs = require('gamejs');
var MapDB = require('mapDB').MapDB;
var constants = require('constants');

exports.currentView = null;
exports.display = null;
exports.mapDB = null;

exports.loadView = function(View) {
    exports.currentView = new View(exports.display);
    gamejs.onEvent(exports.currentView.onEvent);
    gamejs.onTick(exports.currentView.onTick);
};

exports.initialize = function() {
    exports.display = gamejs.display.setMode([600, 400]);
    exports.mapDB = new MapDB(constants.tmxFile);
};
