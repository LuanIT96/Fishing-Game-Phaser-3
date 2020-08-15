import Helpers from '../../helpers';
import Config from '../../config';

/*Class*/
import Player from '../Player';
import Fish0 from '../Fish/Fish0';
import Fish1 from '../Fish/Fish1';
import Fish2 from '../Fish/Fish2';
import Fish3 from '../Fish/Fish3';
import Fish4 from '../Fish/Fish4';
import Fish5 from '../Fish/Fish5';
import Fish6 from '../Fish/Fish6';
import Fish7 from '../Fish/Fish7';
import Fish8 from '../Fish/Fish8';
import Fish9 from '../Fish/Fish9';
import Fish10 from '../Fish/Fish10';
import Fish11 from '../Fish/Fish11';
import Fish12 from '../Fish/Fish12';
import Fish13 from '../Fish/Fish13';
import Fish14 from '../Fish/Fish14';
import Fish15 from '../Fish/Fish15';
import Fish16 from '../Fish/Fish16';
import Fish17 from '../Fish/Fish17';
import Fish18 from '../Fish/Fish18';
import Fish19 from '../Fish/Fish19';
import Fish20 from '../Fish/Fish20';
import Fish21 from '../Fish/Fish21';
import Fish22 from '../Fish/Fish22';
import Fish23 from '../Fish/Fish23';
import Fish24 from '../Fish/Fish24';
import Fish25 from '../Fish/Fish25';
import Fish26 from '../Fish/Fish26';
import Fish27 from '../Fish/Fish27';
import Fish28 from '../Fish/Fish28';
import Fish30 from '../Fish/Fish30';//Blue dragon
import Fish31 from '../Fish/Fish31';//Red dragon
import Fish32 from '../Fish/Fish32';//Dragon Turtle

import CreditWinEffect from '../CreditWinEffect';

/*
* 
* Scene Life: 10 min
*  - random small fish
*  - random in 3 special fish(beam, drill, boom)
*  - random in big fish(13-21)
*  - random in whale fish(22-23 time random longer than big fish)
* first 5 min: dragon blue, dragon red, dragon turtle
* => show boss warning and fade out all current fish
* last 5 min: show the boss of that scene(crab, octopus, crocodile, lanternFish)
* => show Transition to cover current scene then switch to new scene(random exclude current scene)
*
*/

export default class BaseScene extends Phaser.Scene {
  constructor(SceneName='BaseScene') {
    super({key: SceneName, pixelArt: true, physics: {default: 'matter', matter: {debug: false, gravity: {x: 0, y: 0}}}});
  }
  create() {
    //Default Background Music
    this.input.setTopOnly(true);
    this.bgAudio = this.game.gameAudio.custom['bg'+Phaser.Math.Between(1, 3)];
    this.bossBackgroundMusic = this.game.gameAudio.custom['bgBoss'+Phaser.Math.Between(1, 2)];

    this.shapes = this.cache.json.get('fish');
    this.rectangleBounds = Phaser.Geom.Rectangle.Clone(this.cameras.main);

    //Set Bound For Matter Js
    this.matter.world.setBounds(-30, -30, Config.gameWidth+30, Config.gameHeight+30, 1, true, true, true, true).disableGravity();

    //Physic Group
    this.physicBulletGroup = this.matter.world.nextGroup(true);
    this.physicFishGroup = this.matter.world.nextGroup(true);

    this.renderGameScene();//Need overwrite on game scene
    this.importFish();
    this.renderMenu();
    this.renderPlayers();
    this.afterRenderPlayers();

    //win effect
    this.creditWinEffect = new CreditWinEffect(this);

    //Physic check
    this.matter.world.on('collisionstart', function (event, bodyA, bodyB) {
      /*Make sure check for all pairs*/
      const length = event.pairs.length;
      for(let index = 0; index < length;index++){
        /*
        * bodyA : sprite need render before bodyB
        * in this case must render fish before render bullet: Fish become bodyA, Bullet become bodyB
        */
        if(event.pairs[index].bodyA.gameObject){
          event.pairs[index].bodyB.gameObject.emit('explode');  
          let fish = event.pairs[index].bodyA.gameObject;
          let playerFired = this.players[event.pairs[index].bodyB.gameObject.playerPosition];

          //no damage special fish with special bullet
          if(event.pairs[index].bodyB.gameObject.name === 'drill_bullet' && event.pairs[index].bodyB.gameObject.fireDrill === false){return;}
          if(fish.config && fish.config.type > 23 && event.pairs[index].bodyB.gameObject.name === 'drill_bullet'){return;}

          let health = fish.damageFish(Phaser.Math.RND.between(100, 300));//effect tint color when bullet hit fish
          if(health > 0){
            fish.hitFish();
          }else{
            let params = {x: playerFired.x, y: playerFired.y, player: playerFired, coinType: playerFired.position === this.myPosition ? 'gold' : 'silver', textType: playerFired.position === this.myPosition ? 'gold' : 'silver'}
             //drill bullet
            if(event.pairs[index].bodyB.gameObject.name === 'drill_bullet'){
              params.textType = 'pink';
              let odds = fish.config.odds;
              if(fish.config.odds.min){odds = Phaser.Math.Between(fish.config.odds.min, fish.config.odds.max);}
              params.totalWin = playerFired.bet*odds;//overwirte in case the fish odds have min and max
              params.noUpdateCredit = true;
              event.pairs[index].bodyB.gameObject.totalWin =  event.pairs[index].bodyB.gameObject.totalWin+params.totalWin;
            }
            fish.killFish(params);
          }
        }
      }
    },this);

    /*Bullet Hit The Wall*/
    this.matter.world.on('collisionend', function(event, bodyA, bodyB){
      const length = event.pairs.length;
      for(let index=0; index < length;index++){
        if(!event.pairs[index].bodyA.gameObject){
          event.pairs[index].bodyB.gameObject.emit('bodyhit');
        }      
      }
    },this)

    //Main Player fire 
    this.input.on('pointerdown', function (pointer, target) {
      if(this.myPlayer && (target.length === 0 || target[0].constructor.name !== 'Sprite')){
        if(this.myPlayer.focusGroup && this.myPlayer.focusGroup.active){this.myPlayer.focusGroup.removeFocus();}

        /*Lazer Beam Focus and Fire*/
        if(this.myPlayer.lazerBeam.isShowLazerBeam === true){//if lazerbeam is active
          if(this.myPlayer.lazerBeam.lazerBeamIsReady === true){ // if not fire beam yet
            this.myPlayer.lazerBeamFocus(pointer);  
            this.myPlayer.lazerBeamFire();  
          }
          return;
        }

        /*Drill Focus And Fire*/
        if(this.myPlayer.drillGun.isShowDrill===true){//if the drill gun is active
          if(this.myPlayer.drillGun.drillIsReady===true){//if not fire yet
            this.myPlayer.drillFocus(pointer);
            this.myPlayer.drillFire({target: pointer});
          }
          return;
        }

        if(this.myPlayer.gun.active && this.myPlayer.gun.gunType === 1 || this.myPlayer.gun.gunType === 2){
          this.myPlayer.fire({
            target: pointer,
            object: null,
            callback: function callback(){
              if(this.game.socket) this.game.socket.send(JSON.stringify({roomID: this.game.roomID, fire: true, pos: {x: pointer.x, y: pointer.y}, playerPosition: this.myPosition}));
            }.bind(this)
          });
          return;
        }

        //Stop electric when click/touch on screen
        if(this.myPlayer.gun.gunType === 3  && this.myPlayer.focusOnFish === true && target.length === 0){
          this.myPlayer.cancleFocusElectricToFish();
        }  
      }
    }, this);
    //render paytable 
    this.renderPaytable();

    //render scene cover
    this.sceneCover = this.add.tileSprite(Config.gameCenterX, Config.gameCenterY, Config.gameWidth, Config.gameHeight, 'sceneCover').setDisplaySize(Config.gameWidth, Config.gameHeight).setActive(false).setVisible(false).setDepth(100);
    this.sceneCover.setInteractive();//block event pointer for all object below
    this.logo = this.add.sprite(Config.gameCenterX, Config.gameCenterY, 'logo').setActive(false).setVisible(false).setDepth(100);
    this.renderTransitionScene();//prepare transition cene 
    this.startGame();

    this.events.on('transitioncomplete', function(scene){
      this.creditWinEffect.clearAllEffect();
      this.startGame();
    },this);


  }

