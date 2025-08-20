/*:
 * Event Terrain by Shaz
 * Ver 1.00 2019.01.17
 * Shaz_EventTerrain.js
 *
 *
 * @plugindesc Allow an event page to override the map's terrain.
 * @author Shaz
 *
 * @help This plugin allows you to give a terrain id to an event, so any
 * calls to check the terrain on an X/Y coordinate will return the terrain
 * specified on the event rather than the terrain on the map tile.  If there
 * is no event on that tile, or the event doesn't have a terrain override
 * on that page, the map tile will be used.
 *
 * USAGE:
 * Add <terrain:x> as a comment to an event page, where x is a number, to have
 * that event page mimic that terrain ID.
 * 
 * This will allow you to use more terrains than the 7 available in the 
 * editor.
 *
 * Example:
 * <terrain:1> in a comment on an event will override any tile that event is
 * on to have terrain 1 instead of what is specified by the map.
 *
 * NOTE:
 * This plugin has no plugin commands.
 *
 */

var Imported = Imported || {};
Imported.Shaz_EventTerrain = true;

var Shaz = Shaz || {};
Shaz.ET = Shaz.ET || {};
Shaz.ET.Version = 1.00;

(function() {

    var _Shaz_ET_Game_Event_initMembers = Game_Event.prototype.initMembers;
    Game_Event.prototype.initMembers = function() {
        _Shaz_ET_Game_Event_initMembers.call(this);
        this._terrainId = null;
    };

    var _Shaz_ET_Game_Event_clearPageSettings = Game_Event.prototype.clearPageSettings;
    Game_Event.prototype.clearPageSettings = function() {
        _Shaz_ET_Game_Event_clearPageSettings.call(this)
        this._terrainId = null;
    };

    var _Shaz_ET_Game_Event_setupPageSettings = Game_Event.prototype.setupPageSettings;
    Game_Event.prototype.setupPageSettings = function() {
        _Shaz_ET_Game_Event_setupPageSettings.call(this);

        this._terrainId = null;
        if (this.page() && this.list()) {
            this.list().filter(function(cmd) {
                if ((cmd.code === 108 || cmd.code === 408) &&
                    cmd.parameters[0].match(/<terrain:\2*(\d+)>/)) {
                    this._terrainId = parseInt(RegExp.$1);
                }
            }.bind(this));
        }
    };

    Game_Event.prototype.terrainId = function() {
        return this._terrainId;
    }

    var _Shaz_ET_Game_Map_terrainTag = Game_Map.prototype.terrainTag;
    Game_Map.prototype.terrainTag = function(x, y) {
        var event = this.eventsXy(x, y)[0];
        if (event && event.terrainId()) {
            return event.terrainId();
        } else {
            return _Shaz_ET_Game_Map_terrainTag.call(this, x, y);
        }
    }
})();