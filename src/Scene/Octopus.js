import Helpers from '../helpers';
import Config from '../config';
import Storage from 'local-storage-fallback';
import Translation from '../translation';


/*Class*/
import BaseScene from '../Class/Scene/BaseScene';
import BossOctopus from '../Class/Fish/Fish36';

export default class Octopus extends BaseScene {
  /*
  * Scene name is require must be the name you register with gmain.js
  */
  constructor() {super('Octopus');}
  preload(){
    this.load.multiatlas('bossOctopus', 'assets/bossOctopus.json', 'assets');
    this.load.atlas('sceneOctopus', 'assets/sceneOctopus.png', 'assets/sceneOctopus.json');
    this.load.image('octopusBg1', 'assets/octopusBg1.png');
    this.load.image('octopusBg2', 'assets/octopusBg2.png');
    this.load.atlas('bossOctopusAttact', 'assets/bossOctopusAttact.png', 'assets/bossOctopusAttact.json');
    this.load.atlas('bossOctopusIn', 'assets/bossOctopusIn.png', 'assets/bossOctopusIn.json');
    this.load.atlas('bossOctopusOut', 'assets/bossOctopusOut.png', 'assets/bossOctopusOut.json');
    this.load.image('Octopus', 'assets/Octopus.png');//Boss Comming
    this.load.image('target', 'assets/target.png');
  }
  
