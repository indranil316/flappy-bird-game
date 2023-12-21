import Phaser from 'phaser';
import { size } from './src/constants';
import PlayScene from './src/scenes/PlayScene';
import './src/styles/index.scss';

const gameCanvas = document.querySelector('canvas#game');

const config={
  type: Phaser.WEBGL,
  width: size.width,
  height: size.height,
  canvas: gameCanvas,
  physics:{
    default: 'arcade',
  },
  scene:[PlayScene]
}

const game = new Phaser.Game(config);
