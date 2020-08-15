import Config from '../config';

/*Class*/
import BaseScene from '../Class/Scene/BaseScene';
import BossCrab from '../Class/Fish/Fish34';

export default class Crab extends BaseScene {
  /*
  * Scene name is require must be the name you register with gmain.js
  */
  constructor() {super('Crab');}
  init(){
    this.game.gameAudio.loadCustomAudio([
      'bossCrabDie'
    ])
  }
  preload(){
    this.load.atlas('sceneCrab', 'assets/sceneCrab.png', 'assets/sceneCrab.json');
    this.load.multiatlas('bossCrabAttact', 'assets/bossCrabAttact.json', 'assets');
    this.load.atlas('bossCrabDie', 'assets/bossCrabDie.png', 'assets/bossCrabDie.json');
    this.load.atlas('bossCrabSwim', 'assets/bossCrabSwim.png', 'assets/bossCrabSwim.json');
    this.load.image('Crab', 'assets/Crab.png');//Boss Comming
  }
  
  renderGameScene() {
    this.anims.create({key: 'fish34_swim', frames: this.anims.generateFrameNames('bossCrabSwim', {start: 1, end: 20, prefix: 'swim', suffix: '.png'}), frameRate: 18, repeat: -1});
    this.anims.create({key: 'fish34_swim_fast', frames: this.anims.generateFrameNames('bossCrabSwim', {start: 1, end: 20, prefix: 'swim', suffix: '.png'}), frameRate: 22, repeat: -1});
    this.anims.create({key: 'fish34_die', frames: this.anims.generateFrameNames('bossCrabDie', {start: 1, end: 40, prefix: 'die', suffix: '.png'}), frameRate: 16});
    this.anims.create({key: 'fish34_hit', frames: this.anims.generateFrameNames('bossCrabAttact', {start: 1, end: 27, prefix: 'hit', suffix: '.png'}), frameRate: 15});
    this.anims.create({key: 'fish34_last_hit', frames: this.anims.generateFrameNames('bossCrabAttact', {start: 28, end: 40, prefix: 'hit', suffix: '.png'}), frameRate: 14});

    //SCENE1
    this.add.sprite(Config.gameCenterX, Config.gameCenterY, 'sceneCrab','bg.png').setDisplaySize(Config.gameWidth+50, Config.gameHeight+50).setActive(false);
    this.stone = this.add.sprite(Config.gameCenterX, Config.gameCenterY, 'sceneCrab','stone.png');
    
  }

  /*
  *
  *
  */
  beforeImportFish(){
    this.bossCrab = new BossCrab(this.matter.world, this, {type: 34, key: "bossCrabSwim", defaultFrame: 'swim1.png', shapeName: 'BossCrab', active: false, odds: {min: 100, max: 500}});
    this.add.existing(this.bossCrab);
    this.fishGroup[34].add(this.bossCrab);

    this.bossCrab1 = new BossCrab(this.matter.world, this, {type: 34, key: "bossCrabSwim", defaultFrame: 'swim1.png', shapeName: 'BossCrab', active: false, odds: {min: 100, max: 500}});
    this.add.existing(this.bossCrab1);
    this.fishGroup[34].add(this.bossCrab1);
  }

