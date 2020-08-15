import Config from '../../config';
import SpecialFish from './SpecialFish';

/*
* Mega boom
*/
export default class Fish25 extends SpecialFish {
  constructor (world, scene, config){
    super(world, scene, config);
    this.boomArea = this.scene.add.sprite(0, 0, this.config.key,'boom_radius.png').setActive(false).setVisible(false);
    this.speed = {min: 0.5, max: 3, stepSpeedUp: 0.03, stepSlowDown: 0.0035}//animation timeScale 
    this.medal = this.scene.add.sprite(0, 0, 'medal','boom.png').setActive(false).setVisible(false);
  }
  killFish(params){
    if(this.killFishParams) return;
    if(this.tween && this.tween.isPlaying) this.tween.stop();//Stop move
    this.setCollisionGroup(-1);//reset collision 
    this.killFishParams = params;

    this.shadow.setVisible(false).setActive(false);
    this.anims.play('fish25_die');

    this.killFishParams.multiple = Phaser.Math.Between(1, 5);
    this.game.gameAudio.custom['killCrabBoom'].play();

    let dieTimeLine = this.scene.tweens.createTimeline();
    let diePosition = [];
    diePosition[0] = {x: Config.gameCenterX, y: Config.gameCenterY};
    diePosition[1] = {x: Config.gameWidth*0.20, y: Config.gameHeight*0.20};
    diePosition[2] = {x: Config.gameWidth*0.80, y: Config.gameHeight*0.80};
    diePosition[3] = {x: Config.gameWidth*0.80, y: Config.gameHeight*0.20};
    diePosition[4] = {x: Config.gameWidth*0.20, y: Config.gameHeight*0.80};

    //Reset timeline
    let player = this.killFishParams.player;
    for (let explodeIndex = 0; explodeIndex < this.killFishParams.multiple; explodeIndex++) {
      dieTimeLine.add({
        targets: this, 
        x: diePosition[explodeIndex].x, 
        y: diePosition[explodeIndex].y, 
        ease: 'Linear', 
        delay: explodeIndex === 0 ?  0 : (explodeIndex === 1 ? 5000 : 2500),
        onComplete: function(tween, targets){
          if(explodeIndex === this.killFishParams.multiple-1){
            this.boomLastExplode(player, diePosition[explodeIndex], explodeIndex);
          }else{
            this.boomExplode(player, diePosition[explodeIndex], explodeIndex);  
          }
        },
        onStart: function(){this.setScale(1);},
        callbackScope: this
      });
    }
    dieTimeLine.play();
  }
  /*
  * Description: This function overwrite and replace parent function only
  */
  die(){

    this.medal.setPosition(this.x, this.y).setActive(true).setVisible(true).setAlpha(0).setScale(0.1);
    this.scene.tweens.add({targets: this.medal, duration: 300, alpha: 1, scale: 1})
    let player = this.killFishParams.player;
    if(this.killFishParams.player) this.killFishParams.player.cancleFocusElectricToFish();
    this.killFishParams.totalWin = 0;
    const x = player.x;
    let y = player.y - 250;
    if(player.position === 2 | player.position === 3){
      y = player.y + 250;
    }
    //move the medal to player kill this fish
    this.scene.tweens.add({targets: this.medal, x: x, y: y, delay: 700})
  }

