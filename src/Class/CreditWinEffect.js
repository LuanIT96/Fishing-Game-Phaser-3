import Config from '../config';
import Helpers from '../helpers';

export default class CreditWinEffect {

  constructor (scene,  config={}){
    this.scene = scene;
    this.game = scene.game;
    this.config = config;
    this.init();
  }
  init(){
    this.winTextGroup = this.scene.add.group();
    this.winTextGroup1 = this.scene.add.group();
    this.coinGroup = this.scene.add.group();
    this.coinExplodeGroup = this.scene.add.group();
  }
  /*
  *
  * @parmas
  * (float) totalWin: total win text player win when kill the fish
  * (Vector2) fromTarget: vector2 position where fish get killed
  * (Vector2) toTarget: vector2 position player who kill the fish
  * (string) coinType: type of sprite (default is silver)
  *                - silver
  *                - gold
  * (string) textType: type of sprite (default is silver)
  *                - blue
  *                - gold
  *                - bonus
  */
  showSingleCoin(totalWin, fromTarget, playerObject, coinType='silver', textType='blue', noUpdateCredit=false){
    let coinSpriteName = 'coinSilver';
    if(coinType === 'gold'){coinSpriteName = 'coinGold';}
    let textSpriteName = 'BlueScore';
    if(textType === 'gold'){textSpriteName = 'GoldScore';}
    if(textType === 'pink'){textSpriteName = 'PinkScore';}

    let text = this.winTextGroup.getFirstDead(false);
    if(!text){
      text = this.scene.add.bitmapText(fromTarget.x, fromTarget.y, textSpriteName, 0, 18,"center").setOrigin(0.5, 0.5).setCenterAlign();
      this.winTextGroup.add(text);
    }
    text.setText(Helpers.number_format(totalWin, 2, '.', ',')).setOrigin(0.5, 0.5).setCenterAlign();
    text.setOrigin(0.5, 0.5).setAlpha(1).setScale(0).setVisible(true).setActive(true).setFont(textSpriteName).setFontSize(20).setPosition(fromTarget.x, fromTarget.y);
    this.scene.tweens.add({
      targets: text,
      props:{
        scaleX: {value: 1, duration: 300, ease: 'Back'}, 
        scaleY: {value: 1, duration: 300, ease: 'Back'},
        y: {value: "+="+Phaser.Math.Between(-40, 40), duration: Phaser.Math.Between(600, 800), ease: 'Power1'},
        x: {value: "+="+Phaser.Math.Between(-50, 50), duration: Phaser.Math.Between(400, 600), yoyo: true, ease: 'Power1'}
      },
      onComplete: function(){
        //kill current text
        text.setVisible(false).setActive(false);

        //revive coin
        let coin = this.coinGroup.getFirstDead(false);
        if(!coin){
          coin = this.scene.add.sprite(fromTarget.x, fromTarget.y, 'winFont', coinSpriteName+'1.png');
          this.coinGroup.add(coin);
        }
        coin.setPosition(fromTarget.x, fromTarget.y).setVisible(true).setActive(true).setScale(0).anims.play(coinSpriteName).setDisplaySize(30, 31);
        this.scene.tweens.timeline({
          targets: coin,
          duration: 600,
          tweens: [{
            props:{
              scaleX: {value: 1, duration: 150, ease: 'Back'}, 
              scaleY: {value: 1, duration: 150, ease: 'Back'}, 
              y: {value: "-=35", yoyo: true, duration: 100, delay: 50, ease: 'Cubic'}
            },
          },{
            x: playerObject.x, y: playerObject.y, delay: 400,
            onComplete: function(){
              //move coin to player who killed fish
              coin.setVisible(false).setActive(false);
              if(coinType === 'gold'){this.scene.sound.play('coinIn');}

              let text = this.winTextGroup.getFirstDead(false);
              if(!text){
                text = this.scene.add.bitmapText(playerObject.x, playerObject.y, textSpriteName, 0, 10, "center").setOrigin(0.5, 0.5).setCenterAlign();
                this.winTextGroup.add(text);
              }
              //reset text position
              text.setOrigin(0.5, 0.5).setAlpha(1).setPosition(playerObject.x, playerObject.y).setScale(1).setVisible(true).setActive(true).setFont(textSpriteName).setFontSize(10).setText('+'+Helpers.number_format(totalWin, 2, '.', ',')).setOrigin(0.5, 0.5).setCenterAlign();
              this.scene.tweens.add({
                targets: text, 
                props:{
                  y: {value: (playerObject.y > Config.gameCenterY ? "-=35" : "+=35"), duration: 300},
                  scaleX: {value: 1.1, delay: 50, duration: 100, yoyo: true, ease: 'Back'},
                  scaleY: {value: 1.1, delay: 50, duration: 100, yoyo: true, ease: 'Back'}
                },
                onStart: function(){
                  if(!noUpdateCredit) playerObject.updatePlayerTotalCredit(totalWin);
                },
                onComplete: function(){text.setVisible(false).setActive(false);}
              });
            },callbackScope: this
          }]
        });
      },callbackScope: this
    });
  }
  showSingleCoinWithoutText(fromTarget, toTarget){
    //revive coin
    let coin = this.coinGroup.getFirstDead(false);
    if(!coin){
      coin = this.scene.add.sprite(fromTarget.x, fromTarget.y, 'winFont', 'coinGold1.png');
      this.coinGroup.add(coin);
    }
    coin.setPosition(fromTarget.x, fromTarget.y).setVisible(true).setActive(true).setScale(0).anims.play('coinGold').setDisplaySize(30, 31);
    this.scene.tweens.timeline({
      targets: coin,
      tweens: [{
        props:{
          scaleX: {value: 1, duration: 150, ease: 'Back'}, 
          scaleY: {value: 1, duration: 150, ease: 'Back'}, 
          y: {value: "-=70", yoyo: true, duration: 150, delay: 50, ease: 'Cubic'}
        },
      },{
        x: toTarget.x, y: toTarget.y, delay: 500, duration: 500,
        onComplete: function(){coin.setVisible(false).setActive(false);},
        callbackScope: this
      }]
    });
  }

