import Config from '../../config';
import BigFish from './BigFish';
/*
* Dragon Tutle
*/
export default class Fish32 extends BigFish {
  constructor(world, scene, config){
    super(world, scene, config);
    this.shadow = null;
    this.setCollisionGroup(-1).setScale(1.5);

    this.on('animationstart', function (anim, frame) {
      //enable physic when the boss start to walk
      if(anim.key === 'fish32_swim'){
        this.setCollisionGroup(this.scene.physicFishGroup);
        this.hit = false;
        this.isWalking = true;
      }
    },this);
    let crackLeft = scene.add.sprite(0, 0, 'dragonTurtleWalkExplode', 'crack.png').setActive(false).setVisible(false);
    let crackRight = scene.add.sprite(0, 0, 'dragonTurtleWalkExplode', 'crack.png').setActive(false).setVisible(false);
    let stepExplode = scene.add.sprite(0, 0, 'dragonTurtleWalkExplode', 'walkExplode1.png').setScale(3).setActive(false).setVisible(false);
    stepExplode.on('animationcomplete', function(){stepExplode.setActive(false).setVisible(false);});

    this.on('animationcomplete', function (anim, frame) {
      if(anim.key === 'dragonTurtleCome'){
        this.play('fish32_swim');
        let distance = parseInt(Phaser.Math.Distance.Between(this.config.arr[this.config.arr.length-1][0], this.config.arr[this.config.arr.length-1][1], this.config.targetPos[0], this.config.targetPos[1]));
        let duration =  parseInt(distance/0.05);

        //Walk to target Position
        this.tween = scene.tweens.add({
          targets: [this], 
          x: this.config.targetPos[0], 
          y: this.config.targetPos[1],
          duration: duration,
          onComplete: function(){
            this.anims.stop();
            this.setVisible(false).setActive(false);
          },
          onUpdate: function(){
            if(this.tween.timeScale > 0.1){
              this.tween.setTimeScale(this.tween.timeScale-0.02);
            }else{
              this.tween.setTimeScale(0.1);
            }

            //Check Step Walk
            if(this.anims.currentFrame.textureFrame === "dragonTurleWalk12.png") {this.tween.setTimeScale(3);}
            if(this.anims.currentFrame.textureFrame === "dragonTurleWalk30.png") {this.tween.setTimeScale(3);}
          },
          callbackScope: this
        },this);
      }
    },this);
    this.on('animationupdate', function(currentAnim, currentFrame, sprite){
      //Step left
      if(currentFrame.textureFrame == 'dragonTurleWalk7.png'){
        this.game.gameAudio.custom['dragonTurtleStep'].play();
        stepExplode.setActive(true).setPosition(this.x, this.y).anims.play('dragonTurtleWalkExplode');
        crackLeft.setVisible(true).setActive(true).setAlpha(1).setPosition(this.x+120 , this.y-60);
        this.scene.tweens.add({targets: crackLeft, alpha: 0, duration: 700, delay: 500, onComplete: function(twn, targets){targets[0].setVisible(false).setActive(false);}});
      }
      else 
      //Step right
      if(currentFrame.textureFrame == 'dragonTurleWalk26.png'){
        this.game.gameAudio.custom['dragonTurtleStep'].play();
        stepExplode.setActive(true).setPosition(this.x, this.y).anims.play('dragonTurtleWalkExplode');
        crackRight.setVisible(true).setActive(true).setAlpha(1).setPosition(this.x+120 , this.y+60);
        this.scene.tweens.add({targets: crackRight, alpha: 0, duration: 700, delay: 500, onComplete: function(twn, targets){targets[0].setVisible(false).setActive(false);}});
      }

      //Come Explode
      if(currentFrame.textureFrame == 'dragonTurtleIn4.png'){
        this.game.gameAudio.custom['bombExplode'].play();
        this.game.gameAudio.custom['DragonTurtleIn'].stop();
      }
    },this);

    this.medalBossIcon = scene.add.sprite(0,0, 'medal','dragonTurtle.png').setScale(1).setVisible(false).setActive(false);
    this.medal = scene.add.sprite(0,0, 'medal','medalExplode1.png').setScale(1).setVisible(false).setActive(false);
    this.medal.text = this.scene.add.bitmapText(Config.gameCenterX, Config.gameCenterY, 'BonusMultiple', "x1", 18).setOrigin(0.5).setCenterAlign().setVisible(false).setActive(false);
    this.medal.on('animationcomplete', function(anim, frame){
      if(anim.key ==='medal_explode'){this.medal.anims.play('dragonTurtleRotateDie');}
      if(anim.key ==='medal_explode_single'){this.medal.anims.play('medal_dragonTurtle');}
      
    },this);
    this.killEffect = scene.add.sprite(Config.gameCenterX, Config.gameCenterY, 'fireScene','fireSceneExplode1.png').setScale(2).setVisible(false).setActive(false);
    this.killEffect.on('animationcomplete', function(anim, frame){this.killEffect.setActive(false).setVisible(false)},this)
    this.killEffect.on('animationstart', function(anim, frame){this.killEffect.setActive(true).setVisible(true)},this)
    

    
    this.fireWallLeft = scene.add.sprite(0, 0, 'fireWall','wallLeft1.png').setScale(2).setOrigin(0, 0).setActive(false).setVisible(false);
    this.fireWallRight = scene.add.sprite(Config.gameWidth, 0, 'fireWall','wallRight1.png').setScale(2).setOrigin(1, 0).setActive(false).setVisible(false);
    this.fireWallTop = scene.add.sprite(Config.gameCenterX, 0, 'fireWall','wallTop1.png').setScale(2).setOrigin(0.5, 0).setActive(false).setVisible(false);
    this.fireWallBottom = scene.add.sprite(Config.gameCenterX, Config.gameHeight, 'fireWall','wallBottom1.png').setScale(2).setOrigin(0.5, 1).setActive(false).setVisible(false);
    this.fireWallLeft.on('animationcomplete', function(anim, frame){this.fireWallLeft.setActive(false).setVisible(false);},this)
    this.fireWallRight.on('animationcomplete', function(anim, frame){this.fireWallRight.setActive(false).setVisible(false);},this)
    this.fireWallTop.on('animationcomplete', function(anim, frame){this.fireWallTop.setActive(false).setVisible(false);},this)
    this.fireWallBottom.on('animationcomplete', function(anim, frame){this.fireWallBottom.setActive(false).setVisible(false);},this)


    this.swimPath = [
      {//left to right
        arr: [
          [0, 0],  
          [Config.gameCenterX, Config.gameHeight], 
          [Config.gameWidth, Config.gameCenterY], 
          [Config.gameCenterY, 0], [100, Config.gameCenterY]
        ] ,
        targetPos: [Config.gameWidth*1.5, Config.gameCenterY]
      },
      {//right to left
        arr: [
          [100, Config.gameHeight],  
          [Config.gameCenterX*0.5, 0], 
          [Config.gameCenterX, Config.gameHeight], 
          [Config.gameCenterX*1.5, 0], 
          [Config.gameWidth-100, Config.gameCenterY]
        ],
        targetPos: [-Config.gameCenterX, Config.gameCenterY]
      },
      {//top-left to right-bottom
        arr: [
          [Config.gameWidth, 0],  
          [Config.gameCenterX*1.5, Config.gameHeight], 
          [Config.gameCenterX, 0], 
          [Config.gameCenterX*0.5, Config.gameHeight], [100, 100]
        ] ,
        targetPos: [Config.gameWidth*1.5, Config.gameHeight*1.5]
      },
      {//bottom-left to right-top
        arr: [
          [Config.gameWidth, Config.gameHeight],  
          [Config.gameCenterX*1.75, 0], 
          [Config.gameCenterX, Config.gameHeight], 
          [Config.gameCenterX*0.5, 0], [100, Config.gameHeight-100]
        ] ,
        targetPos: [Config.gameWidth*1.5, -400]
      },

      {//right-bottom-to-top-left
        arr: [
          [0, Config.gameHeight],  
          [Config.gameCenterX*0.5, 0], 
          [Config.gameCenterX, Config.gameHeight], 
          [Config.gameCenterX*1.5, 0], [Config.gameWidth-100, Config.gameHeight-100]
        ] ,
        targetPos: [-Config.gameCenterX, -400]
      },
      {//right-top-to-bottom-left
        arr: [
          [0, 0],  
          [Config.gameCenterX*0.5, Config.gameHeight], 
          [Config.gameCenterX, 0], 
          [Config.gameCenterX*1.5, Config.gameHeight], [Config.gameWidth-100, 100]
        ] ,
        targetPos: [-Config.gameCenterX, Config.gameHeight+400]
      },
    ];
  }


