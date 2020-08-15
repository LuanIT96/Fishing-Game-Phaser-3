import Config from '../../config';
import BaseFish from './BaseFish';
import Helpers from '../../helpers';

/*
* Boss Lanterns Fish
*/
export default class Fish33 extends BaseFish {
  constructor(world, scene, config){
    super(world, scene, config);

    this.medalBossIcon = scene.add.sprite(0,0, 'medal','lantern.png').setScale(1).setVisible(false).setActive(false);
    this.medal = scene.add.sprite(0,0, 'medal','medalExplode1.png').setScale(1).setVisible(false).setActive(false);
    this.medal.on('animationcomplete', function(anim, frame){
      if(anim.key ==='medal_explode'){this.setScale(1).medal.anims.play('bossLanternMedal');}
    },this);
    

    let listObj = []
    listObj[1] = {distance: 378, angle: 1.14};
    listObj[2] = {distance: 394, angle: 1.12};
    listObj[3] = {distance: 397, angle: 1.11}
    listObj[4] = {distance:  339 ,angle:  1.09}
    listObj[5] = {distance:  336 ,angle:  0.98}
    listObj[6] = {distance:  333 ,angle:  0.88}
    listObj[7] = {distance:  326 ,angle:  0.80}
    listObj[8] = {distance:  315 ,angle:  0.69}
    listObj[9] = {distance:  314 ,angle:  0.55}
    listObj[10] = {distance:  316 ,angle:  0.44}
    listObj[11] = {distance:  320 ,angle:  0.29}
    listObj[12] = {distance:  327 ,angle:  0.17}
    listObj[13] = {distance:  334 ,angle:  0.07}
    listObj[14] = {distance:  344 ,angle:  -0.02}
    listObj[15] = {distance:  351 ,angle:  -0.10}
    listObj[16] = {distance:  354 ,angle:  -0.2}
    listObj[17] = {distance:  358 ,angle:  -0.32}
    listObj[18] = {distance:  364 ,angle:  -0.39}
    listObj[19] = {distance:  369 ,angle:  -0.46}
    listObj[20] = {distance:  370 ,angle:  -0.56}
    listObj[21] = {distance:  372 ,angle:  -0.61}
    listObj[22] = {distance:  375 ,angle:  -0.71}
    listObj[23] = {distance:  383 ,angle:  -0.75}
    listObj[24] = {distance:  388 ,angle:  -0.82}
    listObj[25] = {distance:  393 ,angle:  -0.89}
    listObj[26] = {distance:  388 ,angle:  -0.95}
    listObj[27] = {distance:  379 ,angle:  -1}
    listObj[28] = {distance:  376 ,angle:  -1.03}
    listObj[29] = {distance:  371 ,angle:  -1.08}
    listObj[30] = {distance:  370 ,angle:  -1.14}
    listObj[31] = {distance:  365 ,angle:  -1.11}
    listObj[32] = {distance:  347 ,angle:  -1.06}
    listObj[33] = {distance:  331 ,angle:  -0.97}
    listObj[34] = {distance:  321 ,angle:  -0.93}
    listObj[35] = {distance:  315 ,angle:  -0.85}
    listObj[36] = {distance:  311 ,angle:  -0.78}
    listObj[37] = {distance:  307 ,angle:  -0.60}
    listObj[38] = {distance:  311 ,angle:  -0.54}
    listObj[39] = {distance:  314 ,angle:  -0.40}
    listObj[40] = {distance:  324 ,angle:  -0.31}
    listObj[41] = {distance:  330 ,angle:  -0.22}
    listObj[42] = {distance:  334 ,angle:  -0.11}
    listObj[43] = {distance:  345 ,angle:  0.014}
    listObj[44] = {distance:  352 ,angle:  0.15}
    listObj[45] = {distance:  364 ,angle:  0.24}
    listObj[46] = {distance:  371 ,angle:  0.34}
    listObj[47] = {distance:  378 ,angle:  0.42}
    listObj[48] = {distance:  384 ,angle:  0.47}
    listObj[49] = {distance:  402 ,angle:  0.56}
    listObj[50] = {distance:  411 ,angle:  0.61}
    listObj[51] = {distance:  423 ,angle:  0.71}
    listObj[52] = {distance:  414 ,angle:  0.74}
    listObj[53] = {distance:  423 ,angle:  0.82}
    listObj[54] = {distance:  418 ,angle:  0.89}
    listObj[55] = {distance:  421 ,angle:  0.94}
    listObj[56] = {distance:  422 ,angle:  0.98}
    listObj[57] = {distance:  419 ,angle:  1.03}
    listObj[58] = {distance:  412 ,angle:  1.07}
    listObj[59] = {distance:  407 ,angle:  1.1}
    listObj[60] = {distance:  402 ,angle:  1.1}
    listObj[61] = {distance:  402 ,angle:  1.1}
    this.focusPoint = Helpers.findSinglePoint({x: this.x, y: this.y}, listObj[1].distance, this.rotation+listObj[1].angle);
    this.on('animationupdate', function (currentAnim, currentFrame, sprite) {
      if(currentAnim.key ==='fish33_swim'){
        this.focusPoint = Helpers.findSinglePoint({x: this.x, y: this.y}, listObj[currentFrame.index+1].distance, this.rotation+listObj[currentFrame.index+1].angle);
      }
    },this);
  }
  /*
  *
  *
  *
  */
  setupInputArea(){
    this.setInteractive(new Phaser.Geom.Polygon([this.width*0.15, this.height*0.3, this.width*0.85, this.height*0.3, this.width*0.85, this.height*0.7, this.width*0.15, this.height*0.7]), Phaser.Geom.Polygon.Contains);
  }
  /*
  *
  *
  */
  killFish(params){
    if(this.killFishParams) return;
    if(this.tween && this.tween.isPlaying) this.tween.stop();

    this.setCollisionGroup(-1);
    this.killFishParams = params;
    this.game.gameAudio.custom['bossMonsterDie'].play();
    this.anims.setTimeScale(1);
    this.shadow.anims.setTimeScale(1);
    this.anims.play('fish'+this.config.type+'_die');
    this.shadow.anims.play('fish'+this.config.type+'_die');
  }
  swim(arrayPath){
    this.killFishParams = null;//reset fish killed params
    this.resetHealth();
    /*Add Fish To Collision Group*/
    this.setCollisionGroup(this.scene.physicFishGroup);
    //Reset fish position
    this.setActive(true).setVisible(true).setAngle(0).setScale(2).setOrigin(0.5).setRotation(0).setAlpha(1).anims.play('fish'+this.config.type+'_swim').setPosition(arrayPath.p.x[0], arrayPath.p.y[0]);
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
        this.shadow.setRotation(this.rotation).setPosition(this.x+10, this.y+20);
      },
      onComplete: function(){
        this.setVisible(false).setActive(false);
        this.setCollisionGroup(-1);
      },
      callbackScope: this,
    },this);
  }


  die(){
    this.scene.tweens.add({targets: [this.shadow, this], alpha: 0,  delay: 1500, duration: 500,
      onComplete: function(){
        this.setVisible(false);//hide but don't kill, have to wait after finish effect
        this.shadow.setVisible(false).setActive(false); 
       
        this.scene.creditWinEffect.showCoinExplode({x: this.x, y: this.y});
        this.scene.cameras.main.shake(500, 0.002);
        this.game.gameAudio.custom['killBoss'].play();
        
        //kill boss effect
        this.scene.killBossAnimation = true;
        !this.scene.fullScreenMultiplier && Phaser.Math.Between(0, 1)===0 ? this.scene.multiplier(this, this.killFishParams.player) : this.killBossAndGetMedal();
      },
      callbackScope: this
    }); 
  }

  /*
  * 
  *
  */
  killBossAndGetMedal(){
    const player = this.killFishParams.player;
    const coinType = this.killFishParams.coinType;
    const textType = this.killFishParams.textType;
    const playerPosition = this.killFishParams.player.position;
    const RD = Phaser.Math.Between(250, 350);
    const yPosition = (player.position < 2) ? (player.y - RD) : (player.y + RD);
    const xPosition = this.killFishParams.player.x;
    
    this.scene.cameras.main.shake(500, 0.002);
    this.medal.setScale(1.2).setActive(true).setAlpha(true).setVisible(true).setPosition(this.x, this.y).anims.play('medal_explode');
    this.showBossIcon();
    this.scene.mainBossDieCallback();
    this.scene.tweens.add({
      targets: [this.medal], x: xPosition, y: yPosition , delay: 3000, duration: 1500,
      onComplete: function(){
        let odds = this.config.odds;
        if(this.config.odds.min){odds = Phaser.Math.Between(this.config.odds.min, this.config.odds.max);}
        this.scene.creditWinEffect.coinJumnpSingle(player.bet*odds, player, {x: xPosition, y:  (player.position < 2) ? yPosition - 70 : yPosition + 70}, 'GoldWin', playerPosition === this.scene.myPosition ? 1 : 0.2);
        this.scene.tweens.add({
          targets: [this.medal],
          alpha: 0, 
          delay: 5000, 
          duration: 500,
          onComplete: function(){
            this.setActive(false);// kill fish after play all animation
            this.medal.setVisible(false).setActive(false);
            this.game.gameAudio.custom['coinjump3'].play();
            
            //show total win
            this.scene.creditWinEffect.coinMultiple({x: xPosition, y: yPosition}, {x: player.x, y: player.y}, player.position, coinType, textType);

            //fade out and kill boss icon
            this.hideBossIcon();
            this.scene.killBossAnimation = false;
          },
          callbackScope: this
        });
      },
      callbackScope: this
    });
  }

  /*
  * Description: hide the fire dragon icon
  */
  hideBossIcon(){
    this.scene.tweens.add({
      targets: this.medalBossIcon, 
      duration: 500, alpha: 0, scale: 0, 
      onComplete: function(tween, targets){
        targets[0].setActive(false).setVisible(false);
      }
    })
  }
  /*
  * Description: 
  */
  showBossIcon(){
    const player = this.killFishParams.player;
    const x = player.x;
    let y = player.y - Phaser.Math.Between(200, 300);
    if(player.position === 2 | player.position === 3){
      y = player.y + Phaser.Math.Between(200, 300);
    }
    this.medalBossIcon.setPosition(x, y).setActive(true).setVisible(true).setAlpha(0).setScale(0.1);
    this.scene.tweens.add({targets: this.medalBossIcon, duration: 300, alpha: 1, scale: 1})
  }
}