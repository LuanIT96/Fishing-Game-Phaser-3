import Config from '../../config';
import BigFish from './BigFish';
/*
* Red Dragon
*/
export default class Fish30 extends BigFish {
  constructor(world, scene, config){
    super(world, scene, config);
    
    this.dragonGroup = this.scene.add.group();
    for (var i = 0; i < 4; i++) {
      let sprite = this.scene.add.sprite(0, 0, config.key,'1redDragon.png').setScale(1.5).setVisible(false).setActive(false);
      sprite.on('animationcomplete', function(){sprite.setActive(false).setVisible(false);})
      this.dragonGroup.add(sprite);
    }


    this.explodeGroup = this.scene.add.group();
    for (var i = 0; i < 20; i++) {
      let point = this.scene.rectangleBounds.getRandomPoint();
      let sprite = this.scene.add.sprite(point.x, point.y, 'electicExplode','electricExplode1.png').setVisible(false).setActive(false);
      this.explodeGroup.add(sprite);
      sprite.on('animationstart', function(){sprite.setActive(true).setVisible(true);})
      sprite.on('animationcomplete', function(){
        sprite.setActive(false).setVisible(false);
        if(this.killFishParams && this.killFishParams.player) this.scene.creditWinEffect.showSingleCoinWithoutText({x: sprite.x, y: sprite.y}, {x: this.killFishParams.player.x, y: this.killFishParams.player.y});
      },this)
    }
    this.killEffect = scene.add.sprite(Config.gameCenterX, Config.gameCenterY, 'electicExplode','killExplode1.png').setVisible(false).setActive(false);
    this.killEffect.on('animationcomplete', function(anim, frame){this.killEffect.setActive(false).setVisible(false);},this)
    this.medalBossIcon = scene.add.sprite(0,0, 'medal','redDragon.png').setScale(1).setVisible(false).setActive(false);
    this.medal = scene.add.sprite(0,0, 'medal','medalExplode1.png').setScale(1.5).setVisible(false).setActive(false);
    this.medal.text = this.scene.add.bitmapText(Config.gameCenterX, Config.gameCenterY, 'BonusMultiple', "x1", 18).setOrigin(0.5).setCenterAlign().setVisible(false).setActive(false);
    this.medal.on('animationcomplete', function(anim, frame, sprite){
      if(anim.key ==='medal_explode_single') sprite.anims.play('redDragon')
      if(anim.key ==='medal_explode') sprite.anims.play('redDragonFireBall');
    });
    // this.medalMultiplier = scene.add.sprite(0,0, 'medal','medalExplode1.png').setScale(1.5).setVisible(false).setActive(false);
  }
	swim(){
    this.resetHealth();
    this.killFishParams = null;//reset fish killed params
    /*Add Fish To Collision Group*/
    this.resetHealth();
    //Reset fish position

    this.arr = [0, 1, 2, 3, 4, 5, 6, 7];
    this.maxSwimRepeat = 5;
    this.setActive(true).setAngle(0).setScale(1.8).setOrigin(0.5).setRotation(0).setAlpha(1);
    this.tween = this.scene.tweens.addCounter({
      from: 0, to: 1, duration: 5200, loop: this.maxSwimRepeat,
      onStart: function(){this.start()},
      onLoop: function(){this.start(); this.maxSwimRepeat-=1},
      callbackScope: this
    });
  }
  start(){
    let randomIndex = Phaser.Math.Between(0, this.arr.length);
    this.config.angleType = this.arr[randomIndex];
    this.arr = [0, 1, 2, 3, 4, 5, 6, 7];
    this.arr.splice(randomIndex, 1);

    //Left to right
    if(this.config.angleType === 0){//left to right
      this.setVisible(true).setCollisionGroup(this.scene.physicFishGroup).setAlpha(1).setAngle(0).setPosition(-400, Config.gameCenterY).anims.play('fish'+this.config.type+'_swim');
      this.tweenSwim = this.scene.tweens.add({targets: this, x: Config.gameWidth-10, duration: 3700, onComplete: function(){
        this.setCollisionGroup(-1).setVisible(false);
        if(this.maxSwimRepeat === 0){this.setActive(false)}
      }, callbackScope: this});
    }
    if(this.config.angleType === 1){//right to left
      this.setVisible(true).setCollisionGroup(this.scene.physicFishGroup).setAlpha(1).setAngle(180).setPosition(Config.gameWidth+200, Config.gameCenterY).anims.play('fish'+this.config.type+'_swim')
      this.tweenSwim = this.scene.tweens.add({targets: this,  x: 10,  duration: 3700, onComplete: function(){
        this.setCollisionGroup(-1).setVisible(false);
        if(this.maxSwimRepeat === 0){this.setActive(false)}
      },callbackScope: this});
    }
    if(this.config.angleType === 2){//top to bottom
      this.setVisible(true).setCollisionGroup(this.scene.physicFishGroup).setAlpha(1).setAngle(90).setPosition(Config.gameCenterX, 0).anims.play('fish'+this.config.type+'_swim');
      this.tweenSwim = this.scene.tweens.add({targets: this, y: Config.gameHeight + 10, duration: 3700, onComplete: function(){
        this.setCollisionGroup(-1).setVisible(false);
        if(this.maxSwimRepeat === 0){this.setActive(false)}
      }, callbackScope: this});
    }
    if(this.config.angleType === 3){//bottom to top
      this.setVisible(true).setCollisionGroup(this.scene.physicFishGroup).setAlpha(1).setAngle(-90).setPosition(Config.gameCenterX, Config.gameHeight).anims.play('fish'+this.config.type+'_swim');
      this.tweenSwim = this.scene.tweens.add({targets: this, y: -10, duration: 3700, onComplete: function(){
        this.setCollisionGroup(-1).setVisible(false);
        if(this.maxSwimRepeat === 0){this.setActive(false)}
      }, callbackScope: this});
    } 
    if(this.config.angleType === 4){
      this.setVisible(true).setCollisionGroup(this.scene.physicFishGroup).setAlpha(1).setAngle(20).setPosition(Config.gameWidth*0.1, -300).anims.play('fish'+this.config.type+'_swim');
      this.tweenSwim = this.scene.tweens.add({targets: this, props:{x: {value: Config.gameWidth*0.9, duration: 4000}, y: {value: Config.gameHeight+30, duration: 4000}}, onComplete: function(){
        this.setCollisionGroup(-1).setVisible(false);
        if(this.maxSwimRepeat === 0){this.setActive(false)}
      }, callbackScope: this});
    }
    if(this.config.angleType === 5){
      this.setVisible(true).setCollisionGroup(this.scene.physicFishGroup).setAlpha(1).setAngle(130).setPosition(Config.gameWidth*0.9, -300).anims.play('fish'+this.config.type+'_swim');
      this.tweenSwim = this.scene.tweens.add({targets: this, props:{x: {value: Config.gameWidth*0.1, duration: 4000}, y: {value: Config.gameHeight+30, duration: 4000}}, onComplete: function(){
        this.setCollisionGroup(-1).setVisible(false);
        if(this.maxSwimRepeat === 0){this.setActive(false)}
      }, callbackScope: this});
    }
    if(this.config.angleType === 6){
      this.setVisible(true).setCollisionGroup(this.scene.physicFishGroup).setAlpha(1).setAngle(200).setPosition(Config.gameWidth*0.9, Config.gameHeight+30).anims.play('fish'+this.config.type+'_swim');
      this.tweenSwim = this.scene.tweens.add({targets: this, props:{x: {value: Config.gameWidth*0.1, duration: 4000}, y: {value: -300, duration: 4000}}, onComplete: function(){
        this.setCollisionGroup(-1).setVisible(false);
        if(this.maxSwimRepeat === 0){this.setActive(false)}
      }, callbackScope: this});
    }
    if(this.config.angleType === 7){
      this.setVisible(true).setCollisionGroup(this.scene.physicFishGroup).setAlpha(1).setAngle(310).setPosition(Config.gameWidth*0.1, Config.gameHeight+30).anims.play('fish'+this.config.type+'_swim');
      this.tweenSwim = this.scene.tweens.add({targets: this, props:{x: {value: Config.gameWidth*0.9, duration: 4000}, y: {value: -300, duration: 4000}}, onComplete: function(){
        this.setCollisionGroup(-1).setVisible(false);
        if(this.maxSwimRepeat === 0){this.setActive(false)}
      }, callbackScope: this});
    }
  }
  killFish(params){
    //Block if fish is not alive or playing animation
    if(this.killFishParams) return;

    this.setCollisionGroup(-1);
    this.killFishParams = params;

    this.setTint(0xffffff);
    /*Stop Tween Walk*/
    this.tween.stop();
    /*Stop Animation*/
    this.anims.stop();

    /*Shake Boss*/
    this.game.gameAudio.custom['bossDragonDie'].play();
    this.scene.tweens.add({
      targets: this,
      props: {
          x: { value: '+=5', duration: 30, ease: 'Power2', yoyo: true, repeat: 10},
          y: { value: '-=5', duration: 30, ease: 'Power2', yoyo: true, repeat: 10}
      },
      onComplete: function(){
        this.setVisible(false);//hide but don't kill=>have to wait for all animation then kill fish
        this.scene.creditWinEffect.showCoinExplode({x: this.x, y: this.y});
        this.game.gameAudio.custom['killBoss'].play();

        Phaser.Math.Between(0, 1)===0 ? this.killBossWithMultiplier() : this.killBossAndGetMedal();
      },
      callbackScope: this
    },this);
  }

