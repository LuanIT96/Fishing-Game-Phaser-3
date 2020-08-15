export default class DrillBulletFollower extends Phaser.GameObjects.Particles.Particle{
  constructor (emitter){
    super(emitter);
    this.t = 0;
    this.i = 0;
    this.anims = emitter.manager.scene.anims.anims.entries.drillFollower;
    this.totalFrame = this.anims.frames.length;
  }

  update (delta, step, processors){
    var result = super.update(delta, step, processors);
    this.t += delta;
    if (this.t >= this.anims.msPerFrame){
      this.i++;
      if (this.i >= this.totalFrame){
          this.i = 0;
      }
      this.frame = this.anims.frames[this.i].frame;
      this.t -= this.anims.msPerFrame;
    }
    return result;
  }
}