  /*
  *
  *
  */
  startGame(){
    //check audio status when start or resume scene
    this.game.sound.mute ? this.menuContainer.getAt(1).setTexture('basegun','audio-off-default.png') : this.menuContainer.getAt(1).setTexture('basegun','audio-on-default.png');


    this.setPlayers()
    //Update BOT Config
    this.plugins.get('AutoBot0').updatePlayerConfig();
    this.plugins.get('AutoBot1').updatePlayerConfig();
    this.plugins.get('AutoBot2').updatePlayerConfig();

    //update player config for this cene
    this.myPlayer.gun.gunType = this.game.mainPlayerConfig.cannon;
    this.myPlayer.updatePlayerTotalCredit(this.game.mainPlayerConfig.credit, true);
    this.myPlayer.changeGunType(false);

    
    this.bgAudio.play({loop: true, volume: 0.6});//play default background
    this.canRenderFish = true; //Allow generate fish
    this.timelineProgress = Config.sceneTimeLine;//reset timeline
    this.sceneMode = 0;//normal mode

    this.sceneTimeLine();
    this.plugins.get('FishRoomPlugin').setScene(this);
    this.tweens.add({
      targets: [this.sceneCover, this.logo], alpha: 0, duration: 500,
      onComplete: function(){
        //Transitibn In Complete
        this.sceneCover.setActive(false).setVisible(false);
        this.logo.setActive(false).setVisible(false);

      },
      onStart: function(){
        //Transition In Start 
        this.sceneCover.setVisible(true).setActive(true).setAlpha(1);
        this.logo.setVisible(true).setActive(true).setAlpha(1);
      },
      callbackScope: this
    })
  }

  /*
  * Overwrite this function to render each scene
  *
  */
  renderGameScene(){}


  sceneTransitionOut(){}

  /*
  *
  * Render 4 Player on Scene
  *
  */
  renderPlayers(){
    //Calculate position by % of device width
    let firstPlayerPosition = this.game.config.width*0.22;
    let secondPlayerPosition = this.game.config.width*0.78;
    if(!Config.isAspectRatio169 && !Config.scaleMode  === Phaser.Scale.WIDTH_CONTROLS_HEIGHT){
      firstPlayerPosition = Config.gameWidth*0.32;
      secondPlayerPosition = Config.gameWidth*0.68;
    }
    let self = this;
    this.players = [];
    let player1 = new Player(this, firstPlayerPosition, Config.gameHeight, {
      position: 0,
      connected: false,
      onChangegun: function(scene){
        if(self.myPosition === this.position){
          if(self.game.socket) self.game.socket.send(JSON.stringify({roomID: self.game.roomID, bet: true, minus: true, position: self.myPosition}));
          if(this.gun.gunType === 3){
            //enable pointer on fish when change to electric gun
            self.enablePointerEventOnFish();
          }else{
            self.disablePointerEventOnFish();
          }
        }
      }
    });
    let player2 = new Player(self, secondPlayerPosition, Config.gameHeight, {
      position: 1,
      connected: false,
      onChangegun: function(){
        if(self.myPosition === this.position){
          if(self.game.socket) self.game.socket.send(JSON.stringify({roomID: self.game.roomID, bet: true, minus: true, position: self.myPosition}));
          if(this.gun.gunType === 3){
            //enable pointer on fish when change to electric gun
            self.enablePointerEventOnFish();
          }else{
            self.disablePointerEventOnFish();
          }
        }
      }
    });
    let player3 = new Player(self, secondPlayerPosition, 0, {
      position: 2,
      connected: false,
      onChangegun: function(){
        if(self.myPosition === this.position){
          if(self.game.socket) self.game.socket.send(JSON.stringify({roomID: self.game.roomID, bet: true, minus: true, position: self.myPosition}));
          if(this.gun.gunType === 3){
            //enable pointer on fish when change to electric gun
            self.enablePointerEventOnFish();
          }else{
            self.disablePointerEventOnFish();
          }
        }
      }
    });
    let player4 = new Player(self, firstPlayerPosition, 0, {
      position: 3,
      connected: false,
      onChangegun: function(){
        if(self.myPosition === this.position){
          if(self.game.socket) self.game.socket.send(JSON.stringify({roomID: self.game.roomID, bet: true, minus: true, position: self.myPosition}));
          if(this.gun.gunType === 3){
            //enable pointer on fish when change to electric gun
            self.enablePointerEventOnFish();
          }else{
            self.disablePointerEventOnFish();
          }
        }
      }
    });

    this.add.existing(player1);
    this.add.existing(player2);
    this.add.existing(player3);
    this.add.existing(player4);

    //RENDER GUN
    player1.renderBaseGun();
    player2.renderBaseGun();
    player3.renderBaseGun();
    player4.renderBaseGun();
    
    player1.renderGun();
    player2.renderGun();
    player3.renderGun();
    player4.renderGun();

    /*Prepare position beam*/
    player1.lazerBeamLoad();
    player2.lazerBeamLoad();
    player3.lazerBeamLoad();
    player4.lazerBeamLoad();
    player1.drillGunLoad();
    player2.drillGunLoad();
    player3.drillGunLoad();
    player4.drillGunLoad();

    //
    this.players[0] = player1;
    this.players[1] = player2;
    this.players[2] = player3;
    this.players[3] = player4;
  }

