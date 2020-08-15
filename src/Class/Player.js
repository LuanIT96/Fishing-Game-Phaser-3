import Config from '../config';
import DrillBulletFollower from './DrillBulletFollower';
import Helpers from '../helpers';

/**********GUN TYPE**************
*
*gun.gunType = 1: single bullet
*gun.gunType = 2: double bullet
*gun.gunType = 3: electric bullet
*
*/
let tweenFocus1, //focus arrow
tweenFocus2;//focus circle

export default class Player extends Phaser.GameObjects.Container {
  constructor (scene, x, y, config){
    super(scene, x, y);
    this.game = scene.game;
    this.position = config.position;
    this.connected = config.connected;
    this.fireRate = 50;
    this.nextFire = 0;
    this.canFire = true;
    if(typeof config.onChangegun ==='function') {
      this.onChangegun = config.onChangegun;
      this.addListener('onChangegun',function(){
        this.onChangegun(this);
      }, this);
    }
    this.playerCredit = 0;
    this.bet = 10;
  }

  /*
  * Description: call this function to update player credit
  * @params: value<Number>
  */
  updatePlayerTotalCredit(value, refresh=false){
    if(refresh===true){//REFRESH CREDIT
      this.playerCredit = value;
    }else{
      this.playerCredit = this.playerCredit + parseFloat(value);
      if(this.bot){
        this.bot.config.credit = this.playerCredit;
      }else{
        this.game.mainPlayerConfig.credit = this.playerCredit;
      }
    }

    this.creditText.setText(Helpers.number_format(this.playerCredit, 0, '.', ','));
  }
  /*
  *
  *
  *
  *
  */
  renderBaseGun(){
    //Player on bottom
    if(this.position === 0 || this.position === 1){
      this.waitText = this.scene.add.sprite(0, -35, 'basegun','waiting.png').setScale(0.9);
      this.playerAngle = 0;
    }else{
      //Player on top
      this.waitText = this.scene.add.sprite(0, 35, 'basegun','waiting.png').setScale(0.9);
      this.playerAngle = 3.141;
    }

    this.waitTextTween = this.scene.tweens.add({ targets: this.waitText, alpha: 0.5, scale: 1, ease: 'Linear', duration: 2000, repeat: -1, yoyo: true, onStart: function(tween ,targets){targets[0].setScale(0.9)}});

    /*Focus Group*/
    this.focusGroup = this.scene.add.container(this.x,this.y);
    this.focusGroupProperty = {};
    if(this.position === 0 || this.position === 1){
      this.focusGroupProperty.focusArrow = this.scene.add.sprite(0,-240, 'basegun','focus_arrow.png');
      this.focusGroupProperty.focusShinee = this.scene.add.sprite(0,-54, 'basegun','focus_shinee.png');
      this.focusGroupProperty.focusCirlce = this.scene.add.sprite(0,-54, 'basegun','focus_circle.png').setScale(Config.phaserGameResolution*1.8);
    }else{
      this.focusGroupProperty.focusArrow = this.scene.add.sprite(0, 240, 'basegun','focus_arrow.png').setFlipY(1);
      this.focusGroupProperty.focusShinee = this.scene.add.sprite(0, 54, 'basegun','focus_shinee.png');
      this.focusGroupProperty.focusCirlce = this.scene.add.sprite(0, 54, 'basegun','focus_circle.png').setScale(Config.phaserGameResolution*1.8);
    }
    this.focusGroup.add([this.focusGroupProperty.focusArrow, this.focusGroupProperty.focusShinee, this.focusGroupProperty.focusCirlce]).setVisible(false).setActive(false);

    //
    this.focusGroup.removeFocus = function(){
      this.focusGroup.setVisible(false).setActive(false);
      if(tweenFocus1 && tweenFocus1.isPlaying()){
        tweenFocus1.stop();
        tweenFocus2.stop();
        tweenFocus1 = null;
        tweenFocus2 = null;
      }
    }.bind(this);
  }