  /*
  *
  * @parmas
  * (float) totalWin: total win text player win when kill the fish
  * (Vector2) fromTarget: vector2 position where fish get killed
  * (Vector2) toTarget: vector2 position player who kill the fish
  * (string) coinType: type of sprite (default is silver)
  *                - silver
  *                - gold
  * (string) textType: type of sprite (default is silver)
  *                - blue
  *                - gold
  *                - bonus
  */
  bigFishExplode(position){
    let explodeGlow = this.coinGroup.getFirstDead(false);
    if(!explodeGlow){
      explodeGlow = this.scene.add.sprite(position.x, position.y, 'winFont', 'bigFishExplode.png');
      this.coinGroup.add(explodeGlow);
    }
    explodeGlow.setPosition(position.x, position.y).setVisible(true).setAlpha(0.5).setScale(0).setTexture('winFont', 'bigFishExplode.png');
    this.scene.tweens.add({targets: explodeGlow, scale: 4.5, alpha: 0, duration: 200, onComplete: function(sprite){explodeGlow.setVisible(false).setActive(false);}});
  }

  /*
  *
  */
  coinJumnp(totalWin, playerObject, fishPosition, textType='blue', volume=1, noUpdateCredit=false){
    let textSpriteName = 'BlueScore';
    if(textType === 'gold'){textSpriteName = 'GoldScore';}
    if(textType === 'pink'){textSpriteName = 'PinkScore';}
    if(textType === 'GoldWin'){textSpriteName = 'GoldWin';}
    
    let text = this.winTextGroup.getFirstDead(false);
    if(!text){
      text = this.scene.add.bitmapText(fishPosition.x, fishPosition.y, textSpriteName, 0, 18,"center").setOrigin(0.5, 0.5).setCenterAlign();
      this.winTextGroup.add(text);
    }
    text.setText(Helpers.number_format(0, 2, '.', ',')).setOrigin(0.5, 0.5).setCenterAlign();
    text.setAlpha(1).setScale(1).setVisible(true).setActive(true).setFont(textSpriteName).setOrigin(0.5).setFontSize(20).setPosition(fishPosition.x, fishPosition.y).setCenterAlign();

    var totalValue = 0;
    let jumpTo = totalWin*0.34;
    var tween = this.scene.tweens.addCounter({
      from: 0, to: jumpTo, duration: 1000, loopDelay: 500, loop: 2,
      onUpdate: function(){
        text.setCenterAlign().setOrigin(0.5, 0.5).setText(Helpers.number_format(parseFloat(totalValue)+parseFloat(tween.getValue()))).setOrigin(0.5, 0.5).setCenterAlign();
      },
      onStart: function(){
        this.game.gameAudio.custom['whaleCount1_1'].play({volume: volume});
        this.game.gameAudio.custom['whaleCount1'].play({volume: volume});
      },
      onLoop: function(){
          totalValue = totalValue + jumpTo;
          let index = (tween.loop - tween.loopCounter)+1;
          //zoom text
          text.setOrigin(0.5, 0.5).setCenterAlign();
          this.scene.tweens.add({ 
            targets: text, scale: 1.2, duration: 200, 
            ease: 'Bounce.easeInOut', yoyo: true,
            onStart: function(){
              this.game.gameAudio.custom['whaleCount'+index+'_1'].play({volume: volume});
            },
            onYoyo: function(){
              this.game.gameAudio.custom['whaleCount'+index].play({volume: volume});
            },
            callbackScope: this
          });
      },
      onComplete: function(){
        //Fadeout and kill text
        text.setText(Helpers.number_format(Helpers.number_format(totalWin), 2, '.', ',')).setOrigin(0.5, 0.5).setCenterAlign();
        this.scene.tweens.add({ targets: text,  alpha: 0, duration: 500, delay: 500,
        onComplete: function(){
          text.setActive(false).setVisible(false);
          if(!noUpdateCredit) playerObject.updatePlayerTotalCredit(totalWin);//update player credity
        }});
      },
      callbackScope: this
    });
  }
  coinJumnpSingle(totalWin, playerObject, position, textType='blue', volume=1, noUpdateCredit=false){
    let textSpriteName = 'BlueScore';
    if(textType === 'gold'){textSpriteName = 'GoldScore';}
    if(textType === 'pink'){textSpriteName = 'PinkScore';}
    if(textType === 'GoldWin'){textSpriteName = 'GoldWin';}
    
    let text = this.winTextGroup.getFirstDead(false);
    if(!text){
      text = this.scene.add.bitmapText(position.x, position.y, textSpriteName, 0, 18,"center").setOrigin(0.5, 0.5).setCenterAlign();
      this.winTextGroup.add(text);
    }
    text.setText(Helpers.number_format(0, 2, '.', ',')).setOrigin(0.5, 0.5).setCenterAlign();
    text.setOrigin(0.5, 0.5).setAlpha(1).setScale(1).setVisible(true).setActive(true).setFont(textSpriteName).setFontSize(20).setPosition(position.x, position.y);
    const whaleCount1 = this.game.gameAudio.custom['whaleCount1'];
    var tween = this.scene.tweens.addCounter({
      from: 0, to: totalWin, duration: 3000,
      onUpdate: function(){
        text.setText(Helpers.number_format(tween.getValue()), 2, '.', ',').setOrigin(0.5, 0.5).setCenterAlign();
      },
      onStart: function(){
        whaleCount1.play({volume: volume});
      },
      onComplete: function(){
        whaleCount1.stop();
        this.game.gameAudio.custom['whaleCount3_1'].play({volume: volume});
        text.setText(Helpers.number_format(Helpers.number_format(totalWin), 2, '.', ',')).setOrigin(0.5, 0.5).setCenterAlign();
        this.scene.tweens.add({ targets: text, scale: 1.2, duration: 250, ease: 'Bounce.easeInOut', yoyo: true});
        //Fadeout and kill text
        this.scene.tweens.add({ targets: text,  alpha: 0, duration: 500, delay: 500, 
          onComplete: function(){
            text.setActive(false).setVisible(false);
            if(!noUpdateCredit) playerObject.updatePlayerTotalCredit(totalWin);//update player credity
          }
        });
      },
      callbackScope: this
    });
  }
  
