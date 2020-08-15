
/*<<<< DO NOT EDIT THIS CLASS DIRECTLY >>>>>*/

/* [Base Socket Class] - SocketIO
 * 
 * TODO: Fill in more info on SocketIO
 *
 */

import Config from '../config';
import Helpers from '../helpers';
import Storage from 'local-storage-fallback';
import io from 'socket.io-client';

export default class Socket {

  constructor (scene=null){
    this.scene = scene;
    this.connection = null;
    this.unclaimedFS = null;
  }

  init(){

    this.playerCurrency = Storage.getItem('playerCurrency');
    this.playerAuthToken = Storage.getItem('playerAuthToken');

    // Connect to socket 
    this.connection = io.connect(Config.wsEndpoint, { 
      transports: ['websocket'] , 
      query: { token: this.playerAuthToken},
      timeout: 500,
      reconnection: true, // auto reconnect
      reconnectionDelay: 1000, // reconnection delay in ms
      reconnectionDelayMax: 1000,
      reconnectionAttempts: 4 // max retries
    });

    // On connect, join slots room
    this.connection.on('connect', () => {
      //this.connection.emit('join-' + Config.egameShortCode, this.playerCurrency);
      //if(this.scene.gameLayout) this.scene.gameLayout.hideAlert('connected');
    });

    // On ready, join slots room
    this.connection.on('ready-to-join', () => {
      this.connection.emit('join-' + Config.egameShortCode, this.playerCurrency);
      //if(this.scene.gameLayout) this.scene.gameLayout.hideAlert('connected');
    });

    this.connection.on('unclaimed-fs-results', (res) => {
      this.unclaimedFS = res;
    });

    // On unauthorized access (e.g. invalid token) OR socket errors thrown by server
    this.connection.on('error', (error) => {
      //if(this.scene.gameLayout) this.scene.gameLayout.displayAlert('reconnectfailed');
      if(this.scene && this.scene.gameLayout){
        this.scene.gameLayout.displayAlert('reconnectfailed');
      }else{
        this.redirectToLobby();
      }
    });

    // On reconnect failed (reconnect attempts hit)
    this.connection.on('reconnect_failed', () => {
      if(this.scene && this.scene.gameLayout){
        this.scene.gameLayout.displayAlert('reconnectfailed');
      }else{
        this.redirectToLobby();
      }
    });

    // On dual login (logging in from more than 1 location)
    this.connection.on('dual-login', () => {
      if(this.scene && this.scene.gameLayout){
        this.scene.gameLayout.displayAlert('duallogin');
      }else{
        this.redirectToLobby();
      }
    });

    // Use this offline event listener instead of socket due to ping timeout and interval (reducing these values will increase server load)
    window.addEventListener('offline', function(e) {
      if(this.scene && this.scene.gameLayout){
        this.close();
        this.scene.gameLayout.displayAlert('reconnectfailed');
      }else{
        this.redirectToLobby();
      }
    }.bind(this));


    /* Catch all other errors TODO: Check if required */

    // On connection timeout
    // this.connection.on('connect_timeout', () => {
    //   if(this.scene.gameLayout) this.scene.gameLayout.displayAlert('reconnectfailed');
    // });
    // // On connection errors
    // this.connection.on('connect_error', (err) => {
    //   if(this.scene.gameLayout) this.scene.gameLayout.displayAlert('reconnectfailed');
    // });
    // // On disconnect
    // this.connection.on('disconnect', (err) => {
    //   if(this.scene.gameLayout) this.scene.gameLayout.displayAlert('reconnectfailed');
    // });
    // // Reconnect error
    // this.connection.on('reconnect_error', () => {
    //   if(this.scene.gameLayout) this.scene.gameLayout.displayAlert('reconnectfailed');
    // });

    // Listen to credit updates (first time load only)
    this.connection.on('credit-update', (data) => {
      Storage.setItem('playerCredits', data.credits);
      // this.scene.playerCredits = parseFloat(data.credits);
      // if(this.scene.gameLayout) this.scene.gameLayout.playerCreditText.text = Helpers.number_format(parseFloat(data.credits), 2, '.', ',');
    });

    this.connection.on('deposit', (data) => {
      Storage.setItem('playerCredits', data.balance);
      if(this.scene && this.scene.gameLayout){
        this.scene.playerCredits = parseFloat(data.balance);
        this.scene.gameLayout.playerCreditText.text = Helpers.number_format(parseFloat(data.balance), 2, '.', ',');
        this.scene.gameLayout.displayAlert('deposit', data);
      }
    });

    this.connection.on('withdrawal', (data) => {
      Storage.setItem('playerCredits', data.balance);
      if(this.scene && this.scene.gameLayout){
        this.scene.playerCredits = parseFloat(data.balance);
        this.scene.gameLayout.playerCreditText.text = Helpers.number_format(parseFloat(data.balance), 2, '.', ',');
        this.scene.gameLayout.displayAlert('withdrawal', data);
      }
    });

    this.connection.on('spin-df-results', (res) => {
      if(res.results && res.results.length > 0){
        this.scene.socketOnResultCallback(res);
        this.scene.playerCredits = res.creditBalance;
        Storage.setItem('playerCredits', res.creditBalance);
      }else{
        // Display alert (spin failed)
      }
    });

    this.connection.on('spin-fs-results', (res) => {
      if(res.results && res.results.length > 0){
        this.scene.socketOnResultCallback(res);
        this.scene.playerCredits = res.creditBalance;
        Storage.setItem('playerCredits', res.creditBalance);
      }else{
        // Display alert (spin failed)
      }
    });

    return this.connection;
  }

  close(){
    if(this.connection){
      this.connection.disconnect();
      this.connection = null;
    }
  }

  redirectToLobby(){
    if(Config.isMobileApp && cordova && cordova.InAppBrowser){
      let iab = cordova.InAppBrowser;
      let target = "_self";
      let options = "location=no,hidden=no,usewkwebview=yes";
      let iabRef = cordova.InAppBrowser.open("index.html?nav=yes", target, options);
    }else{
      // TODO: Hide this button on desktop? Or redirect?
      window.location.href = "index.html";
    }
  }

}