  /*
  *
  *
  */
  afterRenderPlayers(){
    if(!this.myPlayer){
      this.myPosition = this.game.mainPlayerConfig.position;
      this.myPlayer = this.players[this.game.mainPlayerConfig.position];
      this.myPlayer.connect(true, this.game.mainPlayerConfig);
    }
    //update player bet
    this.myPlayer.updateBet(this.game.betConfig[this.game.mainPlayerConfig.betIndex]);
  }

  /*
  *
  *
  */
  renderMenu(){
    this.menuContainer = this.add.container();
    let btnHome = this.add.sprite(Config.gameWidth - 35, Config.gameCenterY + 4, 'basegun','btn-menu-default.png').setInteractive();
    btnHome.on('pointerdown',function(){
      if(this.frame.name === 'btn-menu-default.png') this.setTexture('basegun','btn-menu-active.png');
      if(this.frame.name === 'btn-menu-close-default.png') this.setTexture('basegun','btn-menu-close-active.png');
    });
    btnHome.on('pointerout',function(){
      if(this.isOpen === true){
        this.setTexture('basegun','btn-menu-close-default.png')
      }else{
        this.setTexture('basegun','btn-menu-default.png')
      }
    });
    btnHome.on('pointerup',function(){
      if(!btnHome.isOpen){
        btnHome.setTexture('basegun','btn-menu-close-default.png')
        btnHome.isOpen = true;
        this.menuContainer.setActive(true).setVisible(true)
      }else{
        btnHome.setTexture('basegun','btn-menu-default.png')
        btnHome.isOpen = false;
        this.menuContainer.setActive(false).setVisible(false)
      }
      this.game.gameAudio.custom['btnMenu'].play();
    }, this);

    this.menuContainer.add([
      this.add.sprite(Config.gameWidth - 65, Config.gameCenterY, 'basegun','menu-bg.png'),
      this.add.sprite(Config.gameWidth - 65, Config.gameCenterY - 85, 'basegun','audio-on-default.png').setInteractive().setScale(0.9),
      this.add.sprite(Config.gameWidth - 130, Config.gameCenterY, 'basegun','home-default.png').setInteractive().setScale(0.9),
      this.add.sprite(Config.gameWidth - 65, Config.gameCenterY + 85, 'basegun','infor-default.png').setInteractive().setScale(0.9),
    ]).setActive(false).setVisible(false)
    // btn audio
    this.menuContainer.getAt(1).on('pointerdown',function(pointer, localX, localY, event){
      this.scene.game.gameAudio.custom['btnMute'].play();
      if(this.frame.name === 'audio-on-default.png') this.setTexture('basegun','audio-on-active.png')
      if(this.frame.name === 'audio-off-default.png') this.setTexture('basegun','audio-off-active.png')
    });
    this.menuContainer.getAt(1).on('pointerup',function(pointer, localX, localY, event){
      this.setTexture('basegun','audio-on-default.png')
      this.scene.game.sound.mute = !this.scene.game.sound.mute
      if(!this.scene.game.sound.mute) this.setTexture('basegun','audio-off-default.png')
      if(this.scene.game.sound.mute) this.setTexture('basegun','audio-on-default.png')
    });
    this.menuContainer.getAt(1).on('pointerout',function(pointer, localX, localY, event){
      if(this.frame.name === 'audio-on-active.png') this.setTexture('basegun','audio-on-default.png')
      if(this.frame.name === 'audio-off-active.png') this.setTexture('basegun','audio-off-default.png')
    });
    
    // btn home
    this.menuContainer.getAt(2).on('pointerdown',function(pointer, localX, localY, event){this.scene.game.gameAudio.custom['btnHome'].play();this.setTexture('basegun','home-active.png')});
    this.menuContainer.getAt(2).on('pointerout',function(pointer, localX, localY, event){this.setTexture('basegun','home-default.png')});
    this.menuContainer.getAt(2).on('pointerup',function(pointer, localX, localY, event){
      this.setTexture('basegun','home-default.png')
      //add action redirect to index here
    });
    
    // btn infor
    this.menuContainer.getAt(3).on('pointerdown',function(pointer, localX, localY, event){this.scene.game.gameAudio.custom['btnInfo'].play();this.setTexture('basegun','infor-active.png')});
    this.menuContainer.getAt(3).on('pointerup',function(pointer, localX, localY, event){
      this.menuContainer.getAt(3).setTexture('basegun','infor-default.png')
      if(this.paytableContainer.active){
        this.paytableContainer.setActive(false).setVisible(false)
      }else{
        this.paytableContainer.setActive(true).setVisible(true)
      }
    }, this);
    this.menuContainer.getAt(3).on('pointerout',function(pointer, localX, localY, event){this.setTexture('basegun','infor-default.png')});
  }

