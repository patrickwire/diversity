PATH = {
    IMG : './graphics/',
    SFX : './sfx/',
    TMX : './tmx/'
}

exports.tmxTileset = "./data/tileset.png";
exports.tmxFile = "./data/maps.tmx";
exports.mapsPerPlayer = 1;
exports.graphics = {
    player:PATH.IMG + 'player.png'
}
exports.map={width:800,height:600}
exports.directions={LEFT:3,RIGHT:1,UP:2,DOWN:4}
exports.directionOffset={vertical:-3,horizontal:-2}
exports.player={
    speed:20
}