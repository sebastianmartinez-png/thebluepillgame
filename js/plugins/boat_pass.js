Game_Map.prototype.isBoatPassable = function(x, y) {
    return this.terrainTag(x, y) === 1;
};
Game_Map.prototype.isShipPassable = function(x, y) {
    return this.terrainTag(x, y) === 1;
};