  /*
  *
  *
  *
  *
  */
  coinMultiple(position, toTarget, playerPosition, coinType='silver', textType='blue'){
    //revive coin
    let coinSpriteName = 'coinSilver';
    if(coinType === 'gold'){coinSpriteName = 'coinGold';}

    let coin1 = this.coinGroup.getFirstDead(false);
    if(!coin1){coin1 = this.scene.add.sprite(position.x + Phaser.Math.Between(-40, 40), position.y + Phaser.Math.Between(-40, 40), 'winFont', coinSpriteName+'1.png'); this.coinGroup.add(coin1);}
    coin1.setAlpha(1).setPosition(position.x + Phaser.Math.Between(-40, 40), position.y + Phaser.Math.Between(-40, 40)).setVisible(true).setActive(true).setScale(0).anims.play(coinSpriteName).setDisplaySize(30, 31);

    let coin2 = this.coinGroup.getFirstDead(false);
    if(!coin2){coin2 = this.scene.add.sprite(position.x + Phaser.Math.Between(-40, 40), position.y + Phaser.Math.Between(-40, 40), 'winFont', coinSpriteName+'1.png'); this.coinGroup.add(coin2);}
    coin2.setAlpha(1).setPosition(position.x + Phaser.Math.Between(-40, 40), position.y + Phaser.Math.Between(-40, 40)).setVisible(true).setActive(true).setScale(0).anims.play(coinSpriteName).setDisplaySize(30, 31);

    let coin3 = this.coinGroup.getFirstDead(false);
    if(!coin3){coin3 = this.scene.add.sprite(position.x + Phaser.Math.Between(-40, 40), position.y + Phaser.Math.Between(-40, 40), 'winFont', coinSpriteName+'1.png'); this.coinGroup.add(coin3);}
    coin3.setAlpha(1).setPosition(position.x + Phaser.Math.Between(-40, 40), position.y + Phaser.Math.Between(-40, 40)).setVisible(true).setActive(true).setScale(0).anims.play(coinSpriteName).setDisplaySize(30, 31);

    let coin4 = this.coinGroup.getFirstDead(false);
    if(!coin4){coin4 = this.scene.add.sprite(position.x + Phaser.Math.Between(-40, 40), position.y + Phaser.Math.Between(-40, 40), 'winFont', coinSpriteName+'1.png'); this.coinGroup.add(coin4);}
    coin4.setAlpha(1).setPosition(position.x + Phaser.Math.Between(-40, 40), position.y + Phaser.Math.Between(-40, 40)).setVisible(true).setActive(true).setScale(0).anims.play(coinSpriteName).setDisplaySize(30, 31);

    let coin5 = this.coinGroup.getFirstDead(false);
    if(!coin5){coin5 = this.scene.add.sprite(position.x + Phaser.Math.Between(-40, 40), position.y + Phaser.Math.Between(-40, 40), 'winFont', coinSpriteName+'1.png'); this.coinGroup.add(coin5);}
    coin5.setAlpha(1).setPosition(position.x + Phaser.Math.Between(-40, 40), position.y + Phaser.Math.Between(-40, 40)).setVisible(true).setActive(true).setScale(0).anims.play(coinSpriteName).setDisplaySize(30, 31);

    let coin6 = this.coinGroup.getFirstDead(false);
    if(!coin6){coin6 = this.scene.add.sprite(position.x + Phaser.Math.Between(-40, 40), position.y + Phaser.Math.Between(-40, 40), 'winFont', coinSpriteName+'1.png'); this.coinGroup.add(coin6);}
    coin6.setAlpha(1).setPosition(position.x + Phaser.Math.Between(-40, 40), position.y + Phaser.Math.Between(-40, 40)).setVisible(true).setActive(true).setScale(0).anims.play(coinSpriteName).setDisplaySize(30, 31);

    let coin7 = this.coinGroup.getFirstDead(false);
    if(!coin7){coin7 = this.scene.add.sprite(position.x + Phaser.Math.Between(-40, 40), position.y + Phaser.Math.Between(-40, 40), 'winFont', coinSpriteName+'1.png'); this.coinGroup.add(coin7);}
    coin7.setAlpha(1).setPosition(position.x + Phaser.Math.Between(-40, 40), position.y + Phaser.Math.Between(-40, 40)).setVisible(true).setActive(true).setScale(0).anims.play(coinSpriteName).setDisplaySize(30, 31);

    let y = playerPosition > 1 ? Phaser.Math.Between(70, 100) : -Phaser.Math.Between(70, 100);
    //tween timeline
    this.scene.tweens.timeline({
      targets: [coin1, coin2, coin3, coin4, coin5, coin6, coin7],
      tweens: [
        {scale: 1, duration: 50},
        {y: "+="+y, duration: 100, yoyo: true,  delay:  this.scene.tweens.stagger(50)},
        {x: toTarget.x, y: toTarget.y, delay: this.scene.tweens.stagger(100), onComplete: function(tween, targets){targets.forEach(function(target){target.setVisible(false).setActive(false);});}}
      ],
    });
  }

