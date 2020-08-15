import Config from '../config';

/*Class*/
import BaseScene from '../Class/Scene/BaseScene';
import BossCrocodile from '../Class/Fish/Fish35';

export default class Crocodile extends BaseScene {
  /*
  * Scene name is require must be the name you register with gmain.js
  */
  constructor() {super('Crocodile');}
  init(){
    this.game.gameAudio.loadCustomAudio([
      'bossCrocodileDie'
    ]);
  }
  preload(){
    this.load.atlas('sceneCrocodile', 'assets/sceneCrocodile.png', 'assets/sceneCrocodile.json');
    this.load.multiatlas('CrocodileAttact', 'assets/CrocodileAttact.json', 'assets');
    this.load.multiatlas('CrocodileSwim', 'assets/CrocodileSwim.json', 'assets');
    this.load.image('crocodileBG', 'assets/crocodileBG.png');
    this.load.image('Crocodile', 'assets/Crocodile.png');//Boss Comming
  }
  
  renderGameScene() {
    this.anims.create({key: 'fish35_swim', frames: this.anims.generateFrameNames('CrocodileSwim', {start: 1, end: 60, prefix: 'swim', suffix: '.png'}), frameRate: 15, repeat: -1});
    this.anims.create({key: 'fish35_attact', frames: this.anims.generateFrameNames('CrocodileAttact', {start: 1, end: 60, prefix: 'attact', suffix: '.png'}), frameRate: 20});
    this.anims.create({key: 'fish35_attact_repeat', frames: this.anims.generateFrameNames('CrocodileAttact', {start: 1, end: 60, prefix: 'attact', suffix: '.png'}), frameRate: 25});
    this.anims.create({key: 'iceIcon', frames: this.anims.generateFrameNames('bombExplode', {start: 1, end: 30, prefix: 'crocodile_multiplier_', suffix: '.png'}), frameRate: 15, repeat: -1});
    this.mainBG = this.add.sprite(Config.gameCenterX, Config.gameCenterY, 'crocodileBG').setDisplaySize(Config.gameWidth+1, Config.gameHeight+10).setAlpha(0).setFlipX(true).setFlipY(true).setActive(false).setVisible(false);
  }
  beforeImportFish(){
    //Render Crocodile
    this.boss = new BossCrocodile(this.matter.world, this, {type: 35, key: "CrocodileSwim", defaultFrame: 'swim1.png', shapeName: 'BossCrocodile', active: false, odds: {min: 100, max: 500}});
    this.boss1 = new BossCrocodile(this.matter.world, this, {type: 35, key: "CrocodileSwim", defaultFrame: 'swim1.png', shapeName: 'BossCrocodile', active: false, odds: {min: 100, max: 500}});
    this.add.existing(this.boss);
    this.add.existing(this.boss1);
    this.fishGroup[35].add(this.boss);
    this.fishGroup[35].add(this.boss1);

    //Render Scene Cover The Crocodile
    this.container = this.add.container(0,0);
    this.container.add(this.add.sprite(Config.gameCenterX-150, 50, 'sceneCrocodile', 'top.png').setOrigin(0.5, 0.5).setAngle(-90));//top
    this.container.add(this.add.sprite(Config.gameCenterX+100, Config.gameHeight+20, 'sceneCrocodile', 'bottom.png').setOrigin(0.4, 0.5).setAngle(-90));//bottom
    this.bgLeft = this.add.sprite(Config.gameWidth*0.35, Config.gameCenterY, 'sceneCrocodile', 'right.png').setFlipX(true).setFlipY(true);
    this.bgRight = this.add.sprite(Config.gameWidth*0.65, Config.gameCenterY, 'sceneCrocodile', 'left.png').setFlipX(true).setFlipY(true);
    
    this.swimPath = [
      //left to right
      {"p":{"x":[-400, 640, 1700], "y":[365, 365, 365]}, "t": 25000, attact: false},//distance: 1700==>standard
      {"p":{"x":[-400, 640, 1700], "y":[700, 365, 100]}, "t": 26500, attact: false},//distance: 1802.7756377319947
      {"p":{"x":[-400, 640, 1700], "y":[100, 365, 600]}, "t": 26058, attact: false},//distance 1772.004514666935

      //right to left
      {"p":{"x":[1700, 640, -400], "y":[365, 365, 365]}, "t": 25000, attact: false},//distance: 1700
      {"p":{"x":[1700, 640, -400], "y":[700, 365, 100]}, "t": 26500, attact: false},//distance: 1802.7756377319947
      {"p":{"x":[1700, 640, -400], "y":[100, 365, 600]}, "t": 26058, attact: false},//distance: 1772.004514666935

      //bottom to top
      {"p":{"x":[1500, 868, 320], "y":[1420, 582, -440]}, "t": 27606, attact: true, attactPlayer: 3},//distance: 1877.2320048411705
      {"p":{"x":[640, 640, 640], "y":[1420, 582, -440]}, "t": 21470, attact: false},// distance: 1460
      {"p":{"x":[-200, 480, 960, 1280], "y":[1420, 582, 0, -440]}, "t": 30572, attact: true, attactPlayer: 2},//distance: 2078.942038634074

      //top to bottom
      {"p":{"x":[1500, 480, 320], "y":[ -440, 582, 1420]}, "t": 27606, attact: true, attactPlayer: 0}, //disatance: 1877.2320048411705
      {"p":{"x":[640, 640, 640], "y":[-440, 582, 1420]}, "t": 21470, attact: false},//distance: 1460
      {"p":{"x":[-140, 480, 1200], "y":[-480, 300, 1420]}, "t": 29142, attact: true, attactPlayer: 2}, //1981.716427746412
    ];
  }
  afterImportFish(){}
  renderTransitionScene(){
    this.sceneTransitionContainer = this.add.container();
    this.sceneTransitionContainer.add([
      this.add.tileSprite(Config.gameCenterX, Config.gameCenterY, Config.gameWidth, Config.gameHeight, 'sceneCover').setDisplaySize(Config.gameWidth, Config.gameHeight),
      this.add.sprite(Config.gameCenterX, Config.gameCenterY, 'logo').setActive(false).setVisible(false),
      this.add.sprite(Config.gameCenterX, Config.gameCenterY,'bgOverlay').setActive(false).setVisible(false)
    ]).setActive(false).setVisible(false);
  }