  /*
  *
  *
  *
  *
  */
  renderGun(){
    this.bullets = this.scene.add.group(); 
    this.gunGroup = this.scene.add.container(this.x, this.y);

    this.bulletElectric = this.scene.add.sprite(0, -195, 'basegun','electric_line_1.png').setScale(0.7).setOrigin(0, 0.5).setVisible(false);
    if(this.position === 2 || this.position === 3){
      this.bulletElectric.setOrigin(1, 0.5);
    }
    this.bulletElectricTarget = this.scene.add.sprite(0, -120, 'basegun','fish16.png').setVisible(false);
    this.bulletElectricExplode = this.scene.add.sprite(0, -195, 'basegun','electric_line_1.png').setVisible(false);
    this.bulletElectric.on('animationcomplete',function(){
      this.bulletElectricExplode.anims.stop();
      this.bulletElectricExplode.setVisible(false);
    },this);
    
    this.canChangeGun = true;
    this.basegun1 = this.scene.add.sprite(0,-49, 'basegun','base1_1.png').anims.play('basegun1');

    //Matter js Bullet Object
    for(let i=0; i<20; i++){
      let bullet = this.scene.matter.add.sprite(-500,-500, 'basegun','bullet1.png');
      bullet.name ='bullet1';
      bullet.objectType = "bullet";
      bullet.playerPosition = this.position;
      bullet.setBounce(1).setFriction(0,0,0).setAngularVelocity(0).setFixedRotation(0).setIgnoreGravity(true).setCollisionGroup(-1).setActive(false).setVisible(false);
      bullet.addListener('bodyhit',function(){
        this.hitBody = this.hitBody+1;
        if(this.hitBody === 3){
          this.setVelocity(0,0);
          this.body.isStatic = true;
          this.setActive(false)
          this.setBounce(0);
          this.setVisible(false);
          this.setPosition(5000, 5000)
        }else{
          this.setRotation(Math.atan2(this.body.velocity.y, this.body.velocity.x));
        }
      });

      //add event explode when bullet hit the fish
      bullet.addListener('explode',function(){
        this.setVelocity(0,0);
        this.body.isStatic = true;
        this.setBounce(0).setVisible(false);
        this.explode.setPosition(this.x, this.y).anims.play('bullet1_explode');
      });
      bullet.explode = this.scene.add.sprite(0, 0,'basegun','bullet_explode_1.png').setVisible(false);
      bullet.explode.on('animationcomplete',function(currentAnim, currentFrame){bullet.setActive(false);});
      this.bullets.add(bullet);
    }

    //base gun
    this.gun = this.scene.add.sprite(0,-44, 'basegun','gun1_12.png').setInteractive().setOrigin(0.5, 0.92);
    this.gun.gunType = 1;
    this.gun.anims.play('gun1_rotate');
    this.totalBet = this.scene.add.sprite(0, -23, 'basegun','txt-bet.png');
    this.totalBetText = this.scene.add.bitmapText(0, -20, 'FontBet', Helpers.number_format(this.bet, 0, '.', ','), 18, "center").setOrigin(0.5, 0.5).setCenterAlign();
    switch(this.position) {
      case 0:
        this.creditPanel = this.scene.add.sprite(-140, -20, 'basegun','credit_txt'+this.position+'.png').setScale(0.60).setFlipX(true);
        this.gun.circleRadius =  new Phaser.Geom.Circle(this.x, this.y - 50, 100);  
        this.creditText = this.scene.add.bitmapText(-205, -20, 'FontCredit', Helpers.number_format(this.playerCredit, 0, '.', ','), 18, "center").setOrigin(0, 0.5).setLeftAlign();
        break;
      case 1:
        this.gun.circleRadius =  new Phaser.Geom.Circle(this.x, this.y - 50, 100);  
        this.creditPanel = this.scene.add.sprite(105, -20, 'basegun','credit_txt'+this.position+'.png').setScale(0.60);
        this.creditText = this.scene.add.bitmapText(170, -20, 'FontCredit', Helpers.number_format(this.playerCredit, 0, '.', ','), 18, "center").setOrigin(1, 0.5).setLeftAlign();
        break;
      case 2:
        this.gun.circleRadius =  new Phaser.Geom.Circle(this.x, this.y + 50, 100);
        this.creditPanel = this.scene.add.sprite(-140, -20, 'basegun','credit_txt'+this.position+'.png').setScale(0.60).setFlipX(true);
        this.creditText = this.scene.add.bitmapText(-205, -25, 'FontCredit', Helpers.number_format(this.playerCredit, 0, '.', ','), 18, "center").setOrigin(1, 0.5).setRightAlign().setAngle(180);
        this.totalBetText.setY(-26).setAngle(180);
        break;
      case 3:
        this.gun.circleRadius =  new Phaser.Geom.Circle(this.x, this.y + 50, 100);
        this.creditPanel = this.scene.add.sprite(105, -20, 'basegun','credit_txt'+this.position+'.png').setScale(0.60);
        this.creditText = this.scene.add.bitmapText(170, -25, 'FontCredit', Helpers.number_format(this.playerCredit, 0, '.', ','), 18, "center").setOrigin(0, 0.5).setRightAlign().setAngle(180);
        this.totalBetText.setY(-26).setAngle(180);
        break;
      default: // code block
    }
    this.basegun2 = this.scene.add.sprite(-24, -40, 'basegun','base2_1.png').anims.play('basegun2');
    this.basegun2.on('pointerdown',function(){if(this.position === this.scene.myPosition && this.gun.active) this.changeGunType();},this)
    this.gun.on('pointerdown',function(){if(this.position === this.scene.myPosition && this.gun.active) this.changeGunType();},this)
    this.btnPlus = this.scene.add.sprite(66, -20, 'basegun','plus.png').setInteractive();
    this.btnPlus.on('pointerdown', function(){
      this.scene.tweens.add({targets: this.btnPlus, scaleX: "-="+0.1, scaleY: "-="+0.1, ease: 'Bounce', duration: 50,yoyo: true},this); //button press down effect

      //set betIndex in global config and update player bet text
      this.game.mainPlayerConfig.betIndex+=1;
      if(this.game.mainPlayerConfig.betIndex >= this.game.betConfig.length){
        this.game.mainPlayerConfig.betIndex = 0;
      }
      this.updateBet(this.game.betConfig[this.game.mainPlayerConfig.betIndex]);
    },this)
    this.btnMinus = this.scene.add.sprite(-66, -20, 'basegun','minus.png').setInteractive();
    this.btnMinus.on('pointerdown', function(){
      //
      this.scene.tweens.add({targets: this.btnMinus, scaleX: "-="+0.1, scaleY: "-="+0.1, ease: 'Bounce', duration: 50,yoyo: true},this); //button press down effect

      //set betIndex in global config and update player bet text
      this.game.mainPlayerConfig.betIndex-=1;
      if(this.game.mainPlayerConfig.betIndex < 0){
        this.game.mainPlayerConfig.betIndex = this.game.betConfig.length-1;
      }
      this.updateBet(this.game.betConfig[this.game.mainPlayerConfig.betIndex]);
    },this)
    

    // this.btnMinus.setVisible(false).setAlpha(0);
    // this.btnPlus.setVisible(false).setAlpha(0);
    this.gunGroup.add([
      this.basegun1, 
      this.creditPanel,
      this.creditText,
      this.bulletElectric, 
      this.gun, 
      this.basegun2, 
      this.totalBet,
      this.totalBetText,
      this.bulletElectricTarget,
      this.btnPlus, 
      this.btnMinus,
      // this.drillTextBox
    ]).setRotation(this.playerAngle)

    /*Add To Player Group*/
    this.add(this.waitText);
    if(this.connected){
      this.waitText.setVisible(false).setActive(false);
      this.waitTextTween.stop();
      this.gunGroup.setVisible(true).setActive(true);
    }else{
      this.waitText.setVisible(true).setActive(true);
      this.gunGroup.setVisible(false).setActive(false);
    }

    /*Gun Animation*/
    this.gun.on('animationcomplete', function(currentAnimation, currentFrame){this.gun.emit('animationcomplete_'+currentAnimation.key)},this);
    this.gun.on('animationcomplete_gun1_fire', function(currentAnimation, currentFrame){if(this.gun.gunType === 1) this.gun.anims.play('gun1_rotate')},this);
  }

  /*
  *@data.pointer(Vector2)
  *@data.object(Sprite Object)
  *@data.callback(Function)
  */
  fire(data){
    if(!this.canFire)  return;

    if(this.playerCredit < this.bet) return;//block fire action if not enought credit

    if(this.gun.active && this.gun.gunType === 1 && this.bullets.countActive(false) > 1){
      this.fireSingleBullet(data);
    }
    if(this.gun.active && this.gun.gunType === 2 && this.bullets.countActive(false) > 2){
      this.fireDoubleBullet(data);
    }
      // this.lazerBeamFocus(data.target);
  }

