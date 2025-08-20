//=============================================================================
// TAA_SubstituteSkill.js
// Author: taaspider
//=============================================================================

var TAA = TAA || {};
TAA.ssk = {};
TAA.ssk.Version = "1.0.0";
TAA.ssk.PluginName = "TAA_SubstituteSkill";
TAA.ssk.alias = {};

/*:
 * @target MV MZ
 *
 * @plugindesc [1.0.0] Create customized substitute skills
 * @author T. A. A. (taaspider)
 * @url http://taaspider.itch.io
 * 
 * @help
 * ============================================================================
 * Terms of Use
 * ============================================================================
 * Any plugins developed by taaspider are free for use for both commercial and 
 * noncommercial RPG Maker games, unless specified otherwise. Just remember to
 * credit "Taaspider".
 * 
 * Redistribution of parts or the whole of taaspider plugins is forbidden, unless
 * it comes from the official website: http://taaspider.itch.io. You are allowed 
 * to edit and change the plugin code for your own use, but you're definitely not 
 * allowed to sell or reuse any part of the code as your own. Although not 
 * required to use my plugins, a free copy of your game would be nice!
 * 
 * If you enjoy my work, consider offering a donation when downloading my plugins, 
 * or offering a monthly pledge to my Patreon account. It would be of great help!
 * Also, follow me on facebook to get firsthand news on my activities!
 *  Facebook: https://www.facebook.com/taaspider 
 *  Patreon: https://www.patreon.com/taaspider
 * 
 * =============================================================================
 * Introduction
 * =============================================================================
 * 
 * WARNING: This plugin requires RPG Maker MV 1.5.0 or above! Please make sure 
 * your RPG Maker MV software is up to date before using this plugin.
 * You don't need any specific version if you're using MZ.
 * 
 * -----------------------------------------------------------------------------
 * 
 * This plugin provides more control over the substitute effect. The engine default
 * allows only for a substitute character to cover for all its friend units at the
 * same time, but only when they are at low health. With TAA_SubstituteSkill you
 * can create more specific and flexible substitutions, like covering for a single
 * ally with no health limitations, having different substitutes for each skill
 * type, or even covering for an enemy unit.
 * 
 * =============================================================================
 * Substitution States
 * =============================================================================
 * 
 * Substitution is configured by creating specific states, that when applied to
 * a character turns the user who applies it its substitute for as long as that
 * state is active.
 * 
 * States have the following settings:
 *  - Type: This determines which skill type will be covered by the substitute.
 *          You can specify a comma separated list of types using their names or
 *          engine indexes. For example, the engine default types Magic and 
 *          Special. You can use their names as configured in the editor, or use
 *          their index according to their order: Magic is 1 and Special is 2.
 *          If you want the state to allow for normal attacks substitution just
 *          specify Normal or index 0. You can also specify all skill types by
 *          setting to "all" or -1. See some examples in the States Note Tags
 *          section.
 *          This is the only obligatory parameter.
 *  - Friendly Fire: This determines if the substitute will cover the target in 
 *          case they're being hit by their allies. For example, if this is set
 *          to true and a healer issues a healing skill to the target, the 
 *          substitute we'll be healed instead. If false, the substitution will 
 *          not occur.
 *          If not set, the default global parameter is used (which you can
 *          configure through the Plugin Manager).
 *  - Condition: This determines on which conditions the substitution can occur.
 *          For example, only allow the substitute to take over damage if the
 *          target's HP is below 50%, or if the target's health is greater than
 *          the substitute.
 *          If not set, the default global parameter is used (which you can
 *          configure through the Plugin Manager).
 * 
 * A character can have multiple substitution states at the same time, but only
 * one state will be active for each skill type. For example, if state A covers
 * for Magic, and state B covers for all (and A was inflicted after B), than
 * the character will be substituted by whoever inflicted A if it is hit by a 
 * magic skill, while whoever inflicted B will cover for anything else.
 * 
 * =============================================================================
 * Plugin Parameters
 * =============================================================================
 * 
 * There are just two parameters, which sets the default values for Friendly Fire
 * and Condition:
 * 
 *  - Substitute Friendly Fire
 *      If set to true, substitutes will also cover for any allies issued abilities
 *      as long as substitution conditions are met. If false, only enemy attacks
 *      are substituted. You can overwrite this config using States Note Tags.
 *  - Substitute Condition
 *      This sets a default condition to allow an applied substitution to happen.
 *      For example, only if the target HP is lower than the substitute HP, or the
 *      target health is below 50%, and so on.
 *      This is an eval clause, and the following special objects can be used:
 *          + a: access the attacker parameters like hp, mp, etc.
 *          + b: access the original target parameters;
 *          + c: access the substitute parameters;
 *          + v[n]: access the value from variable number n;
 *          + s[n]: access the value (true or false) from switch number n;
 *      Just remember that this condition must return true or false. If it is
 *      evaluated to anything other than that the condition will always fail.
 *      You can leave this parameter blank to have if you want default condition
 *      to always pass.
 * 
 * =============================================================================
 * State Note Tags
 * =============================================================================
 * 
 * State note tags are used to create substitute states and customize default
 * settings. The only mandatory tag is "type", which specifies which skill types
 * are affected by the substitution:
 *  <TAA_SSK: type:type1,type2,...,typeN>
 * type is a comma separated list of skill types. You can use skill type names
 * as they appear in the editor, or use their index. Here's some examples:
 *  <TAA_SSK: type:normal,Special>
 *      This tag enables the substitution for both normal and Special skills.
 *      Magic skills are not affected. One important thing to note though, is 
 *      that despite "normal" being case INSENSITIVE, any other skill types
 *      are case SENSITIVE, and they should be written exactly as they are set
 *      in the editor System tab.
 * 
 *  <TAA_SSK: type:0,2>
 *      Assuming the engine default config, this tag has the exact same meaning
 *      as the first one. The 0 index represent normal attacks, while 2 is the
 *      Special skill type index.
 * 
 *  <TAA_SSK: type:all>
 *  <TAA_SSK: type:-1>
 *      Both this tags render the same result: a substitution for all skill types.
 * 
 * To include a custom Friendly Fire or Condition settings, add the "friendFire"
 * and "condition" clauses to your tag, and separate each clause with a ';':
 *  <TAA_SSK: type:all; friendFire:true; condition:eval clause>
 * friendFire must be either "true" or "false", while condition is an eval clause.
 * As long as the type clause is present, you can add one or both of the others as
 * you like, just be sure to keep the proper order (first type, then friendFire and
 * last condition).
 * 
 * The following codes can be used inside a condition clause:
 *  + a: access the attacker parameters like hp, mp, etc.
 *  + b: access the original target parameters;
 *  + c: access the substitute parameters;
 *  + v[n]: access the value from variable number n;
 *  + s[n]: access the value (true or false) from switch number n;
 * 
 * Here's a few examples:
 *  <TAA_SSK: type:1; condition: b.hp < b.mhp/2 >
 *      This denotes a substitution for skill type 1 that only takes effect when
 *      the target's HP is below 50%.
 * 
 *  <TAA_SSK: type:Normal; friendFire:false; condition: c.hp > b.hp >
 *      This creates a state that allows substitution to normal attacks, won't allow
 *      substitution for ally issued skills and only takes place when the substitute's
 *      HP is higher than the targets.
 * 
 *  <TAA_SSK: type:Magic; friendFire:true>
 *      This state will allow substitutions only for magical attacks, and will also
 *      work against ally's moves.
 * 
 * State tags can also span multiple lines when inside the proper tags:
 *  <TAA_SSK>
 *  type:type1,type2,...,typeN
 *  friendFire:true|false
 *  condition:eval clause
 *  </TAA_SSK>
 * 
 * Here's how the three examples above would look like in a multi line format:
 *  <TAA_SSK>
 *  type:1
 *  condition: b.hp < b.mhp / 2
 *  </TAA_SSK>
 * 
 *  <TAA_SSK>
 *  type:Normal
 *  friendFire:false
 *  condition: c.hp > b.hp
 *  </TAA_SSK>
 * 
 *  <TAA_SSK>
 *  type:Magic
 *  friendFire:true
 *  </TAA_SSK>
 * 
 * =============================================================================
 * Skill Note Tags
 * =============================================================================
 * 
 * Skill note tags are way simpler, as their only setting is how likely the skill
 * is to ignore the substitution and hit the actual target:
 *  <TAA_SSK: N >
 * where N is a number between 0 and 100, being 0 always hit the substitute, and 
 * 100 always bypass him and hit the original target.
 * 
 * ============================================================================
 * Script Calls
 * ============================================================================
 * 
 * $gameSystem.sskIsFriendlyFireAllowed()
 *  Returns true if the global default friendly fire setting is enable, otherwise
 *  false.
 * 
 * $gameSystem.sskEnableFriendlyFire()
 *  Enables the global default friendly fire setting.
 * 
 * $gameSystem.sskDisableFriendlyFire()
 *  Disables the global default friendly fire setting.
 * 
 * $gameSystem.sskResetFriendlyFire()
 *  Resets the global default friendly fire setting to its original value.
 * 
 * $gameSystem.sskCondition()
 *  Returns the current global default substitution condition.
 * 
 * $gameSystem.sskUpdateCondition(newCondition)
 *  Sets the global default substitution condition to newCondition.
 * 
 * $gameSystem.sskResetCondition()
 *  Resets the global default substitution condition to its original value.
 * 
 * ============================================================================
 * Plugin Commands (MV)
 * ============================================================================
 * 
 * Substitute FriendFire enable
 * Substitute FriendFire disable
 * Substitute FriendFire reset
 *  Enable, disable or reset global default friendly fire setting.
 * 
 * Substitute Condition Set newCondition
 *  Updates the global default substitution condition to newCondition
 * 
 * Substitute Condition Reset
 *  Resets the global default substitution condition to its original value.
 * 
 * ============================================================================
 * Plugin Commands (MZ)
 * ============================================================================
 * 
 * Manage Friendly Fire
 *  Enable, disable or reset global default friendly fire settings.
 * 
 * Manage Substitution Condition
 *  Change or reset global default substitution condition.
 * 
 * ============================================================================
 * Changelog
 * ============================================================================
 *
 * Version 0.9.0:
 *  - Beta release
 * Version 1.0.0:
 *  - Fixed a bug for when a single state covers for more than one skill type;
 *  - Fixed a bug which would always have a substitute cover for friendly skills
 *    (unless a ignore tag was set);
 *  - Fixed a minor bug that could cause a substitute to cover for himself if
 *    he substitutes a target for a substitution skill issued by himself;
 * 
 * ============================================================================
 * End of Help
 * ============================================================================
 * 
 * 
 * =================================================================================
 * Commands (MZ)
 * =================================================================================
 * 
 * @command friendFire
 * @text Manage Friendly Fire
 * @desc Enable, disable or reset default global friendly fire settings.
 * 
 * @arg action
 * @text Action
 * @type select
 * @option Enable
 * @option Disable
 * @option Reset
 * @default Enable
 * @desc Select which action to take.
 * 
 * @command condition
 * @text Manage Substitution Condition
 * @desc Change or reset default global substitution condition.
 * 
 * @arg action
 * @text Action
 * @type select
 * @option Set
 * @option Reset
 * @default Set
 * @desc Select which action to take.
 * 
 * @arg newCondition
 * @text New Clause
 * @type text
 * @default 
 * @desc If Action is set to 'Set', use this parameter to define a new default condition.
 * 
 * =================================================================================
 * Parameters
 * =================================================================================
 * 
 * @param ---Default Settings----
 * @default
 * 
 * @param Substitute Friendly Fire
 * @parent ---Default Settings---
 * @type boolean
 * @on ENABLE
 * @off DISABLE
 * @default false
 * @desc If enabled, substitution can occur with friend actions (buffs, states, etc.)
 * 
 * @param Substitute Condition
 * @parent ---Default Settings---
 * @type text
 * @default
 * @desc Default condition for allowing substitutions. Leave blank to always allow.
 * 
 * 
 */

