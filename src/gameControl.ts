import { Tile, TileState, TilePosition } from './tile/tile.ts';
import { TileManager } from './tileManager.ts';

export class GameControl {
  private _tileColumns: Array<DocumentFragment> = [];
  private _tileContainer: HTMLElement = document.getElementById('tile-container');
  private _columnTemplate: HTMLTemplateElement = document.querySelector('#tile-column');
  private _gameStarted: boolean = false;
  private _tileManager: TileManager;
  private _timerCount: number = 0;
  private _timer: number;
  private _tileFlaggedCount: number = 0;
  private _gameState: IterableIterator<void> = this._advanceGameState();
  constructor(private _gridWidth: number,
    private _gridHeight: number,
    private _numMines: number,
    private _gameOverHandler: (gameWon: boolean) => void,
    private _timerElement: HTMLElement,
    private _counterElement: HTMLElement) {
    this._tileManager = new TileManager(_gridWidth, _gridHeight, _numMines);
    this._initBoard();
    this._gameState.next();
  }

  public get tileFlaggedCount(): number {
    return this._tileFlaggedCount;
  }

  public destroy(): void {
    clearInterval(this._timer);
  }

  private *_advanceGameState() {
      this._tileManager.mineField(yield);
      this._tileManager.addMineCounts();
      this._gameStarted = true;
      this._initTimer();
      this._gameOver(yield);
  }

  private _onTileClicked(element: Element) {
    let tilePos: TilePosition = this._getTilePosition(element);
    let targetTile: Tile = this._tileManager.tiles[tilePos.x][tilePos.y];
    if (targetTile.tileState !== TileState.Hidden) {
      return;
    }
    if (!this._gameStarted) {
      this._gameState.next(tilePos);
    }
    if (targetTile.tileState === TileState.Hidden) {
      targetTile.revealOnClick();
      this._updateBasedOnNewTileState(targetTile);
      this._checkIfGameOver();
      this._refreshBoard();
    }
  }

  private _initTimer(): void {
    this._timer = setInterval(() => {
      this._timerCount++;
      this._timerElement.innerHTML = this._timerCount.toLocaleString(undefined, { minimumIntegerDigits: 3 });
    }, 1000);
  }

  private _checkIfGameOver(): void {
    if (this._tileManager.allTilesRevealed()) {
      this._gameState.next(true);
    }
  }

  private _getTilePosition(element: Element): TilePosition {
    return new TilePosition(+element.attributes['xpos'].value,
      +element.attributes['ypos'].value);
  }

  private _flagTile(element: Element) {
    let tilePos: TilePosition = this._getTilePosition(element);
    this._tileManager.tiles[tilePos.x][tilePos.y].toggleFlagTile();
    this._refreshBoard();
  }

  private _updateBasedOnNewTileState(targetTile: Tile): void {
    switch (targetTile.tileState) {
      case TileState.Revealed: {
        if (targetTile.adjacentMineCount === 0) {
          this._tileManager.revealAdjacentTiles(targetTile.tilePos.x, targetTile.tilePos.y);
        }
        break;
      }
      case TileState.Detonated: {
        this._gameState.next(false);
        break;
      }
      default: {

      }
    }
  }

  private _gameOver(gameWon: boolean): void {
    this._tileManager.tiles.forEach(tileColumn => tileColumn.forEach(tile => {
      if (gameWon) {
        tile.revealOnPlayerWin();
      } else {
        tile.revealOnGameOver();
      }
    }));
    this.destroy();
    this._refreshBoard();
    this._gameOverHandler(gameWon);
  }

  private _initListeners(): void {
    Array.from(document.getElementsByClassName('tile')).forEach((element) => {
      element.addEventListener('click', () => this._onTileClicked(element));
      element.addEventListener('contextmenu', (event: Event) => {
        event.preventDefault();
        this._flagTile(element);
        return false;
      }, false);
    });
  }

  private _removeListeners(): void {
    Array.from(document.getElementsByClassName('tile')).forEach((element) => {
      element.removeEventListener('click', () => this._onTileClicked(element));
    });
  }

  private _initBoard(): void {
    this._refreshBoard();
    this._initListeners();
  }

  private _refreshBoard(): void {
    this._removeListeners();
    this._tileColumns = [];
    this._tileContainer.innerHTML = "";
    this._drawBoard();
    this._initListeners();
  }

  private _drawBoard(): void {
    this._tileFlaggedCount = 0;
    for (let x: number = 0; x < this._gridWidth; x++) {
      this._tileColumns.push(document.importNode(this._columnTemplate.content, true));
    }
    this._tileColumns.forEach((row: DocumentFragment, x: number) => {
      for (let y: number = 0; y < this._gridHeight; y++) {
        row.querySelector('.column-tile-container').innerHTML += this._tileManager.tiles[x][y].getTileTemplate(x, y);
        if (this._tileManager.tiles[x][y].tileState === TileState.Flagged) this._tileFlaggedCount++;
      }
      this._tileContainer.appendChild(row);
    });
    this._counterElement.innerHTML = (this._numMines - this._tileFlaggedCount).toLocaleString(undefined, { minimumIntegerDigits: 3 });
  }
}