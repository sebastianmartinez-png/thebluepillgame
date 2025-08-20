/*:
@title sirL_MP34_3_68
@author SirLegna
@date February 10, 2021
@url https://sirlegna.itch.io/sir-legnas-plugin-generator 
@filename sirL_MP34_3_68
Please reach out to me for any help or just to talk about your project

@plugindesc Debug Hash #34_3_68

@param Skill Cost Sorter

@param SkillCostSorter.Sorts
@text List of the ways to sort
@parent Skill Cost Sorter
@desc The code will sort from top to bottom of this list
@default ["{\"SkillCostSorter.eval\":\"skill.mpCost\",\"SkillCostSorter.order\":\"true\"}"]
@type struct<SirLMPSkillCostSorterSorter>[]

@ End of params
@help
Generator Version = 1.0.0
This plugin is composed of multiple plugins, which are listed here:
	1. v2.0.0 - Skill Cost Sorter

===== v2.0.0 - Skill Cost Sorter =====
This plugin allows you to sort your skill cost based on any comparison list you define in the plugin parameters.

This plugin has some special Skill codes listed below:
	* skill.lastUsedTime = Compares the skills based on when they were last used in either the menu or battle per actor
	* skill.lastUsedBattleTime = Compares the skills based on which they were last used in battle per actor
	* skill.lastUsedMenuTime = Compares the skills based on when they were last used in the menu per actor
	* skill.usable = Compares skill usability in the current menu
	* skill.altType_NAME = must-have skill cost formula plugin, replace NAME with the name of the altType you want to sort on.

Core functionality that this plugin works with:
	* Window_SkillList.prototype.makeItemList
	* Game_Actor.prototype.setLastBattleSkill
	* Game_Actor.prototype.setLastMenuSkill

CHANGELOG
	v2.0.0 - MV compatibility
	v1.0.0 - Forgot to give the list of sorts a default, and included altTypes if you have skill cost formula plugin
	v0.0.5 - Refactor the code to be cleaner for the generator
	v0.0.4 - Give each party individual time factors, so their most recent come up higher
	v0.0.3 - Created logic to determine if the skill is playable in the current menu
	v0.0.2 - More flexible replacement for the functions
	v0.0.1 - Rough code that just straight replaces the functions

TERMS OF USE
	All required Terms of Use follow the higher the number the higher the priority, for example: 1. Can use X and then 2. Cannot use X, then you cannot use X

	Optional Terms of Use are terms that the creator would like to have, but is not forcing anyone to follow.

REQUIRED TERMS OF USE
	1. You are free to use this plugin in any commerical or non-commerical projects with the RPG Maker software.
	2. You are free to modify this script to your liking however, any bug fixes or general features you are required to post an explanation in the Bugs/Features Requests forums on the generator page. This is so that the community can always be using the best code available.
	3. You are not allowed to modify the terms of use with the exception of creating stricter terms
	4. Place SirLegna Generated Plugins in your credits

OPTIONAL TERMS OF USE
	* Gifting SirLegna a copy of your game. I would love to see how you use my code for ideas on how to improve my plugins


CREDITS
	 - SirLegna can be found at https://sirlegna.itch.io/ 
	Creator
	 - Kurochan can be found at https://kurochan.itch.io/
	Tester, code reviewer, and fellow idea generator.
	 - Rik Schennink can be found at https://rikschennink.github.io/fitty/
	Providing a text fitting javascript code, for the generator.
*/

