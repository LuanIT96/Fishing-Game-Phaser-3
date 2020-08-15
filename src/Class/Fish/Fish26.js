import Config from '../../config';
import SpecialFish from './SpecialFish';

export default class Fish26 extends SpecialFish {
	constructor (world, scene, config){
    super(world, scene, config);
    this.bonusGun = this.scene.add.sprite(0, 0, this.config.key, 'weapon_beam.png').setActive(false).setVisible(false).setScale(0);
    this.speed = {min: 0.5, max: 2.5, stepSpeedUp: 0.03, stepSlowDown: 0.0028}//animation timeScale 
  }
	killFish(params){
    if(this.killFishParams) return;
    if(params && params.player) params.player.cancleFocusElectricToFish();
    if(this.tween && this.tween.isPlaying) this.tween.stop();//Stop move
    this.setCollisionGroup(-1);
    this.killFishParams = params;
    
		this.anims.play('fish'+this.config.type+'_die');
    this.shadow.setVisible(false).setActive(false);
    // this.scene.tweens.add({targets: this,props:{scaleY: {value: 1.7, duration: 350, ease: 'Circ.easeInOut'}, scaleX: {value: 1.7, duration: 350,  ease: 'Circ.easeInOut'}}})


    //hide but don't kill, kill the fish after player fire beam
    this.setVisible(false);
    this.bonusGun.setActive(true).setVisible(true).setAngle(0).setScale(0).setPosition(this.x, this.y).setTexture(this.config.key, "weapon_beam.png");

    let angle = 0;
    let playerPosY = params.y-90
    if(this.killFishParams.player.position === 2 || this.killFishParams.player.position === 3){
      angle = 180;
      playerPosY = params.y+90
    }
    this.game.gameAudio.custom['lazerBeamShow'].play();
    
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
              this.killFishParams.player.lazerBeamShow();
              this.bonusGun.setActive(false).setVisible(false);
              this.game.gameAudio.custom['gunChange'].play();
            }
          },
          callbackScope: this
        });//End Tween
      },
      callbackScope: this
    })//End Tween
  }
  die(){}
}