  /*
  * Description: update bet per shoot bullet
  */
  updateBet(bet){
    this.bet = bet;
    this.totalBetText.setText(bet);
  }

  /*
  *
  *
  *
  *
  */
  fireSingleBullet(data){
    let target = data.target;
    let object = data.object;
    let callback = data.callback;
    let bullet = this.bullets.getFirstDead();
    if(bullet && !this.gun.circleRadius.contains(target.x, target.y) && this.scene.time.now > this.nextFire){
      this.updatePlayerTotalCredit(-this.bet);


      this.scene.sound.play('bulletShoot', {volume: this.position === this.scene.myPosition ? 1 : 0.3});
      this.nextFire = this.scene.time.now + this.fireRate;
      var angle = Phaser.Math.Angle.BetweenPoints(this.gunGroup, target);
      if(this.position === 0 || this.position === 1){//player1 & player2
        this.gun.setRotation(angle+1.6);
      }else{//player3 & player4
        this.gun.setRotation(angle-1.6);
      }
      //GUN SINGLE BULLET
      this.gun.anims.play('gun'+this.gun.gunType+'_fire');
      var newPoin1 = Phaser.Geom.Circle.CircumferencePoint(this.gun.circleRadius, angle);
      bullet.hitBody = 0;//reset body hit counter
      let force = 0.15;
      if(this.game.loop.actualFps﻿ < 45){
        force = 0.18;
      }
      bullet.setVelocity(0,0).setStatic(false).setActive(true).setVisible(true).setPosition(newPoin1.x, newPoin1.y).setRotation(angle).setBounce(1).thrust(force)

      /*Socket Send*/
      if(callback) callback();
    }
  }

  /*
  *
  *
  *
  *
  */
  fireDoubleBullet(data){
    let target = data.target;
    let object = data.object;
    let callback = data.callback;
    if(!this.gun.circleRadius.contains(target.x, target.y) && this.scene.time.now > this.nextFire){
      this.updatePlayerTotalCredit(-this.bet);//deduce credit when shoot

      this.scene.sound.play('bulletShoot', {volume: this.position === this.scene.myPosition ? 1 : 0.3});
      this.nextFire = this.scene.time.now + this.fireRate;
      var angle = Phaser.Math.Angle.BetweenPoints(this.gunGroup, target);
      if(this.position === 0 || this.position === 1){//player1 & player2
        this.gun.setRotation(angle+1.6);
      }else{//player3 & player4
        this.gun.setRotation(angle-1.6);
      }
      this.gun.anims.play('gun'+this.gun.gunType+'_fire');
      let newPoin2 = Phaser.Geom.Circle.CircumferencePoint(this.gun.circleRadius, angle-0.25);
      let newPoin3 = Phaser.Geom.Circle.CircumferencePoint(this.gun.circleRadius, angle+0.25);

      let force = 0.15;
      if(this.game.loop.actualFps﻿ < 45){
        force = 0.18;
      }
      let bullet = this.bullets.getFirstDead();
      bullet.hitBody = 0;//reset body hit counter
      bullet.setVelocity(0,0).setStatic(false).setActive(true).setVisible(true).setPosition(newPoin2.x, newPoin2.y).setRotation(angle).setBounce(1).thrust(force)

      let bullet1 = this.bullets.getFirstDead();
      bullet1.hitBody = 0;//reset body hit counter
      bullet1.setVelocity(0,0).setStatic(false).setActive(true).setVisible(true).setPosition(newPoin3.x, newPoin3.y).setRotation(angle).setBounce(1).thrust(force)

      /*Socket Send*/
      if(callback) callback();
    }
  }

  /*
  * description: 
  * params
  *   - target: Fish (Fish.js object)
  *   - x: centerX of rectangle(this.rectCombineFishAndBound) combine fish and bounds
  *   - y: centerY of rectangle(this.rectCombineFishAndBound) combine fish and bounds
  */  
  fireElectric(target, targetX, targetY){
    if(this.playerCredit < this.bet || !this.gun.active) return;//block fire action if not enought credit
    if(this.position === this.scene.myPosition && !this.game.gameAudio.custom['electricFire'].isPlaying)  this.game.gameAudio.custom['electricFire'].play({loop: true}); // 

   	var velocity = new Phaser.Math.Vector2();
    let fromX = this.gunGroup.x;
    let fromY = this.gunGroup.y + this.bulletElectric.y;
    if(this.position === 2 || this.position === 3){
      fromY = this.gunGroup.y - this.bulletElectric.y;
    }
    
   	var distance = Phaser.Math.Distance.Between(fromX, fromY, targetX, targetY);
   	var angle = Phaser.Math.Angle.BetweenPoints({x: fromX, y: fromY}, {x: targetX, y: targetY});
    this.bulletElectric.setRotation(angle).setDisplaySize(distance, this.bulletElectric.displayHeight);
   	this.bulletElectricExplode.setPosition(targetX, targetY);
   	if(!this.bulletElectric.anims.isPlaying){
      //effect tint color when bullet hit fish
      let health = target.damageFish(Phaser.Math.RND.between(70, 200));
      if(health > 0){
        target.hitFish();
      }else{
        let params = {x: this.x, y: this.y, player: this, coinType: 'gold', textType:'gold'};
        target.killFish(params);
      }

      this.updatePlayerTotalCredit(-this.bet);//deduce credit when shoot
   		this.bulletElectric.play('bullet_electric');
      this.bulletElectricExplode.play('bullet_explode');
   	}
  }