  /*
  *
  *
  */
  afterImportFish(){
    this.crabLeft = this.add.sprite(-230, Config.gameCenterY, 'bossCrabAttact','hit1.png').setAngle(-90).setScale(1.6).setActive(false).setVisible(false);
    this.crabRight = this.add.sprite(Config.gameWidth+230, Config.gameCenterY, 'bossCrabAttact','hit1.png').setAngle(90).setScale(1.6).setActive(false).setVisible(false);

    //Crab Hit
    this.crabLeft.on('animationupdate', function(currentAnim, currentFrame, sprite){
      if(currentAnim.key === 'fish34_hit' && currentFrame.textureFrame === 'hit10.png'){
        this.crabMedal.emit('explode');
      }
    },this);
    this.crabRight.on('animationupdate', function(currentAnim, currentFrame, sprite){
      if(currentAnim.key === 'fish34_hit' && currentFrame.textureFrame === 'hit10.png'){
        this.crabMedal.emit('explode');
      }
      //Crab Last hit
      if(currentAnim.key === 'fish34_last_hit' && currentFrame.textureFrame === 'hit30.png'){
        this.crabMedal.emit('last_hit_explode');
      }
    },this);

    //Explode When kill Crab
    this.killEffect = this.add.sprite(Config.gameCenterX, Config.gameCenterY, 'electicExplode','killExplode1.png').setVisible(false).setActive(false);
    this.killEffect.on('animationcomplete', function(currentAnim, currentFrame, sprite){sprite.setActive(false).setVisible(false);})
    this.crabMedal = this.add.sprite(0,0, 'medal','medalExplode1.png').setScale(1.5).setVisible(false).setActive(false);
    this.crabMedal.bossIcon = this.add.sprite(Config.gameCenterX, Config.gameCenterY, 'medal','crabPower.png').setScale(0.9).setVisible(false).setActive(false);
    this.crabMedal.text = this.add.bitmapText(Config.gameCenterX, Config.gameCenterY, 'BonusMultiple', "x1", 20).setScale(1.5).setOrigin(0.5).setCenterAlign().setVisible(false).setActive(false);
    this.crabMedal.on('animationcomplete', function(currentAnim, currentFrame, sprite){
      if(currentAnim.key ==='medal_explode'){
        sprite.anims.play('electricCircle');
      }
    },this);
  
    this.crabMedal.addListener('explode',function(){
      this.killEffect.setActive(true).setScale(3.5).anims.play('electicKillExplode');
      this.cameras.main.shake(500, 0.002);
      this.game.gameAudio.custom['blueDragonExplode'].play();
      this.game.gameAudio.custom['killBossMultipleX'+this.killBossMultipleX].play();//multiplier sound each repeat
      this.crabMedal.text.setText('x'+this.killBossMultipleX);
      this.tweens.add({targets: [this.crabMedal, this.crabMedal.text], scale: 1.5, delay: 100, duration: 400})
      this.tweens.add({targets: [this.crabMedal, this.crabMedal.text], ease: 'Bounce', scale: 2.5, duration: 50})
    },this);
    this.crabMedal.addListener('last_hit_explode',function(){
      this.crabMedal.setVisible(false).setActive(false);
      this.killEffect.anims.stop();
      this.killEffect.setActive(true).setScale(7).anims.play('bombExplode');
      this.game.gameAudio.custom['bombExplode'].play();
      this.game.gameAudio.custom['killBossRepeatFinish'].play();
      this.crabExplodeRandomInBounds();
      //Last hit 
      // this.players[this.crabMedal.playerPosition]
    },this);
  }


  /*
  * Last explode
  */
  crabExplodeRandomInBounds(){
    this.bossBackgroundMusic.resume(); 
    this.game.gameAudio.custom['killBossRepeat'].stop();
    this.explodeRandomInBounds(this.crabMedal.player);
    const fish = this.crabMedal.fish;
    const player = this.crabMedal.player;
    this.tweens.add({
      targets: this.crabMedal.text,
      delay: 1000,
      x: this.crabMedal.player.x,
      y: this.crabMedal.player.y,
      onComplete: function(tween, targets){
        this.game.gameAudio.custom['bossKilledAddScore'].play();
        let odds = this.crabMedal.fish.config.odds;
        if(fish.config.odds.min){odds = Phaser.Math.Between(fish.config.odds.min, fish.config.odds.max);}
        this.creditWinEffect.showBossCrocodileWin({totalWin: player.bet*odds, player: player,  position: {x: player.x, y: player.position < 2 ? player.y-100 : player.y+ 100}});

        fish.setActive(false);
        this.crabMedal.fish = null;
        this.crabMedal.player = null;

        this.crabMedal.setActive(false).setVisible(false);
        this.crabMedal.text.setActive(false).setVisible(false);
        this.crabMedal.bossIcon.setActive(false).setVisible(false);
        this.fullScreenMultiplier = false;
        this.killBossAnimation = false;
      },
      callbackScope: this
    })
  }

  /*
  *
  *
  */
  renderTransitionScene(){
    if(!this.sceneTransitionContainer){
      this.sceneTransitionContainer = this.add.container();
      this.sceneTransitionContainer.add([
        this.add.sprite(-500, Config.gameCenterY, 'bossCrabSwim', 'swim1.png').setScale(1.5).setTint(0x000000).setAlpha(0.5).setActive(false).setVisible(false),
        this.add.sprite(-1000, Config.gameCenterY, 'bossCrabSwim', 'swim1.png').setScale(0.5).setTint(0x000000).setAlpha(0.5).setActive(false).setVisible(false),
        this.add.sprite(-1250, Config.gameCenterY, 'bossCrabSwim', 'swim1.png').setScale(0.5).setTint(0x000000).setAlpha(0.5).setActive(false).setVisible(false),
        this.add.sprite(-1500, Config.gameCenterY, 'bossCrabSwim', 'swim1.png').setScale(0.5).setTint(0x000000).setAlpha(0.5).setActive(false).setVisible(false),
        this.add.sprite(-1750, Config.gameCenterY, 'bossCrabSwim', 'swim1.png').setScale(0.5).setTint(0x000000).setAlpha(0.5).setActive(false).setVisible(false)
      ]);
    }
  }