  renderPaytable(){
    this.paytableContainer = this.add.container();
    this.paytableContainer.setDepth(99);
    this.paytableContainer.add([
      this.add.sprite(Config.gameCenterX, Config.gameCenterY, 'paytable','overlay.png').setDisplaySize(Config.gameWidth, Config.gameHeight).setAlpha(0.5).setInteractive(),
      this.add.sprite(Config.gameCenterX, Config.gameCenterY, 'paytable','1.png').setInteractive(),
      this.add.sprite(1115, 115, 'paytable','x-default.png').setInteractive(),
      this.add.sprite(Config.gameCenterX - 70, 627, 'paytable','btn-active.png').setInteractive(),
      this.add.sprite(Config.gameCenterX, 627, 'paytable','btn-default.png').setInteractive(),
      this.add.sprite(Config.gameCenterX + 70, 627, 'paytable','btn-default.png').setInteractive(),
      this.add.sprite(Config.gameCenterX - 72, 625, 'paytable','number-1.png'),
      this.add.sprite(Config.gameCenterX, 625, 'paytable','number-2.png'),
      this.add.sprite(Config.gameCenterX + 70, 625, 'paytable','number-3.png'),
    ]).setActive(false).setVisible(false);
    this.paytableContainer.getAt(2).on('pointerdown',function(){this.setTexture('paytable', 'x-active.png')})
    this.paytableContainer.getAt(2).on('pointerout',function(){this.setTexture('paytable', 'x-default.png')})
    this.paytableContainer.getAt(2).on('pointerup',function(){
      this.paytableContainer.getAt(2).setTexture('paytable', 'x-default.png');
      this.paytableContainer.setActive(false).setVisible(false)
    },this)
    this.paytableContainer.getAt(3).on('pointerdown',function(){
      this.paytableContainer.getAt(3).setTexture('paytable', 'btn-active.png');
      this.paytableContainer.getAt(4).setTexture('paytable', 'btn-default.png');
      this.paytableContainer.getAt(5).setTexture('paytable', 'btn-default.png');
      this.paytableContainer.getAt(1).setTexture('paytable', '1.png');
    },this)
    this.paytableContainer.getAt(4).on('pointerdown',function(){
      this.paytableContainer.getAt(3).setTexture('paytable', 'btn-default.png');
      this.paytableContainer.getAt(4).setTexture('paytable', 'btn-active.png');
      this.paytableContainer.getAt(5).setTexture('paytable', 'btn-default.png');
      this.paytableContainer.getAt(1).setTexture('paytable', '2.png');
    },this)
    this.paytableContainer.getAt(5).on('pointerdown',function(){
      this.paytableContainer.getAt(3).setTexture('paytable', 'btn-default.png');
      this.paytableContainer.getAt(4).setTexture('paytable', 'btn-default.png');
      this.paytableContainer.getAt(5).setTexture('paytable', 'btn-active.png');
      this.paytableContainer.getAt(1).setTexture('paytable', '3.png');
    },this)
  }
  /*
  *
  *
  */
  setPlayers(){
    //set player for BOT
    let botIndex = 0;
    for (let i=0; i< 4 ;i++) {
      if(this.myPosition != i){
        this.plugins.get('AutoBot'+botIndex).setPlayer(this.players[i]);
        botIndex++;
      }
    }
  }

  /*
  *
  *
  */
  socketListen(message) {
    if (message.joined) {/*You Join Room*/
      this.game.roomID = message.roomID;//Set Room ID
    }
  }

  /*
  * Overwirte this function in game scene to render boss before render fish
  *
  */
  beforeImportFish(){}

  /*
  * Overwirte this function in game scene to render boss after render fish
  *
  */
  afterImportFish(){}

  /*
  *
  *
  */
  sceneTimeLine(){
    let timer = this.time.addEvent({
      delay: 1000, 
      callback: function(){
        var repeat = timer.getRepeatCount();
        if(repeat < Config.sceneHalfTimeLine && this.sceneMode === 0){
          this.sceneMode = 1;
          this.warningBoss();
          this.bossCome();
          this.blockAllPlayer(3000);
          this.fadeOutAndKillFish();
        }
        if(repeat === 0){
          //in case showing multiplier => add more 10 second before switch scene
          if(this.fullScreenMultiplier || this.killBossAnimation){ timer.repeatCount = 10; return;}
          
          // Switch Scene
          this.canRenderFish = false;//not allow to render fish when switch scene
          this.sceneTransitionOut();//effect transition scene => have to overwrite each scene
          this.fadeOutAndKillFish();//fadeOut and kill fish
          this.bgAudio.stop();
          this.bossBackgroundMusic.stop();


          //Show Cover Scene And Logo
          this.sceneCover.setActive(true).setVisible(true).setAlpha(0);
          this.logo.setActive(true).setVisible(true).setAlpha(0);

          this.blockAllPlayer(15000);
          this.tweens.add({targets: [this.sceneCover, this.logo], alpha: 1, delay: 1000})
          this.game.gameAudio.custom['sceneSwitch'].play();
        }
      }, 
      repeat: this.timelineProgress,
      callbackScope: this
    });
  }

  /*
  *
  **/
  bossCome(){}