  /*
  *
  *
  */
  killBossWithMultiplier(){
    this.scene.cameras.main.shake(500, 0.002);
    this.showBossIcon();
    this.medal.setActive(true).setAlpha(true).setVisible(true).setPosition(this.x, this.y).anims.play('medal_explode');
    this.scene.tweens.add({
      targets: [this.medal], x: Config.gameCenterX, y: Config.gameCenterY , delay: 3000, duration: 1000,
      onComplete: function(){
        this.medal.text.setVisible(true).setActive(true).setPosition(Config.gameCenterX, Config.gameCenterY).setText('x1').setScale(1.5);
        this.sceneExplode();
      },
      onStart: function(){
        this.game.gameAudio.custom['killCrabBoom'].play();
        this.scene.bgAudio.pause();
      },
      callbackScope: this
    });
  }

  sceneExplode(){
    // this.scene.cameras.main.shake(500, 0.002);
    // this.killEffect.setActive(true).setScale(6).anims.play('bombExplode');
    // this.scene.tweens.add({targets: [this.medal], ease: 'Bounce', scale: 3, duration: 50})
    const player = this.killFishParams.player;
    let maxLoop = 5;
    let loopTween = this.scene.tweens.add({
      targets: [this.medal], 
      ease: 'Quint.Linear', 
      scale: 1.5, 
      delay: 50, 
      duration: 1000, 
      loop: maxLoop, 
      loopDelay: 1000,
      completeDelay: 1000,
      onStart: function(){
        this.game.gameAudio.custom['redDragonRepeat'].play({loop: true});
        //show text multiplier here
      },
      onLoop: function(){
        //multiplier explode
        this.dragonExplode(loopTween.loopCounter, maxLoop);
      },
      onComplete: function(){
        this.game.gameAudio.custom['redDragonRepeat'].stop();
        this.game.gameAudio.custom['blueDragonExplodeEnd'].play();
        this.scene.cameras.main.shake(2000, 0.002);
        this.medal.setActive(false).setVisible(false);
        this.killEffect.setActive(true).setScale(7).anims.play('bombExplode');
        this.explodeRandomInBounds();
        this.scene.tweens.add({
          targets: this.medal.text,
          delay: 3000,
          x: player.x,
          y: player.y,
          onComplete: function(tween, targets){
            this.medal.setActive(false).setVisible(false);
            this.medal.text.setActive(false).setVisible(false);
            this.setActive(false);
            let odds = this.config.odds;
            if(this.config.odds.min){odds = Phaser.Math.Between(this.config.odds.min, this.config.odds.max);}
            this.scene.creditWinEffect.showBossRedDragonWin({totalWin: player.bet*odds, player: player,  position: {x: player.x, y: player.position < 2 ? player.y-100 : player.y+ 100}});
            this.hideBossIcon();
            this.game.gameAudio.custom['bossKilledAddScore'].play();//play score
            this.scene.bgAudio.resume();//resume background audio
          },
          callbackScope: this
        })
      },
      callbackScope: this
    })
  }
  dragonExplode(loopCounter, maxLoop){
    let type = Phaser.Math.Between(0, 1);
    this.scene.tweens.add({targets: [this.medal], ease: 'Bounce', scale: 3, duration: 50, delay: 300})
    this.scene.time.addEvent({
      delay: 350,
      callback: function(){
        loopCounter === 0 ? this.game.gameAudio.custom['redDragonOut'].play(): false;//play end sound for last explode
        this.medal.multiplierCounter =  maxLoop-loopCounter;
        this.game.gameAudio.custom['killBossMultipleX'+this.medal.multiplierCounter].play();//multiplier sound each repeat
        this.medal.text.setText('x'+this.medal.multiplierCounter);
        this.game.gameAudio.custom['bombExplode'].play();
        this.killEffect.setActive(true).setScale(7).anims.play('bombExplode');
        this.scene.cameras.main.shake(500, 0.002);

        this.scene.tweens.add({targets: [this.medal, this.medal.text], ease: 'Bounce', scale: 2, duration: 50})
        this.scene.tweens.add({targets: [this.medal, this.medal.text], scale: 1.5, delay: 100, duration: 400})
      }, 
      callbackScope: this
    });

    if(type==0){
      let dragon = this.dragonGroup.getFirstDead();
      if(dragon){
        dragon.setPosition(-200, Config.gameCenterY).setActive(true).setVisible(true).setAngle(0).anims.play('fish30_swim_fast');
        this.scene.tweens.add({ targets: dragon, x: Config.gameWidth-10, duration: 1500,onComplete: function(){},callbackScope: this});
      }

      let dragon1 = this.dragonGroup.getFirstDead();
      if(dragon1){
        dragon1.setPosition(Config.gameWidth+200, Config.gameCenterY).setActive(true).setVisible(true).setAngle(180).anims.play('fish30_swim_fast');
        this.scene.tweens.add({ targets: dragon1, x: 10, duration: 1500,onComplete: function(){},callbackScope: this});
      }

      let dragon2 = this.dragonGroup.getFirstDead();
      if(dragon2){
        dragon2.setPosition(Config.gameCenterX, 0).setActive(true).setVisible(true).setAngle(90).anims.play('fish30_swim_fast');
        this.scene.tweens.add({ targets: dragon2, y: Config.gameHeight+10, duration: 1500,onComplete: function(){},callbackScope: this});
      }

      let dragon3 = this.dragonGroup.getFirstDead();
      if(dragon3){
        dragon3.setPosition(Config.gameCenterX, Config.gameHeight).setActive(true).setVisible(true).setAngle(-90).anims.play('fish30_swim_fast');
        this.scene.tweens.add({ targets: dragon3, y: -10, duration: 1500,onComplete: function(){},callbackScope: this});
      }
    }else{
      let dragon = this.dragonGroup.getFirstDead();
      if(dragon){
        dragon.setPosition(Config.gameWidth*0.1, -200).setActive(true).setVisible(true).setAngle(20).anims.play('fish30_swim_fast');
        this.scene.tweens.add({ targets: dragon, props:{x: {value: Config.gameWidth*0.9, duration: 1500}, y: {value: Config.gameHeight+30, duration: 1500}},onComplete: function(){},callbackScope: this});
      }

      let dragon1 = this.dragonGroup.getFirstDead();
      if(dragon1){
        dragon1.setPosition(Config.gameWidth*0.9, -200).setActive(true).setVisible(true).setAngle(130).anims.play('fish30_swim_fast');
        this.scene.tweens.add({ targets: dragon1, props:{x: {value: Config.gameWidth*0.1, duration: 1500}, y: {value: Config.gameHeight+30, duration: 1500}},onComplete: function(){},callbackScope: this});
      }

      let dragon2 = this.dragonGroup.getFirstDead();
      if(dragon2){
        dragon2.setPosition(Config.gameWidth*0.9, Config.gameHeight+30).setActive(true).setVisible(true).setAngle(200).anims.play('fish30_swim_fast');
        this.scene.tweens.add({ targets: dragon2, props:{x: {value: Config.gameWidth*0.1, duration: 1500}, y: {value: -200, duration: 1500}},onComplete: function(){},callbackScope: this});
      }

      let dragon3 = this.dragonGroup.getFirstDead();
      if(dragon3){
        dragon3.setPosition(Config.gameWidth*0.1, Config.gameHeight+30).setActive(true).setVisible(true).setAngle(310).anims.play('fish30_swim_fast');
        this.scene.tweens.add({ targets: dragon3, props:{x: {value: Config.gameWidth*0.9, duration: 1500}, y: {value: -200, duration: 1500}},onComplete: function(){},callbackScope: this});
      }
    }
  }

