import Config from '../../config';
import Helpers from '../../helpers';
import BaseFish from './BaseFish';
/*
* Boss Crab
*/
export default class Fish33 extends BaseFish {
  constructor(world, scene, config){
    super(world, scene, config);    
    //Crab medal
    this.medalBossIcon = scene.add.sprite(0,0, 'medal','crab.png').setScale(1).setVisible(false).setActive(false);
    this.medal = scene.add.sprite(0,0, 'medal','medalExplode1.png').setScale(1).setVisible(false).setActive(false);
    this.medal.on('animationcomplete', function(anim, frame){
      if(anim.key ==='medal_explode'){this.setScale(1).medal.anims.play('bossCrabMedal');}
    },this);
  }
  swim(){
  	this.killFishParams = null;//reset fish killed params
    this.resetHealth();
  	let loop = 40;
    let x =[];
    let y = [];
    x[0] = Config.gameWidth * 0.8;
    y[0] = Config.gameHeight * 0.25;
    x[1] = Config.gameWidth * 0.8;
    y[1] = Config.gameHeight * 0.75;
    x[2] = Config.gameWidth * 0.2;
    y[2] = Config.gameHeight * 0.75;
    x[3] = Config.gameWidth * 0.2;
    y[3] = Config.gameHeight * 0.25;

    //Ramdom Swim Path
    let xArray = [];
    let yArray = [];
    let index = Phaser.Math.Between(0, 3);
    let count = Phaser.Math.Between(0, 5);
    xArray.push(x[index]);
    yArray.push(y[index]);
    let rdWays = Phaser.Math.Between(0, 1);
    let math = (rdWays==0) ? 1 : -1;
    for (let i = 0; i <= loop; i++) {
        index = index + math;
        if (index === 4) index = 0;
        if (index === -1) index = 3;
        count++;
        if (count > Phaser.Math.Between(5, 10)) {
            count = 0;
            if (math === 1) math = -1;
            else math = 1;
        }
        xArray.push(x[index]);
        yArray.push(y[index]);
    }

    
    //Reset fish position
    this.setActive(true).setVisible(true).setAngle(0).setScale(1.2).setRotation(0).setAlpha(0).anims.play('fish'+this.config.type+'_swim').setPosition(xArray[0], yArray[0]);
    this.shadow.setActive(true).setVisible(true).setAngle(0).setScale(1.2).setRotation(0).setAlpha(0).anims.play('fish'+this.config.type+'_swim').setPosition(xArray[0], yArray[0])
    if(!this.follower){
      //Create A Follower Curves Path
      this.follower = {t: 0, vec: new Phaser.Math.Vector2(xArray[0], yArray[0])};
      this.path = new Phaser.Curves.Path();
    }else{
      //Reset Follower
      this.follower.t = 0;
      this.follower.vec.reset(xArray[0], yArray[0]);
      this.path.curves = [];
      this.path.curves.length = 0;
      this.path.cacheLengths = [];
      this.path.cacheLengths.length = 0;
      this.path.startPoint = {x: 0, y: 0};
    }
    let newPath = [];
    xArray.forEach(function(x, index){
      if(index > 0) newPath.push([x, yArray[index]]);
    })

    let targetX = Config.gameCenterX;
    let targetY = Config.gameCenterY;

    //Random Timescale
    this.randomTimeScale = this.scene.tweens.addCounter({
      from: 0, to: 1, repeat: -1,
      repeatDelay: Phaser.Math.Between(4000, 10000),
      onRepeat: function(){
        let timeScale = Phaser.Math.Between(200, 250);
        this.tween.setTimeScale(timeScale*0.01);

        let animsTimeScale = Phaser.Math.Between(200, 350)
        this.anims.setTimeScale(animsTimeScale*0.01);
        this.shadow.anims.setTimeScale(animsTimeScale*0.01);        
      },
      onRepeatScope: this
    });
    //Enable Body collide after Fadeout
    this.scene.tweens.add({targets: [this.shadow], alpha: 0.5});
    this.scene.tweens.add({targets: [this], alpha: 1, onComplete: function(){this.setCollisionGroup(this.scene.physicFishGroup);}, callbackScope: this});

    //Path Follower
    this.path.moveTo(xArray[0], yArray[0])
    this.path.splineTo(newPath)
    this.tween = this.scene.tweens.add({
      targets: this.follower, t: 1, duration: 80000,
      onStart: function(){
        let isRandomTimeScale = Phaser.Math.Between(0, 1);
        if(isRandomTimeScale === 1){
          let timeScale = Phaser.Math.Between(150, 250);
          this.tween.setTimeScale(timeScale*0.01);
          let animsTimeScale = Phaser.Math.Between(150, 250)
          this.anims.setTimeScale(animsTimeScale*0.01);
          this.shadow.anims.setTimeScale(animsTimeScale*0.01);
        }
      },
      onUpdate: function(tween, target){
        //Get Current Position of follower Path
        this.path.getPoint(this.follower.t, this.follower.vec);
        if(this.x > Config.gameCenterX  - 100 && this.x < Config.gameCenterX  + 100 ){
          if(this.x < Config.gameCenterX){//left
            targetX = Config.gameCenterX + (this.x - Config.gameCenterX)*0.2;
          }else{
            targetX = Config.gameCenterX + (this.x - Config.gameCenterX )*0.2;
          }
        }else{
          if(this.x < Config.gameCenterX){//left
            targetX = Config.gameCenterX + (this.x - Config.gameCenterX)*0.6;
          }else{
            targetX = Config.gameCenterX + (this.x - Config.gameCenterX )*0.6;
          }
        }
        if(this.tween.timeScale > 0.6){
          let nexTimeScale = this.tween.timeScale-0.01;
          this.tween.setTimeScale(nexTimeScale);

          this.anims.setTimeScale(nexTimeScale-0.002);
          this.shadow.anims.setTimeScale(nexTimeScale-0.002);
        }else{
          this.anims.setTimeScale(1);
          this.shadow.anims.setTimeScale(1);
        }
        let rotation = Phaser.Math.Angle.BetweenPoints({x: this.x, y: this.y}, {x: targetX, y: targetY})+1.57079633;
        this.setRotation(rotation).setPosition(this.follower.vec.x, this.follower.vec.y);
        this.shadow.setRotation(rotation).setPosition(this.x+10, this.y+20);
        // this.focusPoint = {x: this.x, y: this.y-25};
        this.focusPoint = Helpers.findSinglePoint({x: this.x, y: this.y}, 20, this.rotation);
      },
      onComplete: function(){//Finish swim path
        this.scene.tweens.add({
          targets: [this, this.shadow],  alpha: 0, 
          onComplete: function(){
            this.setVisible(false).setActive(false);
            this.shadow.setVisible(false).setActive(false);
            this.setCollisionGroup(-1);
            this.randomTimeScale.stop();
          }, 
          callbackScope: this
        });
        
      },
      callbackScope: this,
    },this);
  }