  /*
  * 
  * 
  *
  */
  importFish(){
    this.fishGroup = [];
    this.fishGroup[36] = this.add.group();
    this.fishGroup[35] = this.add.group();
    this.fishGroup[34] = this.add.group();
    this.fishGroup[33] = this.add.group();
    this.fishGroup[32] = this.add.group();
    this.fishGroup[31] = this.add.group();
    this.fishGroup[30] = this.add.group();
    this.fishGroup[29] = this.add.group();
    this.fishGroup[28] = this.add.group();
    this.fishGroup[27] = this.add.group();
    this.fishGroup[26] = this.add.group();
    this.fishGroup[25] = this.add.group();
    this.fishGroup[24] = this.add.group();
    this.fishGroup[23] = this.add.group();
    this.fishGroup[22] = this.add.group();
    this.fishGroup[21] = this.add.group();
    this.fishGroup[20] = this.add.group();
    this.fishGroup[19] = this.add.group();
    this.fishGroup[18] = this.add.group();
    this.fishGroup[17] = this.add.group();
    this.fishGroup[16] = this.add.group();
    this.fishGroup[15] = this.add.group();
    this.fishGroup[14] = this.add.group();
    this.fishGroup[13] = this.add.group();
    this.fishGroup[12] = this.add.group();
    this.fishGroup[11] = this.add.group();
    this.fishGroup[10] = this.add.group();
    this.fishGroup[9] = this.add.group();
    this.fishGroup[8] = this.add.group();
    this.fishGroup[7] = this.add.group();
    this.fishGroup[6] = this.add.group();
    this.fishGroup[5] = this.add.group();
    this.fishGroup[4] = this.add.group();
    this.fishGroup[3] = this.add.group();
    this.fishGroup[2] = this.add.group();
    this.fishGroup[1] = this.add.group();
    this.fishGroup[0] = this.add.group();

    //Set Maximum Fish In Scene each fish group
    let maxFishGroup = [];
    maxFishGroup[0] = 60;
    maxFishGroup[1] = 40;
    maxFishGroup[2] = 20;
    maxFishGroup[3] = 20;
    maxFishGroup[4] = 20;
    maxFishGroup[5] = 10;
    maxFishGroup[6] = 10;
    maxFishGroup[7] = 8;
    maxFishGroup[8] = 8;
    maxFishGroup[9] = 8;
    maxFishGroup[10] = 5;
    maxFishGroup[11] = 5;
    maxFishGroup[12] = 5;
    maxFishGroup[13] = 5;
    maxFishGroup[14] = 5;
    maxFishGroup[15] = 2;
    maxFishGroup[16] = 2;
    maxFishGroup[17] = 2;
    maxFishGroup[18] = 2;
    maxFishGroup[19] = 2;
    maxFishGroup[20] = 2;
    maxFishGroup[21] = 2;
    maxFishGroup[22] = 2;
    maxFishGroup[23] = 2;
    maxFishGroup[24] = 1;
    maxFishGroup[25] = 1;
    maxFishGroup[26] = 1;
    maxFishGroup[27] = 1;
    maxFishGroup[28] = 1;
    maxFishGroup[29] = 1;
    maxFishGroup[30] = 1;
    maxFishGroup[31] = 1;
    maxFishGroup[32] = 1;
    maxFishGroup[33] = 1;
    maxFishGroup[34] = 2;
    maxFishGroup[35] = 2;
    maxFishGroup[36] = 3;

    this.beforeImportFish();
    //Fish0
    for(let i = 0; i< maxFishGroup[0]; i++){
      let fish = new Fish0(this.matter.world, this, {type: 0, key: "fish0", defaultFrame: 'fish0_swim_1.png', shapeName: 'fish0', active: false, odds: 2});
      this.add.existing(fish);
      this.fishGroup[0].add(fish);
    }

    //Fish1
    for(let i = 0; i< maxFishGroup[1]; i++){
      let fish = new Fish1(this.matter.world, this, {type: 1, key: "fish0", defaultFrame: 'fish1_swim_1.png', shapeName: 'fish1', active: false, odds: 3});
      this.add.existing(fish);
      this.fishGroup[1].add(fish);
    }

    //Fish2
    for(let i = 0; i< maxFishGroup[2]; i++){
      let fish = new Fish2(this.matter.world, this, {type: 2, key: "fish0", defaultFrame: 'fish2_swim_1.png', shapeName: 'fish2', active: false, odds: 4});
      this.add.existing(fish);
      this.fishGroup[2].add(fish);
    }

    //Fish3
    for(let i = 0; i< maxFishGroup[3]; i++){
      let fish = new Fish3(this.matter.world, this, {type: 3, key: "fish0", defaultFrame: 'fish3_swim_1.png', shapeName: 'fish3', active: false, odds: 5});
      this.add.existing(fish);
      this.fishGroup[3].add(fish);
    }

    //Fish4
    for(let i = 0; i< maxFishGroup[4]; i++){
      let fish = new Fish4(this.matter.world, this, {type: 4, key: "fish0", defaultFrame: 'fish4_swim_1.png', shapeName: 'fish4', active: false, odds: 6});
      this.add.existing(fish);
      this.fishGroup[4].add(fish);
    }

    //Fish5
    for(let i = 0; i< maxFishGroup[5]; i++){
      let fish = new Fish5(this.matter.world, this, {type: 5, key: "fish1", defaultFrame: 'fish5_swim_1.png', shapeName: 'fish5', active: false, odds: 7});
      this.add.existing(fish);
      this.fishGroup[5].add(fish);
    }

    //Fish6
    for(let i = 0; i< maxFishGroup[6]; i++){
      let fish = new Fish6(this.matter.world, this, {type: 6, key: "fish1", defaultFrame: 'fish6_swim_1.png', shapeName: 'fish6', active: false, odds: 8});
      this.add.existing(fish);
      this.fishGroup[6].add(fish);
    }

    //Fish7
    for(let i = 0; i< maxFishGroup[7]; i++){
      let fish = new Fish7(this.matter.world, this, {type: 7, key: "fish1", defaultFrame: 'fish7_swim_1.png', shapeName: 'fish7', active: false, odds: 9});
      this.add.existing(fish);
      this.fishGroup[7].add(fish);
    }

    //Fish8
    for(let i = 0; i< maxFishGroup[8]; i++){
      let fish = new Fish8(this.matter.world, this, {type: 8, key: "fish1", defaultFrame: 'fish8_swim_1.png', shapeName: 'fish8', active: false, odds: 10});
      this.add.existing(fish);
      this.fishGroup[8].add(fish);
    }

    //Fish9
    for(let i = 0; i< maxFishGroup[9]; i++){
      let fish = new Fish9(this.matter.world, this, {type: 9, key: "fish1", defaultFrame: 'fish9_swim_1.png', shapeName: 'fish9', active: false, odds: 12});
      this.add.existing(fish);
      this.fishGroup[9].add(fish);
    }

    //Fish10
    for(let i = 0; i< maxFishGroup[10]; i++){
      let fish = new Fish10(this.matter.world, this, {type: 10, key: "fish1", defaultFrame: 'fish10_swim_1.png', shapeName: 'fish10', active: false, odds: 15});
      this.add.existing(fish);
      this.fishGroup[10].add(fish);
    }

    //Fish11
    for(let i = 0; i< maxFishGroup[11]; i++){
      let fish = new Fish11(this.matter.world, this, {type: 11, key: "fish1", defaultFrame: 'fish11_swim_1.png', shapeName: 'fish11', active: false, odds: 18});
      this.add.existing(fish);
      this.fishGroup[11].add(fish);
    }

    //Fish12
    for(let i = 0; i< maxFishGroup[12]; i++){
      let fish = new Fish12(this.matter.world, this, {type: 12, key: "fish1", defaultFrame: 'fish12_swim_1.png', shapeName: 'fish12', active: false, odds: 20});
      this.add.existing(fish);
      this.fishGroup[12].add(fish);
    }

    //Fish13
    for(let i = 0; i< maxFishGroup[13]; i++){
      let fish = new Fish13(this.matter.world, this, {type: 13, key: "fish2", defaultFrame: 'fish13_swim_1.png', shapeName: 'fish13', active: false, odds: {min: 10, max: 30}});
      this.add.existing(fish);
      this.fishGroup[13].add(fish);
    }

    //Fish14
    for(let i = 0; i< maxFishGroup[14]; i++){
      let fish = new Fish14(this.matter.world, this, {type: 14, key: "fish2", defaultFrame: 'fish14_swim_1.png', shapeName: 'fish14', active: false, odds: {min: 10, max: 30}});
      this.add.existing(fish);
      this.fishGroup[14].add(fish);
    }

    //Fish15
    for(let i = 0; i< maxFishGroup[15]; i++){
      let fish = new Fish15(this.matter.world, this, {type: 15, key: "fish2", defaultFrame: 'fish15_swim_1.png', shapeName: 'fish15', active: false, odds: {min: 10, max: 30}});
      this.add.existing(fish);
      this.fishGroup[15].add(fish);
    }

    //Fish16
    for(let i = 0; i< maxFishGroup[16]; i++){
      let fish = new Fish16(this.matter.world, this, {type: 16, key: "fish3", defaultFrame: 'fish16_swim_1.png', shapeName: 'fish16', active: false, odds: {min: 20, max: 60}});
      this.add.existing(fish);
      this.fishGroup[16].add(fish);
    }

    //Fish17
    for(let i = 0; i< maxFishGroup[17]; i++){
      let fish = new Fish17(this.matter.world, this, {type: 17, key: "fish3", defaultFrame: 'fish17_swim_1.png', shapeName: 'fish17', active: false, odds: {min: 30, max: 100}});
      this.add.existing(fish);
      this.fishGroup[17].add(fish);
    }

    //Fish18
    for(let i = 0; i< maxFishGroup[18]; i++){
      let fish = new Fish18(this.matter.world, this, {type: 18, key: "fish4", defaultFrame: 'fish18_swim_1.png', shapeName: 'fish18', active: false, odds: {min: 50, max: 120}});
      this.add.existing(fish);
      this.fishGroup[18].add(fish);
    }

    //Fish19
    for(let i = 0; i< maxFishGroup[19]; i++){
      let fish = new Fish19(this.matter.world, this, {type: 19, key: "fish4", defaultFrame: 'fish19_swim_1.png', shapeName: 'fish19', active: false, odds: {min: 50, max: 120}});
      this.add.existing(fish);
      this.fishGroup[19].add(fish);
    }

    //Fish20
    for(let i = 0; i< maxFishGroup[20]; i++){
      let fish = new Fish20(this.matter.world, this, {type: 20, key: "fish5", defaultFrame: 'fish20_swim_1.png', shapeName: 'fish20', active: false, odds: {min: 50, max: 120}});
      this.add.existing(fish);
      this.fishGroup[20].add(fish);
    }

    //Fish21
    for(let i = 0; i< maxFishGroup[21]; i++){
      let fish = new Fish21(this.matter.world, this, {type: 21, key: "fish6", defaultFrame: 'fish21_swim_1.png', shapeName: 'fish21', active: false, odds: {min: 50, max: 120}});
      this.add.existing(fish);
      this.fishGroup[21].add(fish);
    }

    //Fish22
    for(let i = 0; i< maxFishGroup[22]; i++){
      let fish = new Fish22(this.matter.world, this, {type: 22, key: "fish7", defaultFrame: 'fish22_swim_1.png', shapeName: 'fish22', active: false, odds: 200});
      this.add.existing(fish);
      this.fishGroup[22].add(fish);
    }

    //Fish23
    for(let i = 0; i< maxFishGroup[23]; i++){
      let fish = new Fish23(this.matter.world, this, {type: 23, key: "fish8", defaultFrame: 'fish23_swim_1.png', shapeName: 'fish23', active: false, odds: 200});
      this.add.existing(fish);
      this.fishGroup[23].add(fish);
    }
    //Fish24
    for(let i = 0; i< maxFishGroup[24]; i++){
      let fish = new Fish24(this.matter.world, this, {type: 24, key: "fish9", defaultFrame: 'fish24_swim_1.png', shapeName: 'fish24', active: false, odds: 0});
      this.add.existing(fish);
      this.fishGroup[24].add(fish);
    }
    //Fish25
    for(let i = 0; i< maxFishGroup[25]; i++){
      let fish = new Fish25(this.matter.world, this, {type: 25, key: "fish9", defaultFrame: 'fish25_swim_1.png', shapeName: 'fish25', active: false, odds: 0});
      this.add.existing(fish);
      this.fishGroup[25].add(fish);
    }
    //Fish26
    for(let i = 0; i< maxFishGroup[26]; i++){
      let fish = new Fish26(this.matter.world, this, {type: 26, key: "fish9", defaultFrame: 'fish26_swim_1.png', shapeName: 'fish26', active: false, odds: 0});
      this.add.existing(fish);
      this.fishGroup[26].add(fish);
    }
    //Fish27
    for(let i = 0; i< maxFishGroup[27]; i++){
      let fish = new Fish27(this.matter.world, this, {type: 27, key: "fish9", defaultFrame: 'fish27_swim_1.png', shapeName: 'fish27', active: false, odds: 0});
      this.add.existing(fish);
      this.fishGroup[27].add(fish);
    }
    //Fish28
    for(let i = 0; i< maxFishGroup[28]; i++){
      let fish = new Fish28(this.matter.world, this, {type: 28, key: "fish9", defaultFrame: 'fish28_swim_1.png', shapeName: 'fish28', active: false, odds: 0});
      this.add.existing(fish);
      this.fishGroup[28].add(fish);
    }

    //Fish30(Red Dragon)
    for(let i = 0; i< maxFishGroup[30]; i++){
      let fish = new Fish30(this.matter.world, this, {type: 30, key: "dragon_red", defaultFrame: '40redDragon.png', shapeName: 'fish30', active: false, odds: {min: 100, max: 500}});
      this.add.existing(fish);
      this.fishGroup[30].add(fish);
    }

    //Fish31(Blue Dragon)
    for(let i = 0; i< maxFishGroup[31]; i++){
      let fish = new Fish31(this.matter.world, this, {type: 31, key: "dragon_blue", defaultFrame: '40dragonBlue.png', shapeName: 'fish30', active: false, odds: {min: 100, max: 500}});
      this.add.existing(fish);
      this.fishGroup[31].add(fish);
    }

    //Fish31(Dragon Tutle)
    for(let i = 0; i< maxFishGroup[32]; i++){
      let fish = new Fish32(this.matter.world, this, {type: 32, key: "dragonTurleWalk", defaultFrame: 'dragonTurleWalk1.png', shapeName: 'DragonTurtle', active: false, odds: {min: 100, max: 500}});
      this.add.existing(fish);
      this.fishGroup[32].add(fish);
    }
    this.afterImportFish();
  }