  explodeRandomInBounds(){
    this.explodeGroup.getChildren().forEach(function(sprite, index){
      sprite.anims.delayedPlay(Phaser.Math.Between(300, 1000), 'electicExplode');
    })
  }

  /*
  * 
  *
  */
  killBossAndGetMedal(){
    const coinType = this.killFishParams.coinType;
    const textType = this.killFishParams.textType;
    const player = this.killFishParams.player;
    const playerPosition = player.position;
    let yPosition = (player.position < 2) ? (player.y - 300) : (player.y + 300);
    let xPosition = player.x;
    this.scene.cameras.main.shake(500, 0.002);
    this.medal.setScale(1.2).setActive(true).setAlpha(true).setVisible(true).setPosition(this.x, this.y).anims.play('medal_explode_single');
    this.showBossIcon();
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
            this.medal.setVisible(false).setActive(false);
            this.game.gameAudio.custom['coinjump3'].play();
            
            //show total win
            this.scene.creditWinEffect.coinMultiple({x: xPosition, y: yPosition}, {x: player.x, y: player.y}, player.position, coinType, textType);

            //fade out and kill boss icon
            this.hideBossIcon();

            this.setActive(false);// kill fish after play all animation
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
    let y = player.y - 250;
    if(player.position === 2 | player.position === 3){
      y = player.y + 250;
    }
    this.medalBossIcon.setPosition(x, y).setActive(true).setVisible(true).setAlpha(0).setScale(0.1);
    this.scene.tweens.add({targets: this.medalBossIcon, duration: 300, alpha: 1, scale: 1})
  }
}