  /*
  *
  *
  *
  *
  */
  startFocusElectricToFish(fish){
    //block electric when drill or lazer beam showing
    if(this.drillGun.drillIsReady===true || this.lazerBeam.lazerBeamIsReady){this.cancleFocusElectricToFish(); return;}


    //cancle old target before focus new target
    this.cancleFocusElectricToFish();//kill old tween focus if exits, make sure focus 1 fish one time
    this.focusOnFish = true;
    this.bulletElectricTarget.fish = fish;

    if(this.focusFishTweenCounter){//reuse tween if tween focus is available
      if(!this.bulletElectricTarget.visible) this.bulletElectricTarget.setVisible(true);
      this.bulletElectricTarget.setTexture('basegun', 'fish'+this.bulletElectricTarget.fish.config.type+'.png');
      this.focusFishTweenCounter.resume();
    }else{
      //create electric focus tween
      this.focusFishTweenCounter = this.scene.tweens.addCounter({
        from: 1, to: 1.1, duration: 200, repeat: -1,
        onRepeat: function(){
          const fish = this.bulletElectricTarget.fish;

          //stop shoot if fish is not visible
          if(fish && (!fish.visible || !fish.active || fish.body.collisionFilter.group === -1 || this.playerCredit < this.bet)){
            this.cancleFocusElectricToFish(); return;
          }
          //If Fish have focus point
          if(fish.focusPoint && Phaser.Geom.Rectangle.ContainsPoint(this.scene.rectangleBounds, {x: fish.focusPoint.x, y: fish.focusPoint.y}) === true){
            this.fireElectric(fish, fish.focusPoint.x, fish.focusPoint.y);
            return;
          }

          let distance = fish.width*0.35;
          //target point is head
          let headPoint = Helpers.findSinglePoint({x: fish.x, y: fish.y}, distance, fish.rotation);
          if(Phaser.Geom.Rectangle.ContainsPoint(this.scene.rectangleBounds, {x: headPoint.x, y: headPoint.y}) === true){
            this.fireElectric(fish, headPoint.x, headPoint.y);
            return;
          }

          //target point is center
          if(Phaser.Geom.Rectangle.ContainsPoint(this.scene.rectangleBounds, {x: fish.x, y: fish.y}) === true){
            this.fireElectric(fish, fish.x, fish.y);
            return;
          }

          //target point is tail
          let tailPoint = Helpers.findSinglePoint({x: fish.x, y: fish.y}, -distance, fish.rotation);
          if(Phaser.Geom.Rectangle.ContainsPoint(this.scene.rectangleBounds, {x: tailPoint.x, y: tailPoint.y}) === true){
            this.fireElectric(fish, tailPoint.x, tailPoint.y);
            return;
          }
          //If Head, Center, Tail out of bound then cancle focus the fish
          this.cancleFocusElectricToFish();
        },
        onUpdate: function(){
          let value = this.focusFishTweenCounter.getValue(); 
          this.bulletElectricTarget.setScale(value);
        },
        onStart: function(){
          if(!this.bulletElectricTarget.visible) this.bulletElectricTarget.setVisible(true);
          this.bulletElectricTarget.setTexture('basegun', 'fish'+this.bulletElectricTarget.fish.config.type+'.png');
        },
        callbackScope: this
      })
    }
  }


  /*
  *
  *
  */
  cancleFocusElectricToFish(){
    if(this.focusFishTweenCounter && this.focusFishTweenCounter.isPlaying()){
      this.focusFishTweenCounter.pause();
      this.bulletElectric.setVisible(false).anims.stop();
      this.bulletElectricExplode.setVisible(false).anims.stop();
      this.bulletElectricTarget.setTexture('basegun',  'fish'+this.bulletElectricTarget.fish.config.type+'_disable.png');
      if(this.position === this.scene.myPosition) this.game.gameAudio.custom['electricFire'].stop();
      this.focusOnFish = false;
    }
  }
  disableCurrentTarget(){
  }
  /*
  *
  *
  * @params: Change<boolean>up level of the gun
  *
  */
  changeGunType(change=true){
    if(this.canChangeGun === true && this.gun.active){
      //Cancle Focus Fish When Change Gun
      if(this.gun.gunType === 3){this.cancleFocusElectricToFish();}

      if(change){
        if(this.gun.gunType === 1){/*Gun 1 to Gun 2*/
          this.gun.gunType = 2;
        }else
        if(this.gun.gunType === 2){/*Gun 2 to Gun 3*/
          this.gun.gunType = 3;
        }else
        if(this.gun.gunType === 3){/*Gun 3 to Gun 1*/
          this.gun.gunType = 1;
        }
      }



      this.canChangeGun = false;
      this.bulletElectricTarget.setVisible(false);
      this.bulletElectric.setVisible(false);
      this.bulletElectricExplode.setVisible(false);
      this.scene.tweens.add({ 
        targets: this.gun, scaleX: "+="+0.15, scaleY: "+="+0.15, ease: 'Bounce', duration: 100, yoyo: true,
        onComplete: function(){
          this.canChangeGun = true;
          if(this.gun.gunType === 2){/*Gun 1 to Gun 2*/
            this.gun.anims.stop();
            this.gun.setTexture('basegun','gun2_1.png').setOrigin(0.5, 0.92);
          }else
          if(this.gun.gunType === 3){/*Gun 2 to Gun 3*/
            this.gun.setRotation(0);
            this.gun.anims.play('gun3_fire');
            this.gun.setTexture('basegun','gun3_1.png').setOrigin(0.5, 0.98);
          }else
          if(this.gun.gunType === 1){/*Gun 3 to Gun 1*/
            this.gun.setTexture('basegun','gun1_12.png').setOrigin(0.5, 0.92);
            this.gun.anims.play('gun1_rotate');
          }
          this.emit('onChangegun', this);

          //Update Cannon number for global config player
          if(this.position === this.scene.myPosition){
            this.game.mainPlayerConfig.cannon = this.gun.gunType;
          }
        },
        callbackScope: this
      },this);
    }

    if(this.position === this.game.myPosition){
      this.game.mainPlayerConfig.cannon = this.gun.gunType;
    }
  }

  /*
  *
  *
  *
  *
  */
  disconnect(){
   	this.connected = false;
   	this.waitText.setVisible(true).setActive(true);
   	this.waitTextTween.restart();
    //this.playerCredit = 0;
    //this.updatePlayerTotalCredit(this.playerCredit);

    //Hide player
    this.gunGroup.setVisible(false).setActive(false);     
  }