//=============================================================================
// Parameters Setup
//=============================================================================

TAA.ssk.Parameters = TAA.ssk.Parameters || {};
var Parameters = PluginManager.parameters(TAA.ssk.PluginName);

TAA.ssk.Parameters.FriendlyFire = Parameters['Substitute Friendly Fire'] === "true";
TAA.ssk.Parameters.Condition = Parameters['Substitute Condition'];

//=============================================================================
// SubstituteManager
//=============================================================================

function SubstituteManager() {
    throw new Error('This is a static class');
};

/**
 * Initializes Substitute Manager
 * 
 * @static
 * @method initialize
 */
SubstituteManager.initialize = function() {
    this._stateEffects = {};
    this._skills = {};
    this._ready = false;
    this.parseSkillTags();
    this.parseStateTags();
};

/**
 * Returns true if Substitute data has finished loading, otherwise false
 * 
 * @static
 * @method isReady
 */
SubstituteManager.isReady = function(){
    return this._ready;
};

/**
 * Parses States note tags to identify those with subtitution effects
 * 
 * @static
 * @method parseStateTags
 */
SubstituteManager.parseStateTags = function() {
    const startTagPattern = /<TAA_SSK>/i;
    const endTagPattern = /<\/TAA_SSK>/i;
    const singleLinePattern = /<TAA_SSK:\s*type:\s*([^;>]+(?:\s*,\s*[^;>]+)*)(?:\s*;\s*friendFire:\s*(true|false)\s*)?(?:\s*;\s*condition:(.+)\s*)?>/i;
    for(var i=1; i<$dataStates.length; i++){
        var notes = $dataStates[i].note.split(/[\r\n]+/);
        var found = false;
        var j = 0;
        var condition = "true";
        var sskObj = {};
        var tagsFound = false;
        var multiLine = false;
        while(j < notes.length && !found){
            if(notes[j].match(startTagPattern))
                multiLine = true;
            else if(multiLine && notes[j].match(endTagPattern)){
                multiLine = false;
                tagsFound = true;
                if(sskObj.types !== undefined){
                    sskObj.state = i;
                    sskObj.active = true;
                    this._stateEffects[i] = sskObj;
                }
            }
            else if(multiLine){
                sskObj = this.processMultiLineTags(notes[j], sskObj);
            }
            else if(notes[j].match(singleLinePattern)){
                condition = RegExp.$3 !== undefined && RegExp.$3 !== "" ? RegExp.$3 : "true";
                sskObj.active = true;
                sskObj.state = i;
                if(RegExp.$2 !== undefined) sskObj.friendlyFire = ((RegExp.$2).toLowerCase() === "true");
                sskObj.types = SubstituteManager.parseSkillTypes(RegExp.$1);
                sskObj.condition = condition;
                this._stateEffects[i] = sskObj;
                found = true;
            }
            j++;
        }
    }
    this._ready = true;
};