  renderGameScene() {
    this.anims.create({key: 'fish36_swim', frames: this.anims.generateFrameNames('bossOctopus', {start: 1, end: 75, prefix: 'swim', suffix: '.png'}), frameRate: 25, repeat: 5});
    this.anims.create({key: 'fish36_in', frames: this.anims.generateFrameNames('bossOctopusIn', {start: 1, end: 31, prefix: 'swimIn', suffix: '.png'}), frameRate: 25});
    this.anims.create({key: 'fish36_out', frames: this.anims.generateFrameNames('bossOctopusOut', {start: 1, end: 31, prefix: 'swimOut', suffix: '.png'}), frameRate: 25});
    this.anims.create({key: 'fish36_attact', frames: this.anims.generateFrameNames('bossOctopusAttact', {start: 1, end: 31, prefix: 'attact', suffix: '.png'}), frameRate: 25, showOnStart: true, hideOnComplete: true});
    
  }
  beforeImportFish(){
    this.sceneContainer = this.add.container(Config.gameCenterX, Config.gameCenterY);
    //SCENE1
    this.scene1 = this.add.sprite(0, 0, 'octopusBg1').setScale(1.1).setActive(true);
    this.scene2 = this.add.sprite(0, 0, 'sceneOctopus','octopusBg2.png').setScale(1.1).setActive(false).setVisible(false).setAlpha(0);
    this.head = this.add.sprite(-10, -40, 'sceneOctopus','octopusHead.png').setAlpha(0.2).setActive(false).setVisible(false).setAlpha(0);
    this.sceneContainer.add([this.scene1, this.scene2, this.head]);

    this.bossPosition = [
      {x: 505, y: 339.5, scale: 0.9, angle: 75 },
      {x: 641, y: 539.5, scale: 1.2, angle: 0 },
      {x: 754, y: 253.5, scale: 1.0, angle: 220 },
      {x: 371, y: 283.5, scale: 1.3, angle: 105 },
      {x: 915, y: 183.5, scale: 1.3, angle: 230 },
      {x: 990, y: 469.5, scale: 1.3, angle: 300 },
    ]

    this.boss = [];
    //left
    this.boss[0] = new BossOctopus(this.matter.world, this, {type: 36, key: "bossOctopus", defaultFrame: 'swim1.png', shapeName: 'OctopusSwim1', active: false, odds: {min: 100, max: 500}});
    this.boss[0].setPosition(505, 339.5).setScale(0.9).setAngle(75);

    // //bottom
    this.boss[1] = new BossOctopus(this.matter.world, this, {type: 36, key: "bossOctopus", defaultFrame: 'swim1.png', shapeName: 'OctopusSwim1', active: false, odds: {min: 100, max: 500}});
    this.boss[1].setPosition(641, 539.5).setScale(1.2).setAngle(0);

    //top right1
    this.boss[2] = new BossOctopus(this.matter.world, this, {type: 36, key: "bossOctopus", defaultFrame: 'swim1.png', shapeName: 'OctopusSwim1', active: false, odds: {min: 100, max: 500}});
    this.boss[2].setPosition(754, 253.5).setScale(1).setAngle(220);

    this.add.existing(this.boss[0]);
    this.add.existing(this.boss[1]);
    this.add.existing(this.boss[2]);

    this.boss[0].targetSprite = this.add.sprite(-200, -200, 'target').setVisible(false).setActive(false);;
    this.boss[1].targetSprite = this.add.sprite(-200, -200, 'target').setVisible(false).setActive(false);;
    this.boss[2].targetSprite = this.add.sprite(-200, -200, 'target').setVisible(false).setActive(false);;



    // let boss = this.boss[2];
    // boss.swim();
    // this.input.keyboard.on('keydown', function (eventName, event) {
    //   if(eventName.key === 'ArrowRight'){
    //     boss.x = boss.x+1;
    //   }
    //   if(eventName.key === 'ArrowLeft'){
    //     boss.x = boss.x-1;
    //   }

    //   if(eventName.key === 'ArrowUp'){
    //     boss.y = boss.y-1;
    //   }
    //   if(eventName.key === 'ArrowDown'){
    //     boss.y = boss.y+1;
    //   }
    //   console.log(boss.x, boss.y);
    // },this);
    //Scene

    // //top-right
    // let s1 = this.add.sprite(891.8079940799838, -73.86128195884862, 'bossOctopus','bgPartial6.png').setAngle(-0.8825461849426119).setScale(1.1);
    // let s2 = this.add.sprite(995.3200592376214,-91.09399616713895, 'bossOctopus','bgPartial5.png').setAngle(0.017453815057534072).setScale(1.1);
    // //left
    // let s3 = this.add.sprite(180.87536900458284,385.06427818756583, 'bossOctopus','bgPartial2.png').setAngle(0.017453815057479005).setScale(1.1);
    // //bottom
    // let s4 = this.add.sprite(607.532667179093, 817.0142083897158, 'bossOctopus','bgPartial1.png').setScale(1.1);
    // //top-left
    // let s5 = this.add.sprite(156.38521769841205, -9.84123946890378, 'bossOctopus','bgPartial3.png').setAngle(1.299999999999840).setScale(1.1);
    // //bottom-left
    // let s6 = this.add.sprite(1156.9934314276384, 735.8621515886286, 'bossOctopus','bgPartial4.png').setAngle(1.7999999999999545).setScale(1.1);
    // this.bossCoverContainer.add([s1, s2, s3, s4, s5, s6])//.setVisible(false);
  }
  afterImportFish(){
    //Add this to group list to force kill when you need
    this.fishGroup[36].add(this.boss[0]);
    this.fishGroup[36].add(this.boss[1]);
    this.fishGroup[36].add(this.boss[2]);
  }

  renderTransitionScene(){
    if(!this.sceneTransitionContainer){
      this.sceneTransitionContainer = this.add.container();
      this.sceneTransitionContainer.add([
        this.add.sprite(-500, Config.gameCenterY,'fish1','fish8_swim_1.png').setActive(false).setVisible(false)
      ]).setActive(false).setVisible(false);
    }
  }

  /*
  *
  *
  *
  *
  */
  sceneTransitionOut(){
    this.bossTimerEvent.paused = true;//pause timer revive boss
    //octopus
    let octopus = this.sceneTransitionContainer.getAt(0).setPosition(-250, Config.gameCenterY).setActive(true).setVisible(true).setScale(6).setTint(0x000000).setAlpha(0.5);
    octopus.anims.play('fish8_swim');
    //octopus swum left to right
    this.tweens.add({
      targets: octopus, x: (Config.gameWidth * 2) + 250, duration: 12000, delay: 2000, 
      onComplete: function(tween, targets){
        targets[0].setActive(false).setVisible(false);
        this.killAllFish();
        let sceneList = ['Crab', 'Crocodile', 'Monster'];
        this.scene.transition({target: sceneList[Phaser.Math.Between(0, 2)], duration: 10, sleep: true, allowInput: false});
        // this.scene.transition({target: 'Crab', duration: 10, sleep: true, allowInput: false});
        this.refreshScene();
      },
      callbackScope: this
    });
  }
  