  /*
  *
  *
  */
  sceneTransitionOut(){
    this.bossTimerEvent.paused = true;//pause timer revive boss1
    this.bossTimerEvent1.paused = true;//pause timer revive boss2

    let crab1 = this.sceneTransitionContainer.getAt(0).anims.play('fish34_swim_fast');
    let crab2 = this.sceneTransitionContainer.getAt(1).anims.play('fish34_swim_fast');
    let crab3 = this.sceneTransitionContainer.getAt(2).anims.play('fish34_swim_fast');
    let crab4 = this.sceneTransitionContainer.getAt(3).anims.play('fish34_swim_fast');
    let crab5 = this.sceneTransitionContainer.getAt(4).anims.play('fish34_swim_fast');
    let crab6 = this.sceneTransitionContainer.setActive(true).setVisible(true);
    this.tweens.add({
      targets: [crab1, crab2, crab3, crab4, crab5, crab6], 
      x: Config.gameWidth + 500, duration: 14000, delay: 2000,
      onComplete: function(){
        crab1.setActive(false).setVisible(false);
        crab2.setActive(false).setVisible(false);
        crab3.setActive(false).setVisible(false);
        crab4.setActive(false).setVisible(false);
        crab5.setActive(false).setVisible(false);
        crab6.setActive(false).setVisible(false);
        this.sceneTransitionContainer.setActive(false).setVisible(false);
        this.killAllFish();

        //switch scene
        let sceneList = ['Octopus', 'Crocodile', 'Monster'];
        this.scene.transition({target: sceneList[Phaser.Math.Between(0, 2)], duration: 10, sleep: true, allowInput: false});
        // this.scene.transition({target: 'Octopus', duration: 10, sleep: true, allowInput: false});
        this.refreshScene();
      },
      callbackScope: this
    });
  }

  /*
  *
  *
  */
  refreshScene(){
    this.stoneTween.stop();
    this.stone.setScale(1);
  }

  /*
  *
  *
  */
  bossCome(){
    //The Stone Effect
    this.tweens.add({targets:[this.stone], scale: 0.7, duration: 5000})
    this.stoneTween = this.tweens.add({targets:[this.stone], scale: 0.65, duration: 3000, delay: 5000, yoyo: true, repeat: -1})

    //Fade out all fish on scene
    this.bgAudio.pause();
    this.bossBackgroundMusic.play({loop: true, volume: 0.6});

    //load fish and revive fish if get killed
    if(this.bossTimerEvent){
      this.bossTimerEvent.paused = false;
      this.bossTimerEvent1.paused = false;
    }else{
      this.bossTimerEvent = this.time.addEvent({
        delay: Phaser.Math.Between(3000, 10000), 
        callback: function(){
          if(!this.bossCrab.active && this.canRenderFish) this.bossCrab.swim();
        }, 
        callbackScope: this,  
        loop: -1
      });
      this.bossTimerEvent1 =  this.time.addEvent({delay: Phaser.Math.Between(4000, 10000), 
        callback: function(){
          if(!this.bossCrab1.active && this.canRenderFish) this.bossCrab1.swim();
        }, 
        callbackScope: this,  
        loop: -1
      });
    }
  }

