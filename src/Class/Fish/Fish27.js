import Config from '../../config';
import SpecialFish from './SpecialFish';

export default class Fish27 extends SpecialFish {
	constructor (world, scene, config){
    super(world, scene, config);
    this.bonusGun = this.scene.add.sprite(0, 0, this.config.key, 'boom_radius.png').setActive(false).setVisible(false).setScale(0);
    this.speed = {min: 0.5, max: 3.5, stepSpeedUp: 0.03, stepSlowDown: 0.0035}//animation timeScale 
  }
	killFish(params){
    if(this.killFishParams) return;
    if(params && params.player) params.player.cancleFocusElectricToFish();
    if(this.tween && this.tween.isPlaying) this.tween.stop();//Stop move
    this.setCollisionGroup(-1);
    this.killFishParams = params;

    this.shadow.setVisible(false).setActive(false);

    //dont kill this fish until player fire the drill bullet and collect bonus
    this.setVisible(false);//.setActive(false);
    this.bonusGun.setActive(true).setVisible(true).setScale(0).setAngle(0).setPosition(this.x, this.y).setTexture(this.config.key, "weapon_drill.png");
    let angle = 0;
    let playerPosY = params.y-90
    if(this.killFishParams.player.position === 2 || this.killFishParams.player.position === 3){
      angle = 180;
      playerPosY = params.y+90
    }
    this.game.gameAudio.custom['drillTitle'].play();
    this.scene.sound.play('drillShow', {delay: 1.2});
    
    this.scene.tweens.add({
      targets: this.bonusGun,
      props: {
        scaleX: {value: 2, duration: 200, ease: 'Power2'},
        scaleY: {value: 2, duration: 200, ease: 'Power2'},
        y: {value: "-=70", duration: 200, delay: 100, yoyo: true, ease: "Cubic"},
      },
      onComplete: function(){
        /*After Show Bonus Canon=>Move To Current Player*/
        this.scene.tweens.add({
          targets: this.bonusGun,
          props: {
            x: {value: params.x, delay: 700,  duration: 1000},
            y: {value: playerPosY, delay: 700, duration: 1000},
            angle: {value: angle,delay: 600, duration: 100},
            scaleX: {value: 3, yoyo: true, delay: 700, ease: 'Power2', duration: 500},
            scaleY: {value: 3, yoyo: true, delay: 700, ease: 'Power2', duration: 500},
          },
          onComplete: function(){
            if(this.killFishParams.player){
              //Beam
              this.killFishParams.player.drillShow();
              this.bonusGun.setActive(false).setVisible(false);
            }
          },
          callbackScope: this
        });//End Tween
      },
      callbackScope: this
    })//End Tween
  }
}