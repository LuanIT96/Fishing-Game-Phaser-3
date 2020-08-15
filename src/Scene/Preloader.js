import Config from '../config';
import Audio from '../Class/Audio';

/*VARIABLE*/
let audioExt;

/*Loading*/
var loadingText;

export default class Preloader extends Phaser.Scene {
  constructor(test) {
    super({key:'Preloader'});
  }
  init(){
    audioExt = this.game.device.iOS ? ".m4a" : ".mp3" ;
    this.loadingBg = this.add.sprite(Config.gameCenterX,Config.gameCenterY, 'loading-bg');
    this.loadingBg.setDisplaySize(Config.gameWidth, Config.gameHeight);

    /*:Loading Bar Animations*/
    // this.anims.create({key: 'shine',frames:  [{key: 'loading', frameNames: ['loadingbox00.png', 'loadingbox01.png', 'loadingbox02.png', 'loadingbox03.png', 'loadingbox04.png', 'loadingbox05.png', 'loadingbox06.png', 'loadingbox07.png', 'loadingbox08.png', 'loadingbox09.png', 'loadingbox10.png', 'loadingbox11.png', 'loadingbox12.png', 'loadingbox13.png', 'loadingbox14.png', 'loadingbox15.png', 'loadingbox16.png', 'loadingbox17.png', 'loadingbox18.png']}],frameRate: 19,repeat: -1});
    // this.loadingLightsweep = this.add.sprite(Config.gameCenterX, Config.gameCenterY + 75, 'loading', 'loadingbox00.png');
    // this.loadingLightsweep.setDisplaySize(1001/2*(640/960),152/2*(640/960));
    // this.loadingLightsweep.anims.load('shine');
    // this.loadingLightsweep.anims.play('shine');
    this.loadingText = this.add.bitmapText(Config.gameCenterX, Config.gameCenterY+200, 'arial-white-en', '0%', 30,"center").setCenterAlign().setOrigin(0.5, 0.5);
  }
  preload() {
    //Display loading progress
    this.load.on('progress', this.updateProgressDisplay, this);

    //
    this.load.image('sceneCover', 'assets/sceneCover.jpg');
    this.load.image('logo', 'assets/logo.png');
    this.load.atlas('coin_explode', 'assets/coin_explode.png', 'assets/coin_explode.json');
    this.load.atlas('basegun', 'assets/basegun.png', 'assets/basegun.json');
    this.load.atlas('medal', 'assets/medal.png', 'assets/medal.json');
    this.load.atlas('paytable', 'assets/paytable.png', 'assets/paytable.json');

    //Fish
    this.load.atlas('fish0', 'assets/fish0.png', 'assets/fish0.json');
    this.load.atlas('fish1', 'assets/fish1.png', 'assets/fish1.json');
    this.load.atlas('fish2', 'assets/fish2.png', 'assets/fish2.json');
    this.load.atlas('fish3', 'assets/fish3.png', 'assets/fish3.json');
    this.load.atlas('fish4', 'assets/fish4.png', 'assets/fish4.json');
    this.load.atlas('fish5', 'assets/fish5.png', 'assets/fish5.json');
    this.load.atlas('fish6', 'assets/fish6.png', 'assets/fish6.json');
    this.load.atlas('fish7', 'assets/fish7.png', 'assets/fish7.json');
    this.load.atlas('fish8', 'assets/fish8.png', 'assets/fish8.json');
    this.load.atlas('fish9', 'assets/fish9.png', 'assets/fish9.json');
    this.load.atlas('fish10', 'assets/fish10.png', 'assets/fish10.json');
    
    //Bonus Gun Lazer and Drill
    this.load.atlas('lazerBeam', 'assets/lazerBeam.png', 'assets/lazerBeam.json');
    this.load.atlas('drillBullet', 'assets/drillBullet.png', 'assets/drillBullet.json');

    //Boss Blue dragon
    this.load.multiatlas('dragon_blue', 'assets/dragon_blue.json', 'assets');
    //Boss Red dragon
    this.load.multiatlas('dragon_red', 'assets/dragon_red.json', 'assets');
    //Boss Dragon Turtle
    this.load.multiatlas('dragonTurleWalk', 'assets/dragonTurleWalk.json', 'assets');
    this.load.atlas('dragonTurtleWalkExplode', 'assets/dragonTurtleWalkExplode.png', 'assets/dragonTurtleWalkExplode.json');
    this.load.atlas('fireScene', 'assets/fireScene.png', 'assets/fireScene.json');
    this.load.atlas('fireWall', 'assets/fireWall.png', 'assets/fireWall.json');
    this.load.atlas('dragonTurleRotate', 'assets/dragonTurleRotate.png', 'assets/dragonTurleRotate.json');

    //Effect
    this.load.atlas('electicExplode', 'assets/electicExplode.png', 'assets/electicExplode.json');
    this.load.atlas('bombExplode', 'assets/bombExplode.png', 'assets/bombExplode.json');

    //Physic body
    this.load.json('fish', 'assets/physics/fish.json');

    //Fonts atlas
    this.load.atlas('winFont', 'assets/winFont.png', 'assets/winFont.json');
    this.load.xml('FontCreditXml', 'assets/fonts/FontCredit.fnt');
    this.load.xml('FontBetXml', 'assets/fonts/FontBet.fnt');
    this.load.xml('BlueScoreXml', 'assets/fonts/BlueScore.fnt');
    this.load.xml('BonuScountXml', 'assets/fonts/BonuScount.fnt');
    this.load.xml('BonusCountElectricXml', 'assets/fonts/BonusCountElectric.fnt');
    this.load.xml('BonusMultipleXml', 'assets/fonts/BonusMultiple.fnt');
    this.load.xml('BonusWinBombXml', 'assets/fonts/BonusWinBomb.fnt');
    this.load.xml('BonusWinColdXml', 'assets/fonts/BonusWinCold.fnt');
    this.load.xml('BonusWinDrillXml', 'assets/fonts/BonusWinDrill.fnt');
    this.load.xml('BonusWinElectricXml', 'assets/fonts/BonusWinElectric.fnt');
    this.load.xml('BonusWinHotXml', 'assets/fonts/BonusWinHot.fnt');
    this.load.xml('BonusWinLaserXml', 'assets/fonts/BonusWinLaser.fnt');
    this.load.xml('CountDownXml', 'assets/fonts/CountDown.fnt');
    this.load.xml('CountDownFontXml', 'assets/fonts/CountDownFont.fnt');
    this.load.xml('GoldScoreXml', 'assets/fonts/GoldScore.fnt');
    this.load.xml('GoldWinXml', 'assets/fonts/GoldWin.fnt');
    this.load.xml('PinkScoreXml', 'assets/fonts/PinkScore.fnt');

    //Import audio
    this.load.audio('bg1', 'assets/audio/bg1.mp3');
    this.load.audio('bg2', 'assets/audio/bg2.mp3');
    this.load.audio('bg3', 'assets/audio/bg3.mp3');
    this.load.audio('bgBoss1', 'assets/audio/bgBoss1.mp3');
    this.load.audio('bgBoss2', 'assets/audio/bgBoss2.mp3');
    this.load.audio('btnHome', 'assets/audio/btnHome.mp3');
    this.load.audio('btnInfo', 'assets/audio/btnInfo.mp3');
    this.load.audio('btnMenu', 'assets/audio/btnMenu.mp3');
    this.load.audio('btnMute', 'assets/audio/btnMute.mp3');
    this.load.audio('sceneSwitch', 'assets/audio/sceneSwitch.mp3');

    this.load.audio('gunChange', 'assets/audio/gunChange.mp3');
    this.load.audio('coinIn', 'assets/audio/coinIn.mp3');
    this.load.audio('specialFishWarning', 'assets/audio/specialFishWarning.mp3');
    this.load.audio('bonusWin1', 'assets/audio/bonusWin1.mp3');
    this.load.audio('bonusWin2', 'assets/audio/bonusWin2.mp3');
    this.load.audio('bonusWin3', 'assets/audio/bonusWin3.mp3');
    
    this.load.audio('bulletShoot', 'assets/audio/bulletShoot.mp3');
    this.load.audio('electricFire', 'assets/audio/electricFire.mp3');
    this.load.audio('lazeBeamPrepare', 'assets/audio/lazeBeamPrepare.mp3');
    this.load.audio('lazerBeamFire', 'assets/audio/lazerBeamFire.mp3');
    this.load.audio('lazerBeamShow', 'assets/audio/lazerBeamShow.mp3');
    this.load.audio('drillHitBound', 'assets/audio/drillHitBound.mp3');
    this.load.audio('drillReady', 'assets/audio/drillReady.mp3');
    this.load.audio('drillShoot', 'assets/audio/drillShoot.mp3');
    this.load.audio('drillUncon', 'assets/audio/drillUncon.mp3');
    this.load.audio('drillTitle', 'assets/audio/drillTitle.mp3');
    this.load.audio('drillShow', 'assets/audio/drillShow.mp3');    
    this.load.audio('killCrabBoom', 'assets/audio/killCrabBoom.mp3');
    this.load.audio('bombExplode', 'assets/audio/bombExplode.mp3');
    this.load.audio('bombExplode1', 'assets/audio/bombExplode1.mp3');
    this.load.audio('boombRadius', 'assets/audio/boombRadius.mp3');

    this.load.audio('wheelforward', 'assets/audio/wheelforward.mp3');
    this.load.audio('wheelgolden', 'assets/audio/wheelgolden.mp3');
    this.load.audio('wheelmax', 'assets/audio/wheelmax.mp3');
    this.load.audio('wheelroll1', 'assets/audio/wheelroll1.mp3');
    this.load.audio('wheelscore', 'assets/audio/wheelscore.mp3');
    this.load.audio('wheelstop', 'assets/audio/wheelstop.mp3');
    
    this.load.audio('killBoss', 'assets/audio/killBoss.mp3');
    this.load.audio('killBossRepeat', 'assets/audio/killBossRepeat.mp3');
    this.load.audio('killBossRepeatFinish', 'assets/audio/killBossRepeatFinish.mp3');
    this.load.audio('killBossMultipleX1', 'assets/audio/killBossMultipleX1.mp3');
    this.load.audio('killBossMultipleX2', 'assets/audio/killBossMultipleX2.mp3');
    this.load.audio('killBossMultipleX3', 'assets/audio/killBossMultipleX3.mp3');
    this.load.audio('killBossMultipleX4', 'assets/audio/killBossMultipleX4.mp3');
    this.load.audio('killBossMultipleX5', 'assets/audio/killBossMultipleX5.mp3');
    this.load.audio('killBossMultipleX6', 'assets/audio/killBossMultipleX6.mp3');
    this.load.audio('killBossMultipleX7', 'assets/audio/killBossMultipleX7.mp3');
    this.load.audio('killBossMultipleX8', 'assets/audio/killBossMultipleX8.mp3');
    this.load.audio('killBossMultipleX9', 'assets/audio/killBossMultipleX9.mp3');
    this.load.audio('killWhale1', 'assets/audio/killWhale1.mp3');
    this.load.audio('killWhale2', 'assets/audio/killWhale2.mp3');
    this.load.audio('whaleCatch', 'assets/audio/whaleCatch.mp3');
    this.load.audio('whaleCount1', 'assets/audio/whaleCount1.mp3');
    this.load.audio('whaleCount2', 'assets/audio/whaleCount2.mp3');
    this.load.audio('whaleCount3', 'assets/audio/whaleCount3.mp3');
    this.load.audio('whaleCount1_1', 'assets/audio/whaleCount1_1.mp3');
    this.load.audio('whaleCount2_1', 'assets/audio/whaleCount2_1.mp3');
    this.load.audio('whaleCount3_1', 'assets/audio/whaleCount3_1.mp3');
    
    this.load.audio('coinjump1', 'assets/audio/coinjump1.mp3');
    this.load.audio('coinjump2', 'assets/audio/coinjump2.mp3');
    this.load.audio('coinjump3', 'assets/audio/coinjump3.mp3');

    this.load.audio('crystalMove', 'assets/audio/crystalMove.mp3');
    this.load.audio('DragonTurtleIn', 'assets/audio/DragonTurtleIn.mp3');
    this.load.audio('dragonTurtleStep', 'assets/audio/dragonTurtleStep.mp3');
    this.load.audio('bossOctopusDie', 'assets/audio/bossOctopusDie.mp3');
    this.load.audio('bossMonsterDie', 'assets/audio/bossMonsterDie.mp3');
    this.load.audio('bossDragonDie', 'assets/audio/bossDragonDie.mp3');
    this.load.audio('bossCrocodileDie', 'assets/audio/bossCrocodileDie.mp3');
    this.load.audio('bossCrocodileAttact', 'assets/audio/bossCrocodileAttact.mp3');
    this.load.audio('bossCrabDie', 'assets/audio/bossCrabDie.mp3');

    this.load.audio('bossKilledAddScore', 'assets/audio/bossKilledAddScore.mp3');
    this.load.audio('redDragonRepeat', 'assets/audio/redDragonRepeat.mp3');
    this.load.audio('redDragonOut', 'assets/audio/redDragonOut.mp3');
    this.load.audio('blueDragonExplode', 'assets/audio/blueDragonExplode.mp3');
    this.load.audio('blueDragonExplodeEnd', 'assets/audio/blueDragonExplodeEnd.mp3');
    this.load.audio('blueDragonRepeat', 'assets/audio/blueDragonRepeat.mp3');
    this.load.audio('blueDragonOut', 'assets/audio/blueDragonOut.mp3');
  }