/**
 * An extension from parseStateTags to deal with multiline tags
 * 
 * @static
 * @method processMultiLineTags
 */
SubstituteManager.processMultiLineTags = function(note, sskObj){
    const typePattern = /type:\s*(.+)\s*/i;
    const friendFirePattern = /friendFire:\s*(true|false)/i;
    const conditionPattern = /condition:(.+)/i;

    if(note.match(typePattern))
        sskObj.types = SubstituteManager.parseSkillTypes(RegExp.$1);
    else if(note.match(friendFirePattern))
        sskObj.friendlyFire = ((RegExp.$1).toLowerCase() === "true");
    else if(note.match(conditionPattern)){
        var condition = RegExp.$3 !== undefined && RegExp.$3 !== "" ? RegExp.$3 : "true";
        sskObj.condition = condition;
    }

    return sskObj;
};

/**
 * Parses Skills note tags to identify which skills have tags for substitution bypassing
 * 
 * @static
 * @method parseSkillTags
 */
SubstituteManager.parseSkillTags = function(){
    const pattern = /<TAA_SSK:\s*(\d+)>/i;
    for(var i=1; i<$dataSkills.length; i++){
        var notes = $dataSkills[i].note.split(/[\r\n]+/);
        var found = false;
        var j = 0;
        while(j < notes.length && !found){
            if(notes[j].match(pattern)){
                this._skills[i] = parseInt(RegExp.$1);
                found = true;
            }
            j++;
        }
    }
};

