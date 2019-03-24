// Testing setup by Gerard Sans (https://stackblitz.com/@gsans)

import './test/jasmine-setup';
import 'jasmine-core/lib/jasmine-core/jasmine-html.js';
import 'jasmine-core/lib/jasmine-core/boot.js';

import './test.ts';
import { Tile } from './src/tile/tile.ts';
import { GameControl } from './src/gameControl.ts';
(function bootstrap() {
  let restartButton: HTMLElement = document.getElementById('restart-button');
  let faceIcon: HTMLElement = document.querySelector('.face');
  let counterElement: HTMLElement = document.getElementById('counter');
  let timerElement: HTMLElement = document.getElementById('timer');
  let selectElement: HTMLSelectElement = document.querySelector('#difficulty-selector');
  let gameControl: GameControl;
  let mineCount: number = 10;
  let gridWidth: number = 9;
  let gridHeight: number = 9;
  restartGame();
  if (window.jasmineRef) {
    location.reload();
    return;
  }
  window.onload(new Event('anything'));
  window.jasmineRef = jasmine.getEnv();



  restartButton.addEventListener('click', () => restartGame());
  selectElement.onchange = selectDifficulty;

  function gameOver(gameWon: boolean): void {
    if (gameWon) {
      faceIcon.classList.add('game-won');
    } else {
      faceIcon.classList.add('game-lost');
    }
  }

  function selectDifficulty(event: Event): void {
    console.log(selectElement.value);
    switch (selectElement.value) {
      case "easy": {
        mineCount = 10;
        gridWidth = 9;
        gridHeight = 9;
        break;
      }
      case "medium": {
        mineCount = 40;
        gridWidth = 16;
        gridHeight = 16;
        break;
      }
      case "hard": {
        mineCount = 99;
        gridWidth = 30;
        gridHeight = 16;
        break;
      }
    }
    restartGame();
  }

  function restartGame(): void {
    if (gameControl) {
      gameControl.destroy();
    }
    faceIcon.classList.remove('game-lost');
    faceIcon.classList.remove('game-won');
    counterElement.innerHTML = mineCount.toString();
    timerElement.innerHTML = "000";
    gameControl = new GameControl(gridWidth, gridHeight, mineCount, gameOver, timerElement, counterElement);
  }

}());
