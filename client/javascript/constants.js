PATH = {
    IMG : './graphics/',
    SFX : './sfx/',
    TMX : './tmx/'
};

exports.tmxTileset = "./data/tiles1.png";
exports.tmxFiles = {
    anger: [
        "./data/anger1.tmx",
        //"./data/anger2.tmx",
        "./data/anger3.tmx",
        //"./data/anger4.tmx"
    ],

    fear: [
        "./data/fear1.tmx",
        //"./data/fear2.tmx",
        "./data/fear3.tmx",
        //"./data/fear4.tmx"
    ],

    sadness: [
        "./data/sadness1.tmx",
        //"./data/sadness2.tmx",
        "./data/sadness3.tmx",
        //"./data/sadness4.tmx"
    ],

    confusion: [
        "./data/confusion1.tmx",
        //"./data/confusion2.tmx",
        "./data/confusion3.tmx",
        //"./data/confusion4.tmx"
    ],

    denial: [
        "./data/denial1.tmx",
        "./data/denial2.tmx"
    ]
};

exports.tmxHappyLevel = "./data/final.tmx";
exports.walkableTiles = "walkable";
exports.fallableTiles = "fallable";
exports.spawnTiles = "spawn";

exports.mapsPerPlayer = 2;
exports.graphics = {
    player:PATH.IMG + 'player.png',
    vignette:PATH.IMG + 'vignette.png',
    vignette_w:PATH.IMG + 'vignette_w.png',
    splash:PATH.IMG + 'splash.png',
    intro:PATH.IMG + 'intro.png',
    outro:PATH.IMG + 'outro.png'
};
exports.moods = ['anger', 'fear', 'sadness', 'confusion', 'denial'];
exports.moodGraphicsOrder = {
    anger: 0,
    fear: 1,
    sadness: 2,
    confusion: 3,
    denial: 4,
    happy: 5
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
    speed:100,
    startingHitpoints: 3,
    maxBullets: 3,
    wallhitsTillAnger: 10,
    millisecondsTillSadness: 60 * 1000,
    millisecondsTillConfusionWon: 10 * 1000, // must be smaller than ..tillSadness
    maxDistanceToOthersForSadnessWin: 50     // pixels
};
exports.bullet={
    speed:50
};