  /*
  *
  *
  *
  *
  */
  connect(isMainPlayer, data=null){
    this.gunGroup.setVisible(true).setActive(true);

    this.playerCredit = (data && data.credit ) ? data.credit : 0;

   	this.connected = true;
   	this.waitText.setVisible(false).setActive(false);
   	this.waitTextTween.stop();
   	this.gunGroup.setVisible(true).setActive(true);
    this.isMainPlayer = isMainPlayer ? true : false;
    if(this.isMainPlayer){
      //PLAYER
      this.btnMinus.setActive(true).setVisible(true)
      this.btnPlus.setActive(true).setVisible(true);
      if(data.firstimeConnect){
        this.showFocusArrow();
        this.game.mainPlayerConfig.firstimeConnect = false;
      }
      this.basegun2.setInteractive()
    }else{
      //BOT
      this.btnMinus.setActive(false).setVisible(false)
      this.btnPlus.setActive(false).setVisible(false);
      this.basegun2.disableInteractive();
    }

    //adjust credit box for main player in position 1
    if(this.position === 1 && this.isMainPlayer){
      this.creditPanel.setX(140);
      this.creditText.setX(205);
    }
  }

  /*
  * Arrow Focus To Player
  * 
  *
  *
  *
  */
  showFocusArrow(){
    tweenFocus1 = this.scene.tweens.add({targets: [this.focusGroupProperty.focusShinee, this.focusGroupProperty.focusCirlce], scaleX: '+='+0.1, scaleY: '+='+0.1,  ease: 'Cubic.In',  duration: 500, repeat: -1,  yoyo: true});
    tweenFocus2 = this.scene.tweens.add({targets: this.focusGroupProperty.focusArrow, y: '+='+10,  ease: 'Cubic.In',delay: 500, duration: 500, repeat: -1,  yoyo: true});
    this.focusGroup.setVisible(true).setActive(true);
  }

  /*
  * Lazer Beam Event
  *
  *
  *
  */
  lazerBeamLoad(){
    this.lazerBeam = {};
    /*Setup Lazer Beam*/
    if(this.position === 0 || this.position === 1){
      this.lazerBeam.gun = this.scene.add.sprite(this.x, this.y - 40, 'lazerBeam','beam_gun_1.png');
    }else{
      this.lazerBeam.gun = this.scene.add.sprite(this.x, this.y + 40, 'lazerBeam','beam_gun_1.png').setRotation(180);
    }

    this.lazerBeam.circle = new Phaser.Geom.Circle(this.lazerBeam.gun.x, this.lazerBeam.gun.y, 100);
    let iconY = this.position < 2 ? this.y - 250 : this.y + 250;
    this.lazerBeam.lazerBeamIcon = this.scene.add.sprite(this.x, iconY, 'basegun', 'beam.png').setOrigin(0.5, 0.5).setActive(false).setVisible(false).setAlpha(0).setScale(0.1);
    this.lazerBeam.circle1 = new Phaser.Geom.Circle(this.lazerBeam.gun.x, this.lazerBeam.gun.y, 250);
    let angle = Phaser.Math.Angle.BetweenPoints(this.lazerBeam.gun, new Phaser.Math.Vector2(this.lazerBeam.gun.x, 0));
    this.lazerBeam.newPoin1 = Phaser.Geom.Circle.CircumferencePoint(this.lazerBeam.circle, angle);
    this.lazerBeam.newPoin2 = Phaser.Geom.Circle.CircumferencePoint(this.lazerBeam.circle1, angle-0.8);
    this.lazerBeam.newPoin3 = Phaser.Geom.Circle.CircumferencePoint(this.lazerBeam.circle1, angle+0.8);
    this.lazerBeam.triagle = new Phaser.Geom.Triangle(this.lazerBeam.newPoin1.x, this.lazerBeam.newPoin1.y, this.lazerBeam.newPoin2.x, this.lazerBeam.newPoin2.y, this.lazerBeam.newPoin3.x, this.lazerBeam.newPoin3.y);
    this.lazerBeam.beamArea = this.scene.add.sprite(this.x, this.y , 'lazerBeam','beam_area.png').setAlpha(0.5).setScale(3).setOrigin(0,0.5).setVisible(false).setActive(false);
    this.lazerBeam.bullet = this.scene.add.sprite(this.x, this.y, 'lazerBeam','beam_1.png').setPosition(this.lazerBeam.newPoin1.x, this.lazerBeam.newPoin1.y).setActive(false).setVisible(false).setScale(4,3).setOrigin(0,0.5);
    this.lazerBeam.bullet.on('animationcomplete',function(currentAnim, currentFrame){
      if(currentAnim.key === "beam_fire"){
        //Show Total LazerBeam win after 1 second
        this.lazerBeam.gun.anims.stop().setTexture('lazerBeam','beam_gun_1.png');
        this.lazerBeam.bullet.setActive(false);
        this.showDefaultCannon();// switch to default cannon
        this.scene.time.delayedCall(1500, function(){
          this.game.gameAudio.custom['coinjump3'].play({volume: this.position === this.scene.myPosition ? 1 : 0.3});
          this.game.gameAudio.custom['bonusWin'+Phaser.Math.Between(1, 3)].play({volume: this.position === this.scene.myPosition ? 1 : 0.3});
          
          //total bonus lazerbeam win
          this.scene.creditWinEffect.showBonusLazerBeamWin({
            totalWin: this.lazerBeam.totalWin, 
            position: {x: this.x, y: this.position < 2 ? this.y-100 : this.y+ 100},
            callback: function(){
              this.updatePlayerTotalCredit(this.lazerBeam.totalWin)
            }.bind(this)
          });
          //kill the lazer beam icon
          this.scene.tweens.add({
            targets: this.lazerBeam.lazerBeamIcon, 
            duration: 300, alpha: 0, scale: 0, delay: 1500, 
            onComplete: function(){
              this.lazerBeam.lazerBeamIcon.setActive(false).setVisible(false);
              //Kill Bonus Fish After explode and collect bonus
              this.scene.fishGroup[26].getChildren()[0].setActive(false);
            }, 
            callbackScope: this
          })
        }, [], this);
      }
    },this)

    this.lazerBeam.bullet.on('animationupdate',function(currentAnim, currentFrame, sprite){
      if(currentAnim.key === 'beam_fire' && currentFrame.textureFrame === 'beam_3.png'){
        this.scene.cameras.main.shake(3000, 0.002);
      }
      if(currentAnim.key === 'beam_fire' && currentFrame.textureFrame === 'beam_20.png'){
        //check collide by area
        let distance = 1200;
        this.lazerBeam.totalWin = this.scene.checkCollideByPolygon(this, [
          (distance*Math.cos(this.lazerBeam.bullet.rotation) + this.lazerBeam.triagle.x2), (distance*Math.sin(this.lazerBeam.bullet.rotation) + this.lazerBeam.triagle.y2),
          this.lazerBeam.triagle.x2, this.lazerBeam.triagle.y2,
          this.lazerBeam.triagle.x3, this.lazerBeam.triagle.y3,
          (distance*Math.cos(this.lazerBeam.bullet.rotation) + this.lazerBeam.triagle.x3), (distance*Math.sin(this.lazerBeam.bullet.rotation) + this.lazerBeam.triagle.y3)
        ]);


      }
    },this)
    //Particle
    this.lazerBeam.particles = this.scene.add.particles('lazerBeam');
    this.lazerBeam.emitter = this.lazerBeam.particles.createEmitter({
      frame: 'blue.png',
      moveToX: this.lazerBeam.newPoin1.x,
      moveToY: this.lazerBeam.newPoin1.y,
      scale: { start: 0.2, end: 0 },
      angle: { start: 0, end: 360 },
      lifespan: 300,
      // blendMode: 'ADD',//this property will make a different draw
      emitZone: { source: this.lazerBeam.triagle },
      on: false
    });
    this.lazerBeam.particles.setActive(false).setVisible(false);
    this.lazerBeam.gun.setVisible(false).setActive(false);
  }

