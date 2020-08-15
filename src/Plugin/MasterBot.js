import Storage from 'local-storage-fallback';
import Config from '../config';

export default class AutoBotPlugin extends Phaser.Plugins.BasePlugin {
  constructor (game, pluginManager){
    super(game, pluginManager);
    this.config = {};
    this.config.cannon = Phaser.Math.Between(1, 3);
    this.config.connected = true;//Phaser.Math.Between(0, 1) === 0 ? true : false;

    if(!this.config.connected){
      let delay = Phaser.Math.Between(10000,  120000);
      this.config.isSleep = true;
      setTimeout(function(){ 
        this.config.isSleep = false;
        this.config.step = 0;
        this.config.connected = true;
        this.config.credit = Phaser.Math.Between(this.game.betConfig[9]*50, this.game.betConfig[9]*200);
        this.updatePlayerConfig();
      }.bind(this), delay);
    }
  }

  /*
  *
  *
  */
  updatePlayerConfig(){
    if(this.player){
      if(!this.config.credit){
        this.config.credit = Phaser.Math.Between(this.game.betConfig[9]*50, this.game.betConfig[9]*200);
        this.config.bet = this.game.betConfig[Phaser.Math.Between(0, 3)];
      }
      this.player.updateBet(this.config.bet);
      this.config.connected===true ? this.player.connect(false, this.config) : this.player.disconnect();
      this.player.updatePlayerTotalCredit(this.config.credit, true);
      this.player.gun.gunType = this.config.cannon;
      this.player.changeGunType(false);
    }
  }

  /*
  *
  *
  */
  setPlayer(player){
  	this.player = player;
    this.scene = player.scene;
    if(!this.player.bot)this.player.bot = this;

    /*
    * loop time action
    *STEP:
    *0: see
    *1: think
    *2: do
    */
    this.config.step = 0;
    this.config.fireCount = 0;
    this.config.maxFireCount = Phaser.Math.Between(50, 150);
    
    if(!this.actionTimer){
      //Can't use phaser timer cause it's use for each scene can't use for global
      this.actionTimer = setInterval(function(){ 
        if(!this.config.connected || this.config.isSleep) return;

        //block action when player get block
        if(!this.player.canFire || !this.config.connected) return;
        switch(this.config.step) {
          case 0: this.see(); break;
          case 1: this.think(); break;
          default: this.do();
        }
      }.bind(this), 200);
    }
  }

  /*
  *
  *
  */
  see(){
    //out of credit 
    if(this.config.credit < this.config.bet){
      this.config.step = 1; 
      return;
    }
    //Drill or Lazer Beam
    if(this.player.drillGun.drillIsReady === true || this.player.lazerBeam.lazerBeamIsReady === true){
      this.config.step = 1; 
      return;
    }
    let bigestFish;
    let nearestFish;
    let distanceMin;
    const length = this.scene.fishGroup.length - 1;
    for (let groupIndex = length; groupIndex > 8; groupIndex--) {
      this.scene.fishGroup[groupIndex].getChildren().forEach(function(fish, fishIndex){
        if(fish.visible && fish.active && fish.anims.currentAnim.key === 'fish'+fish.config.type+'_swim' && Phaser.Geom.Rectangle.ContainsPoint(this.player.scene.rectangleBounds, {x: fish.x, y: fish.y})){
          //find bigest fish
          if(!bigestFish && Phaser.Math.Between(0, 1) === 0) {
            bigestFish = fish;
          }
          //find nearest fish
          let distanceBtw = Phaser.Math.Distance.Between(this.player.x, this.player.y, fish.x, fish.y);
          let rdDistance = Phaser.Math.Between(1500, 5000);
          if(distanceBtw < rdDistance){
            nearestFish = fish;
            groupIndex = 0;//stop loop
          }
        }
      },this)
    }
    if(bigestFish  &&  nearestFish){
      this.config.bigestFish = bigestFish;
      this.config.nearestFish = nearestFish;
      this.config.myGun  = this.player.gun.gunType;
      this.config.step = 1;
    }else{
      this.config.bigestFish =  null;
      this.config.nearestFish = null;
    }
  }

  /*
  *
  *
  */
  think(){
    /*
    * Thinking
    * 0: electric focus
    * 1: fire to fish
    * 2: change gun
    * 3: choose drill pointer and fire
    * 4: out of credit - topup and continue
    * 5: out of credit - quit room and reconnect after time
    */
    if(this.config.credit < this.config.bet){
      this.config.thinking = Phaser.Math.Between(4, 5);
      this.config.step = 2;
      return;
    }

    if(this.player.drillGun.drillIsReady || this.player.lazerBeam.lazerBeamIsReady){
      //random target
      this.config.focusPoint = {x: Phaser.Math.Between(Config.gameCenterX*0.2, Config.gameCenterX*0.8), y: Config.gameCenterY};
      this.config.fireAfter = Phaser.Math.Between(1500, 5000);
      this.config.thinking = 3;
      this.config.step = 2;
      return;
    }

    //
    if(this.player.gun.active){
      if(this.config.fireCount > this.config.maxFireCount) {
        this.config.fireCount = 0;
        if(Phaser.Math.Between(0, 1) === 0) this.config.thinking = 2;
      }else
      if(this.player.gun.gunType === 3) {
        //electric=>focus bigest fish
        this.config.thinking = 0;
      }else
      if(this.player.gun.gunType === 1 || this.player.gun.gunType === 2) {
        //bullet single or pouble=>fire the nearest fish
        this.config.thinking = 1; 
      }
      this.config.step = 2;
    }
  }

