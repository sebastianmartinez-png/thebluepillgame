//=============================================================================
// OZU_damagedSpritess.js
//=============================================================================
/*:
 * @plugindesc Changes enemy/actor sprites once they fall bellow a certain HP threshold.
 * @author Ozuma
 * @help Version 3.2
 * 
 *============================================================================
 *- Introduction
 *============================================================================
 *This plugin allows you to add damaged phases to enemy or actor battle sprites.
 *Think of it like those games where the girls progressively lose clothes as their
 *HP depletes. Of course you could do a lot of other stuff with it too!
 *Also, if the battler recovers enough HP it will change back to its previous
 *battle sprite. (including the default battle sprite if HP returns to 100%)
 *
 *============================================================================
 *- How to use
 *============================================================================
 *For every phase you will need to specify a corresponding sprite name in the
 *battler's notes, like so:
 * 
 *    // Place this in the actor or enemy's notes:
 *    <Damaged Sprite: SpriteA, 60%/>
 *    <Damaged Sprite: SpriteB, 33.3%/>
 *
 *In this example, the battler's sprite will change to "SpriteA.png" once
 *it reaches 60% or lower HP and to "SpriteB.png" once it reaches 33.3%
 *or lower. It's that simple!
 *
 *The plugin will search for the sprites inside the "img\sv_actors" folder in the
 *case of an actor and inside "img\sv_enemies" for enemies.
 *(You don't have to include ".png" for the sprite name)
 *
 *============================================================================
 *- Changelog
 *============================================================================
 *Version 3.2:
 * -Added compatability for transformed enemies
 * 
 *Version 3.1:
 * -Fixed a bug preventing damaged phases
 *
 *Version 3.0:
 * -Implemented damaged sprites for actors
 *
 *Version 2.1:
 * -Removed junk code
 * 
 *Version 2.0:
 * -Added support for multiple damaged sprites (phases)
 */

function getdamagedSprites(battler) {
    let spriteFilter = /<damaged sprite:\s*(.*)\s?,\s?([\d]+[.]?[\d]+)\s?%?\s*\/?>/gmi;
    let sprites = [];
    while ((regex = spriteFilter.exec(battler.note)) !== null) {
        sprites.push({ sprite: regex[1].replace(/.png$/, ''), threshold: Number(regex[2]) });
    };
    sprites.sort(function (a, b) {
        return b.threshold < a.threshold ? 1 : -1;
    })
    return sprites;
};


//-----------------------------------------------------------------------------
// Game_Battler
//

Ozu_GameBattler_gainHp = Game_Battler.prototype.gainHp;
Game_Battler.prototype.gainHp = function (value) {
    Ozu_GameBattler_gainHp.call(this, value);
    this.updateBattler();
};

Game_Battler.prototype.setBattlerImage = function (battlerName) {
    this._battlerName = battlerName;
};

Game_Battler.prototype.updateBattler = function () {
    let percentage = this.hpRate() * 100;
    let changed = false;
    if (this._damagedSprites && this._damagedSprites.length > 0) {
        this._damagedSprites.forEach((phase) => {
            if (!changed && percentage <= phase.threshold) {
                if (this.isAlive()) this._battlerName = phase.sprite;
                changed = true;
                return;
            };
            if (changed) return;
        });
        if (!changed) this.isActor() ? this._battlerName = this.actor().battlerName : this._battlerName = this.enemy().battlerName;
    }
}


//-----------------------------------------------------------------------------
// Game_Actor
//

Ozu_GameActor_setup = Game_Actor.prototype.setup;
Game_Actor.prototype.setup = function (actorId) {
    Ozu_GameActor_setup.call(this, actorId);
    let sprites = getdamagedSprites($dataActors[actorId]);
    if (sprites.length > 0) this._damagedSprites = sprites;
}


//-----------------------------------------------------------------------------
// Game_Enemy
//

Ozu_GameEnemy_setup = Game_Enemy.prototype.setup;
Game_Enemy.prototype.setup = function (enemyId, x, y) {
    Ozu_GameEnemy_setup.call(this, enemyId, x, y);
    this._battlerName = this.enemy().battlerName;
    let sprite = getdamagedSprites($dataEnemies[enemyId]);
    if (sprite.length > 0) this._damagedSprites = sprite;
}

Ozu_GameEnemy_transform = Game_Enemy.prototype.transform;
Game_Enemy.prototype.transform = function (enemyId) {
    Ozu_GameEnemy_transform.call(this, enemyId);
    let sprites = getdamagedSprites($dataEnemies[enemyId]);
    if (sprites.length > 0) {
        this._damagedSprites = sprites;
        this.updateBattler();
    } else {
        delete this._damagedSprites;
        this._battlerName = this.enemy().battlerName;
    }
}

Game_Enemy.prototype.battlerName = function () {
    return this._battlerName;
}