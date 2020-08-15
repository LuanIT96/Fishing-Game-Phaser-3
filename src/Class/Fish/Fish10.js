import Config from '../../config';
import BaseFish from './BaseFish';

export default class Fish10 extends BaseFish {
	swim(arrayPath){
    this.killFishParams = null;
    this.resetHealth();
    /*Add Fish To Collision Group*/
    this.setCollisionGroup(this.scene.physicFishGroup);
    
    //Reset fish position
    this.setScale(1).shadow.setScale(1)
    this.setOrigin(0.5).shadow.setOrigin(0.5)
    this.setActive(true).setVisible(true).setRotation(0).setAlpha(1).anims.play('fish'+this.config.type+'_swim').setPosition(arrayPath.p.x[0], arrayPath.p.y[0]);
    this.shadow.setActive(true).setVisible(true).setRotation(0).setAlpha(0.5).setScale(Config.phaserGameResolution).anims.play('fish'+this.config.type+'_swim').setPosition(arrayPath.p.x[0], arrayPath.p.y[0])
    if(!this.follower){
      /*Create A Follower Curves Path*/
      this.follower = {t: 0, vec: new Phaser.Math.Vector2(arrayPath.p.x[0], arrayPath.p.y[0])};
      this.path = new Phaser.Curves.Path();
    }else{
      /*Reset Follower*/
      this.follower.t = 0;
      this.follower.vec.reset(arrayPath.p.x[0], arrayPath.p.y[0]);
      // this.path.destroy();
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
    /*Reset Path*/
    this.path.moveTo(arrayPath.p.x[0], arrayPath.p.y[0])
    this.path.splineTo(newPath)
    this.tween = this.scene.tweens.add({
      targets: this.follower,
      t: 1,
      duration: arrayPath.t,
      delay: arrayPath.delay,
      onUpdate: function(tween, target){
        /*Get Current Position of follower Path*/
        this.path.getPoint(this.follower.t, this.follower.vec);

        /*For Fish Shadow*/
        this.setRotation(Phaser.Math.Angle.BetweenPoints({x: this.x, y: this.y}, {x: this.follower.vec.x, y: this.follower.vec.y}));
        this.setPosition(this.follower.vec.x, this.follower.vec.y);

        this.shadow.setRotation(this.rotation);
        this.shadow.setPosition(this.x+10, this.y+20);
        
        if(this.frame.name === "fish10_swim_10.png"){
          this.tween.setTimeScale(3);    
        }
        /*Turtle time scale  reduce swim speed*/
        if(this.tween.timeScale > 0.5){
          this.tween.setTimeScale(this.tween.timeScale-0.02);
        }
        /*octopus time scale  reduce swim speed*/
        if(this.tween.timeScale > 0.5){
          this.tween.setTimeScale(this.tween.timeScale-0.02);
        }
        /*Reset Time Scale For Tween*/
        if(this.tween.timeScale < 0.5){
        	this.tween.setTimeScale(0.5);
        }
      },
      onComplete: function(){
        this.setVisible(false).setActive(false);
        this.shadow.setVisible(false).setActive(false);
        this.setCollisionGroup(-1)
      },
      callbackScope: this,
    },this);
  }
}