/*~struct~SirLMPSkillCostSorterSorter:
@param SkillCostSorter.eval
@text Skill code
@parent SirLMPSkillCostSorterSorter
@desc Define the Skill code that will be sorted with. skill is the variable for the skill itself, for example, skill.mpCost
@default skill.mpCost
@type text

@param SkillCostSorter.order
@text Is Ascending
@parent SirLMPSkillCostSorterSorter
@desc What type of order do you want the skills to appears. Ascending means 1,2,3
@default true
@type boolean
@on Ascending Order
@off Descending Order

*/
var Imported = Imported || {};
Imported.sirL_MP34_3_68 = true;
var SirL = SirL || {};
SirL.MPCore = SirL.MPCore || {};
SirL.MP34_3_68 = SirL.MP34_3_68 || {};
SirL.MP34_3_68.pluginName = "sirL_MPsCSMV";
SirL.MP34_3_68.pP = PluginManager.parameters(SirL.MP34_3_68.pluginName);
SirL.MPSkillCostSorter = SirL.MPSkillCostSorter || {};
typeof SirL.savablePP != `undefined` ? SirL.savablePP = SirL.savablePP.concat(...[]) : SirL.savablePP = [];
SirL.MPSkillCostSorter.setUsedTime = function(skill,actor,window){
	if (skill["lastUsed"+window+"Time"] === undefined) { skill["lastUsed"+window+"Time"] = [] }
	skill["lastUsed"+window+"Time"][actor._actorId] = Date.now()
}
SirL.MPSkillCostSorter.getUsedTime = function(skill,actor,window){
			actorId = actor._actorId
			battleValue = SirL.MPSkillCostSorter.getUsedBattleTime(skill,actor)
			menuValue = SirL.MPSkillCostSorter.getUsedMenuTime(skill,actor)
			return (battleValue > menuValue) ? battleValue : menuValue;
}
SirL.MPSkillCostSorter.getUsedBattleTime = function(skill,actor){
	try{exists = skill["lastUsedBattleTime"][actor._actorId] === undefined} catch(err){exists = true}
	if (exists){
		return 0;
	} else {
		return skill["lastUsedBattleTime"][actor._actorId]
	}
}
SirL.MPSkillCostSorter.getUsedMenuTime = function(skill,actor){
	try{exists = skill["lastUsedMenuTime"][actor._actorId] === undefined} catch(err){exists = true}
	if (exists){
		return 0;
	} else {
		return skill["lastUsedMenuTime"][actor._actorId]
	}
}
Window_SkillList.prototype.makeItemList = function() {
	actor = this._actor
	if (actor) {
		this._data = this._actor.skills().filter(item => this.includes(item));
		try{Sorts = SirL.MPCore.toList(SirL.MP34_3_68.pP["SkillCostSorter.Sorts"])} catch(err){return;};
		this._data.sort(function(a,b){
			for (var sortId= 0; sortId < Sorts.length; sortId++){
				sorter = JSON.parse(Sorts[sortId])
				switch(sorter["SkillCostSorter.eval"]){
					case "skill.lastUsedTime":
						aValue = -SirL.MPSkillCostSorter.getUsedTime(a,actor,"Both")
						bValue = -SirL.MPSkillCostSorter.getUsedTime(b,actor,"Both")
					break;
					case "skill.lastUsedBattleTime":
						aValue = -SirL.MPSkillCostSorter.getUsedBattleTime(a,actor)
						bValue = -SirL.MPSkillCostSorter.getUsedBattleTime(b,actor)
					break;
					case "skill.lastUsedMenuTime":
						aValue = -SirL.MPSkillCostSorter.getUsedMenuTime(a,actor)
						bValue = -SirL.MPSkillCostSorter.getUsedMenuTime(b,actor)
					break;
					case "skill.usable":
						aValue = actor.meetsSkillConditions(a)
						bValue = actor.meetsSkillConditions(b)
					break;
					default:
						try{isSkillAltFormula = sorter["SkillCostSorter.eval"].includes("skill.altType_")} catch(err){isSkillAltFormula = false}
						if (isSkillAltFormula){
							altType = sorter["SkillCostSorter.eval"].split("_").splice(1).join('_')
							try{aValue = SirL.MPSkillCostFormula.skillAltCost(actor,altType,a)} catch(err){aValue = 0}
							try{bValue = SirL.MPSkillCostFormula.skillAltCost(actor,altType,b)} catch(err){bValue = 0}
						} else {
							aValue = eval(sorter["SkillCostSorter.eval"].replace(/skill/g,"a"))
							bValue = eval(sorter["SkillCostSorter.eval"].replace(/skill/g,"b"))
						}
				}
				aValue = aValue || Number.MAX_SAFE_INTEGER
				bValue = bValue || Number.MAX_SAFE_INTEGER
				if (aValue > bValue) return (SirL.MPCore.toBoolean(sorter["SkillCostSorter.order"])) ? 1 : -1;
				if (aValue < bValue) return (SirL.MPCore.toBoolean(sorter["SkillCostSorter.order"])) ? -1 : 1;
			}
		});
    } else {
        this._data = [];
    }
};
Game_Actor.prototype.setLastBattleSkill = function(skill) {
	try{SirL.MPSkillCostSorter.setUsedTime(skill,this,"Battle")}catch(err){};
	this._lastBattleSkill.setObject(skill);
};
Game_Actor.prototype.setLastMenuSkill = function(skill) {
	try{SirL.MPSkillCostSorter.setUsedTime(skill,this,"Menu")}catch(err){};
	this._lastMenuSkill.setObject(skill);
};
SirL.MPCore.toBoolean = function(string){
	return Boolean(JSON.parse(string))
};
SirL.MPCore.toList = function(string){
	return JSON.parse(string)
};