  /*
  * Call this fucntion when boss come
  *   - Turn off physic body check
  *   - Fade out then kill the fish
  */
  fadeOutAndKillFish(){
    //Block duplicate kill this function
    if(this.fadeOutAndKillFishStatus) return;
    this.fadeOutAndKillFishStatus = true;
    this.time.addEvent({delay: 1100, callback: function(){this.fadeOutAndKillFishStatus = false;}, callbackScope: this});

    //Kill All Fish 
    this.fishGroup.forEach(function(group, indexGroup){
      group.getChildren().forEach(function(fish, fishIndex){
        fish.setCollisionGroup(-1);//Disable Physic body collide detect
        //Fade out and kill
        if(fish.active  && fish.visible && (fish.anims.currentAnim.key === 'fish'+fish.config.type+'_swim')){
          //Make fish swim faster
          if(fish.config.type < 30 && fish.tween && fish.tween.isPlaying) fish.tween.setTimeScale(3);
          this.tweens.add({
            targets: [fish, fish.shadow], alpha: 0, duration: 1000, 
            onComplete: function(){
              fish.forceStopSwim();
            }
          });
        }
      },this);
    },this);
  }

  /*
  * Call this fucntion when boss come
  *   - Turn off physic body check
  *   - kill  all fish without fadeout effect
  */
  killAllFish(){
    //Block duplicate kill this function
    if(this.fadeOutAndKillFishStatus) return;
    this.fadeOutAndKillFishStatus = true;
    this.time.addEvent({delay: 1100, callback: function(){this.fadeOutAndKillFishStatus = false;}, callbackScope: this});

    //Kill All Fish 
    this.fishGroup.forEach(function(group, indexGroup){
      group.getChildren().forEach(function(fish, fishIndex){
        fish.setCollisionGroup(-1);//Disable Physic body collide detect
        //Fade out and kill
        if(fish.active  && fish.visible && (fish.anims.currentAnim.key === 'fish'+fish.config.type+'_swim')){
          //Make fish swim faster
          if(fish.config.type < 30 && fish.tween && fish.tween.isPlaying)
           fish.tween.setTimeScale(3);
          fish.forceStopSwim();
        }
      },this);
    },this);
  }

