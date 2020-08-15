import Config from '../../config';
import BaseFish from './BaseFish';

export default class Fish5 extends BaseFish {
	/*For Fish 5 Only*/
  swim(arrayPath){
    this.killFishParams = null;
    this.setCollisionGroup(this.scene.physicFishGroup);
    this.resetHealth();
    this.setOrigin(0.5).shadow.setOrigin(0.5);
    this.setActive(true).setVisible(true).setRotation(0).setAlpha(1).anims.play('fish'+this.config.type+'_swim').setPosition(arrayPath.p.x[0], arrayPath.p.y[0]);
    this.shadow.setActive(true).setVisible(true).setRotation(0).setAlpha(0.5).anims.play('fish'+this.config.type+'_swim').setPosition(arrayPath.p.x[0], arrayPath.p.y[0])

    this.arrayPath = arrayPath;
    let x = this.arrayPath.p.x[0];
    let y = this.arrayPath.p.y[0];
    let duration = arrayPath.t;
    this.scene.time.delayedCall(arrayPath.delay, function(){
      this.swimRepeat({x: x, y: y, duration: duration, currentIndexPath: 0});
    }, [], this);
  }
  swimRepeat(params){
    if(!this.active) return;
    let x = params.x;
    let y = params.y;
    let duration = params.duration;
    let currentIndexPath = params.currentIndexPath;
    let rotation = Phaser.Math.Angle.BetweenPoints({x: this.x, y: this.y}, {x: x, y: y});
    
    /*Rotate Before Swim*/
    this.scene.tweens.add({targets: [this, this.shadow], rotation: rotation, duration: 200});
    this.scene.tweens.add({targets: [this, this.shadow], angle: "+=20", yoyo: true, duration: 100, delay: 300,  ease: 'Sine.easeInOut'});
    this.scene.tweens.add({targets: [this, this.shadow], angle: "+=15", yoyo: true, duration: 100, delay: 500,  ease: 'Sine.easeInOut'});
    this.scene.tweens.add({targets: [this, this.shadow], angle: "+=10", yoyo: true, duration: 100, delay: 700,  ease: 'Sine.easeInOut'});
    this.scene.tweens.add({targets: [this, this.shadow], angle: "+=5", yoyo: true, duration: 100, delay: 900,  ease: 'Sine.easeInOut'});

    this.tween = this.scene.tweens.add({
      targets: [this, this.shadow],
      props: {x: {value: x, duration: duration, delay: 550}, y: {value: y, duration: duration, delay: 550}},
      onUpdate: function(tween, target){
        this.shadow.setPosition(this.x+10, this.y+16);
        /*reduce swim speed*/
        if(tween.timeScale > 0 && tween.isSlowDown){
          tween.setTimeScale(tween.timeScale-0.001);
        }
        if(!tween.isSlowDown && tween.timeScale < 1.5){
          tween.setTimeScale(tween.timeScale+0.003);
        }
        if(tween.timeScale <= 0 && this.anims.currentAnim.key != "fish5_wink"){
          this.play('fish5_wink').shadow.anims.play('fish5_wink');
          this.tween.stop();

          /*Next Path*/
          if(this.active && currentIndexPath < this.arrayPath.p.x.length-1){
            currentIndexPath = currentIndexPath+1;
            if(this.active && this.anims.currentAnim.key === "fish5_wink"){
              this.scene.time.delayedCall(1500, function(){
                if(this.active && this.anims.currentAnim.key === "fish5_wink"){
                  let x = this.arrayPath.p.x[currentIndexPath];
                  let y = this.arrayPath.p.y[currentIndexPath];
                  this.anims.play('fish'+this.config.type+'_swim').shadow.anims.play('fish'+this.config.type+'_swim');
                  this.swimRepeat({x: x, y: y, duration: 3000, currentIndexPath: currentIndexPath});
                }
              }, [], this);
            }
          }else{
            this.forceStopSwim();
          }
        }
      },
      onComplete: function(){
        if(this.active && currentIndexPath < this.arrayPath.p.x.length-1){
          currentIndexPath = currentIndexPath+1;
          this.anims.play('fish5_wink').shadow.anims.play('fish5_wink');
          /*Next Path*/
          if(this.active && this.anims.currentAnim.key === "fish5_wink"){
            this.scene.time.delayedCall(1500, function(){
              if(this.active && this.anims.currentAnim.key === "fish5_wink"){
                let x = this.arrayPath.p.x[currentIndexPath];
                let y = this.arrayPath.p.y[currentIndexPath];
                this.anims.play('fish'+this.config.type+'_swim').shadow.anims.play('fish'+this.config.type+'_swim');
                this.swimRepeat({x: x, y: y, duration: 3000,  currentIndexPath: currentIndexPath});
              }
            }, [], this);
          }
        }else{
          this.forceStopSwim();
        }
      },
      onStart: function(tween, target){
        tween.setTimeScale(1.7);
        tween.isSlowDown = true;
      },
      callbackScope: this
    },this);
  }
}