  /*
  *
  *
  */
  killFish(params){
    if(this.killFishParams) return;
    if(this.tween && this.tween.isPlaying()) this.tween.stop();
    if(this.randomTimeScale.isPlaying()) this.randomTimeScale.stop();

    this.setCollisionGroup(-1);
    this.killFishParams = params;
    this.game.gameAudio.custom['bossCrabDie'].play();
    this.anims.setTimeScale(1);
    this.shadow.anims.setTimeScale(1);
    this.anims.play('fish'+this.config.type+'_die');
    this.shadow.anims.play('fish'+this.config.type+'_die');
  }

  die(){
    this.scene.tweens.add({targets: [this.shadow, this], alpha: 0,  delay: 1500, duration: 500,
      onComplete: function(){
        this.setVisible(false);//hide but don't kill, have to wait after finish effect
        this.shadow.setVisible(false).setActive(false); 
       
        this.scene.creditWinEffect.showCoinExplode({x: this.x, y: this.y});
        this.scene.cameras.main.shake(500, 0.002);
        this.game.gameAudio.custom['killBoss'].play();

        //kill fish effect
        this.scene.killBossAnimation = true;
        !this.scene.fullScreenMultiplier && Phaser.Math.Between(0, 1)===0 ? this.scene.multiplier(this, this.killFishParams.player) : this.killBossAndGetMedal();
      },
      callbackScope: this
    }); 
  }

  /*
  * Call this function if you want to kill this fish imediately
  * - Kill fish
  * - Kill fish shadow (if available)
  * - Stop swim tween
  * - Stop timescale tween
  * - Disable collision body check with bullet
  */
  forceStopSwim(){
    this.setActive(false).setVisible(false);
    if(this.shadow) this.shadow.setActive(false).setVisible(false);
    if(this.tween && this.tween.isPlaying()) this.tween.stop();
    if(this.randomTimeScale && this.randomTimeScale.isPlaying()) this.randomTimeScale.stop();
    this.setCollisionGroup(-1);
  }

  /*
  * 
  *
  */
  killBossAndGetMedal(){
    const player = this.killFishParams.player;
    const yPosition = (player.position < 2) ? (player.y - Phaser.Math.Between(250, 350)) : (player.y + Phaser.Math.Between(250, 350));
    this.scene.cameras.main.shake(500, 0.002);
    this.medal.setScale(1.2).setActive(true).setAlpha(true).setVisible(true).setPosition(this.x, this.y).anims.play('medal_explode');
    this.showBossIcon();
    this.scene.tweens.add({
      targets: [this.medal], x: player.x, y: yPosition , delay: 3000, duration: 1500,
      onComplete: function(){
        let odds = this.config.odds;
        if(this.config.odds.min){odds = Phaser.Math.Between(this.config.odds.min, this.config.odds.max);}
        this.scene.creditWinEffect.coinJumnpSingle(player.bet*odds, player, {x: player.x, y:  (player.position < 2) ? yPosition - 70 : yPosition + 70}, 'GoldWin', player.position === this.scene.myPosition ? 1 : 0.2);
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
            this.scene.creditWinEffect.coinMultiple(
              {x: player.x, y: yPosition}, 
              {x: player.x, 
              y: player.y}, 
              player.position, 
              this.killFishParams.coinType, 
              this.killFishParams.textType
              );

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

//10P 1 scene
//5phut ko boss
//5p boss
//boss hien tai se swimout khi switch scene