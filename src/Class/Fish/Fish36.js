import Config from '../../config';
import BaseFish from './BaseFish';
import Helpers from '../../helpers';

/*
* Boss Octopus
*/
export default class Fish36 extends BaseFish {
  constructor(world, scene, config){
    super(world, scene, config);
    this.shadow = null;
    this.medalBossIcon = scene.add.sprite(0,0, 'medal','octopus.png').setScale(1).setVisible(false).setActive(false);
    this.medal = scene.add.sprite(0,0, 'medal','medalExplode1.png').setScale(1).setVisible(false).setActive(false);
    this.medal.on('animationcomplete', function(anim, frame){
      if(anim.key ==='medal_explode'){this.setScale(1).medal.anims.play('bossOctopusMedal');}
    },this);

    this.on('animationcomplete', function(anim, frame){
      if(anim.key ==='fish36_in'){
        this.anims.play('fish36_swim');
        this.setCollisionGroup(this.scene.physicFishGroup);
      }
      if(anim.key === 'fish36_swim' && !this.killFishParams){//swim out
        this.setCollisionGroup(-1);
        this.anims.play('fish36_out');
        if(this.targetSprite) this.targetSprite.setVisible(false).setActive(false);
      }
      if(anim.key ==='fish36_out'){//kill after swim out
        this.setScale(1).setAngle(0);
        this.forceStopSwim();
      }
    },this);
    this.on('animationstart', function(anim, frame){
      if(anim.key ==='fish36_swim' && this.targetSprite){
        this.targetSprite.setVisible(true).setActive(true); 
      }
    },this);
    this.on('animationupdate', function(anim, frame){
      if(anim.key ==='fish36_swim' && this.targetSprite){
        this.targetSprite.setPosition(this.focusPoint.x, this.focusPoint.y);
        this.targetSprite.setRotation(this.targetSprite.rotation+0.05);
      }
    },this);

    let listObj = [
      ,{distance: 60.50049040133476,  angle: -2.154414358962178}
      ,{distance: 60.50049040133476,  angle: -2.154414358962178}
      ,{distance: 60.50049040133476,  angle: -2.154414358962178}
      ,{distance: 60.50049040133476,  angle: -2.154414358962178}
      ,{distance: 67.93832096115983,  angle: -2.3038764193853742}
      ,{distance: 73.84338369695466,  angle: -2.4436141701822183}
      ,{distance: 82.36468855380619,  angle: -2.557236628026486}
      ,{distance: 89.90869295894232,  angle: -2.6630886629372177}
      ,{distance: 98.5679583678509,  angle: -2.7194052428316873}
      ,{distance: 107.99353132685502,  angle: -2.8377438879755084}
      ,{distance: 116.4255653397777,  angle: -2.8693904307053275}
      ,{distance: 121.64889456712346,  angle: -2.9410438337878744}
      ,{distance: 127.05418143673135,  angle: -2.9739173157186314}
      ,{distance: 127.05418143673135,  angle: -2.9739173157186314}
      ,{distance: 133.90371312987463,  angle: -3.050980803156732}
      ,{distance: 135.82977629437923,  angle: -3.059730193712791}
      ,{distance: 133.49192552972787,  angle: -3.0961935410404053}
      ,{distance: 135.46900895570303,  angle: -3.104316375189241}
      ,{distance: 133.36967022048464,  angle: -3.1264503681223483}
      ,{distance: 134.36464088397787,  angle: 3.141592653589793}
      ,{distance: 134.3684347562566,  angle: 3.1340780038338525}
      ,{distance: 132.34797176074918,  angle: 3.1339632807751263}
      ,{distance: 127.29281767955808,  angle: 3.1415926535897927}
      ,{distance: 126.3188826310918,  angle: -3.1176100390994153}
      ,{distance: 122.44568385348627,  angle: -3.0838365414183886}
      ,{distance: 115.52766185866234,  angle: -3.0628504929292646}
      ,{distance: 110.89797959772362,  angle: -3.0229499670234383}
      ,{distance: 107.45720326700696,  angle: -2.98116478377157}
      ,{distance: 100.05442235128841,  angle: -2.9383619416178304}
      ,{distance: 91.8861542784738,  angle: -2.8860780753906705}
      ,{distance: 83.3830538039786,  angle: -2.80851304874625}
      ,{distance: 79.5922991461718,  angle: -2.7235660701229167}
      ,{distance: 71.04002601252537,  angle: -2.620912879234589}
      ,{distance: 63.25537333424804,  angle: -2.469605117913379}
      ,{distance: 54.35065676892773,  angle: -2.303876419385371}
      ,{distance: 50.13719870641425,  angle: -2.0526788230176356}
      ,{distance: 47.58790959884962,  angle: -1.8725665696609843}
      ,{distance: 47.55362459093909,  angle: -1.634573525857471}
      ,{distance: 50.84869671933573,  angle: -1.4513043429227914}
      ,{distance: 52.47745677858906,  angle: -1.3770736853974395}
      ,{distance: 59.281645907951756,  angle: -1.1658039691227293}
      ,{distance: 60.59496120398617,  angle: -0.9270394016142391}
      ,{distance: 66.4536617039831,  angle: -0.7528853839680074}
      ,{distance: 74.24011762099278,  angle: -0.5915294699812639}
      ,{distance: 81.31573452991238,  angle: -0.4634344786552912}
      ,{distance: 83.4798045339567,  angle: -0.3713376262669903}
      ,{distance: 90.19870156763429,  angle: -0.2720079480147794}
      ,{distance: 94.12556022070927,  angle: -0.21622896185054793}
      ,{distance: 102.87715915297298,  angle: -0.12794160140248279}
      ,{distance: 107.39183578481287,  angle: -0.07528890945157446}
      ,{distance: 110.16004558953871,  angle: -0.027501337009169093}
      ,{distance: 113.16719098358195,  angle: -0.0178457344368077}
      ,{distance: 118.2694574823441,  angle: 0.03415653054121844}
      ,{distance: 121.43712192713215,  angle: 0.05823633010981351}
      ,{distance: 124.67159886508638,  angle: 0.08107936181120999}
      ,{distance: 126.86251562058887,  angle: 0.09565602906256726}
      ,{distance: 127.1875800769641,  angle: 0.11936590080628796}
      ,{distance: 127.1875800769641,  angle: 0.11936590080628796}
      ,{distance: 121.30164668255664,  angle: 0.13358188580259495}
      ,{distance: 121.30164668255664,  angle: 0.13358188580259495}
      ,{distance: 121.30164668255664,  angle: 0.13358188580259495}
      ,{distance: 114.02878845535452,  angle: 0.12428942242820004}
      ,{distance: 104.36988919467218,  angle: 0.07747314950876809}
      ,{distance: 103.09107991433724,  angle: 0.029387632060836517}
      ,{distance: 94.96985088052729,  angle: 0.010632229460212105}
      ,{distance: 90.9738864196032,  angle: -0.03330325660814175}
      ,{distance: 83.14233535324031,  angle: -0.08511424118898198}
      ,{distance: 77.72998455702458,  angle: -0.15651980067925184}
      ,{distance: 71.60440699241373,  angle: -0.2859072146665465}
      ,{distance: 65.85655757394194,  angle: -0.36039011233525997}
      ,{distance: 62.343506332440846,  angle: -0.4706784338354788}
      ,{distance: 54.62923310227362,  angle: -0.5877566698073798}
      ,{distance: 51.498137301791516,  angle: -0.8406318450311528}
      ,{distance: 47.47374282468021,  angle: -1.0593381914733786}
      ,{distance: 49.50838713826188,  angle: -1.3652945067359197}
      ,{distance: 51.65414668519011,  angle: -1.4924836339327012}
      ,{distance: 50.78049498675468,  angle: -1.8738329468591775}
      ,{distance: 56.01657222325536,  angle: -2.058853444722348}
      ,{distance: 56.01657222325536,  angle: -2.058853444722348}
    ];

    // // this.setBody(scene.shapes['OctopusSwim50']);
    this.focusPoint = Helpers.findSinglePoint({x: this.x, y: this.y}, listObj[1].distance, this.rotation+listObj[1].angle);
    this.on('animationupdate', function (currentAnim, currentFrame, sprite) {
      if(currentAnim.key ==='fish36_swim'){
        sprite.focusPoint = Helpers.findSinglePoint({x: sprite.x, y: sprite.y}, listObj[currentFrame.index+2].distance, sprite.rotation+listObj[currentFrame.index+2].angle);
      }
    });
  }
  /*
  *
  *
  *
  */
  setupInputArea(){
    this.setInteractive(new Phaser.Geom.Polygon([
      this.width*0.42, this.height*0.2, 
      this.width*0.58, this.height*0.2, 
      this.width*0.58, this.height, 
      this.width*0.42, this.height
    ]), Phaser.Geom.Polygon.Contains);
    // this.scene.input.enableDebug(this);
  }

