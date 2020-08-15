import Storage from 'local-storage-fallback';
import Config from '../config';


import fish0 from  '../Data/fish0.json';
import fish1 from  '../Data/fish1.json';
import fish2 from  '../Data/fish2.json';
import fish3 from  '../Data/fish3.json';
import fish4 from  '../Data/fish4.json';
import fish5 from  '../Data/fish5.json';
import fish6 from  '../Data/fish6.json';

import bigFish0 from '../Data/topToBottomLeft.json';
import bigFish1 from '../Data/leftToRightBottom.json';
import bigFish2 from '../Data/bottomToTopRight.json';
import bigFish3 from '../Data/rightToLeftTop.json';

import specialFish from '../Data/specialFish.json';
let bigFish = [];


export default class FishRoomPlugin extends Phaser.Plugins.BasePlugin {
  constructor (game, pluginManager){super(game, pluginManager);}
  init(){
    bigFish[0] = bigFish0;
		bigFish[1] = bigFish1;
		bigFish[2] = bigFish2;
		bigFish[3] = bigFish3;
  }
  setScene(scene){
  	this.scene = scene;
    this.randomFish();//random fish with ihnterval
    this.smallBoss = Phaser.Math.Between(30, 32);
  	// this.firstImportFish(); //random fish imediately
  }

