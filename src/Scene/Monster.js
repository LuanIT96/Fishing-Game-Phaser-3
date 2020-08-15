import Config from '../config';

/*Class*/
import BaseScene from '../Class/Scene/BaseScene';
import BossLanternFish from '../Class/Fish/Fish33';

export default class Monster extends BaseScene {
  /*
  * Scene name is require must be the name you register with gmain.js
  */
  constructor() {super('Monster');}
  init(){
    this.game.gameAudio.loadCustomAudio([
      'bossMonsterDie'
    ])
  }

  /*
  *
  *
  */
  preload(){
    this.load.multiatlas('bossLanternFish', 'assets/bossLanternFish.json', 'assets');
    this.load.multiatlas('lanternBossExplode', 'assets/lanternBossExplode.json', 'assets');
    this.load.atlas('sceneMonster', 'assets/sceneMonster.png', 'assets/sceneMonster.json');
    this.load.image('bgOverlay', 'assets/bgOverlay.png');
    this.load.image('Monster', 'assets/Monster.png');//Boss Comming
  }

  /*
  *  Use renderGameScene function instead create function
  *  If overwrite create funtion will lost all collide group
  */  
  renderGameScene() {
    //Fish Animation
    this.anims.create({key: 'fish33_swim', frames: this.anims.generateFrameNames('bossLanternFish', {start: 1, end: 60, prefix: 'swim', suffix: '.png'}), frameRate: 15, repeat: -1});
    this.anims.create({key: 'fish33_die', frames: this.anims.generateFrameNames('bossLanternFish', {start: 1, end: 30, prefix: 'die', suffix: '.png'}), frameRate: 18, repeat: 1});
    this.anims.create({key: 'lanternRepeat', frames: this.anims.generateFrameNames('lanternBossExplode', {start: 1, end: 31, prefix: 'lanternExplode', suffix: '.png'}), frameRate: 16, repeat: -1});
    this.anims.create({key: 'lanternRepeat1', frames: this.anims.generateFrameNames('lanternBossExplode', {start: 1, end: 75, prefix: 'lanternExplode', suffix: '.png'}), frameRate: 16, showOnStart: true,hideOnComplete: true});
    this.anims.create({key: 'lanternExplode', frames: this.anims.generateFrameNames('lanternBossExplode', {start: 76, end: 135, prefix: 'lanternExplode', suffix: '.png'}), frameRate: 16});
    
    this.sceneConfig = {scrollBg: false};

    //SCENE1
    this.container0 = this.add.container(0,0);
    this.mainBG1 = this.add.sprite(0, Config.gameCenterY, 'sceneMonster','bg.png').setDisplaySize(Config.gameWidth+1, Config.gameHeight+10).setOrigin(0,0.5)
    this.mainBG2 = this.add.sprite(Config.gameWidth, Config.gameCenterY, 'sceneMonster','bg.png').setDisplaySize(Config.gameWidth+1, Config.gameHeight+10).setOrigin(0,0.5).setFlipX(true);
    this.overlayBakground1 = this.add.sprite(-Config.gameWidth*0.5, 0, 'sceneMonster', 'bgOverlay.png').setAlpha(0.9).setScale(10).setActive(false).setVisible(false)

    this.container = this.add.container(0,0);
    let totalFireFly = 20;
    let xp = 23;
    let yp = 25.5;
    let rdMinX = 315;
    let rdMaxX = 370;
    let rdMinY = 20;
    let rdMaxY = 100;

    let x = {min: rdMinX, max: rdMaxX};
    let y = {min: Config.gameHeight-rdMaxY, max: Config.gameHeight-rdMinY};
    for (var i = 0; i < totalFireFly; ++i){
      x.min = x.min + xp;
      x.max = x.max + xp;
      y.min = y.min - yp;
      y.max = y.max - yp;
      let destX = Phaser.Math.Between(x.min, x.max);
      let destY = Phaser.Math.Between(y.min, y.max);
      let firefly = this.add.sprite(destX, destY, 'sceneMonster','blue.png');
      let firefly1 = this.add.sprite(destX+Phaser.Math.Between(-50, 50), destY+Phaser.Math.Between(-100, 100), 'sceneMonster','blue.png');
      let firefly2 = this.add.sprite(destX+Phaser.Math.Between(-50, 50), destY+Phaser.Math.Between(-100, 100), 'sceneMonster','blue.png');
      firefly.setScale(Phaser.Math.Between(0.1, 0.5));
      firefly1.setScale(Phaser.Math.Between(0.1, 0.5));
      firefly2.setScale(Phaser.Math.Between(0.1, 0.5));

      let duration = Phaser.Math.Between(2000, 4000);

      this.container.add([firefly, firefly1, firefly2]);
      var destY = Config.gameCenterY;
      let scale1 = Phaser.Math.Between(0.3, 1);
      let scale2 = Phaser.Math.Between(0.3, 1);
      let scale3 = Phaser.Math.Between(0.3, 1);
      this.tweens.add({
        targets: [firefly],
        props: {
          x: { value: "+=" + Phaser.Math.Between(30, 80), repeat: -1, duration: duration, ease: 'Sine.easeInOut'},
          y: { value: "-=" + Phaser.Math.Between(5, 50), repeat: -1, yoyo: true, ease: 'Sine.easeInOut'},
          scaleX: {value: scale1, duration: duration, repeat: -1},
          scaleY: {value: scale1, duration: duration, repeat: -1},
          alpha: {value: Phaser.Math.Between(.4, 0.8), duration: duration, yoyo: true, repeat: -1},
        },
        delay: Phaser.Math.Between(0, 1500)
      });
      this.tweens.add({
        targets: [firefly1],
        props: {
          x: { value: "+=" + Phaser.Math.Between(30, 80), repeat: -1, duration: duration, ease: 'Sine.easeInOut'},
          y: { value: "-=" + Phaser.Math.Between(5, 50), repeat: -1, yoyo: true, ease: 'Sine.easeInOut'},
          scaleX: {value: scale2, duration: duration, repeat: -1},
          scaleY: {value: scale2, duration: duration, repeat: -1},
          alpha: {value: Phaser.Math.Between(.4, 0.8), duration: duration, yoyo: true, repeat: -1},
        },
        delay: Phaser.Math.Between(0, 1500)
      });
      this.tweens.add({
        targets: [firefly2],
        props: {
          x: { value: "+=" + Phaser.Math.Between(30, 80), repeat: -1, duration: duration, ease: 'Sine.easeInOut'},
          y: { value: "-=" + Phaser.Math.Between(5, 50), repeat: -1, yoyo: true, ease: 'Sine.easeInOut'},
          scaleX: {value: scale3, duration: duration, repeat: -1},
          scaleY: {value: scale3, duration: duration, repeat: -1},
          alpha: {value: Phaser.Math.Between(.4, 0.8), duration: duration, yoyo: true, repeat: -1}
        },
        delay: Phaser.Math.Between(0, 1500)
      });
    }
    
    //SCENE2
    this.container1 = this.add.container(Config.gameWidth, 0);
    let x1 = {min: rdMinX, max: rdMaxX};
    let y1 = {min: rdMinY, max: rdMaxY};
    for (var i = 0; i < totalFireFly; ++i){
      x1.min = x1.min + xp;
      x1.max = x1.max + xp;
      y1.min = y1.min + xp;
      y1.max = y1.max + yp;
      let destX = Phaser.Math.Between(x1.min, x1.max);
      let destY = Phaser.Math.Between(y1.min, y1.max);
      let firefly = this.add.sprite(destX, destY, 'sceneMonster','blue.png');
      let firefly1 = this.add.sprite(destX+Phaser.Math.Between(-50, 50), destY+Phaser.Math.Between(-100, 100), 'sceneMonster','blue.png');
      let firefly2 = this.add.sprite(destX+Phaser.Math.Between(-50, 50), destY+Phaser.Math.Between(-100, 100), 'sceneMonster','blue.png');
      firefly.destX = destX;
      firefly.destY = destY;
      let scale1 = Phaser.Math.Between(0.3, 1);
      let scale2 = Phaser.Math.Between(0.3, 1);
      let scale3 = Phaser.Math.Between(0.3, 1);

      let duration = Phaser.Math.Between(2000, 4000);
      let randomScale =  Phaser.Math.Between(0.3, 1);

      this.container1.add([firefly, firefly1, firefly2]);
      var destY = Config.gameCenterY;
      this.tweens.add({
        targets: [firefly],
        props: {
          x: { value: "+=" + Phaser.Math.Between(30, 80), repeat: -1, duration: duration, ease: 'Sine.easeInOut'},
          y: { value: "+=" + Phaser.Math.Between(5, 50), repeat: -1, yoyo: true, ease: 'Sine.easeInOut'},
          scaleX: {value: scale1, duration: duration, repeat: -1},
          scaleY: {value: scale1, duration: duration, repeat: -1},
          alpha: {value: Phaser.Math.Between(.4, 0.8), duration: duration, yoyo: true, repeat: -1},
        },
        delay: Phaser.Math.Between(0, 1500)
      });
      this.tweens.add({
        targets: [firefly1],
        props: {
          x: { value: "+=" + Phaser.Math.Between(30, 80), repeat: -1, duration: duration, ease: 'Sine.easeInOut'},
          y: { value: "+=" + Phaser.Math.Between(5, 50), repeat: -1, yoyo: true, ease: 'Sine.easeInOut'},
          scaleX: {value: scale2, duration: duration, repeat: -1},
          scaleY: {value: scale2, duration: duration, repeat: -1},
          alpha: {value: Phaser.Math.Between(.4, 0.8), duration: duration, yoyo: true, repeat: -1},
        },
        delay: Phaser.Math.Between(0, 1500)
      });
      this.tweens.add({
        targets: [firefly2],
        props: {
          x: { value: "+=" + Phaser.Math.Between(30, 80), repeat: -1, duration: duration, ease: 'Sine.easeInOut'},
          y: { value: "+=" + Phaser.Math.Between(5, 50), repeat: -1, yoyo: true, ease: 'Sine.easeInOut'},
          scaleX: {value: scale3, duration: duration, repeat: -1},
          scaleY: {value: scale3, duration: duration, repeat: -1},
          alpha: {value: Phaser.Math.Between(.4, 0.8), duration: duration, yoyo: true, repeat: -1}
        },
        delay: Phaser.Math.Between(0, 1500)
      });
    }
  }

