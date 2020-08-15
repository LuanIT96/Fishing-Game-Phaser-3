import Config from '../../config';
import BaseFish from './BaseFish';

export default class SpecialFish extends BaseFish {
  swim(arrayPath){
    this.killFishParams = null;
    /*Add Fish To Collision Group*/
    this.setCollisionGroup(this.scene.physicFishGroup);
    this.resetHealth();
    /*Reset fish position*/
    this.setOrigin(0.5)
    this.shadow.setOrigin(0.5)
    this.setActive(true).setVisible(true).setRotation(0).setAlpha(1).setScale(1.3).anims.play('fish'+this.config.type+'_swim').setPosition(arrayPath.p.x[0], arrayPath.p.y[0]);
    this.shadow.setActive(true).setVisible(true).setRotation(0).setAlpha(0.5).setScale(1.3).anims.play('fish'+this.config.type+'_swim').setPosition(arrayPath.p.x[0], arrayPath.p.y[0])

    this.arrayPath = arrayPath;
    this.swimRepeat({x: arrayPath.p.x[1], y: arrayPath.p.y[1], duration: arrayPath.t, currentIndexPath: 1});
  }
  swimRepeat(params){
    /*Rotate Before Swim*/
    this.scene.tweens.add({targets: [this, this.shadow], rotation: Phaser.Math.Angle.BetweenPoints({x: this.x, y: this.y}, {x: params.x, y: params.y}), duration: 300});
    this.tween = this.scene.tweens.add({
      targets: [this],
      props: {
          x: {value: params.x, duration: params.duration, delay: 550}, 
          y: {value: params.y, duration: params.duration, delay: 550}
      },
      onUpdate: function(tween, target){
        /*Make shadow follow main sprite*/
        this.shadow.setPosition(this.x+10, this.y+16);

        /*Check for Next Position in Array Path */
        if(tween.timeScale <= 0){
          this.tween.stop();
          /*Next Path*/
          if(params.currentIndexPath < this.arrayPath.p.x.length-1){
            params.currentIndexPath = params.currentIndexPath+1;
            if(this.anims.currentAnim.key === 'fish'+this.config.type+"_swim"){
              this.scene.time.delayedCall(3000, function(){
                if(this.anims.currentAnim.key === 'fish'+this.config.type+"_swim"){
                  this.anims.play('fish'+this.config.type+'_swim').shadow.anims.play('fish'+this.config.type+'_swim');
                  this.swimRepeat({x: this.arrayPath.p.x[params.currentIndexPath], y: this.arrayPath.p.y[params.currentIndexPath], duration: this.arrayPath.t, currentIndexPath: params.currentIndexPath});
                }
              }, [], this);
            }
          }else{
            this.tween.stop();
            this.setVisible(false).setActive(false);
            this.shadow.setVisible(false).setActive(false);
            this.setCollisionGroup(-1)
          }
        }

        let fishAnimsTimeScale = this.anims.getTimeScale();
        /**/
        if(!tween.isSlowDown){
          /*speed up for tween*/
          if(tween.timeScale < 2){
            tween.setTimeScale(tween.timeScale+this.speed.stepSpeedUp);
          }

          /*Speed up for animation*/
          if(fishAnimsTimeScale < this.speed.max){
            this.anims.setTimeScale(this.anims.getTimeScale()+this.speed.stepSpeedUp);
            this.shadow.anims.setTimeScale(this.anims.getTimeScale());
          }
        }else{
          /*Swiming Speed Slow Down for animation*/
          if(fishAnimsTimeScale > this.speed.min){
            this.anims.setTimeScale(fishAnimsTimeScale-this.speed.stepSlowDown);
            this.shadow.anims.setTimeScale(fishAnimsTimeScale-this.speed.stepSlowDown);
          }
          /*reduce swim speed for tween*/
          if(tween.timeScale > 0.2 && tween.isSlowDown){
            tween.setTimeScale(tween.timeScale-this.speed.stepSlowDown);
          }
        }
      },
      onComplete: function(){
        if(params.currentIndexPath < this.arrayPath.p.x.length-1){
          params.currentIndexPath = params.currentIndexPath+1;
          /*Next Path*/
          if(this.anims.currentAnim.key === 'fish'+this.config.type+"_swim"){
            this.scene.time.delayedCall(3000, function(){
              if(this.anims.currentAnim.key === 'fish'+this.config.type+"_swim"){
                this.anims.play('fish'+this.config.type+'_swim').shadow.anims.play('fish'+this.config.type+'_swim');
                this.swimRepeat({x: this.arrayPath.p.x[params.currentIndexPath], y: this.arrayPath.p.y[params.currentIndexPath], duration: this.arrayPath.t, delay: this.arrayPath.delay, currentIndexPath: params.currentIndexPath});
              }
            }, [], this);
          }
        }else{
          this.tween.stop();
          this.setVisible(false).setActive(false);
          this.shadow.setVisible(false).setActive(false);
          this.setCollisionGroup(-1)
        }
      },
      onStart: function(tween, target){
        tween.setTimeScale(2);
        this.anims.setTimeScale(this.speed.max);
        this.shadow.anims.setTimeScale(this.speed.max);
        tween.isSlowDown = true;
      },
      callbackScope: this
    },this);
  }

  resetHealth(){
    this.health = 100;
  }
}