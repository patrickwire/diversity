var gamejs = require('gamejs');

exports.display = null;

exports.currentView = null;

exports.loadView = function(View) {
    exports.currentView = new View(exports.display);
    gamejs.onEvent(exports.currentView.onEvent);
    gamejs.onTick(exports.currentView.onTick);
};