  /*
  *
  *
  *
  */
  setupInputArea(){
    this.setInteractive(new Phaser.Geom.Polygon([this.width*0.22, this.height*0.35, this.width*0.78, this.height*0.35, this.width*0.78, this.height*0.65, this.width*0.22, this.height*0.65]), Phaser.Geom.Polygon.Contains);
  }
	swim(){

    //Random swim path
    const swimPath = Phaser.Math.Between(0, this.swimPath.length-1);
    this.config.arr = this.swimPath[swimPath].arr;
    this.config.targetPos = this.swimPath[swimPath].targetPos;


    this.resetHealth();
    this.killFishParams = null;//reset fish killed params
    this.setVisible(true).setActive(true).setAlpha(1);
    this.isWalking = false;
    this.play('dragonTurtleRotateIn');
    this.setPosition(this.config.arr[0][0], this.config.arr[0][1]);
    this.game.gameAudio.custom['DragonTurtleIn'].play();
    //Hit the Wall before Swim
    let speed = 1.5;//vantoc
    let delay = 0;
    let distance =  0;
    let duration = 0;
    const l = this.config.arr.length-1;
    for(let i = 0; i< l ; i++){
      delay = delay + duration;
      distance = parseInt(Phaser.Math.Distance.Between(this.config.arr[i][0], this.config.arr[i][1], this.config.arr[i+1][0], this.config.arr[i+1][1]));
      duration =  parseInt(distance/speed);
      this.tween = this.scene.tweens.add({
        targets: [this],
        x: this.config.arr[i+1][0],
        y: this.config.arr[i+1][1],
        duration: duration,
        delay:  i == 0 ? 0 : delay,
        onComplete: function(){
          if(i < 3){
            this.scene.cameras.main.shake(300, 0.002);
          }else{
            this.play('dragonTurtleCome');
            //check angle and rotate the boss to last position
            var rad = Phaser.Math.Angle.Between(this.config.arr[this.config.arr.length-1][0], this.config.arr[this.config.arr.length-1][1], this.config.targetPos[0], this.config.targetPos[1]);
            this.setRotation(rad);
          }
        },
        onStart: function(){
          this.game.gameAudio.custom['dragonTurtleStep'].play();
        },
        callbackScope: this
      });
    }
	}
  killFish(params){
    //Block if fish is not alive or playing animation
    if(this.killFishParams) return;

    this.setCollisionGroup(-1);
    this.killFishParams = params;
    //force cancle focus of player using electric gun
    if(params && params.player) params.player.cancleFocusElectricToFish();

    // this.setTint(0xffffff);
    /*Stop Tween Walk*/
    this.tween.stop();
    /*Stop Walk Animation*/
    this.anims.stop();

    /*Shake Boss*/
    this.game.gameAudio.custom['bossDragonDie'].play();
    this.scene.tweens.add({
      targets: [this],
      props: {
          x: { value: '+=5', duration: 30, ease: 'Power2', yoyo: true, repeat: 10},
          y: { value: '-=5', duration: 30, ease: 'Power2', yoyo: true, repeat: 10}
      },
      onComplete: function(){
        this.setVisible(false);//Hide But Not kill, have to wait after finish effect then kill
        this.scene.creditWinEffect.showCoinExplode({x: this.x, y: this.y});
        this.game.gameAudio.custom['killBoss'].play();

        Phaser.Math.Between(0, 1)===0 ? this.killBossWithMultiplier() : this.killBossAndGetMedal();
      },
      callbackScope: this
    },this);
  }
  die(){}