/**
 * Auxiliary function that convert a skill type name list for its indexes
 * 
 * @static
 * @method parseSkillTypes
 */
SubstituteManager.parseSkillTypes = function(typeArray){
    var result = [];
    var types = typeArray.split(/\s*,\s*/);
    for(var i=0; i<types.length; i++){
        if(types[i].toLowerCase() === 'all' || parseInt(types[i]) === -1)
            result.splice(0, 0, -1);
        else if(types[i].toLowerCase() === 'normal')
            result.push(0);
        else if(!isNaN(types[i]) && parseInt(types[i]) >= 0 && !result.contains(parseInt(types[i])))
            result.push(parseInt(types[i]));
        else{
            var index = $dataSystem.skillTypes.indexOf(types[i]);
            if(index > 0)
                result.push(index);
        }
    }
    if(result.length === 0) result.push(-1);
    return result;
};

/**
 * Test if a given state ID sets a substitution effect
 * 
 * @static
 * @method isSubstitution
 */
SubstituteManager.isSubstitution = function(statedId){
    if(this._stateEffects[statedId] !== undefined) return true;
    return false;
};

/**
 * Returns the substitution effect object for a given state ID
 * 
 * @static
 * @method getSubstitutionObject
 */
SubstituteManager.getSubstitutionObject = function(stateId){
    if(!this.isSubstitution(stateId)) return undefined;
    return this._stateEffects[stateId];
};