  /*
  * This function is required, only use for main player only
  * more information ./Fish/BaseFish.js#line21
  *
  */
  focusToFish(fish){
    if(this.myPlayer && this.myPlayer.gun.active && this.myPlayer.gun.gunType === 3 && fish.health > 0 && fish.visible){
      //can focus on big fish only
      if(fish.config.type > 8){
        this.myPlayer.startFocusElectricToFish(fish);
      }
    }
  }

  /*
  * Description: loop all fish and enable pointerdown event when current cannon is electric cannon
  */
  enablePointerEventOnFish(){
    const length = this.fishGroup.length-1;
    for (var index = 9; index < length; index++) {
      this.fishGroup[index].getChildren().forEach(function(fish){
        fish.setInteractive();
      });
    }
  }

  /*
  * Description: loop all fish and disable pointerdown event when current cannon is not electric cannon
  */
  disablePointerEventOnFish(){
    const length = this.fishGroup.length-1;
    for (var index = 9; index < length; index++) {
      this.fishGroup[index].getChildren().forEach(function(fish){
        fish.disableInteractive();
      });
    }
  }

  /*
  * Description: Check Collie Dame Fish by Circle Area, boom, drill explode
  * @Params
  * position<Vector2>
  * radius<Number>
  * damage<Number>
  */
  checkCollideByRadius(player, position, radius){
    if(!this.circleCollideArea){this.circleCollideArea = new Phaser.Geom.Circle();}
    this.circleCollideArea.radius = radius;
    this.circleCollideArea.setPosition(position.x, position.y);
    let totalWin = 0;
    let params = {x: player.x,  y: player.y,  player: player, coinType: player.position === this.myPosition ? 'gold' : 'silver', textType: 'pink'};
    for (let i = 0; i < 24; i++) {
      this.fishGroup[i].getChildren().forEach(function(fish){
        if(
          fish.active === true //Fish is alive
          && fish.anims.currentAnim.key === 'fish' + fish.config.type+'_swim'  //Fish is swimming
          && Phaser.Geom.Circle.ContainsPoint(this.circleCollideArea, { x: fish.x, y: fish.y }) // Circle contains fish center point 
        ){
          let health = fish.damageFish(Phaser.Math.Between(1000, 10000));
          if(health <= 0){
            let odds = fish.config.odds;
            if(fish.config.odds.min){odds = Phaser.Math.Between(fish.config.odds.min, fish.config.odds.max);}
            params.totalWin = player.bet*odds;//overwirte in case the fish odds have min and max
            params.noUpdateCredit = true;
            totalWin =  totalWin+params.totalWin;
            fish.killFish(params);
          }
        }
      }, this)
    }
    return totalWin;
  }

