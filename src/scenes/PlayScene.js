import {size, speedDown} from '../constants';
import Phaser from 'phaser';

export default class PlayScene extends Phaser.Scene{
    constructor(){
      super('scene-game');
      this.bird=null;
      this.velocity = 150;
      this.initialBirdPosition= {
        x: size.width * 0.1,
        y: size.height * 0.5
      }
      this.pipeVerticalDistanceRange = [150,250];
      this.pipeHorizontalDistanceRamge = [400,500];
      this.totalPipes=8;
      this.pipes=null;
      this.flap = this.flap.bind(this);
      this.restartGame=this.restartGame.bind(this);
    }
    preload(){
      this.load.image('sky','assets/sky.png');
      this.load.image('bird','assets/bird.png');
      this.load.image('pipe','assets/pipe.png');
    }
    create(){
        this.createBG();
        this.createBird();
        this.createPipes();
        this.createColidor();
        this.handleInputs();
    }
    update(time, delta){
      if(this.bird.y + this.bird.height >= size.height || this.bird.y <= 0){
        this.restartGame();
      }
      this.recyclePipes();
    }
    createBG = () => {
        this.add.image(0,0,'sky').setOrigin(0,0);
    }
    createBird = () => {
        this.bird = this.physics.add.sprite(this.initialBirdPosition.x, this.initialBirdPosition.y,'bird').setOrigin(0,0);
        this.bird.body.gravity.y=speedDown;
        this.bird.body.setCollideWorldBounds(true);
    }
    createPipes = () => {
        this.pipes = this.physics.add.group();
        for(let i=0; i<this.totalPipes; i++){
          let upperPipe = this.pipes.create(0,0,'pipe').setImmovable(true).setOrigin(0,1);
          let lowerPipe = this.pipes.create(0,0,'pipe').setImmovable(true).setOrigin(0,0);
          this.placePipe(upperPipe, lowerPipe);
        }
        this.pipes.setVelocityX(-200);
    }
    createColidor = () =>{
        this.physics.add.collider(this.bird, this.pipes, this.restartGame);
    }
    handleInputs = () => {
        this.input.on('pointerdown',this.flap);
        var spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        spaceBar.on('down',this.flap);
    }
    placePipe = (upperPipe, lowerPipe) =>{
      const rightMostX = this.getRightMostPipe();
      let pipeVerticalDistance = Phaser.Math.Between(...this.pipeVerticalDistanceRange);
      let pipeVerticalPosition = Phaser.Math.Between(30,size.height-30 - pipeVerticalDistance);
      let pipeHorizontalDistance = Phaser.Math.Between(...this.pipeHorizontalDistanceRamge);
  
      upperPipe.x = rightMostX+ pipeHorizontalDistance;
      upperPipe.y = pipeVerticalPosition;
      lowerPipe.x = upperPipe.x;
      lowerPipe.y = upperPipe.y + pipeVerticalDistance;
    }
    recyclePipes = () => {
      const tempPipes = [];
      this.pipes.getChildren().forEach((pipe,i) => {
        if(pipe.getBounds().right <= 0){
          tempPipes.push(pipe);
          if(tempPipes.length === 2){
            this.placePipe(...tempPipes);
          }      
        }
      })
    }
    getRightMostPipe = () => {
      let rightMostX = 0;
      this.pipes.getChildren().forEach(pipe=>{
        rightMostX = Math.max(pipe.x, rightMostX);
      })
      return rightMostX;
    }
    flap(){
        this.bird.body.velocity.y = -this.velocity;
    }
    restartGame(){
        this.physics.pause();
        this.bird.setTint(0xEE4824);
        this.bird.x = this.initialBirdPosition.x;
        this.bird.y = this.initialBirdPosition.y;
        this.bird.body.velocity.y=0;
    }
}