  /*
  *
  *
  *
  *
  */
  showCoinExplode(position, delay=0){
    let coinExplode = this.coinExplodeGroup.getFirstDead(false);
    if(!coinExplode){
      coinExplode = this.scene.add.sprite(position.x, position.y, 'winFont', 'bigFishExplode.png');
      coinExplode.on('animationcomplete',function(){coinExplode.setActive(false).setVisible(false);})
      this.coinExplodeGroup.add(coinExplode);
    }
    coinExplode.setPosition(position.x, position.y).setActive(true).setVisible(true).setScale(5).setTexture('winFont', 'coin_exlode_1.png');
    delay > 0 ? coinExplode.anims.delayedPlay(delay, 'coin_explode') : coinExplode.anims.play('coin_explode');
  }

  /*
  * Descriotion: after shoot drill and explode the drill=> show total credit player with
  * @params
  * - totalCredit<number>
  * - position<Vect2>
  * - callback<Function>
  */
  showBonusDrillWin(params){
    const totalWin = params.totalWin ? params.totalWin : 0;
    const position = params.position ? params.position : {x: 0, y: 0};
    const callback = params.callback ? params.callback : null ;

    let textLeft = this.winTextGroup1.getFirstDead(false);
    if(!textLeft){
      textLeft = this.scene.add.sprite(position.x, position.y, 'winFont',"winDrill.png");
      this.winTextGroup1.add(textLeft);
    }
    textLeft
    .setTexture('winFont',"winDrill.png")
    .setAlpha(1)
    .setScale(1.2)
    .setVisible(true)
    .setActive(true)
    .setOrigin(1.2, 0.5)
    .setPosition(position.x, position.y);

    let textRight = this.winTextGroup.getFirstDead(false);
    if(!textRight){
      textRight = this.scene.add.bitmapText(position.x, position.y, 'BonusWinDrill', 0, 25,"center").setOrigin(0.5, 0.5).setCenterAlign();
      this.winTextGroup.add(textRight);
    }
    textRight
    .setVisible(true)
    .setActive(true)
    .setText(totalWin)
    .setAlpha(1)
    .setScale(1)
    .setFont('BonusWinDrill')
    .setFontSize(30)
    .setOrigin(0, 0.5)
    .setPosition(position.x, position.y);

    this.scene.tweens.add({
      targets: [textLeft, textRight],
      y: position.y-20,
      yoyo: true,
      duration: 500,
      loop: 2,
      onComplete: function(){
        //Fadeout and kill text
        this.scene.tweens.add({targets: [textLeft, textRight], duration: 500, alpha: 0,
          onComplete: function(){
            //kill text
            textLeft.setActive(false).setVisible(false);
            textRight.setActive(false).setVisible(false);
          },
          callbackScope: this
        });
        //callback 
        if(callback && typeof callback==='function') callback();
      },
      callbackScope: this
    })
  }

