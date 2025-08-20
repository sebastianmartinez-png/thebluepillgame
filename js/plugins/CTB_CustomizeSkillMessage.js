/*=============================================================================*\
 * CTB CustomizeSkillMessage
 * By CT_Bolt
 * CTB_CustomizeSkillMessage.js
 * Version: 1.00
 * Terms of Use:
 *  Free for commercial or non-commercial use
 *
/*=============================================================================*/
var CTB = CTB || {}; CTB.CustomizeSkillMessage  = CTB.CustomizeSkillMessage || {};
var Imported = Imported || {}; Imported["CT_Bolt CustomizeSkillMessage"] = 1.00;
//=============================================================================//

/*:
 * @plugindesc v1.00 CT_Bolt's CustomizeSkillMessage Plugin
 * @author CT_Bolt
 *
 * @param Dont Use Name
 * @text Don't use the skill casters name?
 * @desc Don't use the skill casters name?
 * @type boolean
 * @default true
 *
 * @help
 * CT_Bolt's CustomizeSkillMessage
 * Version 1.00
 * CT_Bolt
 *
 * Optionally use "%nouser" without the quotes in messages to remove 
 * the skill caster's name if you only want it removed during certain skills
 *
 */
//=============================================================================
//=============================================================================

"use strict";
(function ($_$) {
    function getPluginParameters() {var a = document.currentScript || (function() { var b = document.getElementsByTagName('script'); return b[b.length - 1]; })(); return PluginManager.parameters(a.src.substring((a.src.lastIndexOf('/') + 1), a.src.indexOf('.js')));} $_$.params = getPluginParameters();
	
	//-----------------------------------------------------------------------------
	// Main Code
	//-----------------------------------------------------------------------------
	Window_BattleLog.prototype.displayAction = function(subject, item) {
		var numMethods = this._methods.length;		
		if (DataManager.isSkill(item)) {
			var noUsername = false;
			if (item.message1.toLowerCase().includes('%nouser') || eval($_$.params['Dont Use Name'])){
				item.message1 = item.message1.replace("%nouser", "");
				noUsername = true;
			};
			if (item.message1) {
				if (noUsername){
					this.push('addText', item.message1.format(item.name));
				}else{
					this.push('addText', subject.name() + item.message1.format(item.name));
				};
			}
			if (item.message2) {
				this.push('addText', item.message2.format(item.name));
			}
		} else {
			this.push('addText', TextManager.useItem.format(subject.name(), item.name));
		}
		if (this._methods.length === numMethods) {
			this.push('wait');
		}
	};
	
})(CTB.CustomizeSkillMessage);