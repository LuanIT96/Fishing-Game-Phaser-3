import Config from '../../config';
import BaseFish from './BaseFish';
/*
* Boss Crocodile
*/
export default class Fish35 extends BaseFish {
  constructor(world, scene, config){
    super(world, scene, config);

    this.medalBossIcon = scene.add.sprite(0,0, 'medal','crocodile.png').setScale(1).setVisible(false).setActive(false);
    this.medal = scene.add.sprite(0,0, 'medal','medalExplode1.png').setScale(1).setVisible(false).setActive(false);
    this.medal.on('animationcomplete', function(anim, frame){
      if(anim.key ==='medal_explode'){this.setScale(1).medal.anims.play('bossCrocodileMedal');}
    },this);
    //continue swim after attact player
    this.on('animationcomplete', function(anim, frame){
      if(anim.key ==='fish35_attact'){
        this.anims.play('fish35_swim')
      }
    });
  }
  /*
  *
  *
  *
  */
  setupInputArea(){
    this.setInteractive(new Phaser.Geom.Polygon([this.width*0.2, this.height*0.4, this.width*0.8, this.height*0.4, this.width*0.8, this.height*0.7, this.width*0.2, this.height*0.7]), Phaser.Geom.Polygon.Contains);
  }

  /*
  * Revive the fish and swim
  * @params: arrayPath<>
  * - Reset kill fish params
  * - Active body collide check with body
  * - revive fish and shadow(if available)
  * - update swim path by params arrayPath using follower, reference object Phaser.GameObjects.Components.PathFollower
  */
  swim(arrayPath){
    this.killFishParams = null;//reset fish killed params

    /*Add Fish To Collision Group*/
    this.setCollisionGroup(this.scene.physicFishGroup);
    this.resetHealth();
    
    //Reset fish position
    this.setActive(true).setVisible(true).setAngle(0).setScale(2).setOrigin(0.5).setRotation(0).setAlpha(1).anims.play('fish'+this.config.type+'_swim').setPosition(arrayPath.p.x[0], arrayPath.p.y[0]);
    this.shadow.setActive(true).setVisible(true).setAngle(0).setScale(2).setOrigin(0.5).setRotation(0).setAlpha(0.5).anims.play('fish'+this.config.type+'_swim').setPosition(arrayPath.p.x[0], arrayPath.p.y[0])
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

        //If attact player
        // if(arrayPath.attact && this.tween.targets[0].t > 0.48){
        //   arrayPath.attact = false;
        //   this.anims.play('fish35_attact')
        //   this.setDept(10);
        // }
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
  *
  *
  */
  killFish(params){
    //Block if fish is not alive or playing animation
    if(this.killFishParams) return;

    this.setCollisionGroup(-1);
    this.killFishParams = params;
    //force cancle focus of player using electric gun
    if(params && params.player) params.player.cancleFocusElectricToFish();

    this.setTint(0xffffff);//clear tint
    this.tween.stop();//Stop Tween Swim
    this.anims.stop();//Stop Animation Swim

    /*Shake Boss*/
    this.game.gameAudio.custom['bossDragonDie'].play();
    this.scene.tweens.add({
      targets: [this, this.shadow],
      props: {
        x: { value: '+=5', duration: 30, ease: 'Power2', yoyo: true, repeat: 10},
        y: { value: '-=5', duration: 30, ease: 'Power2', yoyo: true, repeat: 10}
      },
      onComplete: function(){
        this.setVisible(false);//Hide But Not kill, have to wait after finish effect then kill
        this.shadow.setActive(false).setVisible(false);
        this.scene.creditWinEffect.showCoinExplode({x: this.x, y: this.y});
        this.game.gameAudio.custom['killBoss'].play();
        
        //killboss effect
        this.scene.killBossAnimation = true;
        !this.scene.fullScreenMultiplier && Phaser.Math.Between(0, 1)===0 ? this.scene.multiplier(this, params.player) : this.killBossAndGetMedal();
      },
      callbackScope: this
    },this);
  }
  
  /*
  *
  */  
  die(){}
 
  /*
  * 
  *
  */
  killBossAndGetMedal(){
    const player = this.killFishParams.player;
    const coinType = this.killFishParams.coinType;
    const textType = this.killFishParams.textType;
    const playerPosition = this.killFishParams.player.position;
    const RD = Phaser.Math.Between(250, 350)
    const yPosition = (player.position < 2) ? (player.y - RD) : (player.y + RD);
    const xPosition = this.killFishParams.player.x;
    
    this.scene.cameras.main.shake(500, 0.002);
    this.medal.setScale(1.2).setActive(true).setAlpha(true).setVisible(true).setPosition(this.x, this.y).anims.play('medal_explode');
    this.showBossIcon();
    this.scene.tweens.add({
      targets: [this.medal], x: xPosition, y: yPosition , delay: 3000, duration: 1500,
      onComplete: function(){
        let odds = this.config.odds;
        if(this.config.odds.min){odds = Phaser.Math.Between(this.config.odds.min, this.config.odds.max);}
        this.scene.creditWinEffect.coinJumnpSingle(player.bet*odds, player, {x: xPosition, y:  (player.position < 2) ? yPosition - 70 : yPosition + 70}, 'GoldWin',  playerPosition === this.scene.myPosition ? 1 : 0.2);
        this.scene.tweens.add({
          targets: [this.medal],
          alpha: 0, 
          delay: 5000, 
          duration: 500,
          onComplete: function(){
            
            this.setActive(false);// kill fish after play all animation
            this.medal.setVisible(false).setActive(false);
            this.game.gameAudio.custom['coinjump3'].play();
            this.scene.creditWinEffect.coinMultiple({x: xPosition, y: yPosition}, {x: player.x, y: player.y}, player.position, coinType, textType);//show total win
            this.hideBossIcon();//fade out and kill boss icon
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