   /*
  * Descriotion: after shoot drill and explode the drill=> show total credit player with
  * @params
  * - totalCredit<number>
  * - position<Vect2>
  * - callback<Function>
  */
  showBonusLazerBeamWin(params){
    const position = params.position ? params.position : {x: 0, y: 0};

    let textLeft = this.winTextGroup1.getFirstDead(false);
    if(!textLeft){
      textLeft = this.scene.add.sprite(position.x, position.y, 'winFont',"winLazerBeam.png");
      this.winTextGroup1.add(textLeft);
    }
    textLeft
    .setTexture('winFont',"winLazerBeam.png")
    .setAlpha(1)
    .setScale(1.2)
    .setVisible(true)
    .setActive(true)
    .setOrigin(1.2, 0.5)
    .setPosition(position.x, position.y);

    let textRight = this.winTextGroup.getFirstDead(false);
    if(!textRight){
      textRight = this.scene.add.bitmapText(position.x, position.y, 'BonusWinLaser', 0, 25,"center").setOrigin(0.5, 0.5).setCenterAlign();
      this.winTextGroup.add(textRight);
    }
    textRight
    .setVisible(true)
    .setActive(true)
    .setFont('BonusWinLaser')
    .setText(params.totalWin ? params.totalWin : 0)
    .setAlpha(1)
    .setScale(1)
    .setFontSize(30)
    .setOrigin(0, 0.5)
    .setPosition(position.x, position.y)
    .setCenterAlign();

    this.scene.tweens.add({
      targets: [textLeft, textRight],
      y: position.y-20,
      yoyo: true,
      duration: 500,
      loop: 2,
      onComplete: function(){
        //Fadeout and kill text
        this.scene.tweens.add({targets: [textLeft, textRight], duration: 500, alpha: 0,
          onComplete: function(){
            //kill text
            textLeft.setActive(false).setVisible(false);
            textRight.setActive(false).setVisible(false);
          },
          callbackScope: this
        });
        //callback 
        if(params.callback && typeof params.callback==='function') params.callback();
      },
      callbackScope: this
    })
  }
   /*
  * Descriotion: after supper boom explode => show total credit player with
  * @params
  * - totalCredit<number>
  * - position<Vect2>
  * - callback<Function>
  */
  showBonusBoomWin(params){
    const position = params.position ? params.position : {x: 0, y: 0};

    let textLeft = this.winTextGroup1.getFirstDead(false);
    if(!textLeft){
      textLeft = this.scene.add.sprite(position.x, position.y, 'winFont',"winBomb.png");
      this.winTextGroup1.add(textLeft);
    }
    textLeft
    .setTexture('winFont',"winBomb.png")
    .setAlpha(1)
    .setScale(1.2)
    .setVisible(true)
    .setActive(true)
    .setOrigin(1.2, 0.5)
    .setPosition(position.x, position.y);

    let textRight = this.winTextGroup.getFirstDead(false);
    if(!textRight){
      textRight = this.scene.add.bitmapText(position.x, position.y, 'BonusWinBomb', 0, 25,"center").setOrigin(0.5, 0.5).setCenterAlign();
      this.winTextGroup.add(textRight);
    }
    textRight
    .setVisible(true)
    .setActive(true)
    .setFont('BonusWinBomb')
    .setText(params.totalWin ? params.totalWin : 0)
    .setAlpha(1)
    .setScale(1)
    .setFontSize(30)
    .setOrigin(0, 0.5)
    .setPosition(position.x, position.y)
    .setCenterAlign();

    this.scene.tweens.add({
      targets: [textLeft, textRight],
      y: position.y-20,
      yoyo: true,
      duration: 500,
      loop: 2,
      onComplete: function(){
        //Fadeout and kill text
        this.scene.tweens.add({targets: [textLeft, textRight], duration: 500, alpha: 0,
          onComplete: function(){
            //kill text
            textLeft.setActive(false).setVisible(false);
            textRight.setActive(false).setVisible(false);
          },
          callbackScope: this
        });
        //callback 
        if(params.callback && typeof params.callback==='function') params.callback();
      },
      callbackScope: this
    })
  }