  afterImportFish(){
    this.overlayBakground = this.add.sprite(-Config.gameWidth*0.5, 0, 'bgOverlay').setAlpha(0.7).setScale(12).setActive(false).setVisible(false)
  }

  /*
  *
  *
  */
  beforeImportFish(){
    this.boss = new BossLanternFish(this.matter.world, this, {type: 33, key: "bossLanternFish", defaultFrame: 'swim1.png', shapeName: 'LanternFish', active: false, odds: {min: 100, max: 500}});
    this.add.existing(this.boss);
    this.fishGroup[33].add(this.boss);
    this.swimPath = [
      //left to right
      {"p":{"x":[-400, 640, 1700], "y":[365, 365, 365]}, "t": 25000},//distance: 1700==>standard
      {"p":{"x":[-400, 640, 1700], "y":[700, 365, 100]}, "t": 26500},//distance: 1802.7756377319947
      {"p":{"x":[-400, 640, 1700], "y":[100, 365, 600]}, "t": 26058},//distance 1772.004514666935

      //right to left
      {"p":{"x":[1700, 640, -400], "y":[365, 365, 365]}, "t": 25000},//distance: 1700
      {"p":{"x":[1700, 640, -400], "y":[700, 365, 100]}, "t": 26500},//distance: 1802.7756377319947
      {"p":{"x":[1700, 640, -400], "y":[100, 365, 600]}, "t": 26058},//distance: 1772.004514666935

      //bottom to top
      {"p":{"x":[1500, 868, 320], "y":[1420, 582, -440]}, "t": 27606},//distance: 1877.2320048411705
      {"p":{"x":[640, 640, 640], "y":[1420, 582, -440]}, "t": 21470},// distance: 1460
      {"p":{"x":[-200, 480, 960, 1280], "y":[1420, 582, 0, -440]}, "t": 30572},//distance: 2078.942038634074

      //top to bottom
      {"p":{"x":[1500, 480, 320], "y":[ -440, 582, 1420]}, "t": 27606}, //disatance: 1877.2320048411705
      {"p":{"x":[640, 640, 640], "y":[-440, 582, 1420]}, "t": 21470},//distance: 1460
      {"p":{"x":[-140, 480, 1200], "y":[-480, 300, 1420]}, "t": 29142}, //1981.716427746412
    ];
  }