  /*
  *
  *
  */
  do(){
    //lazer beam or drill
    if(this.player.drillGun.drillIsReady || this.player.lazerBeam.lazerBeamIsReady){
      this.config.step = 0;
    }
    if(this.config.credit < this.config.bet){
      this.config.step = 0;
    }
    switch(this.config.thinking) {
      case 0://Focus Electric
        if(this.config.bigestFish.visible && this.config.bigestFish.active && this.config.bigestFish.anims.currentAnim.key === 'fish'+this.config.bigestFish.config.type+'_swim'){
          if(Phaser.Geom.Rectangle.ContainsPoint(this.player.scene.rectangleBounds, {x: this.config.bigestFish.x, y: this.config.bigestFish.y})) {
            if(!this.player.focusOnFish){
              this.player.startFocusElectricToFish(this.config.bigestFish);
            }
          }else{
            this.player.cancleFocusElectricToFish();
            this.config.step = 0;
            this.config.bigestFish = null;
          }
          this.config.fireCount+=1;
        }else{
          this.config.step = 0;
          this.config.bigestFish = null;
        }

        break;
      case 1://Fire to nearedest Fish
        this.player.fire({target: {x: this.config.nearestFish.x, y: this.config.nearestFish.y}});
        if(
          !this.config.nearestFish.visible || 
          !this.config.nearestFish.active || 
          Phaser.Math.Distance.Between(this.player.x, this.player.y, this.config.nearestFish.x, this.config.nearestFish.y) > Phaser.Math.Between(700, 1000) ||
          this.config.nearestFish.anims.currentAnim.key !== 'fish'+this.config.nearestFish.config.type+'_swim'
        ){
          this.config.step = 0;
          this.config.nearestFish = null;
        }
        this.config.fireCount+=1;
        break;

      case 2://check change gun
        let cannon = Phaser.Math.Between(1, 3);
        if(this.config.cannon != cannon){
          this.config.cannon = cannon;
          this.player.gun.gunType = cannon;
          this.player.changeGunType(false);
        }
        this.config.maxFireCount = Phaser.Math.Between(50, 150);
        this.config.fireCount = 0;
        this.config.step = 0;
        
        break;
      case 3: //Fire Drill or Lazer Beam after #fireAfter
        if(this.config.fireAfter > 0){
          this.config.fireAfter = 0;

          this.scene.time.delayedCall(
            this.config.fireAfter,
            function(){
              if(this.player.drillGun.drillIsReady===true){//is drill
                this.player.drillFocus(this.config.focusPoint);
                this.player.drillFire({target: this.config.focusPoint});
              }else{//is lazer beam
                this.player.lazerBeamFocus(this.config.focusPoint);
                this.player.lazerBeamFire();
              }
              
            }, [], this)
        }

        //
        if(!this.player.drillGun.drillIsReady && !this.player.lazerBeam.lazerBeamIsReady) this.config.step = 0;
        break;
      case 4: //out of credit -> topup and continue after random times
        this.topup()
        break
      case 5://out of credit -> quit room and sleep by random times
        this.quit();
        break;
      default: 
        break;
    }
  }

  /*
  *
  *
  */
  topup(){
    this.config.isSleep = true;
    let actionDelay = Phaser.Math.Between(5000, 20000)
    let self = this;
    setTimeout(function(){ 
      self.config.isSleep = false;
      self.config.credit = Phaser.Math.Between(this.game.betConfig[9]*50, this.game.betConfig[9]*200);
      self.updatePlayerConfig();
      self.config.step = 0;
    }, actionDelay);
  }

  /*
  *
  *
  */
  quit(){
    this.config.isSleep = true;
    let self = this;
    let actionDelay = Phaser.Math.Between(15000, 25000)
    setTimeout(function(){ 
      self.config.connect = false;
      self.player.disconnect();
      setTimeout(function(){ 
        self.config.isSleep = false;
        self.config.credit = Phaser.Math.Between(this.game.betConfig[9]*50, this.game.betConfig[9]*200);
        self.config.connect = true;
        self.updatePlayerConfig();
        self.config.step = 0;
      }, Phaser.Math.Between(10000, 100000));
    }, actionDelay);
  }
}