  /*
  *
  *
  */
  killBossWithMultiplier(){
    this.scene.cameras.main.shake(500, 0.002);
    this.medal.setActive(true).setAlpha(true).setVisible(true).setPosition(this.x, this.y).anims.play('medal_explode');
    this.showBossIcon();
    this.scene.tweens.add({
      targets: [this.medal], scale: 1, x: Config.gameCenterX, y: Config.gameCenterY , delay: 1800, duration: 1000,
      onComplete: function(){
        // this.medal.anims.play('dragonTurtleRotateDie');
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
    
    let maxLoop = 5;
    const player = this.killFishParams.player;
    this.scene.tweens.add({targets: [this.medal], ease: 'Bounce', scale: 1.8, duration: 50})
    let loopTween = this.scene.tweens.add({
      targets: [this.medal], 
      ease: 'Quint.Linear', 
      scale: 1.3, 
      delay: 50, 
      duration: 500, 
      loop: maxLoop, 
      loopDelay: 3000,
      completeDelay: 1000,
      onStart: function(){
        this.game.gameAudio.custom['killBossRepeat'].play({loop: true});
        this.fireWallExplode(loopTween.loopCounter, maxLoop);
      },
      onLoop: function(){
        //multiplier explode
        this.fireWallExplode(loopTween.loopCounter, maxLoop);
        this.medal.multiplierCounter =  maxLoop-loopTween.loopCounter;
        this.medal.text.setText('x'+this.medal.multiplierCounter);
      },
      onComplete: function(){
        this.killEffect.setActive(false).setVisible(false);
        this.medal.setActive(false).setVisible(false);
        this.game.gameAudio.custom['killBossRepeat'].stop();
        this.game.gameAudio.custom['killBossRepeatFinish'].play();
        this.explodeRandomInBounds();

        //Fadeout Dragon Turtle
        this.scene.tweens.add({
          targets: this.medal,
          alpha: 0,
          onComplete: function(){
            this.medal.setActive(false).setVisible(false);

            //
            this.fireWallLeft.anims.stop();
            this.fireWallRight.anims.stop();
            this.fireWallTop.anims.stop();
            this.fireWallBottom.anims.stop();
            //
            this.fireWallLeft.setActive(false);
            this.fireWallRight.setActive(false);
            this.fireWallTop.setActive(false);
            this.fireWallBottom.setActive(false);
          },
          callbackScope: this
        })

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
            this.scene.creditWinEffect.showBossDragonTurtleWin({totalWin: player.bet*odds, player: player,  position: {x: player.x, y: player.position < 2 ? player.y-100 : player.y+ 100}});
            this.hideBossIcon();
            this.game.gameAudio.custom['bossKilledAddScore'].play();//play score
            this.scene.bgAudio.resume();//resume background audio
          },
          callbackScope: this
        });
      },
      callbackScope: this
    })
  }