  /*
  *
  *
  */
  renderTransitionScene(){
    this.sceneTransitionContainer = this.add.container();
    this.sceneTransitionContainer.add([this.add.sprite(Config.gameCenterX, Config.gameCenterY,'bgOverlay').setActive(false).setVisible(false)]).setActive(false).setVisible(false);
  }

  /*
  *
  *
  */
  sceneTransitionOut(){
    this.bossTimerEvent.paused = true;//pause timer revive boss
    this.sceneTransitionContainer.setActive(true).setVisible(true);
    this.tweens.add({
      targets: this.sceneTransitionContainer, 
      x: 0, 
      duration: 10000, delay: 3000,
      onComplete: function(){
        this.refreshScene();

        this.sceneTransitionContainer.setActive(false).setVisible(false);
        //switch scene
        let sceneList = ['Octopus', 'Crocodile', 'Crab'];
        this.scene.transition({target: sceneList[Phaser.Math.Between(0, 2)], duration: 10, sleep: true, allowInput: false})
      },
      callbackScope: this
    });
  }

  /*
  *
  *
  */
  bossCome(){
    this.overlayBakground.setActive(true).setVisible(true).setAlpha(0);
    this.overlayBakground1.setActive(true).setVisible(true).setAlpha(0);
    this.tweens.add({targets: [this.overlayBakground], duration: 2000, alpha: 0.4});
    this.tweens.add({targets: [this.overlayBakground1], duration: 2000, alpha: 0.8, onComplete: function(){this.sceneConfig.scrollBg = true;}, callbackScope: this});

    //loop revive boss in 5 min
    let currentBossIndex = 0;
    if(!this.bossTimerEvent){
      this.bossTimerEvent = this.time.addEvent({
        delay: 10000,
        callback: function(){
          if(this.canRenderFish && !this.boss.active){
            this.boss.swim(this.swimPath[Phaser.Math.Between(0, 11)]);
          }
        },
        callbackScope: this,
        loop: true
      });
    }else{
      this.bossTimerEvent.paused = false;
    }
  }


