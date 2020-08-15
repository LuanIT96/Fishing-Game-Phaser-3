import Config from '../../config';
var uniqid = require('uniqid');

export default class BaseFish extends Phaser.Physics.Matter.Sprite {

  constructor (world, scene, config){
    super(world, -1000, -1000, config.key, config.defaultFrame, {shape: scene.shapes[config.shapeName]});
    this.config = config;
    this.fishID = uniqid();
    this.scene = scene;
    this.game = scene.game;
    this.health = 0;
    this.setScale(Config.phaserGameResolution).setStatic(true).setBounce(0).setIgnoreGravity().setSensor(true);
    this.setupInputArea();//setup input area
    this.setCollisionGroup(-1);//no collide check when init
    this.objectType = "fish";
    this.shadow = scene.add.sprite(0, 0, this.config.key, config.defaultFrame).setScale(Config.phaserGameResolution).setTint(0x000000).setAlpha(0.5);
    //
    if(config.active === false){
      this.setVisible(false).setActive(false);
      this.shadow.setVisible(false).setActive(false);
    }

    this.on('pointerdown',function(){
      if(scene.focusToFish) scene.focusToFish(this);
    },this);

    this.on('animationstart', function (anim, frame) {
      if(anim.key === 'fish'+this.config.type+'_die'){
        this.die();
      }
    });
    this.on('animationcomplete', function (anim, frame) {
      this.emit('animationcomplete_' + anim.key, anim, frame);
    },this);
  }
  setupInputArea(){}
  /*
  *
  *
  */
  killFish(params){
    if(this.killFishParams) return;
    if(this.tween && this.tween.isPlaying) this.tween.stop();
    this.killFishParams = params;
    this.setCollisionGroup(-1);
    if(params && params.player) params.player.cancleFocusElectricToFish();
    this.anims.play('fish'+this.config.type+'_die');
    this.shadow.anims.play('fish'+this.config.type+'_die');

  }

  /*
  * Call this function When the bullet collide to let player know that bullet hit this fish
  * - Make a tween to set tint color to red
  *
  */
  hitFish(){
    if(this.hit) return;//block duplicate

    this.setTint(0xfA0000);
    this.hit = true;
    this.scene.tweens.addCounter({from: 0, to: 250, duration: 200,
      onComplete: function(){this.hit = false;},
      onUpdate: function (tween){
        let value = Math.floor(tween.getValue());
        this.setTint(Phaser.Display.Color.GetColor(255, value, value));
      },
      callbackScope: this
    },this);
  }

  /*
  * Call this function When the bullet collide to update current health of fish
  * @params: damage<Integer>
  */
  damageFish(damage){
    (damage > 0) ? this.health = this.health - damage : false;
    return this.health;
  }

  /*
  *
  * 
  *
  */
  resetHealth(){
    if(this.config.type > 30){
      this.health = this.config.type*Phaser.Math.Between(300, 3000);
    }else{
      this.health = this.config.type*Phaser.Math.Between(150, 2000);
    }
  }
  /*
  * Revive this fish and swim
  * @params: arrayPath<>
  * - Reset kill fish params
  * - Active body collide check with body
  * - revive fish and shadow(if available)
  * - update swim path by params arrayPath using follower, reference object Phaser.GameObjects.Components.PathFollower
  */
  swim(arrayPath){
    this.killFishParams = null;//reset fish killed params
    this.resetHealth();
    /*Add Fish To Collision Group*/
    this.setCollisionGroup(this.scene.physicFishGroup);
    
    //Reset fish position
    this.setActive(true).setVisible(true).setAngle(0).setScale(1).setOrigin(0.5).setRotation(0).setAlpha(1).anims.play('fish'+this.config.type+'_swim').setPosition(arrayPath.p.x[0], arrayPath.p.y[0]);
    this.shadow.setActive(true).setVisible(true).setAngle(0).setScale(1).setOrigin(0.5).setRotation(0).setAlpha(0.5).anims.play('fish'+this.config.type+'_swim').setPosition(arrayPath.p.x[0], arrayPath.p.y[0]);
    
    if(!this.follower){
      //Create A Follower Curves Path
      this.follower = {t: 0, vec: new Phaser.Math.Vector2(arrayPath.p.x[0], arrayPath.p.y[0])};
      this.path = new Phaser.Curves.Path();
    }else{
      //Reset Follower
      this.follower.t = 0;
      this.follower.vec.reset(arrayPath.p.x[0], arrayPath.p.y[0]);
      this.path.curves = [];
      this.path.curves.length = 0;
      this.path.cacheLengths = [];
      this.path.cacheLengths.length = 0;
      this.path.startPoint = {x: 0, y: 0};
    }
    let newPath = [];
    arrayPath.p.x.forEach(function(x, index){
      if(index > 0) newPath.push([x, arrayPath.p.y[index]]);
    })

    //Reset Swim Path
    this.path.moveTo(arrayPath.p.x[0], arrayPath.p.y[0])
    this.path.splineTo(newPath)
    this.tween = this.scene.tweens.add({
      targets: this.follower, t: 1, duration: arrayPath.t, delay: arrayPath.delay,
      onUpdate: function(tween, target){
        //Get Current Position of follower Path
        this.path.getPoint(this.follower.t, this.follower.vec);

        //Fish Angle And Position
        this.setRotation(Phaser.Math.Angle.BetweenPoints({x: this.x, y: this.y}, {x: this.follower.vec.x, y: this.follower.vec.y})).setPosition(this.follower.vec.x, this.follower.vec.y);
        //Fish Shadow Angle And Position
        this.shadow.setRotation(this.rotation).setPosition(this.x+10, this.y+20);
      },
      onComplete: function(){
        this.setVisible(false).setActive(false);
        this.shadow.setVisible(false).setActive(false);
        this.setCollisionGroup(-1);
      },
      callbackScope: this,
    },this);
  }


  /*
  * Fade out and kill this fish 
  *   - Tween fadeout fish
  *   - kill fish
  *   - show total credit win and the coin then move the coin to player kill this player
  */
  die(){
    this.scene.tweens.add({
      targets: [this.shadow, this], alpha: 0,  delay: 300, duration: 1000,
      onComplete: function(){
        if(!this.killFishParams.totalWin) {
          this.killFishParams.totalWin = this.killFishParams.player.bet*(this.config.odds.min ? Phaser.Math.Between(this.config.odds.min, this.config.odds.max) : this.config.odds);
        }
        this.scene.creditWinEffect.showSingleCoin(this.killFishParams.totalWin,{x: this.x, y: this.y}, this.killFishParams.player, this.killFishParams.coinType, this.killFishParams.textType, this.killFishParams.noUpdateCredit ? this.killFishParams.noUpdateCredit : false);
        this.setVisible(false).setActive(false);
        this.shadow.setVisible(false).setActive(false);
      },
      callbackScope: this
    });
  }

  /*
  * Call this function if you want to kill this fish imediately
  * - Kill fish
  * - Kill fish shadow (if available)
  * - Stop swim tween
  * - Disable collision body check with bullet
  */
  forceStopSwim(){
    this.setActive(false).setVisible(false);
    if(this.shadow) this.shadow.setActive(false).setVisible(false);
    if(this.tween) this.tween.stop();
    this.setCollisionGroup(-1);
  }
}