  /*
  * Description: Check Collie Dame Fish by Rectangle Area(for lazer beam)
  * @Params
  * rect<Phaser.Geom.Rectangle>
  * damage<Number>
  */
  checkCollideByPolygon(player, points){
    let totalWin = 0;
    if(!this.pollyCollideArea){this.pollyCollideArea = new Phaser.Geom.Polygon();}
    this.pollyCollideArea.setTo(points);

    let params = {
      x: player.x, 
      y: player.y, 
      player: player,
      coinType: player.position === this.myPosition ? 'gold' : 'silver',
      textType: 'pink'
    };
    for (let i = 0; i < 24; i++) {
      this.fishGroup[i].getChildren().forEach(function(fish){
        if(
          fish.active === true //Fish is alive
          && fish.anims.currentAnim.key === 'fish' + fish.config.type+'_swim'  //Fish is swimming
          && Phaser.Geom.Polygon.ContainsPoint(this.pollyCollideArea, { x: fish.x, y: fish.y }) // Circle contains fish center point 
        ){
          let health = fish.damageFish(Phaser.Math.Between(1000, 10000));
          if(health <= 0){
            let odds = fish.config.odds;
            if(fish.config.odds.min){odds = Phaser.Math.Between(fish.config.odds.min, fish.config.odds.max);}
            params.totalWin = player.bet*odds;//overwirte in case the fish odds have min and max
            params.noUpdateCredit = true;
            totalWin =  totalWin+params.totalWin;
            fish.killFish(params);
          }
        }
      }, this)
    }
    return totalWin;
  }

  /*
  * Show The Boss Icon  To Warning Player Boss is comming
  * The spritename have to 
  */
  warningBoss(){
    this.bgAudio.stop();
    this.bossBackgroundMusic.play({loop: true});

    if(!this.bossWarning){this.bossWarning = this.add.sprite(Config.gameWidth + 200, Config.gameCenterY, this.scene.key);}
    this.bossWarning.setPosition(Config.gameWidth + 250, Config.gameCenterY).setActive(true).setVisible(true);
    this.tweens.timeline({
      targets: this.bossWarning,
      tweens: [
        {x: Config.gameCenterX, duration: 1200, ease: 'Back.easeOut'},
        {scale: 1.1, angle: -10, duration: 300, yoyo: true},
        {scale: 1.1, angle: 10, duration: 300, yoyo: true},
        {scale: 1.1, angle: -10, duration: 300, yoyo: true},
        {scale: 1.1, angle: 10, duration: 300, yoyo: true},
        {x: -250, duration: 1200, ease: 'Back.easeIn'}
      ],
      onComplete: function(){
        this.bossWarning.setActive(false).setVisible(false);
      },
      callbackScope: this
    });
  }

  /*
  *
  *
  */
  blockAllPlayer(duration=1000){
    if(this.players[0].connected) {
      this.players[0].blockPlayer(duration);
      this.players[0].cancleFocusElectricToFish();
    }
    if(this.players[1].connected){
      this.players[1].blockPlayer(duration);
      this.players[1].cancleFocusElectricToFish();
    }
    if(this.players[2].connected){
      this.players[2].blockPlayer(duration);
      this.players[2].cancleFocusElectricToFish();
    }
    if(this.players[3].connected){
      this.players[3].blockPlayer(duration);
      this.players[3].cancleFocusElectricToFish();
    }
  }

  mainBossDieCallback(){}
 
  addFish(group, data){
    if(!this.canRenderFish) return;
    if(group  < 24){
      data.forEach(function (item, index) {
        let fish = this.fishGroup[group].getFirstDead();
        if(fish){fish.swim(item);}
      },this);
    }
    // if(group > 23 && group  < 28){
    //   group = 26;
    // }
    if(group === 24){//Lucky wheel
      console.log('Not do yet');
    }
    if(group === 25){//Boom
      console.log('fish25==>comming');
      let fish = this.fishGroup[group].getFirstDead();
      if(fish) fish.swim(data);
    }
    if(group === 26){//Beam
      console.log('fish26==>comming');
      let fish = this.fishGroup[group].getFirstDead();
      if(fish) fish.swim(data);
    }
    if(group === 27){//Drill
      console.log('fish27==>comming');
      let fish = this.fishGroup[group].getFirstDead();
      if(fish) fish.swim(data);
    }

    // if(group > 27){
    //   group = 32;
    // }
    /*Small Boss*/
    if(group === 30){
      console.log('fish30==>comming------dragon red', this.sceneMode);
      let fish = this.fishGroup[30].getFirstDead();
      if(fish) {fish.swim(data)}
    }
    // Blue Dragon
    if(group === 31){
      // console.log('fish31==>comming------dragon blue');
      let fish = this.fishGroup[31].getFirstDead();
      if(fish) {fish.swim(data)}
    }
    // Dragon Turtle
    if(group === 32){
      console.log('fish32==>comming------dragon blue');
      let fish = this.fishGroup[32].getFirstDead();
      if(fish) {fish.swim(data)}
    }
  }

  /*
  * Last Explode and show coin
  *
  */
  explodeRandomInBounds(player){
    for (let i = 0; i < 20; i++) {
      const point = this.rectangleBounds.getRandomPoint();
      this.creditWinEffect.showSingleCoinWithoutText({x: point.x, y: point.y}, {x: player.x, y: player.y});
    }
  }
}