  /*
  * Descriotion: after kill crocodile then show total win(for multiplier only)
  * @params
  * - totalCredit<number>
  * - position<Vect2>
  * - callback<Function>
  */
  showBossCrocodileWin(params){
    const position = params.position ? params.position : {x: 0, y: 0};

    let textLeft = this.winTextGroup1.getFirstDead(false);
    if(!textLeft){
      textLeft = this.scene.add.sprite(position.x, position.y, 'winFont',"winBomb.png");
      this.winTextGroup1.add(textLeft);
    }
    textLeft
    .setTexture('winFont',"winBomb.png")
    .setAlpha(1)
    .setScale(1.2)
    .setVisible(true)
    .setActive(true)
    .setOrigin(1.2, 0.5)
    .setPosition(position.x, position.y);

    let textRight = this.winTextGroup.getFirstDead(false);
    if(!textRight){
      textRight = this.scene.add.bitmapText(position.x, position.y, 'BonusWinBomb', 0, 25,"center").setOrigin(0.5, 0.5).setCenterAlign();
      this.winTextGroup.add(textRight);
    }
    textRight
    .setVisible(true)
    .setActive(true)
    .setText(params.totalWin ? params.totalWin : 0)
    .setAlpha(1)
    .setScale(1)
    .setFont('BonusWinBomb')
    .setFontSize(30)
    .setOrigin(0, 0.5)
    .setPosition(position.x, position.y);

    this.scene.tweens.add({
      targets: [textLeft, textRight],
      y: position.y-20,
      yoyo: true,
      duration: 500,
      loop: 2,
      onComplete: function(){
        //Fadeout and kill text
        this.scene.tweens.add({targets: [textLeft, textRight], duration: 500, alpha: 0,
          onComplete: function(){
            //kill text
            textLeft.setActive(false).setVisible(false);
            textRight.setActive(false).setVisible(false);
            if(params.player) params.player.updatePlayerTotalCredit(params.totalWin ? params.totalWin : 0);
          },
          callbackScope: this
        });
        //callback 
        if(params.callback && typeof params.callback==='function') params.callback();
      },
      callbackScope: this
    })
  }

  /*
  * Descriotion: after kill boss lantern fish then show total win(for multiplier only)
  * @params
  * - totalCredit<number>
  * - position<Vect2>
  * - callback<Function>
  */
  showBossLanternFishWin(params){
    const position = params.position ? params.position : {x: 0, y: 0};

    let textLeft = this.winTextGroup1.getFirstDead(false);
    if(!textLeft){
      textLeft = this.scene.add.sprite(position.x, position.y, 'winFont',"winBomb.png");
      this.winTextGroup1.add(textLeft);
    }
    textLeft
    .setTexture('winFont',"winBomb.png")
    .setAlpha(1)
    .setScale(1.2)
    .setVisible(true)
    .setActive(true)
    .setOrigin(1.2, 0.5)
    .setPosition(position.x, position.y);

    let textRight = this.winTextGroup.getFirstDead(false);
    if(!textRight){
      textRight = this.scene.add.bitmapText(position.x, position.y, 'BonusWinBomb', 0, 25,"center").setOrigin(0.5, 0.5).setCenterAlign();
      this.winTextGroup.add(textRight);
    }
    textRight
    .setVisible(true)
    .setActive(true)
    .setText(params.totalWin ? params.totalWin : 0)
    .setAlpha(1)
    .setScale(1)
    .setFont('BonusWinBomb')
    .setFontSize(30)
    .setOrigin(0, 0.5)
    .setPosition(position.x, position.y);

    this.scene.tweens.add({
      targets: [textLeft, textRight],
      y: position.y-20,
      yoyo: true,
      duration: 500,
      loop: 2,
      onComplete: function(){
        //Fadeout and kill text
        this.scene.tweens.add({targets: [textLeft, textRight], duration: 500, alpha: 0,
          onComplete: function(){
            //kill text
            textLeft.setActive(false).setVisible(false);
            textRight.setActive(false).setVisible(false);
            if(params.player) params.player.updatePlayerTotalCredit(params.totalWin ? params.totalWin : 0);
          },
          callbackScope: this
        });
        //callback 
        if(params.callback && typeof params.callback==='function') params.callback();
      },
      callbackScope: this
    })
  }
  