  /*
  *
  * description: Switch to default cannon after fire Beam or Drill or FireStorm
  * 
  */
  showDefaultCannon(){
    this.game.gameAudio.custom['gunChange'].play({volume: this.position === this.scene.myPosition ? 1 : 0.3});

    //Show Electric target if gun type electric
    if(this.gun.gunType === 3) 
      this.scene.tweens.add({targets: this.bulletElectricTarget, scaleX: 1, scaleY: 1, duration: 150, delay: 150, onComplete: function(tween, targets){targets[0].setActive(true).setVisible(true);}});

    //Show Gun
    this.scene.tweens.add({targets: this.gun, scaleX: 1, scaleY: 1, duration: 150, delay: 150, 
      onStart: function(tween, targets){
        targets[0].setVisible(true);
      },
      onComplete: function(tween, targets){
        targets[0].setActive(true);  
      }
    });

    //Hide Lazer Beam
    if(this.lazerBeam.isShowLazerBeam){
      this.lazerBeam.isShowLazerBeam = false;
      this.scene.tweens.add({
        targets: this.lazerBeam.gun, 
        scaleX: 0, scaleY: 0, duration: 150, delay: 150,
        onComplete: function(){
          this.lazerBeam.particles.setActive(false).setVisible(false);
          this.lazerBeam.beamArea.setVisible(false).setActive(false)
        },
        callbackScope: this
      });
    }

    //Hide Drill
    if(this.drillGun.isShowDrill){
      this.drillGun.isShowDrill = false;
      this.scene.tweens.add({
        targets: this.drillGun.gun, 
        scaleX: 0, scaleY: 0, duration: 150, delay: 150,
        onComplete: function(tween, targets){
          targets[0].setVisible(false).setActive(false);
        }
      });
    }
  }

  /*
  *
  *
  *
  *
  */
  lazerBeamShow(pointer=null){
    if(!this.lazerBeam.isShowLazerBeam){//show the lazer beam if the lazer beam not show yet
      this.lazerBeam.isShowLazerBeam = true;
      
      this.lazerBeam.gun.setOrigin(0.5, 0.80);
      this.lazerBeam.gun.setVisible(true).setActive(true).setScale(0);
      this.position > 1 ? this.lazerBeam.gun.setAngle(180) : this.lazerBeam.gun.setAngle(0);
      this.lazerBeam.gun.setScale(0).setTexture('lazerBeam','beam_gun_1.png')
      //Fade Out Gun
      this.scene.tweens.add({targets: this.gun, scaleX: 0, scaleY: 0, duration: 150, delay: 150, 
        onComplete: function(tween, targets){
          targets[0].setVisible(false).setActive(false);
          //Stop focus fish using electric gun
          this.bulletElectricTarget.setVisible(false).setActive(false);
          //Stop focus fish using electric gun
          if(this.gun.gunType === 3) this.cancleFocusElectricToFish();
        },
        callbackScope: this
      })

      this.lazerBeam.lazerBeamIcon.setActive(true).setVisible(true).setAlpha(0).setScale(0.1);
      this.scene.tweens.add({targets: this.lazerBeam.lazerBeamIcon, duration: 300, alpha: 1, scale: 1})
      //Fade In Lazer Beam
      this.scene.tweens.add({
        targets: this.lazerBeam.gun, 
        scaleX: 1, scaleY: 1, duration: 150, delay: 150,
        onComplete: function(){
          this.lazerBeam.lazerBeamIsReady = true;//ready to fire

          this.lazerBeam.gun.anims.play('beam_gun');
          this.lazerBeam.particles.setActive(true).setVisible(true);
          this.lazerBeam.emitter.start();
          this.lazerBeam.beamArea.setVisible(true).setActive(true)
          this.game.gameAudio.custom['lazeBeamPrepare'].play({loop: true, volume: this.position === this.scene.myPosition ? 1 : 0.3})
          this.lazerBeamFocus(pointer);
        },
        callbackScope: this
      })
    }
  }

  /*
  *
  *
  *
  *
  */
  lazerBeamFire(){
    if(this.lazerBeam.lazerBeamIsReady === true){
      this.lazerBeam.lazerBeamIsReady = false;// disable satus lazerbeam after fire
      if(!this.lazerBeam.bullet.visible && (this.lazerBeam.gun.anims.currentAnim && this.lazerBeam.gun.anims.currentAnim.key === "beam_gun")){
        this.lazerBeam.gun.anims.play('beam_gun_fire').anims.chain('beam_gun');
        this.lazerBeam.beamArea.setActive(false).setVisible(false);
        this.lazerBeam.particles.setActive(false).setVisible(false);
        this.lazerBeam.emitter.stop();
        this.game.gameAudio.custom['lazerBeamFire'].play({volume: this.position === this.scene.myPosition ? 1 : 0.3})
        this.game.gameAudio.custom['lazeBeamPrepare'].stop();

        this.scene.time.delayedCall(700, function(){
          this.lazerBeam.bullet.setActive(true).setPosition(this.lazerBeam.newPoin1.x, this.lazerBeam.newPoin1.y).setRotation(this.lazerBeam.gun.rotation-1.6).play('beam_fire');
        }, [], this);
      }
    }
  }