/**
 * Tests if a given skill manages to bypass substitution
 * 
 * @static
 * @method skillIgnoreSubstitution
 */
SubstituteManager.skillIgnoreSubstitution = function(skill){
    if(skill === undefined) return false;
    const id = skill.id;
    if(this._skills[id] === undefined) return false;
    const chance = Math.random() * 100;
    if(chance <= this._skills[id]) return true;
    return false;
};

//=============================================================================
// Game_System
//=============================================================================

TAA.ssk.alias.Game_System = TAA.ssk.alias.Game_System || {};
TAA.ssk.alias.Game_System.initialize = Game_System.prototype.initialize;
Game_System.prototype.initialize = function(){
    TAA.ssk.alias.Game_System.initialize.call(this);
    this._sskFriendlyFire = TAA.ssk.Parameters.FriendlyFire === true;
    this._sskCondition = TAA.ssk.Parameters.Condition || "true";
};

Game_System.prototype.sskIsFriendlyFireAllowed = function(){
    return this._sskFriendlyFire;
};

Game_System.prototype.sskEnableFriendlyFire = function(){
    this._sskFriendlyFire = true;
};

Game_System.prototype.sskDisableFriendlyFire = function(){
    this._sskFriendlyFire = false;
};

Game_System.prototype.sskResetFriendlyFire = function(){
    this._sskFriendlyFire = TAA.ssk.Parameters.FriendlyFire === true;
};

Game_System.prototype.sskCondition = function(){
    return this._sskCondition;
};

Game_System.prototype.sskUpdateCondition = function(condition){
    if(condition === undefined) condition = "";
    this._sskCondition = condition;
};

Game_System.prototype.sskResetCondition = function(){
    this._sskCondition = TAA.ssk.Parameters.Condition || "true";
};

//=============================================================================
// Game_Interpreter (MV)
//=============================================================================