  /*
  * Descriotion: after kill octopus then show total win(for multiplier only)
  * @params
  * - totalCredit<number>
  * - position<Vect2>
  * - callback<Function>
  */
  showBossOctopusWin(params){
    const position = params.position ? params.position : {x: 0, y: 0};

    let textLeft = this.winTextGroup1.getFirstDead(false);
    if(!textLeft){
      textLeft = this.scene.add.sprite(position.x, position.y, 'winFont',"winBossCrab.png");
      this.winTextGroup1.add(textLeft);
    }
    textLeft
    .setTexture('winFont',"winBossCrab.png")
    .setAlpha(1)
    .setScale(1)
    .setVisible(true)
    .setActive(true)
    .setOrigin(1.2, 0.5)
    .setPosition(position.x, position.y);

    let textRight = this.winTextGroup.getFirstDead(false);
    if(!textRight){
      textRight = this.scene.add.bitmapText(position.x, position.y, 'BonusWinCold', 0, 25,"center").setOrigin(0.5, 0.5).setCenterAlign();
      this.winTextGroup.add(textRight);
    }
    textRight
    .setVisible(true)
    .setActive(true)
    .setText(params.totalWin ? params.totalWin : 0)
    .setAlpha(1)
    .setScale(1)
    .setFont('BonusWinCold')
    .setFontSize(25)
    .setOrigin(0, 0.5)
    .setPosition(position.x, position.y);

    this.scene.tweens.add({
      targets: [textLeft, textRight],
      y: position.y-20,
      yoyo: true,
      duration: 500,
      loop: 2,
      onComplete: function(){
        //Fadeout and kill text
        this.scene.tweens.add({targets: [textLeft, textRight], duration: 500, alpha: 0,
          onComplete: function(){
            //kill text
            textLeft.setActive(false).setVisible(false);
            textRight.setActive(false).setVisible(false);
            if(params.player) params.player.updatePlayerTotalCredit(params.totalWin ? params.totalWin : 0);
          },
          callbackScope: this
        });
        //callback 
        if(params.callback && typeof params.callback==='function') params.callback();
      },
      callbackScope: this
    })
  }

  /*
  * Descriotion: after kill blue dragon then show total win(for multiplier only)
  * @params
  * - totalCredit<number>
  * - position<Vect2>
  * - callback<Function>
  */
  showBossBlueDragonWin(params){
    const position = params.position ? params.position : {x: 0, y: 0};

    let textLeft = this.winTextGroup1.getFirstDead(false);
    if(!textLeft){
      textLeft = this.scene.add.sprite(position.x, position.y, 'winFont',"winBomb.png");
      this.winTextGroup1.add(textLeft);
    }
    textLeft
    .setTexture('winFont',"winBomb.png")
    .setAlpha(1)
    .setScale(1.2)
    .setVisible(true)
    .setActive(true)
    .setOrigin(1.2, 0.5)
    .setPosition(position.x, position.y);

    let textRight = this.winTextGroup.getFirstDead(false);
    if(!textRight){
      textRight = this.scene.add.bitmapText(position.x, position.y, 'BonusWinBomb', 0, 25,"center").setOrigin(0.5, 0.5).setCenterAlign();
      this.winTextGroup.add(textRight);
    }
    textRight
    .setVisible(true)
    .setActive(true)
    .setFont('BonusWinBomb')
    .setText(params.totalWin ? params.totalWin : 0)
    .setAlpha(1)
    .setScale(1)
    .setFontSize(30)
    .setOrigin(0, 0.5)
    .setPosition(position.x, position.y)
    .setCenterAlign();

    this.scene.tweens.add({
      targets: [textLeft, textRight],
      y: position.y-20,
      yoyo: true,
      duration: 500,
      loop: 2,
      onComplete: function(){
        //Fadeout and kill text
        this.scene.tweens.add({targets: [textLeft, textRight], duration: 500, alpha: 0,
          onComplete: function(){
            //kill text
            textLeft.setActive(false).setVisible(false);
            textRight.setActive(false).setVisible(false);
            if(params.player) params.player.updatePlayerTotalCredit(params.totalWin ? params.totalWin : 0);
          },
          callbackScope: this
        });
        //callback 
        if(params.callback && typeof params.callback==='function') params.callback();
      },
      callbackScope: this
    })
  }


