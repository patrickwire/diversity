PATH = {
    IMG : './graphics/',
    SFX : './sfx/',
    TMX : './tmx/'
}

exports.tmxTileset = "./data/tileset.png";
exports.tmxFile = "./data/maps.tmx";
exports.mapsPerPlayer = 1;
exports.graphics = {
    player:PATH.IMG + 'player.png',
    bullet:PATH.IMG + 'bullet.png'
}
exports.map={width:600,height:400}
exports.directions={LEFT:1,RIGHT:3,UP:2,DOWN:4}
exports.directionOffset={vertical:-3,horizontal:-2}
exports.player={
    speed:20
}