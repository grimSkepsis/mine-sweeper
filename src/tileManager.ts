import { Tile, TileState, TilePosition } from './tile/tile.ts';


export class TileManager {
  private _tiles: Array<Array<Tile>> = [];
  
  constructor(
    private _gridWidth: number,
    private _gridHeight: number,
    private _numMines: number) {
    this._initTiles();
  }

  public get tiles(): Array<Array<Tile>> {
    return this._tiles;
  }


  private _initTiles(): void {
    for (let x: number = 0; x < this._gridWidth; x++) {
      this._tiles.push([]);
      for (let y: number = 0; y < this._gridHeight; y++) {
        this._tiles[x].push(
          new Tile()
        );
      }
    }
  }

  public allTilesRevealed(): boolean {
    for (let x: number = 0; x < this._gridWidth; x++) {
        for(let y: number = 0; y < this._gridHeight; y++) {
          if(this._tiles[x][y].tileState === TileState.Hidden && !this._tiles[x][y].hasMine) {
            return false;
          }
        }
    }
    return true;
  }

  public revealAdjacentTiles(x: number, y: number): void {
    if (this._tiles[x][y].adjacentMineCount !== 0) return;
    if (!(x - 1 < 0) && this._tiles[x - 1][y].tileState === TileState.Hidden) {
      this._tiles[x - 1][y].revealOnAdjacentReveal();
      this.revealAdjacentTiles(x - 1, y);
    }
    if (!(x + 1 > this._gridWidth - 1) && this._tiles[x + 1][y].tileState === TileState.Hidden) {
      this._tiles[x + 1][y].revealOnAdjacentReveal();
      this.revealAdjacentTiles(x + 1, y);
    }

    if (!(y - 1 < 0) && this._tiles[x][y - 1].tileState === TileState.Hidden) {
      this._tiles[x][y - 1].revealOnAdjacentReveal();
      this.revealAdjacentTiles(x, y - 1);
    }

    if (!(y + 1 > this._gridHeight - 1) && this._tiles[x][y + 1].tileState === TileState.Hidden) {
      this._tiles[x][y + 1].revealOnAdjacentReveal();
      this.revealAdjacentTiles(x, y + 1);
    }

    if (!(y - 1 < 0) && !(x - 1 < 0) && this._tiles[x - 1][y - 1].tileState === TileState.Hidden) {
      this._tiles[x - 1][y - 1].revealOnAdjacentReveal();
      this.revealAdjacentTiles(x - 1, y - 1);
    }
    if (!(y + 1 > this._gridHeight - 1) && !(x + 1 > this._gridWidth - 1) && this._tiles[x + 1][y + 1].tileState === TileState.Hidden) {
      this._tiles[x + 1][y + 1].revealOnAdjacentReveal();
      this.revealAdjacentTiles(x + 1, y + 1);
    }

    if (!(y - 1 < 0) && !(x + 1 > this._gridWidth - 1) && this._tiles[x + 1][y - 1].tileState === TileState.Hidden) {
      this._tiles[x + 1][y - 1].revealOnAdjacentReveal();
      this.revealAdjacentTiles(x + 1, y - 1);
    }
    if (!(y + 1 > this._gridHeight - 1) && !(x - 1 < 0) && this._tiles[x - 1][y + 1].tileState === TileState.Hidden) {
      this._tiles[x - 1][y + 1].revealOnAdjacentReveal();
      this.revealAdjacentTiles(x - 1, y + 1);
    }
  }

  private _getCountForTile(x: number, y: number): void {
    let mineCount: number = 0;
    if (!(x - 1 < 0) && this._tiles[x - 1][y].hasMine) {
      mineCount++;
    }
    if (!(x + 1 > this._gridWidth - 1) && this._tiles[x + 1][y].hasMine) {
      mineCount++;
    }

    if (!(y - 1 < 0) && this._tiles[x][y - 1].hasMine) {
      mineCount++;
    }
    if (!(y + 1 > this._gridHeight - 1) && this._tiles[x][y + 1].hasMine) {
      mineCount++;
    }

    if (!(y - 1 < 0) && !(x - 1 < 0) && this._tiles[x - 1][y - 1].hasMine) {
      mineCount++;
    }
    if (!(y + 1 > this._gridHeight - 1) && !(x + 1 > this._gridWidth - 1) && this._tiles[x + 1][y + 1].hasMine) {
      mineCount++;
    }

    if (!(y - 1 < 0) && !(x + 1 > this._gridWidth - 1) && this._tiles[x + 1][y - 1].hasMine) {
      mineCount++;
    }
    if (!(y + 1 > this._gridHeight - 1) && !(x - 1 < 0) && this._tiles[x - 1][y + 1].hasMine) {
      mineCount++;
    }
    this._tiles[x][y].adjacentMineCount = mineCount;
  }
  
  public mineField(excludedTilePos: TilePosition): void {
    let minesPlaced: number = 0;
    while (minesPlaced < this._numMines) {
      let x: number = this._getRandomInt(this._gridWidth);
      let y: number = this._getRandomInt(this._gridHeight);
      if (!(Math.abs(x - excludedTilePos.x) <= 1 && Math.abs(y - excludedTilePos.y) <= 1) && !this._tiles[x][y].hasMine) {
        this._tiles[x][y].hasMine = true;
        minesPlaced++;
      }
    }
  }

  public addMineCounts(): void {
    for (let x: number = 0; x < this._gridWidth; x++) {
      for (let y: number = 0; y < this._gridHeight; y++) {
        this._getCountForTile(x, y);
      }
    }
  }

  //from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
  private _getRandomInt(max: number): number {
    return Math.floor(Math.random() * Math.floor(max));
  }
}