  /*
  * Descriotion: after kill dragon turtle then show total win(for multiplier only)
  * @params
  * - totalCredit<number>
  * - position<Vect2>
  * - callback<Function>
  */
  showBossDragonTurtleWin(params){
    const position = params.position ? params.position : {x: 0, y: 0};

    let textLeft = this.winTextGroup1.getFirstDead(false);
    if(!textLeft){
      textLeft = this.scene.add.sprite(position.x, position.y, 'winFont',"winBomb.png");
      this.winTextGroup1.add(textLeft);
    }
    textLeft
    .setTexture('winFont',"winBomb.png")
    .setAlpha(1)
    .setScale(1.2)
    .setVisible(true)
    .setActive(true)
    .setOrigin(1.2, 0.5)
    .setPosition(position.x, position.y);

    let textRight = this.winTextGroup.getFirstDead(false);
    if(!textRight){
      textRight = this.scene.add.bitmapText(position.x, position.y, 'BonusWinBomb', 0, 25,"center").setOrigin(0.5, 0.5).setCenterAlign();
      this.winTextGroup.add(textRight);
    }
    textRight
    .setVisible(true)
    .setActive(true)
    .setFont('BonusWinBomb')
    .setText(params.totalWin ? params.totalWin : 0)
    .setAlpha(1)
    .setScale(1)
    .setFontSize(30)
    .setOrigin(0, 0.5)
    .setPosition(position.x, position.y)
    .setCenterAlign();

    this.scene.tweens.add({
      targets: [textLeft, textRight],
      y: position.y-20,
      yoyo: true,
      duration: 500,
      loop: 2,
      onComplete: function(){
        //Fadeout and kill text
        this.scene.tweens.add({targets: [textLeft, textRight], duration: 500, alpha: 0,
          onComplete: function(){
            //kill text
            textLeft.setActive(false).setVisible(false);
            textRight.setActive(false).setVisible(false);
            if(params.player) params.player.updatePlayerTotalCredit(params.totalWin ? params.totalWin : 0);
          },
          callbackScope: this
        });
        //callback 
        if(params.callback && typeof params.callback==='function') params.callback();
      },
      callbackScope: this
    })
  }

  /*
  * Descriotion: after kill red dragon then show total win(for multiplier only)
  * @params
  * - totalCredit<number>
  * - position<Vect2>
  * - callback<Function>
  */
  showBossRedDragonWin(params){
    const position = params.position ? params.position : {x: 0, y: 0};

    let textLeft = this.winTextGroup1.getFirstDead(false);
    if(!textLeft){
      textLeft = this.scene.add.sprite(position.x, position.y, 'winFont',"winDrill.png");
      this.winTextGroup1.add(textLeft);
    }
    textLeft
    .setTexture('winFont',"winDrill.png")
    .setAlpha(1)
    .setScale(1.5)
    .setVisible(true)
    .setActive(true)
    .setOrigin(1.2, 0.5)
    .setPosition(position.x, position.y);


    let textRight = this.winTextGroup.getFirstDead(false);
    if(!textRight){
      textRight = this.scene.add.bitmapText(position.x, position.y, 'BonusWinBomb', 0, 25,"center").setOrigin(0.5, 0.5).setCenterAlign();
      this.winTextGroup.add(textRight);
    }
    textRight
    .setVisible(true)
    .setActive(true)
    .setText(params.totalWin ? params.totalWin : 0)
    .setAlpha(1)
    .setScale(1)
    .setFont('BonusWinBomb')
    .setFontSize(35)
    .setOrigin(0, 0.5)
    .setPosition(position.x, position.y);

    this.scene.tweens.add({
      targets: [textLeft, textRight],
      y: position.y-20,
      yoyo: true,
      duration: 500,
      loop: 2,
      onComplete: function(){
        //Fadeout and kill text
        this.scene.tweens.add({targets: [textLeft, textRight], duration: 500, alpha: 0,
          onComplete: function(){
            //kill text
            textLeft.setActive(false).setVisible(false);
            textRight.setActive(false).setVisible(false);
            if(params.player) params.player.updatePlayerTotalCredit(params.totalWin ? params.totalWin : 0);
          },
          callbackScope: this
        });
        //callback 
        if(params.callback && typeof params.callback==='function') params.callback();
      },
      callbackScope: this
    })
  }


  /*
  * description: call this function when you  want to kill all effect sprite(win coin and win text)
  */
  clearAllEffect(){
    this.winTextGroup.getChildren().forEach(function(item){
      item.setActive(false).setVisible(false);
    })
    this.winTextGroup1.getChildren().forEach(function(item){
      item.setActive(false).setVisible(false);
    })
    this.coinGroup.getChildren().forEach(function(item){
      item.setActive(false).setVisible(false);
    })
    this.coinExplodeGroup.getChildren().forEach(function(item){
      item.setActive(false).setVisible(false);
    })
  }
}