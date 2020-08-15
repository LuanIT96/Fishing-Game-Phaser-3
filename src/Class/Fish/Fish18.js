import Config from '../../config';
import BigFish from './BigFish';

export default class Fish18 extends BigFish {
	/*
  * Revive this fish and swim
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
    this.setActive(true).setVisible(true).setAngle(0).setScale(1.3).setOrigin(0.5).setRotation(0).setAlpha(1).anims.play('fish'+this.config.type+'_swim').setPosition(arrayPath.p.x[0], arrayPath.p.y[0]);
    this.shadow.setActive(true).setVisible(true).setAngle(0).setScale(1.3).setOrigin(0.5).setRotation(0).setAlpha(0.5).anims.play('fish'+this.config.type+'_swim').setPosition(arrayPath.p.x[0], arrayPath.p.y[0])
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
      },
      onComplete: function(){
        this.setVisible(false).setActive(false);
        this.shadow.setVisible(false).setActive(false);
        this.setCollisionGroup(-1);
      },
      callbackScope: this,
    },this);
  }
}