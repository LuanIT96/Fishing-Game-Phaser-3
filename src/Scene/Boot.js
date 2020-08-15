import Config from '../config';


export default class Boot extends Phaser.Scene {
  constructor(test) {
    super({key:'Boot'});
  }
  preload() {
    //Load assets
    this.load.crossOrigin = 'anonymous';
    
    /*Import Assets*/
    this.load.image('loading-bg', Config.assetPath+Config.assetResolution+ '/loading-bg.jpg');
    this.load.atlas('loading', Config.assetPath+Config.assetResolution+ '/loading.png', Config.assetPath+Config.assetResolution+ '/loading.json');

    /*Import Fonts*/
    this.load.bitmapFont('arial-white-en', Config.assetPath + 'fonts/arial-white-en.png', Config.assetPath + 'fonts/arial-white-en.fnt');
    this.load.bitmapFont('arial-white-th', Config.assetPath + 'fonts/arial-white-th.png', Config.assetPath + 'fonts/arial-white-th.fnt');
    this.load.bitmapFont('arial-white-cn', Config.assetPath + 'fonts/arial-white-cn.png', Config.assetPath + 'fonts/arial-white-cn.fnt');
    this.load.bitmapFont('gang-of-three', Config.assetPath + 'fonts/gang-of-three.png', Config.assetPath + 'fonts/gang-of-three.fnt'); // Header: userName & userCredit



    // this.plugins.get('SocketPlugin').connect();
    
  }
  create() {
    this.scene.switch('Preloader');
  }
}