  /*
  *
  *
  */
  refreshScene(){
    //Cover BG
    this.overlayBakground.setAlpha(0).setActive(false).setVisible(false);
    this.overlayBakground1.setAlpha(0).setActive(false).setVisible(false);

    //Scroll BG
    this.sceneConfig.scrollBg = false;
    this.container.x = 0;
    this.container0.x = 0;
    this.container1.x = Config.gameWidth;
    this.mainBG2.x = Config.gameWidth;
    this.mainBG1.x = 0;

  }
  update(){
    if(this.sceneConfig.scrollBg === true){
      this.container.x -=0.2;
      this.mainBG1.x -=0.2;
      if(this.container.x < -Config.gameWidth){
        this.container.x = Config.gameWidth;
        this.mainBG1.x = Config.gameWidth;
      }
      this.container1.x -=0.2;
      this.mainBG2.x -=0.2;
      if(this.container1.x < -Config.gameWidth){
        this.container1.x = Config.gameWidth;
        this.mainBG2.x = Config.gameWidth;
      }
    }
    //Focus Point
    if(this.boss.active && this.boss.anims.currentAnim.key === 'fish33_swim' && this.boss.focusPoint){
      this.overlayBakground.setPosition(this.boss.focusPoint.x, this.boss.focusPoint.y);
      this.overlayBakground1.setPosition(this.boss.focusPoint.x, this.boss.focusPoint.y);
    }
  }
  mainBossDieCallback(){
    this.overlayBakground1.setPosition(-Config.gameWidth*0.5, 0);
    this.overlayBakground.setPosition(-Config.gameWidth*0.5, 0);
  }

