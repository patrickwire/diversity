PATH = {
    IMG : './graphics/',
    SFX : './sfx/',
    TMX : './tmx/'
};

exports.tmxTileset = "./data/tiles1.png";
exports.tmxFile = "./data/rage1.tmx";
exports.walkableTiles = "walkable";
exports.fallableTiles = "fallable";
exports.spawnTiles = "spawn";

exports.mapsPerPlayer = 2;
exports.graphics = {
    player:PATH.IMG + 'player.png',
    bullet:PATH.IMG + 'bullet.png'
};
exports.moods = ['anger', 'fear', 'sadness', 'confusion', 'denial'];
exports.moodGraphicsOrder = {
    anger: 0,
    fear: 1,
    sadness: 2,
    confusion: 3,
    denial: 4
};
exports.moodColors = {
    anger: "red",
    fear: "green",
    sadness: "blue",
    confusion: "yellow",
    denial: "DarkOrchid"
};
exports.map={width:992,height:992};
exports.directions={LEFT:1,RIGHT:3,UP:2,DOWN:4};
exports.directionOffset={vertical:-3,horizontal:-2};
exports.player={
    speed:20,
    startingHitpoints: 3
};
exports.bullet={
    speed:20
};