  refreshScene(){
    this.bossTimerEvent.paused = true; //pause boss revive timer
    this.headTween.pause();
    this.head.setVisible(false).setActive(false);
    this.scene1.setActive(true).setVisible(true).setAlpha(1);
    this.scene2.setActive(false).setVisible(false).setAlpha(0);
    this.timelineProgress = 60;//Config.sceneTimeLine;
    this.sceneMode = 0;
  }
  bossCome(){
    //Hide green bg
    this.tweens.add({targets: [this.scene1], alpha:0, delay: 1000, onComplete: function(tween, targets){ targets[0].setActive(false).setVisible(false)}});
    //Show Red Bg
    this.tweens.add({targets: [this.scene2, this.head],  alpha:1, delay: 1000, onStart: function(tween, targets){targets[0].setAlpha(0).setActive(true).setVisible(true);}});
    //show head
    this.tweens.add({targets: [this.head, this.head],  alpha:0.2, delay: 1000, onStart: function(tween, targets){targets[0].setAlpha(0).setActive(true).setVisible(true);}});
      
    //loop revive boss in 5 min
    if(!this.bossTimerEvent){
      this.bossTimerEvent = this.time.addEvent({delay: 10000, callback: function(){ this.callBossRevive(); }, callbackScope: this, loop: true});
      //The Octopus Head
      this.headTween = this.tweens.add({targets: this.head, props:{alpha: {value:  1, duration: Phaser.Math.Between(3000,6000), yoyo: true, repeat: -1}, x: {value:  "+=30", duration: Phaser.Math.Between(3000,6000), yoyo: true, repeat: -1}, y: {value:  "-=30", duration: Phaser.Math.Between(3000,6000), yoyo: true, repeat: -1}}});
    }else{
      this.bossTimerEvent.paused = false;
      this.headTween.resume();
    }
  }

  callBossRevive(){
    if(!this.canRenderFish) return;
    let boss;
    let slot;
    if(!this.boss[0].active){//2-4
      boss = this.boss[0];
      if(!boss.slot){
        slot = 2;
      }else{
        boss.slot==2 ? slot = 4 : slot = 2;
      }
    }
    if(!this.boss[1].active){//3-0
      boss = this.boss[1];
      if(!boss.slot){
        slot = 3;
      }else{
        boss.slot==3 ? slot = 0 : slot = 3;
      }
    }
    if(!this.boss[2].active){//slot:5-1
      boss = this.boss[2];
      if(!boss.slot){
        slot = 5;
      }else{
        boss.slot==5 ? slot = 1 : slot = 5;
      }
    }
    if(boss) {
      let config = this.bossPosition[slot];
      boss.slot = slot;
      boss.swim(config);
    }
  }