  create() {
    Phaser.GameObjects.BitmapText.ParseFromAtlas(this, 'FontCredit', 'basegun', 'FontCredit.png', 'FontCreditXml');
    Phaser.GameObjects.BitmapText.ParseFromAtlas(this, 'FontBet', 'basegun', 'FontBet.png', 'FontBetXml');
    Phaser.GameObjects.BitmapText.ParseFromAtlas(this, 'BlueScore', 'winFont', 'BlueScore.png', 'BlueScoreXml');
    Phaser.GameObjects.BitmapText.ParseFromAtlas(this, 'BonuScount', 'winFont', 'BonusCount.png', 'BonuScountXml');
    Phaser.GameObjects.BitmapText.ParseFromAtlas(this, 'BonusCountElectric', 'winFont', 'BonusCountElectric.png', 'BonusCountElectricXml');
    Phaser.GameObjects.BitmapText.ParseFromAtlas(this, 'BonusMultiple', 'winFont', 'BonusMultiple.png', 'BonusMultipleXml');
    Phaser.GameObjects.BitmapText.ParseFromAtlas(this, 'BonusWinBomb', 'winFont', 'BonusWinbomb.png', 'BonusWinBombXml');
    Phaser.GameObjects.BitmapText.ParseFromAtlas(this, 'BonusWinCold', 'winFont', 'BonusWincold.png', 'BonusWinColdXml');
    Phaser.GameObjects.BitmapText.ParseFromAtlas(this, 'BonusWinDrill', 'winFont', 'BonusWinDrill.png', 'BonusWinDrillXml');
    Phaser.GameObjects.BitmapText.ParseFromAtlas(this, 'BonusWinElectric', 'winFont', 'BonusWinelEctric.png', 'BonusWinElectricXml');
    Phaser.GameObjects.BitmapText.ParseFromAtlas(this, 'BonusWinHot', 'winFont', 'BonusWinHot.png', 'BonusWinHotXml');
    Phaser.GameObjects.BitmapText.ParseFromAtlas(this, 'BonusWinLaser', 'winFont', 'BonusWinLaser.png', 'BonusWinLaserXml');
    Phaser.GameObjects.BitmapText.ParseFromAtlas(this, 'CountDown', 'winFont', 'CountDown.png', 'CountDownXml');
    Phaser.GameObjects.BitmapText.ParseFromAtlas(this, 'CountDownFont', 'winFont', 'CountDownFont.png', 'CountDownFontXml');
    Phaser.GameObjects.BitmapText.ParseFromAtlas(this, 'GoldScore', 'winFont', 'GoldScore.png', 'GoldScoreXml');
    Phaser.GameObjects.BitmapText.ParseFromAtlas(this, 'GoldWin', 'winFont', 'GoldWin.png', 'GoldWinXml');
    Phaser.GameObjects.BitmapText.ParseFromAtlas(this, 'PinkScore', 'winFont', 'PinkScore.png', 'PinkScoreXml');
    
    /*Fish Animation*/
    this.anims.create({key: 'fish0_swim', frames: this.anims.generateFrameNames('fish0', {start: 1, end: 20, prefix: 'fish0_swim_', suffix: '.png'}), frameRate: 10, repeat: -1});
    this.anims.create({key: 'fish0_die', frames: this.anims.generateFrameNames('fish0', {start: 1, end: 8, prefix: 'fish0_die_', suffix: '.png'}), frameRate: 12, repeat: 4});

    this.anims.create({key: 'fish1_swim', frames: this.anims.generateFrameNames('fish0', {start: 1, end: 13, prefix: 'fish1_swim_', suffix: '.png'}), frameRate: 10, repeat: -1});
    this.anims.create({key: 'fish1_die', frames: this.anims.generateFrameNames('fish0', {start: 1, end: 4, prefix: 'fish1_die_', suffix: '.png'}), frameRate: 12, repeat: 46});

    this.anims.create({key: 'fish2_swim', frames: this.anims.generateFrameNames('fish0', {start: 1, end: 30, prefix: 'fish2_swim_', suffix: '.png'}), frameRate: 10, repeat: -1});
    this.anims.create({key: 'fish2_die', frames: this.anims.generateFrameNames('fish0', {start: 1, end: 8, prefix: 'fish2_die_', suffix: '.png'}), frameRate: 12, repeat: 3});

    this.anims.create({key: 'fish3_swim', frames: this.anims.generateFrameNames('fish0', {start: 1, end: 30, prefix: 'fish3_swim_', suffix: '.png'}), frameRate: 10, repeat: -1});
    this.anims.create({key: 'fish3_die', frames: this.anims.generateFrameNames('fish0', {start: 1, end: 5, prefix: 'fish3_die_', suffix: '.png'}), frameRate: 12, repeat: 4});

    this.anims.create({key: 'fish4_swim', frames: this.anims.generateFrameNames('fish0', {start: 1, end: 23, prefix: 'fish4_swim_', suffix: '.png'}), frameRate: 10, repeat: -1});
    this.anims.create({key: 'fish4_die', frames: this.anims.generateFrameNames('fish0', {start: 1, end: 5, prefix: 'fish4_die_', suffix: '.png'}), frameRate: 12, repeat: 4});

    this.anims.create({key: 'fish5_wink', frames: this.anims.generateFrameNames('fish1', {start: 1, end: 12, prefix: 'fish5_swim_', suffix: '.png'}), frameRate: 10});
    this.anims.create({key: 'fish5_swim', frames: this.anims.generateFrameNames('fish1', {start: 13, end: 30, prefix: 'fish5_swim_', suffix: '.png'}), frameRate: 10, repeat: -1});
    this.anims.create({key: 'fish5_die', frames: this.anims.generateFrameNames('fish1', {start: 1, end: 13, prefix: 'fish5_die_', suffix: '.png'}), frameRate: 12, repeat: 3});

    this.anims.create({key: 'fish6_swim', frames: this.anims.generateFrameNames('fish1', {start: 1, end: 15, prefix: 'fish6_swim_', suffix: '.png'}), frameRate: 10, repeat: -1});
    this.anims.create({key: 'fish6_die', frames: this.anims.generateFrameNames('fish1', {start: 1, end: 4, prefix: 'fish6_die_', suffix: '.png'}), frameRate: 12, repeat: 3});

    this.anims.create({key: 'fish7_swim', frames: this.anims.generateFrameNames('fish1', {start: 1, end: 27, prefix: 'fish7_swim_', suffix: '.png'}), frameRate: 10, repeat: -1});
    this.anims.create({key: 'fish7_die', frames: this.anims.generateFrameNames('fish1', {start: 1, end: 9, prefix: 'fish7_die_', suffix: '.png'}), frameRate: 12, repeat: 3});

    this.anims.create({key: 'fish8_swim', frames: this.anims.generateFrameNames('fish1', {start: 1, end: 25, prefix: 'fish8_swim_', suffix: '.png'}), frameRate: 10, repeat: -1});
    this.anims.create({key: 'fish8_die', frames: this.anims.generateFrameNames('fish1', {start: 1, end: 10, prefix: 'fish8_die_', suffix: '.png'}), frameRate: 12, repeat: 3});

    this.anims.create({key: 'fish9_swim', frames: this.anims.generateFrameNames('fish1', {start: 1, end: 30, prefix: 'fish9_swim_', suffix: '.png'}), frameRate: 10, repeat: -1});
    this.anims.create({key: 'fish9_die', frames: this.anims.generateFrameNames('fish1', {start: 1, end: 30, prefix: 'fish9_die_', suffix: '.png'}), frameRate: 12, repeat: 3});

    this.anims.create({key: 'fish10_swim', frames: this.anims.generateFrameNames('fish1', {start: 1, end: 30, prefix: 'fish10_swim_', suffix: '.png'}), frameRate: 10, repeat: -1});
    this.anims.create({key: 'fish10_die', frames: this.anims.generateFrameNames('fish1', {start: 1, end: 9, prefix: 'fish10_die_', suffix: '.png'}), frameRate: 12, repeat: 3});

    this.anims.create({key: 'fish11_swim', frames: this.anims.generateFrameNames('fish1', {start: 1, end: 20, prefix: 'fish11_swim_', suffix: '.png'}), frameRate: 10, repeat: -1});
    this.anims.create({key: 'fish11_die', frames: this.anims.generateFrameNames('fish1', {start: 1, end: 15, prefix: 'fish11_die_', suffix: '.png'}), frameRate: 12, repeat: 3});

    this.anims.create({key: 'fish12_swim', frames: this.anims.generateFrameNames('fish1', {start: 1, end: 30, prefix: 'fish12_swim_', suffix: '.png'}), frameRate: 10, repeat: -1});
    this.anims.create({key: 'fish12_die', frames: this.anims.generateFrameNames('fish1', {start: 1, end: 5, prefix: 'fish12_die_', suffix: '.png'}), frameRate: 10, repeat: 3});

    this.anims.create({key: 'fish13_swim', frames: this.anims.generateFrameNames('fish2', {start: 1, end: 15, prefix: 'fish13_swim_', suffix: '.png'}), frameRate: 10, repeat: -1});
    this.anims.create({key: 'fish13_die', frames: this.anims.generateFrameNames('fish2', {start: 1, end: 5, prefix: 'fish13_die_', suffix: '.png'}), frameRate: 10, repeat: -1});

    this.anims.create({key: 'fish14_swim', frames: this.anims.generateFrameNames('fish2', {start: 1, end: 30, prefix: 'fish14_swim_', suffix: '.png'}), frameRate: 12,repeat: -1});
    this.anims.create({key: 'fish14_die', frames: this.anims.generateFrameNames('fish2', {start: 1, end: 8, prefix: 'fish14_die_', suffix: '.png'}), frameRate: 10, repeat: -1});

    this.anims.create({key: 'fish15_swim', frames: this.anims.generateFrameNames('fish2', {start: 1, end: 20, prefix: 'fish15_swim_', suffix: '.png'}), frameRate: 12, repeat: -1});
    this.anims.create({key: 'fish15_die', frames: this.anims.generateFrameNames('fish2', {start: 1, end: 8, prefix: 'fish15_die_', suffix: '.png'}), frameRate: 10, repeat: -1});

    this.anims.create({key: 'fish16_swim', frames: this.anims.generateFrameNames('fish3', {start: 1, end: 35, prefix: 'fish16_swim_', suffix: '.png'}), frameRate: 16, repeat: -1});
    this.anims.create({key: 'fish16_die', frames: this.anims.generateFrameNames('fish3', {start: 1, end: 8, prefix: 'fish16_die_', suffix: '.png'}), frameRate: 10, repeat: -1});

    this.anims.create({key: 'fish17_swim', frames: this.anims.generateFrameNames('fish3', {start: 1, end: 40, prefix: 'fish17_swim_', suffix: '.png'}), frameRate: 12, repeat: -1});
    this.anims.create({key: 'fish17_die', frames: this.anims.generateFrameNames('fish3', {start: 1, end: 8, prefix: 'fish17_die_', suffix: '.png'}), frameRate: 10, repeat: -1});

    this.anims.create({key: 'fish18_swim', frames: this.anims.generateFrameNames('fish4', {start: 1, end: 30, prefix: 'fish18_swim_', suffix: '.png'}), frameRate: 20, repeat: -1});
    this.anims.create({key: 'fish18_die', frames: this.anims.generateFrameNames('fish4', {start: 1, end: 10, prefix: 'fish18_die_', suffix: '.png'}), frameRate: 10, repeat: -1});

    this.anims.create({key: 'fish19_swim', frames: this.anims.generateFrameNames('fish4', {start: 1, end: 53, prefix: 'fish19_swim_', suffix: '.png'}), frameRate: 20, repeat: -1});
    this.anims.create({key: 'fish19_die', frames: this.anims.generateFrameNames('fish4', {start: 1, end: 20, prefix: 'fish19_die_', suffix: '.png'}), frameRate: 15, repeat: -1});

    this.anims.create({key: 'fish20_swim', frames: this.anims.generateFrameNames('fish5', {start: 1, end: 40, prefix: 'fish20_swim_', suffix: '.png'}), frameRate: 15, repeat: -1});
    this.anims.create({key: 'fish20_die', frames: this.anims.generateFrameNames('fish5', {start: 1, end: 10, prefix: 'fish20_die_', suffix: '.png'}), frameRate: 10, repeat: -1});

    this.anims.create({key: 'fish21_swim', frames: this.anims.generateFrameNames('fish6', {start: 1, end: 50, prefix: 'fish21_swim_', suffix: '.png'}), frameRate: 40, repeat: -1});
    this.anims.create({key: 'fish21_die', frames: this.anims.generateFrameNames('fish6', {start: 1, end: 15, prefix: 'fish21_die_', suffix: '.png'}), frameRate: 10, repeat: -1});

    this.anims.create({key: 'fish22_swim', frames: this.anims.generateFrameNames('fish7', {start: 1, end: 32, prefix: 'fish22_swim_', suffix: '.png'}), frameRate: 15, repeat: -1});
    this.anims.create({key: 'fish22_die', frames: this.anims.generateFrameNames('fish7', {start: 1, end: 10, prefix: 'fish22_die_', suffix: '.png'}), frameRate: 10, repeat: -1});

    this.anims.create({key: 'fish23_swim', frames: this.anims.generateFrameNames('fish8', {start: 1, end: 80, prefix: 'fish23_swim_', suffix: '.png'}), frameRate: 15, repeat: -1});
    this.anims.create({key: 'fish23_die', frames: this.anims.generateFrameNames('fish8', {start: 1, end: 15, prefix: 'fish23_die_', suffix: '.png'}), frameRate: 10, repeat: -1});
    
    /*Special Fish Animation*/
    this.anims.create({key: 'fish24_swim', frames: this.anims.generateFrameNames('fish9', {start: 30, end: 1, prefix: 'fish24_swim_', suffix: '.png'}), frameRate: 20, repeat: -1});
    this.anims.create({key: 'fish24_die', frames: this.anims.generateFrameNames('fish9', {start: 1, end: 45, prefix: 'fish24_die_', suffix: '.png'}), frameRate: 12, repeat: -1});

    this.anims.create({key: 'fish25_swim', frames: this.anims.generateFrameNames('fish9', {start: 5, end: 1, prefix: 'fish25_swim_', suffix: '.png'}), frameRate: 10, repeat: -1});
    this.anims.create({key: 'fish25_die', frames: this.anims.generateFrameNames('fish9', {start: 1, end: 15, prefix: 'fish25_die_', suffix: '.png'}), frameRate: 15, repeat: -1});

    this.anims.create({key: 'fish26_swim', frames: this.anims.generateFrameNames('fish9', {start: 8, end: 1, prefix: 'fish26_swim_', suffix: '.png'}), frameRate: 10, repeat: -1});
    this.anims.create({key: 'fish26_die', frames: this.anims.generateFrameNames('fish9', {start: 8, end: 1, prefix: 'fish26_swim_', suffix: '.png'}), frameRate: 18, repeat: 5});

    this.anims.create({key: 'fish27_swim', frames: this.anims.generateFrameNames('fish9', {start: 1, end: 13, prefix: 'fish27_swim_', suffix: '.png'}), frameRate: 15, repeat: -1});
    this.anims.create({key: 'fish27_die', frames: this.anims.generateFrameNames('fish9', {start: 1, end: 13, prefix: 'fish27_swim_', suffix: '.png'}), frameRate: 50, repeat: 5});

    this.anims.create({key: 'fish28_swim', frames: this.anims.generateFrameNames('fish9', {start: 15, end: 1, prefix: 'fish28_swim_', suffix: '.png'}), frameRate: 10, repeat: -1});
    this.anims.create({key: 'fish28_die', frames: this.anims.generateFrameNames('fish9', {start: 15, end: 1, prefix: 'fish28_swim_', suffix: '.png'}), frameRate: 18, repeat: 5});

    /*Jelly*/
    this.anims.create({key: 'fish29_swim', frames: this.anims.generateFrameNames('fish10', {start: 1, end: 30, prefix: 'fish29_swim_', suffix: '.png'}), frameRate: 10, repeat: -1});
    this.anims.create({key: 'fish29_die', frames: this.anims.generateFrameNames('fish10', {start: 1, end: 30, prefix: 'fish29_swim_', suffix: '.png'}), frameRate: 18, repeat: 1});

    /*Gun Animation*/
    this.anims.create({key: 'basegun1', frames: this.anims.generateFrameNames('basegun', {start: 1, end: 5, prefix: 'base1_', suffix: '.png'}), frameRate: 10, repeat: -1});
    this.anims.create({key: 'basegun1_super', frames: this.anims.generateFrameNames('basegun', {start: 6, end: 15, prefix: 'base1_', suffix: '.png'}), frameRate: 10, repeat: -1});
    this.anims.create({key: 'basegun2', frames: this.anims.generateFrameNames('basegun', {start: 1, end: 15, prefix: 'base2_', suffix: '.png'}), frameRate: 15, repeat: -1});
    this.anims.create({key: 'gun1_rotate', frames: this.anims.generateFrameNames('basegun', {start: 12, end: 27, prefix: 'gun1_', suffix: '.png'}), frameRate: 20, repeat: -1});
    this.anims.create({key: 'gun1_fire', frames: this.anims.generateFrameNames('basegun', {start: 1, end: 12, prefix: 'gun1_', suffix: '.png'}), frameRate: 50});
    this.anims.create({key: 'gun2_fire', frames: this.anims.generateFrameNames('basegun', {start: 1, end: 10, prefix: 'gun2_', suffix: '.png'}), frameRate: 50});
    this.anims.create({key: 'gun3_fire', frames: this.anims.generateFrameNames('basegun', {start: 1, end: 10, prefix: 'gun3_', suffix: '.png'}), frameRate: 20, repeat: -1});
    this.anims.create({key: 'bullet_electric', frames: this.anims.generateFrameNames('basegun', {start: 1, end: 6, prefix: 'electric_line_', suffix: '.png'}), frameRate: 21, repeat: 1, showOnStart: true, hideOnComplete: true});
    this.anims.create({key: 'bullet_explode', frames: this.anims.generateFrameNames('basegun', {start: 1, end: 3, prefix: 'electric_explode_', suffix: '.png'}), frameRate: 12, repeat: -1, showOnStart: true});
    this.anims.create({key: 'bullet1_explode', frames: this.anims.generateFrameNames('basegun', {start: 1, end: 7, prefix: 'bullet_explode_', suffix: '.png'}), frameRate: 12, showOnStart: true, hideOnComplete: true});
    this.anims.create({key: 'beam_gun', frames: this.anims.generateFrameNames('lazerBeam', {start: 1, end: 10, prefix: 'beam_gun_', suffix: '.png'}), frameRate: 12, repeat: -1});
    this.anims.create({key: 'beam_gun_fire', frames: this.anims.generateFrameNames('lazerBeam', {start: 1, end: 18, prefix: 'beam_fire_', suffix: '.png'}), frameRate: 20});
    this.anims.create({key: 'beam_fire', frames: this.anims.generateFrameNames('lazerBeam', {start: 1, end: 40, prefix: 'beam_', suffix: '.png'}), frameRate: 12, showOnStart: true, hideOnComplete: true});
    
    this.anims.create({key: 'drill_gun', frames: this.anims.generateFrameNames('drillBullet', {start: 1, end: 20, prefix: 'drill_base_', suffix: '.png'}), frameRate: 20, repeat: -1});
    this.anims.create({key: 'drill_bullet_fire', frames: this.anims.generateFrameNames('drillBullet', {start: 1, end: 15,  prefix: 'drill', suffix: '.png'}),  frameRate: 20, repeat: -1});
    this.anims.create({key: 'drill_bullet_explode_prepare', frames: this.anims.generateFrameNames('drillBullet', {start: 1, end: 4,  prefix: 'drill_explode_', suffix: '.png'}),  frameRate: 15, repeat: -1});
    this.anims.create({key: 'drill_hit', frames: this.anims.generateFrameNames('drillBullet', {start: 1, end: 6,  prefix: 'drill_hit_', suffix: '.png'}),  frameRate: 10, showOnStart: true, hideOnComplete: true});
    this.anims.create({key: 'drillFollower', frames: this.anims.generateFrameNames('drillBullet', {start: 1, end: 45,  prefix: 'disp_', suffix: '.png'}),  frameRate: 45, repeat: 0, showOnStart: true, hideOnComplete: true});

    //coin animation
    this.anims.create({key: 'coinSilver', frames: this.anims.generateFrameNames('winFont', {start: 1, end: 8, prefix: 'coinSilver', suffix: '.png'}), frameRate: 10, repeat: -1});
    this.anims.create({key: 'coinGold', frames: this.anims.generateFrameNames('winFont', {start: 1, end: 8, prefix: 'coinGold', suffix: '.png'}), frameRate: 10, repeat: -1});
    this.anims.create({key: 'coinExplode', frames: this.anims.generateFrameNames('winFont', {start: 1, end: 21, prefix: 'coin_exlode_', suffix: '.png'}), frameRate: 14, hideOnComplete: true, showOnStart: true});
     
    //medal when kill boss
    this.anims.create({key: 'coin_explode', frames: this.anims.generateFrameNames('coin_explode', {start: 1, end: 21, prefix: 'coin_exlode_', suffix: '.png'}), frameRate: 10, hideOnComplete: true, showOnStart: true});
    this.anims.create({key: 'medal_dragonTurtle', frames: this.anims.generateFrameNames('medal', {start: 1, end: 15, prefix: 'unicorn_medal_', suffix: '.png'}), frameRate: 10, repeat: -1});
    this.anims.create({key: 'medal_explode', frames: this.anims.generateFrameNames('medal', {start: 1, end: 15, prefix: 'medalExplode', suffix: '.png'}), frameRate: 10, showOnStart: true});
    this.anims.create({key: 'medal_explode_single', frames: this.anims.generateFrameNames('medal', {start: 1, end: 15, prefix: 'medalExplode', suffix: '.png'}), frameRate: 10, showOnStart: true});

    this.anims.create({key: 'electicKillExplode', frames: this.anims.generateFrameNames('electicExplode', {start: 1, end: 13, prefix: 'killExplode', suffix: '.png'}), frameRate: 10, showOnStart: true, hideOnComplete: true});
    this.anims.create({key: 'electicExplode', frames: this.anims.generateFrameNames('electicExplode', {start: 1, end: 9, prefix: 'electricExplode', suffix: '.png'}), frameRate: 14, showOnStart: true, hideOnComplete: true});
    this.anims.create({key: 'bombExplode', frames: this.anims.generateFrameNames('bombExplode', {start: 1, end: 13, prefix: 'boomExplode', suffix: '.png'}), frameRate: 13, showOnStart: true, hideOnComplete: true});

    /*Boss Dragon Turtle Animation*/
    this.anims.create({key: 'dragonTurtleRotateIn', frames: this.anims.generateFrameNames('dragonTurleWalk', {start: 1, end: 3,  prefix: 'dragonTurtleIn', suffix: '.png'}),  frameRate: 13, repeat: -1});
    this.anims.create({key: 'dragonTurtleCome', frames: this.anims.generateFrameNames('dragonTurleWalk', {start: 1, end: 21,  prefix: 'dragonTurtleIn', suffix: '.png'}),  frameRate: 10});
    this.anims.create({key: 'fish32_swim', frames: this.anims.generateFrameNames('dragonTurleWalk', {start: 1, end: 39,  prefix: 'dragonTurleWalk', suffix: '.png'}),  frameRate: 13, repeat: -1});
    this.anims.create({key: 'dragonTurtleWalkExplode', frames: this.anims.generateFrameNames('dragonTurtleWalkExplode', {start: 1, end: 8,  prefix: 'walkExplode', suffix: '.png'}),  frameRate: 10, hideOnComplete: true, showOnStart: true});
    this.anims.create({key: 'dragonTurtleRotateDie', frames: this.anims.generateFrameNames('dragonTurleRotate', {start: 1, end: 9,  prefix: 'rotateDie', suffix: '.png'}),  frameRate: 18, repeat: -1});
    this.anims.create({key: 'dragonTurtleRotateExplode', frames: this.anims.generateFrameNames('dragonTurleRotate', {start: 1, end: 15,  prefix: 'dragonTurtleRotate', suffix: '.png'}),  frameRate: 10});
    this.anims.create({key: 'fireWallLeft', frames: this.anims.generateFrameNames('fireWall', {start: 1, end: 11, prefix: 'wallLeft', suffix: '.png'}), frameRate: 10, repeat: 3, hideOnComplete: true, showOnStart: true});
    this.anims.create({key: 'fireWallRight', frames: this.anims.generateFrameNames('fireWall',{start: 1, end: 11, prefix: 'wallRight', suffix: '.png'}), frameRate: 10,  repeat: 3, hideOnComplete: true, showOnStart: true});
    this.anims.create({key: 'fireWallTop', frames: this.anims.generateFrameNames('fireWall', {start: 1, end: 11, prefix: 'wallTop', suffix: '.png'}), frameRate: 10, repeat: 3,hideOnComplete: true, showOnStart: true});
    this.anims.create({key: 'fireWallBottom', frames: this.anims.generateFrameNames('fireWall', {start: 1, end: 11, prefix: 'wallBottom', suffix: '.png'}), frameRate: 10, repeat: 3, hideOnComplete: true, showOnStart: true});
    this.anims.create({key: 'fireSceneExplode', frames: this.anims.generateFrameNames('fireScene', {start: 1, end: 18, prefix: 'fireSceneExplode', suffix: '.png'}), frameRate: 10, showOnStart: true, hideOnComplete: true});

    //Boss Blue Dragon
    this.anims.create({key: 'electricCircle', frames: this.anims.generateFrameNames('electicExplode', {start: 1, end: 20, prefix: 'electricCircle', suffix: '.png'}), frameRate: 10, repeat: -1, showOnStart: true});
    this.anims.create({key: 'fish31_swim', frames: this.anims.generateFrameNames('dragon_blue', {start: 1, end: 60, suffix: 'dragonBlue.png'}), frameRate: 14, showOnStart: true, hideOnComplete: true});
    this.anims.create({key: 'fish31_swim_fast', frames: this.anims.generateFrameNames('dragon_blue', {start: 1, end: 60, suffix: 'dragonBlue.png'}), frameRate: 36, showOnStart: true, hideOnComplete: true});

    /*Boss Red Dragon*/
    this.anims.create({key: 'fish30_swim', frames: this.anims.generateFrameNames('dragon_red', {start: 1, end: 60, suffix: 'redDragon.png'}), frameRate: 14, showOnStart: true, hideOnComplete: true});
    this.anims.create({key: 'fish30_swim_fast', frames: this.anims.generateFrameNames('dragon_red', {start: 1, end: 60, suffix: 'redDragon.png'}), frameRate: 36, showOnStart: true, hideOnComplete: true});
    this.anims.create({key: 'redDragonFireBall', frames: this.anims.generateFrameNames('bombExplode', {start: 1, end: 15, prefix: 'redDragonFireBall', suffix: '.png'}), frameRate: 10, repeat: -1, showOnStart: true});
    this.anims.create({key: 'redDragon', frames: this.anims.generateFrameNames('medal', {start: 1, end: 20, prefix: 'redDragon', suffix: '.png'}), frameRate: 10, repeat: -1, showOnStart: true});

    //Boss Crab
    this.anims.create({key: 'bossCrabMedal', frames: this.anims.generateFrameNames('medal', {start: 1, end: 15, prefix: 'medal_crab_', suffix: '.png'}), frameRate: 10, repeat: -1, showOnStart: true});
    //Boss Crocodie
    this.anims.create({key: 'bossCrocodileMedal', frames: this.anims.generateFrameNames('medal', {start: 1, end: 15, prefix: 'medal_crocodile_', suffix: '.png'}), frameRate: 10, repeat: -1, showOnStart: true});

    //Boss LanternFish
    this.anims.create({key: 'bossLanternMedal', frames: this.anims.generateFrameNames('medal', {start: 1, end: 15, prefix: 'medal_monster_', suffix: '.png'}), frameRate: 10, repeat: -1, showOnStart: true});

    //Boss LanternFish
    this.anims.create({key: 'bossOctopusMedal', frames: this.anims.generateFrameNames('medal', {start: 1, end: 15, prefix: 'medal_octopus_', suffix: '.png'}), frameRate: 10, repeat: -1, showOnStart: true});
    
    //Hide Loading Bar
    // this.loadingBg.destroy();
    // this.loadingLightsweep.destroy();
    this.loadingText.destroy();
    // this.anims.remove('shine');

    /*LOADING SCREEN*/
    this.load.off('progress', this.updateProgressDisplay, this);

    //Switch To Game State=> can random in [Crab, Crocodile, Monster, Octopus]
    this.game.gameAudio = new Audio(this);
    // this.socketData();
    this.importAudio();

    //Main Player Object
    this.game.mainPlayerConfig ={
      position: Phaser.Math.Between(0, 1), // random position at bottom for main player
      credit: 1000000000,// need to request socket and get player credit
      firstimeConnect: true,//if true => show the focus circle
      cannon: 1, //default cannnon number
      betIndex: 0, // index of bet in array bet betConfig.options, default is min bet 
      currency: 'VND' // have to request and get player currency
    };
    //get global config for BOT follow main player currency
    this.game.betConfig = Config.betConfigs.find(x => x.currency === this.game.mainPlayerConfig.currency).options;
    let state = ['Crab', 'Crocodile', 'Monster', 'Octopus'];
    this.scene.switch(state[Phaser.Math.Between(0, 3)]);//random first scene
    // this.scene.switch('Monster');
  }
   socketData(){
    this.game.socket.onmessage = function (messageResponse) {
      let message = JSON.parse(messageResponse.data);
      console.log('socketData');
      // this.scene.manager.getScene('Octopus').socketListen(message);
      
    }.bind(this);
    this.game.socket.onclose = function () {
      // socket = null;
    }.bind(this);
    this.game.socket.onopen = function (event) {
      this.game.socket.send(JSON.stringify({join: true}))
    }.bind(this);
    
  }
  importAudio(){
    this.game.gameAudio.loadCustomAudio([
      'bulletShoot',
      'sceneSwitch',
      'electricFire',
      'bg1',
      'bg2',
      'bg3',
      'bgBoss1',
      'bgBoss2',
      'btnHome',
      'btnInfo',
      'btnMenu',
      'btnMute',
      'bonusWin1',
      'bonusWin2',
      'bonusWin3',
      'lazerBeamShow',
      'lazeBeamPrepare',
      'lazerBeamFire',
      'drillHitBound',
      'drillReady',
      'drillShoot',
      'drillUncon',
      'bombExplode',
      'bombExplode1',
      'boombRadius',
      'killCrabBoom',
      'drillTitle',
      'drillShow',
      'gunChange',
      'killWhale2',
      'whaleCatch',
      'whaleCount1',
      'whaleCount1_1',
      'whaleCount2',
      'whaleCount2_1',
      'whaleCount3',
      'whaleCount3_1',
      'coinjump1',
      'coinjump2',
      'coinjump3',
      'killBoss',
      'bossDragonDie',
      'killBossMultipleX1',
      'killBossMultipleX2',
      'killBossMultipleX3',
      'killBossMultipleX4',
      'killBossMultipleX5',
      'killBossMultipleX6',
      'killBossMultipleX7',
      'killBossMultipleX8',
      'killBossMultipleX9',
      'killBossRepeat',
      'killBossRepeatFinish',
      'bossKilledAddScore',

      //Red Dragon
      'redDragonRepeat',
      'redDragonOut',

      //Blue Dragon
      'blueDragonExplode',
      'blueDragonExplodeEnd',
      'blueDragonRepeat',
      'blueDragonOut',

      //Dragon Turtle
      'DragonTurtleIn',
      'dragonTurtleStep',
    ]);
  }
  updateProgressDisplay(pct) {
    this.loadingText.text = parseFloat(pct*100).toFixed(2) + '%';
  }
}
