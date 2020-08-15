import Config from '../../config';
import SpecialFish from './SpecialFish';

export default class Fish24 extends SpecialFish {
  constructor (world, scene, config){
    super(world, scene, config);
    this.boomArea = this.scene.add.sprite(0, 0, this.config.key,'boom_radius.png').setActive(false).setVisible(false);
  }
  killFish(params){
    if(this.killFishParams) return;
    if(this.tween && this.tween.isPlaying) this.tween.stop();//Stop move
    this.setCollisionGroup(-1);//reset collision 
    this.killFishParams = params;

    this.shadow.setVisible(false).setActive(false);
    this.anims.play('crab_boom_small_die');
    this.boomArea.setActive(true).setVisible(true).setTexture(this.config.key,'boom_radius.png').setPosition(this.x, this.y).setAlpha(0.5).setScale(10);
    this.scene.tweens.add({targets: this.boomArea,props:{scaleY: {value: 14, duration: 350, yoyo: true, repeat: 4}, scaleX: {value: 14, duration: 350, yoyo: true, repeat: 4}}})
    this.scene.tweens.add({
      targets: this,
      props:{scaleY: {value: 2, duration: 350, yoyo: true, ease: 'Sine.easeInOut'}, scaleX: {value: 2, duration: 350, yoyo: true, ease: 'Sine.easeInOut'}},
      repeat: 4,
      onUpdate: function(){
        this.setRotation(this.rotation+0.02);
      },
      onComplete: function(){
        this.boomArea.setAlpha(1);
        this.boomArea.anims.play('boom_explode');
        this.setVisible(false).setActive(false);
      },
      callbackScope: this
    },this);
  }
}