  /*
  * Description: this function to explode boomn and dame fish by radius
  * @params
  * - position<Vector2>
  */
  boomExplode(player, position, explodeIndex, callback=null){
    let repeatExplode = explodeIndex == 0 ? 4 : 1;
    this.boomArea.setActive(true).setVisible(true).setTexture(this.config.key,'boom_radius.png').setPosition(position.x, position.y).setAlpha(0.7).setScale(12);
    this.scene.tweens.add({targets: this.boomArea, props:{scaleY: {value: 14, duration: 400, yoyo: true, repeat: repeatExplode}, scaleX: {value: 14, duration: 400, yoyo: true, repeat: repeatExplode}}})
    this.scene.tweens.add({
      targets: this,
      props:{
        scaleY: {value: 1.5, duration: 400, yoyo: true, ease: 'Sine.easeInOut'}, 
        scaleX: {value: 1.5, duration: 400, yoyo: true, ease: 'Sine.easeInOut'},
        angle: {value: "+=180", duration: 800}
      },
      repeat: repeatExplode,
      onStart: function(){
        this.game.gameAudio.custom['boombRadius'].play();
      },
      onComplete: function(){
        this.game.gameAudio.custom['boombRadius'].stop();
        this.game.gameAudio.custom['bombExplode'].play();
        this.scene.cameras.main.shake(1000, 0.003);
        this.boomArea.setTexture('bombExplode','boomExplode1.png').setAlpha(1).setScale(4).anims.play('bombExplode');
        this.scene.cameras.main.shake(1000, 0.002);
        this.scene.tweens.add({targets: this, scale: 2.5, yoyo: true, duration: 800,  ease: 'Circ.easeIn'})
        this.killFishParams.totalWin = this.killFishParams.totalWin + this.scene.checkCollideByRadius(player, {x: position.x, y: position.y}, this.boomArea.width);
      },
      callbackScope: this
    },this);
  }

  /*
  * Description: boom explode last time then show total bonus win
  * @params
  * - position<Vector2>
  */
  boomLastExplode(player, position, explodeIndex, callback=null){
    const repeat = 1;
    this.boomArea.setActive(true).setVisible(true).setTexture(this.config.key,'boom_radius.png').setPosition(position.x, position.y).setAlpha(0.7).setScale(12);
    this.scene.tweens.add({targets: this.boomArea, props:{scaleY: {value: 14, duration: 400, yoyo: true, repeat: repeat}, scaleX: {value: 14, duration: 400, yoyo: true, repeat: repeat}}})
    this.scene.tweens.add({
      targets: this,
      props:{
        scaleY: {value: 1.5, duration: 400, yoyo: true, ease: 'Sine.easeInOut'}, 
        scaleX: {value: 1.5, duration: 400, yoyo: true, ease: 'Sine.easeInOut'},
        angle: {value: "+=180", duration: 800}
      },
      repeat: repeat,
      onStart: function(){
        this.game.gameAudio.custom['boombRadius'].play();
      },
      onComplete: function(){
        this.game.gameAudio.custom['boombRadius'].stop();
        this.game.gameAudio.custom['bombExplode'].play();
        this.scene.cameras.main.shake(1000, 0.003);
        this.boomArea.setTexture('bombExplode','boomExplode1.png').setAlpha(1).setScale(4).anims.play('bombExplode');
        this.scene.cameras.main.shake(1000, 0.002);
        this.scene.tweens.add({targets: this, scale: 2.5, yoyo: true, duration: 800,  ease: 'Circ.easeIn'})
        this.killFishParams.totalWin = this.killFishParams.totalWin +  this.scene.checkCollideByRadius(player, {x: position.x, y: position.y}, this.boomArea.width);
        //done
        this.setVisible(false);

        //Hide the medal
        this.scene.tweens.add({
          targets: this.medal, duration: 500, alpha: 0, scale: 0, delay: 1500, 
          onComplete: function(tween, targets){
            targets[0].setActive(false).setVisible(false);
            this.setActive(false);

            //show total bonus win 
            this.game.gameAudio.custom['coinjump3'].play();
            this.game.gameAudio.custom['bonusWin'+Phaser.Math.Between(1, 3)].play();
            const totalWin = this.killFishParams.totalWin;
            this.scene.creditWinEffect.showBonusBoomWin({
              totalWin: totalWin, 
              position: {x: player.x, y:  player.position < 2 ? player.y-100 : player.y+100},
              callback: function(){
                player.updatePlayerTotalCredit(totalWin)
              }
            });
          },
          callbackScope: this
        });
      },
      callbackScope: this
    },this);
  }
}