  fireWallExplode(loopCounter, maxLoop){
    this.medal.setActive(true).anims.play('dragonTurtleRotateExplode');
    this.killEffect.anims.play('fireSceneExplode');

    this.scene.tweens.addCounter({
      from: 0, to: 1, delay: 300, duration: 700,
      onComplete: function(){
        this.medal.setActive(true).anims.play('dragonTurtleRotateDie');
        this.fireWallLeft.setActive(true).setVisible(true).anims.play('fireWallLeft');
        this.fireWallRight.setActive(true).setVisible(true).anims.play('fireWallRight');
        this.fireWallTop.setActive(true).setVisible(true).anims.play('fireWallTop');
        this.fireWallBottom.setActive(true).setVisible(true).anims.play('fireWallBottom');
        this.game.gameAudio.custom['bombExplode1'].play();
        // this.explodeRandomInBounds();
      },
      onStart: function(){
        this.fireWallLeft.anims.stop();
        this.fireWallRight.anims.stop();
        this.fireWallTop.anims.stop();
        this.fireWallBottom.anims.stop();
      },
      callbackScope: this
    });
      
  }


  /*
  * Last Explode and show coin
  *
  */
  explodeRandomInBounds(){
    for (var i = 0; i < 20; i++) {
      let point = this.scene.rectangleBounds.getRandomPoint();
      this.scene.creditWinEffect.showSingleCoinWithoutText({x: point.x, y: point.y}, {x: this.killFishParams.player.x, y: this.killFishParams.player.y});
    }
  }

  /*
  * 
  *
  */
  killBossAndGetMedal(){
    const coinType = this.killFishParams.coinType;
    const textType = this.killFishParams.textType;
    const player = this.killFishParams.player;
    const playerPosition = this.killFishParams.player.position;
    let yPosition = (player.position < 2) ? (player.y - 300) : (player.y + 300);
    let xPosition = this.killFishParams.player.x;
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
            // kill fish after play all animation
            this.medal.setVisible(false).setActive(false);
            this.game.gameAudio.custom['coinjump3'].play();
            
            //show total win
            this.scene.creditWinEffect.coinMultiple({x: xPosition, y: yPosition}, {x: player.x, y: player.y}, player.position, coinType, textType);
            //fade out and kill boss icon
            this.hideBossIcon();
            this.setActive(false);
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