  /*
  * Descriptiion: Focus to a pointer if the lazer beam is showing and not fire yet
  * @params: pointer<Vector2>
  */
  lazerBeamFocus(pointer){
    if(this.lazerBeam.lazerBeamIsReady){
      let angle = pointer ? Phaser.Math.Angle.BetweenPoints(this.lazerBeam.gun, pointer) : Phaser.Math.Angle.BetweenPoints(this.lazerBeam.gun, {x: this.x, y: Config.gameCenterY});
      this.lazerBeam.newPoin1 = Phaser.Geom.Circle.CircumferencePoint(this.lazerBeam.circle, angle);
      this.lazerBeam.newPoin2 = Phaser.Geom.Circle.CircumferencePoint(this.lazerBeam.circle1, angle-0.8);
      this.lazerBeam.newPoin3 = Phaser.Geom.Circle.CircumferencePoint(this.lazerBeam.circle1, angle+0.8);
      
      this.lazerBeam.triagle.x1 = this.lazerBeam.newPoin1.x;
      this.lazerBeam.triagle.y1 = this.lazerBeam.newPoin1.y;
      this.lazerBeam.triagle.x2 = this.lazerBeam.newPoin2.x;
      this.lazerBeam.triagle.y2 = this.lazerBeam.newPoin2.y;
      this.lazerBeam.triagle.x3 = this.lazerBeam.newPoin3.x;
      this.lazerBeam.triagle.y3 = this.lazerBeam.newPoin3.y;

      this.lazerBeam.emitter.killAll();
      this.lazerBeam.emitter.moveToX.propertyValue = this.lazerBeam.newPoin1.x;
      this.lazerBeam.emitter.moveToY.propertyValue = this.lazerBeam.newPoin1.y;
      this.lazerBeam.gun.setRotation(angle+1.6)

      /*Beam AreA*/
      if(this.lazerBeam.beamArea){
          this.lazerBeam.beamArea.setVisible(true).setActive(true)
          this.lazerBeam.beamArea.setPosition(this.lazerBeam.newPoin1.x, this.lazerBeam.newPoin1.y).setRotation(angle)
      }
    }
  }


  /*
  * Description: Setup position for drill gun and bullet
  *
  */
  drillGunLoad(){
    this.drillGun = {};
    this.drillGun.gun = this.scene.add.sprite(this.x, this.y - 40, 'drillBullet','drill_base_1.png');
    let iconY = this.position < 2 ? this.y - 250 : this.y + 180;
    this.drillGun.drillIcon = this.scene.add.sprite(this.x, iconY, 'basegun', 'drill.png').setOrigin(0.5, 0.5).setActive(false).setVisible(false).setAlpha(0).setScale(0.1);
    this.drillGun.totalBonusWin = 0;
    if(this.position === 2 || this.position === 3){
      this.drillGun.gun.setPosition(this.x, this.y + 40).setRotation(180);
    }
    this.drillGun.bullet = this.scene.matter.add.sprite(-500,-500, 'drillBullet','drill1.png');
    this.drillGun.bullet.hitBody = 0;
    this.drillGun.bullet.name = 'drill_bullet'
    this.drillGun.bullet.objectType = "bullet";
    this.drillGun.bullet.playerPosition = this.position;
    this.drillGun.bullet.setBounce(1).setFriction(0,0,0).setAngularVelocity(0).setFixedRotation(0).setIgnoreGravity(true).setCollisionGroup(-1).setActive(false).setVisible(false);

    this.drillGun.bullet.particles = this.scene.add.particles('drillBullet');
    this.drillGun.bullet.emitter = this.drillGun.bullet.particles.createEmitter({
        frame: 'disp_1.png',
        lifespan: 1000,
        alpha: { start: 0.7, end: 0.4 },
        scale: { start: 2, end: 1.5 },
        particleClass: DrillBulletFollower,
        deathCallback: function(sprite){
          sprite.t = 0;//reset time delta on this sprite
          sprite.i = 0;//reset frame
        }
    });
    this.drillGun.bullet.emitter.startFollow(this.drillGun.bullet);
    this.drillGun.bullet.particles.setVisible(false).setActive(false);

    this.drillGun.bullet.on('animationcomplete', function(currentAnim, currentFrame){
      if(currentAnim.key === "bombExplode"){
        this.drillGun.bullet.setVisible(false).setActive(false);
        this.showDefaultCannon();//switch to default cannon
        this.scene.time.delayedCall(1500, function(){          
          this.game.gameAudio.custom['bonusWin'+Phaser.Math.Between(1, 3)].play({volume: this.position === this.scene.myPosition ? 1 : 0.3});
          this.game.gameAudio.custom['coinjump3'].play({volume: this.position === this.scene.myPosition ? 1 : 0.3});
          this.scene.creditWinEffect.showBonusDrillWin({
            totalWin: this.drillGun.bullet.totalWin, 
            position: {x: this.x, y: this.position < 2 ? this.y-100 : this.y+ 100},
            callback: function(){
              this.updatePlayerTotalCredit(this.drillGun.bullet.totalWin)
            }.bind(this)
          });//Show Total Drill win
        }, [], this);
        // after show total win => hide the drill icon
        this.scene.tweens.add({
          targets: this.drillGun.drillIcon, 
          duration: 300, alpha: 0, scale: 0, delay: 1500, 
          onComplete: function(){
            this.drillGun.drillIcon.setActive(false).setVisible(false);
            this.drillGun.drillIsReady = false;//enable
          }, 
          callbackScope: this
        })
      }
    },this)


    let self = this;
    this.drillGun.bullet.addListener('bodyhit',function(){
      //Colide body
      this.hitBody = this.hitBody+1;
      if(this.hitBody < 20){
        self.game.gameAudio.custom['drillHitBound'].play({volume: this.position === this.scene.myPosition ? 1 : 0.3});
        this.scene.cameras.main.shake(300, 0.002);
        this.setRotation(Math.atan2(this.body.velocity.y, this.body.velocity.x));
      }
      //Explode if the drill bullet hit the body 20 times
      if(this.hitBody === 20){
        this.emitter.on = false;
        this.setFriction(0.01,0.01,0.01).setAngularVelocity(0.1).setFixedRotation(1).setBounce(0.2).setCollisionGroup(-1);
        this.fireDrill = false;

        /*Stop Drill And Explode*/
        this.anims.play('drill_bullet_explode_prepare');
        self.game.gameAudio.custom['drillUncon'].play({volume: self.position === self.scene.myPosition ? 1 : 0.3});
        this.scene.time.delayedCall(2500, function(){
          self.game.gameAudio.custom['drillUncon'].stop();
          self.game.gameAudio.custom['bombExplode'].play({volume: self.position === self.scene.myPosition ? 1 : 0.3});
          this.setFriction(0, 0, 0).setVelocity(0, 0).setAngularVelocity(0);
          this.particles.setActive(false).setVisible(false);
          this.body.isStatic = true;
          this.anims.play('bombExplode').setScale(4);
          this.scene.cameras.main.shake(1000, 0.002);
          this.totalWin =  this.totalWin + this.scene.checkCollideByRadius(self, {x: this.x, y: this.y}, this.width);
          this.scene.fishGroup[27].getChildren()[0].setActive(false);//Kill Bonus Fish After explode and collect bonus
        }, [], this)
      }
    });
    this.drillGun.gun.setVisible(false).setActive(false);
  }