TAA.ssk.alias.Game_Interpreter = TAA.ssk.alias.Game_Interpreter || {};
TAA.ssk.alias.Game_Interpreter.pluginCommand = Game_Interpreter.prototype.pluginCommand;
Game_Interpreter.prototype.pluginCommand = function(command, args){
    TAA.ssk.alias.Game_Interpreter.pluginCommand.call(this, command, args);
    if(command.toLowerCase() === 'substitute' || command.toLowerCase() === 'substituteskill'){
        if(args[0] && ['friendfire', 'friendlyfire'].contains(args[0].toLowerCase())){
            if(args[1] && args[1].toLowerCase() === 'enable')
                $gameSystem.sskEnableFriendlyFire();
            else if(args[1] && args[1].toLowerCase() === 'disable')
                $gameSystem.sskDisableFriendlyFire();
            else if(args[1] && args[1].toLowerCase() === 'reset')
                $gameSystem.sskResetFriendlyFire();
        }
        else if(args[0] && ['condition', 'conditions'].contains(args[0].toLowerCase())){
            if(args[1] && args[1].toLowerCase() === 'set'){
                var cond = "";
                for(var i=2; i<args.length; i++){
                    cond += " " + args[i];
                }
                $gameSystem.sskUpdateCondition(cond);
            }
            else if(args[1] && args[1].toLowerCase() === 'reset')
                $gameSystem.sskResetCondition();
        }
    }
};

//=============================================================================
// Plugin Commands (MZ)
//=============================================================================

if(Utils.RPGMAKER_NAME === 'MZ'){
    PluginManager.registerCommand(TAA.ssk.PluginName, 'friendFire', args => {
        const action = args.action;
        switch(action.toLowerCase()){
            case 'enable':
                $gameSystem.sskEnableFriendlyFire();
                break;
            case 'disable':
                $gameSystem.sskDisableFriendlyFire();
                break;
            case 'reset':
                $gameSystem.sskResetFriendlyFire();
                break;
        }
    });
    
    PluginManager.registerCommand(TAA.ssk.PluginName, 'condition', args => {
        const action = args.action;
        const newClause = args.newCondition;
        if(action === "Reset")
            $gameSystem.sskResetCondition();
        else
            $gameSystem.sskUpdateCondition(newClase);
    });
}

//=============================================================================
// DataManager
//=============================================================================

TAA.ssk.alias.DataManager = TAA.ssk.alias.DataManager || {};
TAA.ssk.alias.DataManager.isDatabaseLoaded = DataManager.isDatabaseLoaded;
DataManager.isDatabaseLoaded = function() {
    if(!this._substituteManagerState && $dataStates !== null && $dataSkills !== null){
        this._substituteManagerState = true;
        SubstituteManager.initialize();
        return false;
    }
    return SubstituteManager.isReady() && TAA.ssk.alias.DataManager.isDatabaseLoaded.call(this);
};

//=============================================================================
// BattleManager
//=============================================================================

TAA.ssk.alias.BattleManager = TAA.ssk.alias.BattleManager || {};
TAA.ssk.alias.BattleManager.initMembers = BattleManager.initMembers;
BattleManager.initMembers = function() {
    TAA.ssk.alias.BattleManager.initMembers.call(this);
    this._allowSubstitution = true;
};

TAA.ssk.alias.BattleManager.applySubstitute = BattleManager.applySubstitute;
BattleManager.applySubstitute = function(target) {
    const skillType = this._action.item().stypeId;
    if(target.hasCustomSubstitution(skillType) && this._allowSubstitution){
        var substitute = target.getSubstitute(skillType);
        if(substitute && target !== substitute) {
            if(!substitute.canMove())
                return target;
            this._logWindow.displaySubstitute(substitute, target);
            return substitute;
        }
    }
    
    return TAA.ssk.alias.BattleManager.applySubstitute.call(this, target);
};

TAA.ssk.alias.BattleManager.invokeNormalAction = BattleManager.invokeNormalAction;
BattleManager.invokeNormalAction = function(subject, target) {
    this.validateCustomSubstitution(subject, target);
    TAA.ssk.alias.BattleManager.invokeNormalAction.call(this, subject, target);
    this._allowSubstitution = true;
};