  /*
  *
  *
  */
  multiplier(fish, player){
    if(this.fullScreenMultiplier) return;
    this.fullScreenMultiplier = true;
    this.killBossAnimation = true; 
    this.cameras.main.shake(500, 0.002);
    this.crabMedal.setScale(1.5).setActive(true).setAlpha(true).setVisible(true).setPosition(fish.x, fish.y).anims.play('medal_explode');
    this.crabMedal.bossIcon.setActive(true).setVisible(true).setPosition(player.x, (player.position === 2 | player.position === 3) ? player.y + 250 : player.y - 250);

    this.crabMedal.fish = fish;
    this.crabMedal.player = player;
    this.creditWinEffect.showCoinExplode({x: fish.x, y: fish.y});
    this.game.gameAudio.custom['killBoss'].play();

    this.tweens.add({
      targets: [this.crabMedal], x: Config.gameCenterX, y: Config.gameCenterY , delay: 3000, duration: 1000,
      onComplete: function(){
        this.crabMedal.text.setVisible(true).setActive(true).setText('x1').setPosition(Config.gameCenterX+15, Config.gameCenterY).setScale(1.5);
        this.showBossMultiplier();
      },
      onStart: function(){
        this.game.gameAudio.custom['killCrabBoom'].play();
        this.bossBackgroundMusic.pause();
      },
      callbackScope: this
    });
  }

  /*
  *
  *
  */
  showBossMultiplier(maxLoop=6){
    this.killBossMultipleX = 0;
    let LeftSize = true;
    let loopTween = this.tweens.addCounter({
      from: 0, to:1, duration: 700,  loop: maxLoop, loopDelay: 700,
      onStart: function(){
        this.game.gameAudio.custom['killBossRepeat'].play({loop: true});
      },
      onLoop: function(){
        let loopCounter = loopTween.loopCounter;
        this.killBossMultipleX +=1;

        if(loopCounter > 1){
          if(LeftSize){
            LeftSize = false;
            this.crabLeftAttact();
          }else{
            LeftSize = true;
            this.crabRightAttact();
          }  
        }

        //Wait to last hit
        if(loopCounter === 1){
          if(LeftSize){
            LeftSize = false;
            this.crabLeftAttact(false);
          }else{
            LeftSize = true;
            this.crabRightAttact(false);
          }
        }

        if(loopCounter === 0){
          if(LeftSize){
            LeftSize = false;
            this.crabLeftAttact(true, true);
          }else{
            LeftSize = true;
            this.crabRightAttact(true, true);
          }
        }
      },
      onComplete: function(){
        //Last Explde
        if(LeftSize === true){
          this.crabLeft.anims.play('fish34_last_hit');
          this.tweens.add({ targets: this.crabLeft, x: -230, duration: 1000, delay: 1000, onStart: function(){this.crabLeft.anims.play('fish34_swim');}, onComplete: function(){this.crabLeft.setActive(false).setVisible(false);}, callbackScope: this});
        }
        if(LeftSize === false){
          this.crabRight.anims.play('fish34_last_hit');
          this.tweens.add({ targets: this.crabRight, x: Config.gameWidth+230, duration: 1000, delay: 1000, onStart: function(){this.crabRight.anims.play('fish34_swim');}, onComplete: function(){this.crabRight.setActive(false).setVisible(false);}, callbackScope: this});
        }
      },
      callbackScope: this
    })
  }
  crabLeftAttact(YoyoTween=true, IsLastHit=false){
    this.crabLeft.setActive(true).setVisible(true).anims.play('fish34_swim');
    this.tweens.add({
      targets: this.crabLeft,  x: Config.gameCenterX-220, yoyo: YoyoTween, duration: 700, hold: 900,
      onYoyo: function(){this.crabLeft.anims.play('fish34_swim');}, 
      onComplete: function(){
        if(YoyoTween) this.crabLeft.setActive(false).setVisible(false);
        if(!YoyoTween) this.crabLeft.anims.play('fish34_swim');
      },
      callbackScope: this
    });
    this.time.delayedCall(700, function(){(!IsLastHit) ?  this.crabLeft.anims.play('fish34_hit') :  this.crabLeft.anims.play('fish34_last_hit');}, [], this);
  }
  crabRightAttact(YoyoTween=true, IsLastHit=false){
    this.crabRight.setActive(true).setVisible(true).anims.play('fish34_swim');
    this.tweens.add({
      targets: this.crabRight, x: Config.gameCenterX + 250, yoyo: YoyoTween, duration: 700, hold: 900,
      onYoyo: function(){this.crabRight.anims.play('fish34_swim');}, 
      onComplete: function(){
        if(YoyoTween) this.crabRight.setActive(false).setVisible(false);
        if(!YoyoTween) this.crabRight.anims.play('fish34_swim');
      },
      callbackScope: this
    });
    this.time.delayedCall(700, function(){(!IsLastHit) ?  this.crabRight.anims.play('fish34_hit') :  this.crabRight.anims.play('fish34_last_hit') ;}, [], this);
  }
}

