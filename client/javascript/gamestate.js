var gamejs = require('gamejs');

exports.currentView = null;
exports.display = null;

exports.loadView = function(View) {
    exports.currentView = new View(exports.display);
    gamejs.onEvent(exports.currentView.onEvent);
    gamejs.onTick(exports.currentView.onTick);
};

exports.initialize = function() {
    exports.display = gamejs.display.setMode([600, 400]);
};
