/* 
  To Note:
  - Game width and height will be fixed @ 640 x 360
  - 2 bundles of assets: 960x540 & 1366x768 (16:9 aspect ratio)
  - Existing assets (based on 960x540) will be scaled down to 640x360
  - Set Resolution based on screen width,height & DPR
*/


let assetResolution, phaserGameResolution;
let aspectRatio =  screen.availHeight > screen.availWidth ? screen.availWidth/screen.availHeight : screen.availHeight/screen.availWidth ;


// 0 - 960x640 | 1 - 1366x768 | 2 - 1920x1080
if(navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)|(android)|(webOS)/i)){
  if(window.devicePixelRatio <= 1){
    assetResolution = 0;
    phaserGameResolution = window.devicePixelRatio;
  }
  if(window.devicePixelRatio > 1 && window.devicePixelRatio < 2){
    assetResolution = 1;
    phaserGameResolution = window.devicePixelRatio;
  }
  if(window.devicePixelRatio >= 2){
    assetResolution = 2;
    phaserGameResolution = 2;
  }
}else{
  assetResolution = 2;
  phaserGameResolution = 2;
}
/*Check 16:9 AspectRatio*/
let isAspectRatio169 = false;
if(parseInt(screen.availWidth *9/16) ==  screen.availHeight) isAspectRatio169 = true;

/*Check Scale Mode*/
let scaleMode = Phaser.Scale.HEIGHT_CONTROLS_WIDTH;
if(screen.availWidth/screen.availHeight > 2){
    scaleMode = Phaser.Scale.WIDTH_CONTROLS_HEIGHT;
}
let defaultWidth = 640*phaserGameResolution;
let defaultHeight = Math.ceil(defaultWidth*aspectRatio);
module.exports =  {
  assetResolution: assetResolution, //assetResolution,
  phaserGameResolution: 1,
  gameWidth: defaultWidth,
  gameHeight: defaultHeight,
  gameCenterX: defaultWidth * 0.5,
  gameCenterY: defaultHeight * 0.5,
  isAspectRatio169: isAspectRatio169,
  pingInterval: 5000,
  scaleMode: scaleMode,
  assetPath:  "local-assets/",//Storage.getItem('loadedGameAssetPath'), // "local-assets/"
  sceneTimeLine: 600, //The time line each scene(second)
  sceneHalfTimeLine: 300,// Call big boss 
  wsEndpoint: "wss://staging-api.play247.bet/v1/p/ws",
  //wsEndpoint: "wss://api.play247.bet/v1/p/ws" //LIVE
  //wsEndpoint: "wss://staging-api.play247.bet/v1/p/ws" //STAGING,
  betConfigs: [
    { currency: "MYR", options: [ 0.1, 0.3, 0.5, 1, 2, 3, 4, 5, 10, 15 ] },
    { currency: "THB", options: [ 5, 10, 20, 50, 100, 200, 300, 500, 800, 1000 ] },
    { currency: "USD", options: [ 0.1, 0.3, 0.5, 1, 2, 3, 4, 5, 10, 15 ] },
    { currency: "CNY", options: [ 1, 3, 5, 10, 15, 30, 50, 80, 100, 150 ] },
    { currency: "VND", options: [ 1000, 5000, 15000, 30000, 50000, 100000, 150000, 200000, 300000, 500000 ] },
  ]
}