BattleManager.validateCustomSubstitution = function(subject, target){
    // ignore skills where the user is also the target
    const skillType = this._action.item().stypeId;
    if(target === subject) 
        this._allowSubstitution = false;
    else if(this._action.isSkill() && SubstituteManager.skillIgnoreSubstitution(this._action.item()))
        this._allowSubstitution = false;
    else if(target.isFriendUnit(subject) && !target.sskIsFriendlyFireAllowed(skillType)) 
        this._allowSubstitution = false;
    else if(!target.evalSubstituteCondition(subject, skillType)) 
        this._allowSubstitution = false;
};

//=============================================================================
// Game_Battler
//=============================================================================

TAA.ssk.alias.Game_Battler = TAA.ssk.alias.Game_Battler || {};
TAA.ssk.alias.Game_Battler.initMembers = Game_Battler.prototype.initMembers;
Game_Battler.prototype.initMembers = function() {
    TAA.ssk.alias.Game_Battler.initMembers.call(this);
    this.clearAllSubstitutions();
};

Game_Battler.prototype.addSubstitution = function(subsType, substitute, obj, stateId){
    var typeLen = $dataSystem.skillTypes.length;
    for(var i=0; i<typeLen; i++){
        var sskObj = {};
        sskObj._sskSubstituteType = subsType;
        sskObj._sskActiveSubstitute = substitute;
        sskObj._stateId = stateId;
        sskObj._sskObject = obj;
        if(obj.types === undefined || obj.types.length === 0 || obj.types.contains(-1) || obj.types.contains(i)) {
            // Handle when a substitution replaces another
            var oldSubstitution = this._sskSubstitutions[i];
            if(oldSubstitution && this._sskStateIndex[oldSubstitution._stateId]){
                var typeIndex = this._sskStateIndex[oldSubstitution._stateId].indexOf(i);
                if(typeIndex >= 0) this._sskStateIndex[oldSubstitution._stateId].splice(typeIndex, 1);
            }
            // register the new substitution
            this._sskSubstitutions[i] = sskObj;
            if(!this._sskStateIndex[stateId]) this._sskStateIndex[stateId] = [];
            this._sskStateIndex[stateId].push(i);
        }
    }
};

Game_Battler.prototype.clearAllSubstitutions = function(){
    this._sskSubstitutions = [];
    this._sskStateIndex = {};
};

Game_Battler.prototype.clearSubstitutionByState = function(stateId){
    if(this._sskStateIndex === undefined || this._sskStateIndex[stateId] === undefined) return;
    for(var i=0; i<this._sskStateIndex[stateId].length; i++){
        var index = this._sskStateIndex[stateId][i];
        this._sskSubstitutions[index] = undefined;
    }
    delete this._sskStateIndex[stateId];
};

Game_Battler.prototype.clearSubstitutionBySkillType = function(typeIndex){
    var stateId = this._sskSubstitutions[typeIndex]._stateId;
    var index = this._sskStateIndex[stateId].indexOf(typeIndex);
    if(index >= 0) this._sskStateIndex[stateId].splice(index, 1);
    this._sskSubstitutions[typeIndex] = null;
};

TAA.ssk.alias.Game_Battler.removeState = Game_Battler.prototype.removeState;
Game_Battler.prototype.removeState = function(stateId) {
    TAA.ssk.alias.Game_Battler.removeState.call(this, stateId);
    if(SubstituteManager.isSubstitution(stateId))
        this.clearSubstitutionByState(stateId);
};

Game_Battler.prototype.hasCustomSubstitution = function(skillType){
    if(skillType === undefined) skillType = 0;
    if(this._sskSubstitutions && this._sskSubstitutions[skillType])
        return true;
    return false;
};

Game_Battler.prototype.getSubstitute = function(skillType){
    if(skillType === undefined) skillType = 0;
    if(!this.hasCustomSubstitution(skillType))
        return undefined;
    else{
        var sskObj = this._sskSubstitutions[skillType];
        if(sskObj._sskSubstituteType === 1){
            return $gameActors.actor(sskObj._sskActiveSubstitute);
        }
        else{
            return $gameTroop.members()[sskObj._sskActiveSubstitute];
        }
    }
};