  multiplier(fish, player){
    if(this.fullScreenMultiplier) return; //block repeat action
    this.mainBossDieCallback();//remove the light from fish lantern
    this.fullScreenMultiplier = true;
    this.killBossAnimation = true;
    if(!this.multiplierProperty){
      this.multiplierProperty = {};
      this.multiplierProperty.bossIcon = this.add.sprite(Config.gameCenterX, Config.gameCenterY, 'medal','lanternPower.png').setScale(0.9).setVisible(false).setActive(false);
      this.multiplierProperty.lantern = this.add.sprite(Config.gameCenterX, Config.gameCenterY, 'lanternBossExplode','lanternExplode1.png').setScale(1.5).setVisible(false).setActive(false);
      this.multiplierProperty.lanternExplode = this.add.sprite(Config.gameCenterX, Config.gameCenterY, 'lanternBossExplode','lanternExplode1.png').setScale(2).setVisible(false).setActive(false);
      this.multiplierProperty.text = this.add.bitmapText(Config.gameCenterX, Config.gameCenterY, 'BonusMultiple', "x1", 18).setScale(1.5).setOrigin(0.5).setCenterAlign().setVisible(false).setActive(false);

      this.multiplierProperty.lantern.on('animationupdate', function(currentAnim, currentFrame, sprite){
        if(currentAnim.key === 'lanternRepeat1' && currentFrame.textureFrame === 'lanternExplode35.png'){
          this.multiplierProperty.lanternExplode.setActive(true).setVisible(true).anims.play('lanternExplode');
        }
      },this);
      this.multiplierProperty.lantern.on('animationcomplete', function(currentAnim, currentFrame, sprite){
        if(currentAnim.key ==='medal_explode'){
          sprite.anims.play('lanternRepeat')
        }
      }, this);
      this.multiplierProperty.lanternExplode.on('animationupdate', function(currentAnim, currentFrame, sprite){
        if(currentFrame.textureFrame === 'lanternExplode120.png'){
          this.game.gameAudio.custom['bombExplode'].play();
          this.cameras.main.shake(500, 0.002);
          if(this.multiplierProperty.player) this.explodeRandomInBounds(this.multiplierProperty.player);
        }
      }, this)
    }
    
    this.multiplierProperty.player = player;
    this.multiplierProperty.multiplierCounter = 1;
    this.multiplierProperty.lantern.setVisible(true).setActive(true).setPosition(fish.x, fish.y).anims.play('medal_explode');
    this.multiplierProperty.bossIcon.setActive(true).setVisible(true).setPosition(player.x, (player.position === 2 | player.position === 3) ? player.y + 250 : player.y - 250);
    this.tweens.add({
      targets: [this.multiplierProperty.lantern], 
      x: Config.gameCenterX, 
      y: Config.gameCenterY, 
      delay: 2000, 
      duration: 1000,
      onComplete: function(){
        this.multiplierProperty.text.setVisible(true).setActive(true).setPosition(Config.gameCenterX+15, Config.gameCenterY).setText('x1').setScale(1.5);
        this.bossMultiAttact({fish: fish, player: player, repeat: 2});
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
    this.tweens.addCounter({
      from: 0,
      to: 1,
      repeat: data && data.repeat ? data.repeat : 2,
      duration: 3500,
      repeatDelay: 1000,
      completeDelay: 3000,
      onStart: function(){
        this.multiplierProperty.lantern.anims.play('lanternRepeat1'); 
      },
      onRepeat: function(tween){
        this.multiplierProperty.multiplierCounter+=1;
        this.multiplierProperty.text.setText('x'+this.multiplierProperty.multiplierCounter);
        this.multiplierProperty.lantern.anims.play('lanternRepeat1'); 
      },
      onComplete: function(){
        //done multiplier
        this.bossBackgroundMusic.resume(); 
        this.game.gameAudio.custom['killBossRepeatFinish'].play();
        this.game.gameAudio.custom['killBossRepeat'].stop();
        this.multiplierProperty.lantern.setActive(false).setVisible(false);
        this.tweens.addCounter({
          from: 0, to: 1, duration: 500,
          onComplete: function(){
            this.multiplierProperty.bossIcon.setActive(false).setVisible(false)
            this.multiplierProperty.lanternExplode.setAlpha(1).setActive(false).setVisible(false);
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
            this.creditWinEffect.showBossLanternFishWin({totalWin: data.player.bet*odds, player: data.player,  position: {x: data.player.x, y: data.player.position < 2 ? data.player.y-100 : data.player.y+ 100}});
          },
          callbackScope: this
        })
      },
      callbackScope: this
    })
  }
}

