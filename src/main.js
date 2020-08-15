//=================================================================================================//
import 'phaser';
import Boot from './Scene/Boot';
import Preloader from './Scene/Preloader';
import Crocodile from './Scene/Crocodile';
import Monster from './Scene/Monster';
import Octopus from './Scene/Octopus';
import Crab from './Scene/Crab';
import Config from './config';
import SocketPlugin from './Plugin/socket';
import FishRoomPlugin from './Plugin/FishRoom';
import AutoBot0 from './Plugin/AutoBot0';
import AutoBot1 from './Plugin/AutoBot1';
import AutoBot2 from './Plugin/AutoBot2';

//=================================================================================================//
var game;

function resize() {
  var canvas = document.getElementById('game');
  var windowWidth = window.innerWidth;
  var windowHeight = window.innerHeight;
  var windowRatio = windowWidth / windowHeight;
  var gameRatio = game.config.width / game.config.height;
  if (windowRatio < gameRatio) {
    canvas.style.width = Math.ceil(windowWidth)+1 + 'px';
    canvas.style.height = Math.ceil(windowWidth / gameRatio)+1 + 'px';
  }
  else {
    canvas.style.width = Math.ceil(windowHeight * gameRatio)+1 + 'px';
    canvas.style.height = Math.ceil(windowHeight)+1 + 'px';
  }
}

window.onload = function() {
  game = new Phaser.Game({
    type: Phaser.WEBGL,
    parent: 'game',
    scale: {mode: Config.scaleMode, width: Config.gameWidth, height: Config.gameHeight},
    scene: [Boot, Preloader, Crab, Crocodile, Monster, Octopus],
    plugins: {
      global: [
        {key: 'SocketPlugin', plugin: SocketPlugin, start: true},
        {key: 'FishRoomPlugin', plugin: FishRoomPlugin, start: true},
        {key: 'AutoBot0', plugin: AutoBot0, start: true},//Bot1
        {key: 'AutoBot1', plugin: AutoBot1, start: true},//Bot2
        {key: 'AutoBot2', plugin: AutoBot2, start: true}//Bot3
      ]
    },
    fps:{
      min: 30,
      target: 60,
      forceSetTimeOut: false,//set forceSetTimeOut true then you can set target fps
    },
    autoRound: true,
    antialias: true, //or set pixelArt: true in your game config. You don't need to set both
    multiTexture: true,
    transparent: false,
    roundPixels: true,
    forceSingleUpdate: true,
    clearBeforeRender: false,
    preserveDrawingBuffer: false,//In WebGL mode, the drawing buffer won't be cleared automatically each frame.
    disableContextMenu:  true,

    // antialias: true, //
    // multiTexture: true,
    // transparent: true,
    // roundPixels: true,
    // forceSingleUpdate: true,
    // clearBeforeRender: false,
    // preserveDrawingBuffer: false,//In WebGL mode, the drawing buffer won't be cleared automatically each frame.
    // disableContextMenu:  true,
    powerPreference: "low-power",
    title: "OCEANKING 3 - MONSTER AWAKEN"
  });
  window.addEventListener('resize', resize, false);
}
//=================================================================================================//