Game_Battler.prototype.evalSubstituteCondition = function(subject, skillType){
    if(skillType === undefined) skillType = 0;
    var condition = $gameSystem.sskCondition();
    if(this._sskSubstitutions && this._sskSubstitutions[skillType] && this._sskSubstitutions[skillType]._sskObject && this._sskSubstitutions[skillType]._sskObject.condition)
        condition = this._sskSubstitutions[skillType]._sskObject.condition;
    var sskObj = this._sskSubstitutions[skillType];
    var evalResult = true;
    if(condition === "") condition = "true";
    try{
        var a = subject;
        var b = this;
        var c = this.getSubstitute(skillType);
        var v = $gameVariables._data;
        var s = $gameSwitches._data;
        if(c === undefined) c = b;
        evalResult = eval(condition) === true;
    } catch(e) {
        console.error("TAA_SubstituteSkill: Failed do eval substitution condition '" + condition + "'. Rolling back to default: false.");
        console.error(e);
        evalResult = false;
    }
    return evalResult;
};

Game_Battler.prototype.sskIsFriendlyFireAllowed = function(skillType){
    if(skillType === undefined) skillType = 0;
    if(!this._sskSubstitutions || !this._sskSubstitutions[skillType] || !this._sskSubstitutions[skillType]._sskObject || !this._sskSubstitutions[skillType]._sskObject.friendlyFire)
        return $gameSystem.sskIsFriendlyFireAllowed();
    return this._sskSubstitutions[skillType]._sskObject.friendlyFire === true;
};

//=============================================================================
// Game_Actor
//=============================================================================

Game_Actor.prototype.isFriendUnit = function(unit){
    if(!unit || unit.constructor.name !== 'Game_Actor') return false;
    return true;
};

TAA.ssk.alias.Game_Actor = TAA.ssk.alias.Game_Actor || {};
TAA.ssk.alias.Game_Actor.addSubstitution = Game_Actor.prototype.addSubstitution;
Game_Actor.prototype.addSubstitution = function(subsType, substitute, obj, stateId){
    if(subsType === 1 && substitute === this.actorId()) return;

    TAA.ssk.alias.Game_Actor.addSubstitution.call(this, subsType, substitute, obj, stateId);
};

//=============================================================================
// Game_Enemy
//=============================================================================

Game_Enemy.prototype.isFriendUnit = function(unit){
    if(!unit || unit.constructor.name !== 'Game_Enemy') return false;
    return true;
};

TAA.ssk.alias.Game_Enemy = TAA.ssk.alias.Game_Enemy || {};
TAA.ssk.alias.Game_Enemy.addSubstitution = Game_Enemy.prototype.addSubstitution;
Game_Enemy.prototype.addSubstitution = function(subsType, substitute, obj, stateId){
    if(subsType === 2 && substitute === this.enemyId()) return;

    TAA.ssk.alias.Game_Enemy.addSubstitution.call(this, subsType, substitute, obj, stateId);
};

//=============================================================================
// Game_Action
//=============================================================================

TAA.ssk.alias.Game_Action = TAA.ssk.alias.Game_Action || {};
TAA.ssk.alias.Game_Action.itemEffectAddNormalState = Game_Action.prototype.itemEffectAddNormalState;
Game_Action.prototype.itemEffectAddNormalState = function(target, effect) {
    TAA.ssk.alias.Game_Action.itemEffectAddNormalState.call(this, target, effect);
    var sskObj = SubstituteManager.getSubstitutionObject(effect.dataId);
    if(sskObj !== undefined && target.result().success) {
        var type = (this._subjectActorId > 0) ? 1 : 2;
        var subsId = (type === 1) ? this._subjectActorId : this._subjectEnemyIndex;
        target.addSubstitution(type, subsId, sskObj, effect.dataId);
    }
};

Game_Action.prototype.skillTypeId = function() {
    if (this.isSkill()) {
        return $dataSystem.magicSkills.indexOf(this.item().stypeId);
    } else {
        return undefined;
    }
};