  /*
  *
  *
  */
  firstImportFish(){
    this.scene.addFish(0, this.randomFishSigle0())
    this.scene.addFish(1, this.randomFishSigle1())

    let rnd0_0 = Phaser.Math.Between(0, 3);
    if(rnd0_0 == 0){
        let fish2 = this.randomFishSigle2();
        this.scene.addFish(2, fish2);
    }   
    if(rnd0_0 == 1){
        let fish3 = this.randomFishSigle3();
        this.scene.addFish(3, fish3)
    }
    /*RD1*/
    if(rnd0_0 == 2){
        let fish4 = this.randomFishSigle4();
        this.scene.addFish(4, fish4)
    }
    if(rnd0_0 == 3){
        let fish5 = this.randomFishSigle5();
        this.scene.addFish(5, fish5)
    }

    /**********************************************************/
    let rnd1_0 = Phaser.Math.Between(0, 1);
    /*RD*/ 
    if(rnd1_0 == 0){
        let fish6 = this.randomFishSigle6();
        this.scene.addFish(6, fish6)
    }else{
        let fish7 = this.randomFishSigle7();
        this.scene.addFish(7, fish7)
    }

    /****************************************************/
    let rnd1_1 = Phaser.Math.Between(0, 1);
    if(rnd1_1 == 0){
      let fish = this.randomFishSigle8();
      this.scene.addFish(8, fish)
    }
    if(rnd1_1 == 1){
      let fish = this.randomFishSigle9();
      this.scene.addFish(9, fish)
    }
    /*RD2*/
    if(rnd1_1 == 2){
      let fish = this.randomFishSigle10();
      this.scene.addFish(10, fish)
    }
    if(rnd1_1 == 3){
      let fish = this.randomFishSigle11();
      this.scene.addFish(11, fish)
    }

    /*************************/
    let rnd = Phaser.Math.Between(0, 6);
    if(rnd == 0){
      var fish13 = this.generateBigFish(13, 2);
      this.scene.addFish(13, fish13)

      var fish14 = this.generateBigFish(14, 2);
      this.scene.addFish(14, fish14)
    }
    if(rnd == 1){
      var fish15 = this.generateBigFish(15, 2);
      this.scene.addFish(15, fish15)

      var fish16 = this.generateBigFish(16, 2);
      this.scene.addFish(16, fish16)
    }
    if(rnd == 2){
      var fish17 = this.generateBigFish(17, 2);
      this.scene.addFish(17, fish17)

      var fish18 = this.generateBigFish(18, 2);
      this.scene.addFish(18, fish18)
    }
    if(rnd == 3){
      var fish19 = this.generateBigFish(19, 2);
      this.scene.addFish(19, fish19)

      var fish20 = this.generateBigFish(20, 2);
      this.scene.addFish(20, fish20)
    }
    if(rnd == 4){
      var fish21 = this.generateBigFish(21, 2);
      this.scene.addFish(21, fish21)
    }
    if(rnd == 5){
    	var fish22 = this.generateBigFish(22, 2);
      this.scene.addFish(22, fish22)
    }
    if(rnd == 6){
    	var fish23 = this.generateBigFish(22, 2);
      this.scene.addFish(23, fish23)
    }
  }
	randomFish(){
    if(!this.scene.loopInterval){
      this.scene.loopInterval = [];
      this.scene.loopInterval[0] = this.scene.time.addEvent({
        delay: 7000,                // ms
        callback: function(){
          this.scene.addFish(0, this.randomFishSigle0());
          this.scene.addFish(0, this.randomFishSigle0());
          this.scene.addFish(1, this.randomFishSigle1());

          let rnd0_0 = Phaser.Math.Between(0, 1);
          let rnd0_1 = Phaser.Math.Between(0, 1);

          /*RD*/ 
          if(rnd0_0 == 0){
            let fish2 = this.randomFishSigle2();
            this.scene.addFish(2, fish2);
          }   
          if(rnd0_0 == 1){
            let fish3 = this.randomFishSigle3();
            this.scene.addFish(3, fish3)
          }
          /*RD1*/
          if(rnd0_1 == 0){
            let fish4 = this.randomFishSigle4();
            this.scene.addFish(4, fish4)
          }
          if(rnd0_1 == 1){
            let fish5 = this.randomFishSigle5();
            this.scene.addFish(5, fish5)
          }
        },
        callbackScope: this,
        loop: true
      });
      this.scene.loopInterval[1] = this.scene.time.addEvent({
        delay: 10000,
        callback: function(){
          let rnd1_0 = Phaser.Math.Between(0, 1);
          /*RD*/ 
          if(rnd1_0 == 0){
              let fish6 = this.randomFishSigle6();
              this.scene.addFish(6, fish6)
          }
          if(rnd1_0 == 1){
              let fish7 = this.randomFishSigle7();
              this.scene.addFish(7, fish7)
          }
        },
        callbackScope: this,
        loop: true
      });
      this.scene.loopInterval[2] = this.scene.time.addEvent({
        delay: 8000,
        callback: function(){
          let rnd1_1 = Phaser.Math.Between(0, 1);
          let rnd1_2 = Phaser.Math.Between(0, 1);
          /*RD1*/ 
          if(rnd1_1 == 0){
            let fish = this.randomFishSigle8();
            this.scene.addFish(8, fish)
          }
          if(rnd1_1 == 1){
            let fish = this.randomFishSigle9();
            this.scene.addFish(9, fish)
          }
          /*RD2*/
          if(rnd1_2 == 0){
            let fish = this.randomFishSigle10();
            this.scene.addFish(10, fish)
          }
          if(rnd1_2 == 1){
            let fish = this.randomFishSigle11();
            this.scene.addFish(11, fish)
          }
        },
        callbackScope: this,
        loop: true
      });

      //Big fish
      this.scene.loopInterval[3] = this.scene.time.addEvent({
        delay: 15000,
        callback: function(){
          let rnd = Phaser.Math.Between(0, 6);
          if(rnd == 0){
            var fish13 = this.generateBigFish(13, 2);
            this.scene.addFish(13, fish13)
            
            var fish14 = this.generateBigFish(14, 2);
            this.scene.addFish(14, fish14)
          }
          if(rnd == 1){
            var fish15 = this.generateBigFish(15, 2);
            this.scene.addFish(15, fish15)

            var fish16 = this.generateBigFish(16, 2);
            this.scene.addFish(16, fish16)
          }
          if(rnd == 2){
            var fish17 = this.generateBigFish(17, 2);
            this.scene.addFish(17, fish17)

            var fish18 = this.generateBigFish(18, 2);
            this.scene.addFish(18, fish18)
          }
          if(rnd == 3){
            var fish19 = this.generateBigFish(19, 2);
            this.scene.addFish(19, fish19)

            var fish20 = this.generateBigFish(20, 2);
            this.scene.addFish(20, fish20)
          }
          if(rnd == 4){
            var fish21 = this.generateBigFish(21, 2);
            this.scene.addFish(21, fish21)
          }
          if(rnd == 5){
            var fish22 = this.generateBigFish(22, 2);
            this.scene.addFish(22, fish22)
          }
          if(rnd == 6){
            var fish23 = this.generateBigFish(22, 2);
            this.scene.addFish(23, fish23)
          }
        },
        callbackScope: this,
        loop: true
      });

      //Special fish
      this.scene.loopInterval[4] = this.scene.time.addEvent({
        delay: 30000,
        callback: function(){
          let group = Phaser.Math.Between(24, 28);
          if(this.scene.fishGroup[group].getFirstDead()){
            let rd = Phaser.Math.Between(0, specialFish.length-1);
            let fish = {};
            fish.p = {x: specialFish[rd].x, y: specialFish[rd].y};
            fish.t = 5000;
            fish.endTime =  Date.now() + fish.t;
            fish.delay = 0;
            this.scene.addFish(group, fish)
          }
        },
        callbackScope: this,
        loop: true
      });

      //Small boss
      this.scene.loopInterval[5] = this.scene.time.addEvent({
        delay: 45000,
        callback: function(){
          if(this.scene.sceneMode===0 && this.scene.fishGroup[this.smallBoss].getFirstDead()){
            this.scene.addFish(this.smallBoss, {});
          }
        },
        callbackScope: this,
        loop: true
      });
    }
  }
  randomFishSigle0() {
    var totalFish = 5;
    var fishData = [];
    for (let i = 0; i <= totalFish; i++) {
      let fish = {};
      if(this.scene.fishGroup[0].getFirstDead()){
        let length = fish1.length;
        let rd = Phaser.Math.Between(0, length-1);
        fish.p = {x: fish0[rd].x, y: fish0[rd].y};
        fish.t = 15000;
        fish.endTime =  Date.now() + fish.t;
        fish.delay = i*Phaser.Math.Between(200, 600);
        fishData.push(fish);    
      }
    }
    return fishData;
  }
  randomFishSigle1() {
    var totalFish = 5;
    let fishData = [];
    for (let i = 0; i <= totalFish; i++) {
      let fish = {};
      if(this.scene.fishGroup[1].getFirstDead()){
        let length = fish1.length;
        let rd = Phaser.Math.Between(0, length-1);
        fish.p = {x: fish1[rd].x, y: fish1[rd].y};
        fish.t = Phaser.Math.Between(15000, 25000);;
        fish.endTime =  Date.now() + fish.t;
        fish.delay = i*Phaser.Math.Between(500, 1500);
        fishData.push(fish);
      }
    }
    return fishData;
  }
  randomFishSigle2 () {
    var totalFish = 3;
    let fishData = [];
    let length = fish2.length;
    let rd = Phaser.Math.Between(0, length-1);
    for (let i = 0; i <= totalFish; i++) {
      let fish = {};
      if(this.scene.fishGroup[2].getFirstDead()){
        fish.p = {x: fish2[rd].x, y: fish2[rd].y};
        fish.t = 15000;
        fish.endTime =  Date.now() + fish.t;
        fish.delay = i*700;
        fishData.push(fish);
      }
    }
    return fishData;
  }
  randomFishSigle3() {
    var totalFish = 3;
    let fishData = [];
    for (let i = 0; i <= totalFish; i++) {
      let fish = {};
      if(this.scene.fishGroup[3].getFirstDead()){
        let length = fish3.length;
        let rd = Phaser.Math.Between(0, length-1);
        fish.p = {x: fish3[rd].x, y: fish3[rd].y};
        fish.t = Phaser.Math.Between(15000, 25000);
        fish.endTime =  Date.now() + fish.t;
        fish.delay = i*Phaser.Math.Between(2500, 7500);
        fishData.push(fish);
      }
    }
    return fishData;
  }
  randomFishSigle4() {
    var totalFish = 3;
    let fishData = [];
    for (let i = 0; i <= totalFish; i++) {
      let fish = {};
      if(this.scene.fishGroup[4].getFirstDead()){
        let length = fish4.length;
        let rd = Phaser.Math.Between(0, length-1);
        fish.p = {x: fish4[rd].x, y: fish4[rd].y};
        fish.t = Phaser.Math.Between(15000, 25000);
        fish.endTime =  Date.now() + fish.t;
        fish.delay = i*Phaser.Math.Between(2500, 7500);
        fishData.push(fish);
      }
    }
    return fishData;
  }
  randomFishSigle5() {
    var totalFish = 2;
    let fishData = [];
    for (let i = 0; i <= totalFish; i++) {
      let fish = {};
      if(this.scene.fishGroup[5].getFirstDead()){
         let length = fish5.length;
        let rd = Phaser.Math.Between(0, length-1);
        fish.p = {x: fish5[rd].x, y: fish5[rd].y};
        fish.t = Phaser.Math.Between(15000, 25000);;
        fish.endTime =  Date.now() + fish.t;
        fish.delay = i*Phaser.Math.Between(2500, 6500);
        fishData.push(fish);
      }
    }
    return fishData;
  }
  randomFishSigle6() {
    var totalFish = 3;
    let fishData = [];
    for (let i = 0; i <= totalFish; i++) {
      let fish = {};
      if(this.scene.fishGroup[6].getFirstDead()){
        let length = fish6.length;
        let rd = Phaser.Math.Between(0, length-1);
        fish.p = {x: fish6[rd].x, y: fish6[rd].y};
        fish.t = Phaser.Math.Between(30000, 50000);;
        fish.endTime =  Date.now() + fish.t;
        fish.delay = i*Phaser.Math.Between(2500, 6500);
        fishData.push(fish);
      }
    }
    return fishData;
  }
  randomFishSigle7() {
    var totalFish = 3;
    let fishData = [];
    for (let i = 0; i <= totalFish; i++) {
      let fish = {};
      if(this.scene.fishGroup[7].getFirstDead()){
        let length = fish1.length;
        let rd = Phaser.Math.Between(0, length-1);
        fish.p = {x: fish1[rd].x, y: fish1[rd].y};
        fish.t = Phaser.Math.Between(15000, 25000);;
        fish.endTime =  Date.now() + fish.t;
        fish.delay = i*Phaser.Math.Between(3000, 8000);
        fishData.push(fish);
      }
    }
    return fishData;
  }
  randomFishSigle8() {
    var totalFish = 3;
    let fishData = [];
    for (let i = 0; i <= totalFish; i++) {
      let fish = {};
      if(this.scene.fishGroup[8].getFirstDead()){
        let length = fish1.length;
        let rd = Phaser.Math.Between(0, length-1);
        fish.p = {x: fish1[rd].x, y: fish1[rd].y};
        fish.t = Phaser.Math.Between(30000, 45000);;
        fish.endTime =  Date.now() + fish.t;
        fish.delay = i*Phaser.Math.Between(2500, 6500);
        fishData.push(fish);
      }
    }
    return fishData;
  }
  randomFishSigle9() {
    var totalFish = 3;
    let fishData = [];
    for (let i = 0; i <= totalFish; i++) {
      let fish = {};
      if(this.scene.fishGroup[9].getFirstDead()){
        let length = fish1.length;
        let rd = Phaser.Math.Between(0, length-1);
        fish.p = {x: fish1[rd].x, y: fish1[rd].y};
        fish.t = Phaser.Math.Between(15000, 25000);;
        fish.endTime =  Date.now() + fish.t;
        fish.delay = i*Phaser.Math.Between(2500, 6500);
        fishData.push(fish);
      }
    }
    return fishData;
  }
  randomFishSigle10() {
    var totalFish = 3;
    let fishData = [];
    for (let i = 0; i <= totalFish; i++) {
      let fish = {};
      if(this.scene.fishGroup[10].getFirstDead()){
        let length = fish1.length;
        let rd = Phaser.Math.Between(0, length-1);
        fish.p = {x: fish1[rd].x, y: fish1[rd].y};
        fish.t = Phaser.Math.Between(30000, 45000);;
        fish.endTime =  Date.now() + fish.t;
        fish.delay = i*Phaser.Math.Between(2500, 6500);
        fishData.push(fish);
      }
    }
    return fishData;
  }
  randomFishSigle11() {
    var totalFish = 3;
    let fishData = [];
    for (let i = 0; i <= totalFish; i++) {
      let fish = {};
      if(this.scene.fishGroup[11].getFirstDead()){
        let length = fish1.length;
        let rd = Phaser.Math.Between(0, length-1);
        fish.p = {x: fish1[rd].x, y: fish1[rd].y};
        fish.t = Phaser.Math.Between(15000, 25000);;
        fish.endTime =  Date.now() + fish.t;
        fish.delay = i*Phaser.Math.Between(2500, 6500);
        fishData.push(fish);
      }
    }
    return fishData;
  }
  randomFishSigle12() {
    var totalFish = 3;
    let fishData = [];
    for (let i = 0; i <= totalFish; i++) {
      let fish = {};
      if(this.scene.fishGroup[12].getFirstDead()){
        let length = fish1.length;
        let rd = Phaser.Math.Between(0, length-1);
        fish.p = {x: fish1[rd].x, y: fish1[rd].y};
        fish.t = Phaser.Math.Between(15000, 25000);;
        fish.endTime =  Date.now() + fish.t;
        fish.delay = i*Phaser.Math.Between(2500, 6500);
        fishData.push(fish);
      }
    }
    return fishData;
  }
  generateBigFish(group, limit){
    var totalFish = limit;
    let fishData = [];
    let index1 = Phaser.Math.Between(0, 1);
    let index2 = Phaser.Math.Between(2, 3);
    let fish = {};
    if(this.scene.fishGroup[group].getFirstDead()){
      let rd = Phaser.Math.Between(0, bigFish[index1].length-1);
      fish.p = {x: bigFish[index1][rd].x, y: bigFish[index1][rd].y};
      fish.t = Phaser.Math.Between(15000, 25000);;
      fish.endTime =  Date.now() + fish.t;
      fish.delay = Phaser.Math.Between(0, 1500);
      fishData.push(fish);
    }
    let fish1 = {};
    if(this.scene.fishGroup[group].getFirstDead()){
      let rd1 = Phaser.Math.Between(0, bigFish[index2].length-1);
      fish1.p = {x: bigFish[index2][rd1].x, y: bigFish[index2][rd1].y};
      fish1.t = Phaser.Math.Between(15000, 25000);;
      fish1.endTime =  Date.now() + fish1.t;
      fish1.delay = Phaser.Math.Between(0, 1500);
      fishData.push(fish1);
    }
    return fishData;
  }
}

