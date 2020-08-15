
/*<<<< DO NOT EDIT THIS CLASS DIRECTLY >>>>>*/

/* [Base Audio Class] 
 * 
 * Common functions to bridge "PhaserWebAudio" on Android and "Media" on iOS
 *
 */

import Config from '../config';
import Helpers from '../helpers';

export default class Audio {
  
  constructor (scene){
    this.scene = scene;
    this.default = [];
    this.custom = [];
    this.winAudioKeys = []; // keys of all audio that needs to be stopped before next spin starts
    // vars used to check if scatter match audio played, for force stop 
    this.scatter1Played = false;
    this.scatter2Played = false;
    this.scatter3Played = false;
    this.scatter4Played = false;
    this.scatter5Played = false;
  }

  loadDefaultAudio(){
    this.default['button-press'] = this.scene.sound.add('button-press');
    this.default['button-press1'] = this.scene.sound.add('button-press1');
    this.default['key-press'] = this.scene.sound.add('key-press');
    this.default['move'] = this.scene.sound.add('move');

    this.default['collect-coin'] = this.scene.sound.add('collect-coin');
    this.default['stop-number'] = this.scene.sound.add('stop-number');
    this.default['bell-ring'] = this.scene.sound.add('bell-ring');
    this.default['freespin'] = this.scene.sound.add('freespin');
    this.default['freespin-finish'] = this.scene.sound.add('freespin-finish');

    this.default['df-win-big'] = this.scene.sound.add('df-win-big');
    this.default['df-win-mega'] = this.scene.sound.add('df-win-mega');
  }

  unloadDefaultAudio(){
    Object.keys(this.default).forEach(function (key) {
      this.default[key].stop();
      this.scene.sound.remove(key);
    },this);
  }

  loadCustomAudio(audioTitles){
    audioTitles.forEach(function (audio) {
      this.custom[audio] = this.scene.sound.add(audio);
    },this);
  }

  unloadCustomAudio(){
    Object.keys(this.custom).forEach(function (key) {
      this.custom[key].stop();
      this.scene.sound.remove(key);
    },this);
  }

  defineWinAudioKeys(keys){
    this.winAudioKeys = keys;
  }

  winAudioIsPlaying(){
    let isPlayingCount = 0;
    if(this.default['df-win-big'].isPlaying || this.default['df-win-mega'].isPlaying) isPlayingCount += 1;
    Object.keys(this.custom).forEach(function (key) {
      if(this.winAudioKeys.includes(key)){
        if(this.custom[key] && this.custom[key].isPlaying){
          isPlayingCount += 1;
        }
      }
    },this);
    if(isPlayingCount > 0){
      return true;
    }else{
      return false;
    }
  }

  stopAllWinAudio(){
    this.scatter1Played = false;
    this.scatter2Played = false;
    this.scatter3Played = false;
    this.scatter4Played = false;
    this.scatter5Played = false;
    if(this.default['df-win-big'].isPlaying) this.default['df-win-big'].stop();
    if(this.default['df-win-mega'].isPlaying) this.default['df-win-mega'].stop();
    Object.keys(this.custom).forEach(function (key) {
      if(this.winAudioKeys.includes(key)){
        if(this.custom[key] && this.custom[key].isPlaying){
          this.custom[key].stop();
        }
      }
    },this);
  }

}