  /*
  *
  *
  */
  sceneTransitionOut(){
    this.bossTimerEvent.paused = true;//pause timer revive boss
    this.sceneTransitionContainer.setActive(true).setVisible(true);
    //scene cover
    let sceneCover = this.sceneTransitionContainer.getAt(0);
    sceneCover.setAlpha(0).setActive(true).setVisible(true);
    this.tweens.add({targets: sceneCover, alpha: 1, delay: 1000, onComplete: function(tween, targets){targets[0].setActive(false)}})
    //logo
    let logo = this.sceneTransitionContainer.getAt(1).setAlpha(0).setActive(true).setVisible(true);
    this.tweens.add({targets: logo, alpha: 1, delay: 1000});    
    
    this.tweens.add({
      targets: this.sceneTransitionContainer, 
      x: 0, 
      duration: 1000, delay: 3000,
      onComplete: function(){
        this.killAllFish();
        this.sceneTransitionContainer.setActive(false).setVisible(false);
        //render scene 
        let sceneList = ['Crab', 'Octopus', 'Monster'];
        this.scene.transition({target: sceneList[Phaser.Math.Between(0, 2)], duration: 10, sleep: true, allowInput: false})
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
    this.bossTimerEvent.paused = true; //pause boss revive timer
    this.bgLeft.setPosition(Config.gameWidth*0.35, Config.gameCenterY);
    this.bgRight.setPosition(Config.gameWidth*0.65, Config.gameCenterY);
    this.mainBG.setAlpha(0).setActive(false).setVisible(false);
  }

  /*
  *
  *
  */
  bossCome(){
    //stone move
    this.tweens.add({targets: this.bgLeft, x: -280, duration: 3000});
    this.tweens.add({targets: this.bgRight, x: Config.gameWidth + 190, duration: 3000});
    //fade in background
    this.mainBG.setActive(true).setVisible(true);
    this.tweens.add({targets: this.mainBG, alpha: 1, duration: 3000});

    //loop revive boss in 5 min
    let currentBossIndex = 0;
    if(!this.bossTimerEvent){
      this.bossTimerEvent = this.time.addEvent({
        delay: 10000,
        callback: function(){
          //random swim path
          //boss swim
          if(this.canRenderFish){
            if(!this.boss.active){
              let PathRandom = Phaser.Math.Between(0, 11);
              this.boss.swim(this.swimPath[8]);
            }else
            if(!this.boss1.active){
              let PathRandom = Phaser.Math.Between(0, 11);
              this.boss1.swim(this.swimPath[PathRandom]);
            }
          }
          
        },
        callbackScope: this,
        loop: true
      });
    }else{
      this.bossTimerEvent.paused = false;
    }
  }

  multiplier(fish, player){
    if(this.fullScreenMultiplier) return; //block repeat action

    this.fullScreenMultiplier = true;
    this.killBossAnimation = true;
    if(!this.multiplierProperty){
      this.multiplierProperty = {};
      this.multiplierProperty.bossIcon = this.add.sprite(Config.gameCenterX, Config.gameCenterY, 'medal','crocodile.png').setScale(0.9).setVisible(false).setActive(false);
      this.multiplierProperty.crocodile = this.add.sprite(Config.gameCenterX, Config.gameCenterY, 'CrocodileAttact', 'attact1.png').setScale(3).setVisible(false).setActive(false);
      this.multiplierProperty.boom = this.add.sprite(Config.gameCenterX, Config.gameCenterY, 'bombExplode', 'boomExplode1.png').setScale(7).setVisible(false).setActive(false);
      this.multiplierProperty.iceIcon = this.add.sprite(Config.gameCenterX, Config.gameCenterY, 'bombExplode', 'crocodile_multiplier_1.png').setScale(1.5).setVisible(false).setActive(false);
      this.multiplierProperty.text = this.add.bitmapText(Config.gameCenterX, Config.gameCenterY, 'BonusMultiple', "x1", 18).setScale(1.5).setOrigin(0.5).setCenterAlign().setVisible(false).setActive(false);

      this.multiplierProperty.boom.on('animationcomplete', function(currentAnim, currentFrame, sprite){sprite.setVisible(false).setActive(false)})
      this.multiplierProperty.crocodile.on('animationupdate', function(currentAnim, currentFrame, sprite){
        if(currentAnim.key === 'fish35_attact_repeat' && currentFrame.textureFrame === 'attact28.png'){
          this.crocodileAttactTween.setTimeScale(0.1);
          sprite.anims.setTimeScale(0.4);
          this.time.delayedCall(700, function(){

            //bomb explode vs shake camera
            this.game.gameAudio.custom['bombExplode'].play();
            this.tweens.add({targets: [this.multiplierProperty.iceIcon, this.multiplierProperty.text], ease: 'Bounce', scale: 2.5, duration: 50})
            this.tweens.add({targets: [this.multiplierProperty.iceIcon, this.multiplierProperty.text], scale: 1.5, delay: 100, duration: 400})
            this.cameras.main.shake(500, 0.002);
            this.multiplierProperty.boom.setActive(true).setVisible(true).anims.play('bombExplode');

            //return time scale to 1 
            sprite.anims.setTimeScale(1);
            this.crocodileAttactTween.setTimeScale(1);

            //random coin
            if(this.multiplierProperty.player) this.explodeRandomInBounds(this.multiplierProperty.player);
            this.game.gameAudio.custom['killBossMultipleX'+this.multiplierProperty.multiplierCounter].play();
            this.multiplierProperty.multiplierCounter+=1;
            this.multiplierProperty.text.setText('x'+this.multiplierProperty.multiplierCounter);
          },[], this);
        }
      },this);
      this.multiplierProperty.crocodile.on('animationcomplete', function(currentAnim, currentFrame, sprite){if(currentAnim.key === 'fish35_attact_repeat'){sprite.anims.play('fish35_swim')}});
      this.multiplierProperty.iceIcon.on('animationcomplete', function(currentAnim, currentFrame, sprite){if(currentAnim.key ==='medal_explode'){sprite.anims.play('iceIcon')}});
    }

    this.multiplierProperty.player = player;
    this.multiplierProperty.multiplierCounter = 1;
    this.multiplierProperty.bossIcon.setActive(true).setVisible(true).setPosition(player.x, (player.position === 2 | player.position === 3) ? player.y + 250 : player.y - 250);
    this.multiplierProperty.iceIcon.setVisible(true).setActive(true).setPosition(fish.x, fish.y).anims.play('medal_explode');
    this.tweens.add({
      targets: [this.multiplierProperty.iceIcon], 
      x: Config.gameCenterX, 
      y: Config.gameCenterY, 
      delay: 3000, 
      duration: 1000,
      onComplete: function(){
        this.multiplierProperty.text.setVisible(true).setActive(true).setPosition(Config.gameCenterX+15, Config.gameCenterY).setText('x1').setScale(1.5);
        this.bossMultiAttact({fish: fish, player: player, repeat: 1});
      },
      onStart: function(){
        this.game.gameAudio.custom['killCrabBoom'].play();
        this.bossBackgroundMusic.pause();
      },
      callbackScope: this
    });
  }
  bossMultiAttact(data){
    this.game.gameAudio.custom['killBossRepeat'].play({loop: true});
    this.multiplierProperty.crocodile.setActive(true).setVisible(true).setPosition(-Config.gameWidth, Config.gameCenterY);
    this.crocodileAttactTween = this.tweens.add({
      targets: this.multiplierProperty.crocodile,
      x: Config.gameWidth*2,
      repeat: data && data.repeat ? data.repeat : 1,
      yoyo: true,
      duration: 3500,
      hold: 1000,
      onStart: function(){
        this.multiplierProperty.crocodile.setFlipX(false);
        this.multiplierProperty.crocodile.anims.play('fish35_attact_repeat');
      },
      onRepeat: function(tween){
        this.multiplierProperty.crocodile.setFlipX(false);
        this.multiplierProperty.crocodile.anims.play('fish35_attact_repeat');
      },
      onYoyo: function(){
        this.multiplierProperty.crocodile.setFlipX(true);
        this.multiplierProperty.crocodile.anims.play('fish35_attact_repeat');
      },
      onComplete: function(){
        //done multiplier
        this.bossBackgroundMusic.resume(); 
        this.game.gameAudio.custom['blueDragonExplodeEnd'].play();
        this.game.gameAudio.custom['killBossRepeat'].stop();
        this.tweens.add({
          targets:[this.multiplierProperty.iceIcon],
          alpha: 0,
          duration: 500,
          onComplete: function(){
            this.multiplierProperty.crocodile.setActive(false).setVisible(false);
            this.multiplierProperty.boom.setActive(false).setVisible(false);
            this.multiplierProperty.iceIcon.setAlpha(1).setActive(false).setVisible(false);
            this.multiplierProperty.bossIcon.setActive(false).setVisible(false)
            this.fullScreenMultiplier = false;
            this.killBossAnimation = false;
            this.multiplierProperty.player = null;
            data.fish.setActive(false);
          },
          callbackScope:this
        })
        this.tweens.add({
          targets: this.multiplierProperty.text,
          x: data.player.x,
          y: data.player.y,
          onComplete: function(tween, targets){
            targets[0].setActive(false).setVisible(false)
            this.game.gameAudio.custom['bossKilledAddScore'].play();
            let odds = data.fish.config.odds;
            if(data.fish.config.odds.min){odds = Phaser.Math.Between(data.fish.config.odds.min, data.fish.config.odds.max);}
            this.creditWinEffect.showBossCrocodileWin({totalWin: data.player.bet*odds, player: data.player,  position: {x: data.player.x, y: data.player.position < 2 ? data.player.y-100 : data.player.y+ 100}});
          },
          callbackScope: this
        })
      },
      callbackScope: this
    })
  }
}

