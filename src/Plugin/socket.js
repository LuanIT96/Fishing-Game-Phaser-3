import Storage from 'local-storage-fallback';
import Config from '../config';


export default class SocketPlugin extends Phaser.Plugins.BasePlugin {
  constructor (game, pluginManager){
      super(game, pluginManager);
  }
  init(){
    this.totalRetry = 0;
    this.webSocket;
    console.log('SocketPlugin is alive');
  }

  connect(){
    var socket = new WebSocket('ws://192.168.2.23:3500/fishing');
    socket.onmessage = function (messageResponse) {
      let message = JSON.parse(messageResponse.data);
      if (message.joined) {/*You Join Room*/
        this.game.roomID = message.roomID;
      }
    }.bind(this);
    socket.onclose = function () {
    }.bind(this);
    socket.onopen = function (event) {
      this.game.socket = socket;
      socket.send(JSON.stringify({join: true}))
    }.bind(this);
  }
}

