import Config from '../../config';
import BaseFish from './BaseFish';

export default class BigFish extends BaseFish {
  killFish(params){
    if(this.killFishParams) return;
    if(this.tween && this.tween.isPlaying) this.tween.stop();
    if(params && params.player) params.player.cancleFocusElectricToFish();//force cancle focus of player using electric gun
    
    this.setCollisionGroup(-1);//disable collide
    this.killFishParams = params;
    this.anims.play('fish'+this.config.type+'_die');
    this.shadow.anims.play('fish'+this.config.type+'_die');
  }
	die(){
		this.scene.cameras.main.shake(300, 0.002);
    const yPosition = (this.killFishParams.player.position < 2) ? (this.killFishParams.player.y - Phaser.Math.RND.between(150, 300)) : (this.killFishParams.player.y + Phaser.Math.RND.between(150, 300));
    const xPosition = this.killFishParams.player.x + Phaser.Math.RND.between(-100, 100);

    //explode glow
    this.game.gameAudio.custom['killWhale2'].play({volume: this.killFishParams.player.position === this.scene.myPosition ? 1 : 0.2});
    this.game.gameAudio.custom['whaleCatch'].play({volume: this.killFishParams.player.position === this.scene.myPosition ? 1 : 0.2});
    this.scene.creditWinEffect.bigFishExplode({x: this.x, y: this.y});

		this.scene.tweens.add({
      targets: [this.shadow, this], x: xPosition, y: yPosition, angle: this.angle < 0 ? -180 : 180, delay: 200, duration: 800,
      onComplete: function(){
        let odds = this.config.odds;
        if(this.config.odds.min){odds = Phaser.Math.Between(this.config.odds.min, this.config.odds.max);}
        this.scene.creditWinEffect.coinJumnp(
          this.killFishParams.player.bet*odds, 
          this.killFishParams.player, 
          {x: xPosition, y: yPosition}, 
          'GoldWin', 
          this.killFishParams.player.position === this.scene.myPosition ? 1 : 0.2, 
          this.killFishParams.noUpdateCredit ? this.killFishParams.noUpdateCredit : false
        );
        this.scene.tweens.add({
          targets: [this, this.shadow],
          props: {
            angle: {value: 720, delay: 4500},
            alpha: {value: 0.1, delay: 5000, duration: 500}
          },
          onComplete: function(){
            this.scene.creditWinEffect.coinMultiple({x: xPosition, y: yPosition}, {x: this.killFishParams.player.x, y: this.killFishParams.player.y}, this.killFishParams.player.position, this.killFishParams.coinType, this.killFishParams.textType);
            this.scene.sound.play('coinjump2', {volume: this.killFishParams.player.position === this.scene.myPosition ? 1 : 0.2});
            this.setVisible(false).setActive(false);
            this.shadow.setVisible(false).setActive(false);
          },
          callbackScope: this
        })
      },
      callbackScope: this
    });
	}
}