  multiplier(fish, player){
    if(this.fullScreenMultiplier) return; //block repeat action
    this.fullScreenMultiplier = true;
    this.killBossAnimation = true;
    if(!this.multiplierProperty){
      this.multiplierProperty = {};
      this.tentacles = this.add.container();
      this.multiplierProperty.bossIcon = this.add.sprite(Config.gameCenterX, Config.gameCenterY, 'medal','octopus.png').setVisible(false).setActive(false);
      this.multiplierProperty.electricExplode = this.add.sprite(Config.gameCenterX, Config.gameCenterY, 'electicExplode','killExplode1.png').setVisible(false).setActive(false);
      this.multiplierProperty.electricCircle = this.add.sprite(0,0, 'medal','medalExplode1.png').setScale(1.5).setVisible(false).setActive(false);
      this.multiplierProperty.text = this.add.bitmapText(Config.gameCenterX, Config.gameCenterY, 'BonusMultiple', "x1", 18).setOrigin(0.5).setCenterAlign().setScale(1.5).setVisible(false).setActive(false);
      this.multiplierProperty.electricCircle.on('animationcomplete', function(currentAnim, currentFrame, sprite){if(currentAnim.key ==='medal_explode'){sprite.anims.play('electricCircle')}});

      this.tentacles.add([
        this.add.sprite(0, Config.gameCenterY, 'bossOctopusAttact','attact1.png').setFlipX(true).setOrigin(0, 0.5).setVisible(false),//left
        this.add.sprite(Config.gameWidth, Config.gameCenterY, 'bossOctopusAttact','attact1.png').setOrigin(1, 0.5).setVisible(false),//right
        this.add.sprite(Config.gameCenterX, Config.gameCenterY, 'bossOctopusAttact','attact1.png').setAngle(90).setOrigin(0.25, 0.5).setVisible(false),//top
        this.add.sprite(Config.gameCenterX, Config.gameCenterY, 'bossOctopusAttact','attact1.png').setAngle(-90).setOrigin(0.25, 0.5).setVisible(false),//bottom
        this.add.sprite(Config.gameCenterX, Config.gameCenterY, 'bossOctopusAttact','attact1.png').setAngle(-45).setOrigin(0.25, 0.5).setVisible(false),
        this.add.sprite(Config.gameCenterX, Config.gameCenterY, 'bossOctopusAttact','attact1.png').setAngle(-135).setOrigin(0.25, 0.5).setVisible(false),
        this.add.sprite(Config.gameCenterX, Config.gameCenterY, 'bossOctopusAttact','attact1.png').setAngle(45).setOrigin(0.25, 0.5).setVisible(false),
        this.add.sprite(Config.gameCenterX, Config.gameCenterY, 'bossOctopusAttact','attact1.png').setAngle(135).setOrigin(0.20, 0.5).setVisible(false),
      ]).setActive(false).setVisible(false);

    }
    
    this.multiplierProperty.player = player;
    this.multiplierProperty.player = player;
    this.multiplierProperty.multiplierCounter = 1;
    this.multiplierProperty.bossIcon.setActive(true).setVisible(true).setPosition(player.x, (player.position === 2 | player.position === 3) ? player.y + 250 : player.y - 250);
    this.multiplierProperty.electricCircle.setVisible(true).setActive(true).setPosition(fish.x, fish.y).anims.play('medal_explode');
    this.tweens.add({
      targets: [this.multiplierProperty.electricCircle], 
      x: Config.gameCenterX, 
      y: Config.gameCenterY, 
      delay: 2000, 
      duration: 1000,
      onComplete: function(){
        this.multiplierProperty.text.setVisible(true).setActive(true).setPosition(Config.gameCenterX, Config.gameCenterY).setText('x1').setScale(1.5);
        this.bossMultiAttact({fish: fish, player: player, repeat: 5});
      },
      onStart: function(){
        this.game.gameAudio.custom['killCrabBoom'].play();
        this.bossBackgroundMusic.pause();
      },
      callbackScope: this
    });
  }
  bossMultiAttact(params){
    const fish = params.fish;
    const player = params.player;
    const repeat = params.repeat;
    this.tentacles.setActive(true).setVisible(true);
    this.game.gameAudio.custom['killBossRepeat'].play({loop: true});
    this.killBossMultipleX = 0;
    this.isOdd = false;
    this.tweens.addCounter({
      from: 0, to: 1, duration: 2000, delay: 1000,
      repeat: repeat ? repeat : 3,
      onStart: function(){
        this.killBossMultipleX+=1;
        this.tentacles.getAt(4).anims.play('fish36_attact');
        this.tentacles.getAt(7).anims.play('fish36_attact');
        this.game.gameAudio.custom['killBossMultipleX'+this.killBossMultipleX].play();//multiplier sound each repeat
        this.multiplierProperty.electricExplode.setActive(true).setScale(3.5).anims.play('electicKillExplode');
        this.multiplierProperty.text.setText('x'+this.killBossMultipleX).setScale(1.5);
        this.tweens.add({targets: [this.multiplierProperty.electricCircle, this.multiplierProperty.text], ease: 'Bounce', scale: 2.5, duration: 50})
        this.tweens.add({targets: [this.multiplierProperty.electricCircle, this.multiplierProperty.text], scale: 1.5, delay: 100, duration: 400})
      },
      onRepeat: function(tweens){
        this.killBossMultipleX+=1;
        this.game.gameAudio.custom['blueDragonExplode'].play();
        this.game.gameAudio.custom['killBossMultipleX'+this.killBossMultipleX].play();//multiplier sound each repeat
        this.multiplierProperty.text.setText('x'+this.killBossMultipleX);
        if(this.isOdd){
          this.tentacles.getAt(4).anims.play('fish36_attact');
          this.tentacles.getAt(7).anims.play('fish36_attact');
        }else{
          this.tentacles.getAt(5).anims.play('fish36_attact');
          this.tentacles.getAt(6).anims.play('fish36_attact');
        }
        this.tweens.add({targets: [this.multiplierProperty.electricCircle, this.multiplierProperty.text], ease: 'Bounce', scale: 2.5, duration: 50})
        this.tweens.add({targets: [this.multiplierProperty.electricCircle, this.multiplierProperty.text], scale: 1.5, delay: 100, duration: 400})
        this.isOdd = !this.isOdd;
        this.multiplierProperty.electricExplode.setActive(true).setScale(3.5).anims.play('electicKillExplode');
      },
      onComplete: function(){
        this.killBossMultipleX+=1;
        this.tentacles.getAt(0).anims.play('fish36_attact');
        this.tentacles.getAt(1).anims.play('fish36_attact');
        this.tentacles.getAt(2).anims.play('fish36_attact');
        this.tentacles.getAt(3).anims.play('fish36_attact');
        this.tentacles.getAt(4).anims.play('fish36_attact');
        this.tentacles.getAt(5).anims.play('fish36_attact');
        this.tentacles.getAt(6).anims.play('fish36_attact');
        this.tentacles.getAt(7).anims.play('fish36_attact');
        this.game.gameAudio.custom['killBossRepeatFinish'].play();
        this.game.gameAudio.custom['killBossRepeat'].stop();
        this.game.gameAudio.custom['bombExplode'].play();
        this.cameras.main.shake(500, 0.002);
        this.explodeRandomInBounds(player);
        this.multiplierProperty.electricExplode.setActive(true).setScale(7).anims.play('bombExplode');
        this.tweens.addCounter({
          from: 0, to: 1, duration: 2000,
          onComplete: function(){
            //done multiplier
            this.bossBackgroundMusic.resume(); 
          },
          callbackScope:this
        })
        this.multiplierProperty.electricCircle.setActive(false).setVisible(false);
        this.tweens.addCounter({
          from: 0, to: 1, duration: 500, delay: 2000,
          onComplete: function(){
            this.multiplierProperty.bossIcon.setActive(false).setVisible(false)
            this.multiplierProperty.electricExplode.setAlpha(1).setActive(false).setVisible(false);
            this.tentacles.setActive(false).setVisible(false);
            this.fullScreenMultiplier = false;
            this.killBossAnimation = false;
            this.multiplierProperty.player = null;
            fish.setActive(false);
          },
          callbackScope:this
        })
        this.tweens.add({
          delay: 2000, targets: this.multiplierProperty.text, x: player.x, y: player.y,
          onComplete: function(tween, targets){
            targets[0].setActive(false).setVisible(false)
            this.game.gameAudio.custom['bossKilledAddScore'].play();
            let odds = fish.config.odds;
            if(fish.config.odds.min){odds = Phaser.Math.Between(fish.config.odds.min, fish.config.odds.max);}
            this.creditWinEffect.showBossOctopusWin({totalWin: player.bet*odds, player: player,  position: {x: player.x, y: player.position < 2 ? player.y-100 : player.y+ 100}});
          },
          callbackScope: this
        })
      },
      callbackScope: this
    })
  }
}