  /*
  * Revive the fish and swim
  * @params: arrayPath<>
  * - Reset kill fish params
  * - Active body collide check with body
  * - revive fish and shadow(if available)
  * - update swim path by params arrayPath using follower, reference object Phaser.GameObjects.Components.PathFollower
  */
  swim(config){
    this.killFishParams = null;//reset fish killed params
    /*Add Fish To Collision Group*/
    this.resetHealth();
    //Reset fish position
    this.setActive(true).setVisible(true)
    .setAlpha(1)
    .setPosition(config.x ? config.x : this.x, config.y ? config.y : this.y)
    .setAngle(config.angle ? config.angle : this.angle)
    .setScale(config.scale ? config.scale : this.scale)
    .anims.play('fish'+this.config.type+'_in');
  }

  /*
  *
  *
  */
  killFish(params){
    //Block if fish is not alive or playing animation
    if(this.killFishParams) return;
    if(this.targetSprite) this.targetSprite.setVisible(false).setActive(false);
    this.setCollisionGroup(-1);
    this.killFishParams = params;
    //force cancle focus of player using electric gun
    if(params && params.player) params.player.cancleFocusElectricToFish();

    this.setTint(0xffffff);
    /*Stop Walk Animation*/
    this.anims.stop();

    /*Shake Boss*/
    this.game.gameAudio.custom['bossDragonDie'].play();
    this.scene.tweens.add({
      targets: [this, this.shadow],
      props: {
          x: { value: '+=5', duration: 30, ease: 'Power2', yoyo: true, repeat: 10},
          y: { value: '-=5', duration: 30, ease: 'Power2', yoyo: true, repeat: 10}
      },
      onComplete: function(){
        this.setScale(1).setAngle(0).setVisible(false);//Hide But Not kill, have to wait after finish effect then kill
        this.scene.creditWinEffect.showCoinExplode({x: this.x, y: this.y});
        this.game.gameAudio.custom['killBoss'].play();
        
        //kill boss effect
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
    const yPosition = (player.position < 2) ? (player.y - Phaser.Math.Between(250, 350)) : (player.y + Phaser.Math.Between(250, 350));
    
    this.scene.cameras.main.shake(500, 0.002);
    this.medal.setScale(1.2).setActive(true).setAlpha(true).setVisible(true).setPosition(this.x, this.y).anims.play('medal_explode');
    this.showBossIcon();
    this.scene.tweens.add({
      targets: [this.medal], x: player.x, y: yPosition , delay: 3000, duration: 1500,
      onComplete: function(){
        let odds = this.config.odds;
        if(this.config.odds.min){odds = Phaser.Math.Between(this.config.odds.min, this.config.odds.max);}
        this.scene.creditWinEffect.coinJumnpSingle(player.bet*odds, player, {x: player.x, y:  (player.position < 2) ? yPosition - 70 : yPosition + 70}, 'GoldWin');
        this.scene.tweens.add({
          targets: [this.medal],
          alpha: 0, 
          delay: 5000, 
          duration: 500,
          onComplete: function(){
            this.setActive(false);// kill fish after play all animation
            this.medal.setVisible(false).setActive(false);
            this.game.gameAudio.custom['coinjump3'].play();
            this.scene.creditWinEffect.coinMultiple({x: player.x, y: yPosition}, {x: player.x, y: player.y}, player.position, coinType, textType);//show total win
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
    let y = this.killFishParams.player.y - Phaser.Math.Between(200, 300);
    if(this.killFishParams.player.position === 2 | this.killFishParams.player.position === 3){
      y = this.killFishParams.player.y + Phaser.Math.Between(200, 300);
    }
    this.medalBossIcon.setPosition(this.killFishParams.player.x, y).setActive(true).setVisible(true).setAlpha(0).setScale(0.1);
    this.scene.tweens.add({targets: this.medalBossIcon, duration: 300, alpha: 1, scale: 1})
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
    if(this.targetSprite) this.targetSprite.setActive(false).setVisible(false);
    this.setCollisionGroup(-1);
  }
}

//10P 1 scene
//5phut ko boss
//5p boss
//boss hien tai se swimout khi switch scene