  /*
  *
  *
  *
  *
  */
  drillShow(){
    if(!this.drillGun.isShowDrill){// show drillif drill not show
      this.drillGun.isShowDrill = true;
      this.drillGun.drillIsReady = false;//show drill but wait for tween switch gun

      
      this.drillGun.bullet.setActive(false).setActive(false);
      this.drillGun.gun.setActive(true).setVisible(true).setOrigin(0.5, 0.87).setScale(0).setTexture('drillBullet','drill_base_1.png')

      //Fade Out current Gun
      this.scene.tweens.add({targets: this.gun, scaleX: 0, scaleY: 0, duration: 150, delay: 150, 
        onComplete: function(tweem, targets){
          targets[0].setVisible(false).setActive(false);
          //hide the electric target
          this.bulletElectricTarget.setVisible(false).setActive(false);
          //Stop focus fish using electric gun
          if(this.gun.gunType === 3) this.cancleFocusElectricToFish();
        },
        callbackScope: this
      });

      //update angle 
      this.position > 1 ? this.drillGun.gun.setAngle(180) : this.drillGun.gun.setAngle(0);

      //Fade In Drill Gun
      this.scene.tweens.add({
        targets: this.drillGun.gun, 
        scaleX: 1, scaleY: 1, duration: 150, delay: 150,
        onComplete: function(){
          this.drillGun.drillIsReady = true;//drill ready to fire
          this.drillGun.gun.anims.play('drill_gun');
          this.game.gameAudio.custom['drillReady'].play({loop: true, delay: 0.1, volume: this.position === this.scene.myPosition ? 1 : 0.3});
          this.drillGun.drillIcon.setActive(true).setVisible(true).setAlpha(0).setScale(0.1);
          this.scene.tweens.add({targets: this.drillGun.drillIcon, duration: 300, alpha: 1, scale: 1})
        },
        callbackScope: this
      })
    }
  }

  /*
  *
  *
  *
  *
  */
  drillFocus(pointer){
    let angle = pointer ? Phaser.Math.Angle.BetweenPoints(this.drillGun.gun, pointer) : Phaser.Math.Angle.BetweenPoints(this.drillGun.gun, {x: this.x, y: Config.gameCenterY});
    this.drillGun.gun.setRotation(angle+1.6)
  }

  /*
  *
  *
  *
  *
  */
  drillFire(data){
    if(this.drillGun.drillIsReady){//ready to fire
      this.drillGun.totalBonusWin = 0; //reset total bonus win
      let target = data.target;
      let object = data.object;
      let callback = data.callback;
      if(!this.gun.circleRadius.contains(target.x, target.y) && this.scene.time.now > this.nextFire){
        this.drillGun.drillIsReady = false;
        this.game.gameAudio.custom['drillReady'].stop();
        this.game.gameAudio.custom['drillShoot'].play({volume: this.position === this.scene.myPosition ? 1 : 0.3});
        this.game.gameAudio.custom['drillReady'].stop();
        this.drillGun.gun.setVisible(false);
        this.drillGun.bullet.setActive(true).setVisible(true).setTexture('drillBullet','drill1.png').setScale(1);
        this.drillGun.bullet.emitter.on = true;

        this.nextFire = this.scene.time.now + this.fireRate;
        var angle = Phaser.Math.Angle.BetweenPoints(this.gunGroup, target);
        if(this.position === 0 || this.position === 1){//player1 & player2
          this.drillGun.gun.setRotation(angle+1.6);
        }else{//player3 & player4
          this.drillGun.gun.setRotation(angle-1.6);
        }
        //GUN SINGLE BULLET
        this.drillGun.bullet.anims.play('drill_bullet_fire');
        var newPoin1 = Phaser.Geom.Circle.CircumferencePoint(this.gun.circleRadius, angle);

        let force = 1.4;
        if(this.game.loop.actualFps﻿ < 45){
          force = 1.8;
        }
        this.drillGun.bullet.totalWin = 0;
        this.drillGun.bullet.hitBody = 0;//reset body hit counter
        this.drillGun.bullet.setFixedRotation(0) //dont allow rotate when collide
                            .setBounce(1)//collide with body
                            .setFriction(0, 0, 0)
                            .setVelocity(0, 0)
                            .setStatic(false).setActive(true).setVisible(true)
                            .setPosition(newPoin1.x, newPoin1.y) //
                            .setRotation(angle)// angle follow cannon angle
                            .thrust(force)//this value affected by FPS
        this.drillGun.bullet.particles.setActive(true).setVisible(true);
        /*Socket Send*/
        this.drillGun.bullet.fireDrill = true;
        if(callback) callback();
      }
    }
  }

  /*
  * Attact this player
  * - shake this player
  * - show some bolts animation
  */
  attactPlayer(){

  }

  /*
  * Player Cant shoot 
  * Eg: Boss attact this player then block 3 second
  */
  blockPlayer(duration=1000){
    if(!duration || duration < 0 || !this.canFire) return;
    this.canFire = false;
    this.scene.time.delayedCall(duration, function(){
      this.canFire = true;

    }, [],this);
  }
}