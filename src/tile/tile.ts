export class Tile {
  public hasMine: boolean = false;
  public adjacentMineCount: number = 0;
  private _tilePos: TilePosition;
  constructor() {
  }
  private _tileState: TileState = TileState.Hidden;

  public get tileState(): TileState {
    return this._tileState;
  }

  public get tilePos(): TilePosition {
    return this._tilePos;
  }

  public revealOnClick(): void {
    if (this.hasMine) {
      this._tileState = TileState.Detonated;
    } else {
      this._tileState = TileState.Revealed;
    }
  }

  public revealOnGameOver(): void {
    if (this._tileState === TileState.Hidden) {
      if (this.hasMine) {
        this._tileState = TileState.Mine;
      } else {
        this._tileState = TileState.GameOverHidden;
      }
    } else if (this._tileState === TileState.Flagged && this.hasMine) {
      this._tileState = TileState.Disarmed;
    }
  }

  public revealOnPlayerWin(): void {
    if (this._tileState === TileState.Hidden && this.hasMine) {
      this._tileState = TileState.GameOverHidden;
    } else if (this._tileState === TileState.Flagged) {
      this._tileState = TileState.Disarmed;
    }
  }

  public toggleFlagTile(): void {
    if (this._tileState === TileState.Hidden) {
      this._tileState = TileState.Flagged;
    } else if(this._tileState === TileState.Flagged) {
      this._tileState = TileState.Hidden;
    }
  }

  public revealOnAdjacentReveal(): boolean {
    if (this._tileState === TileState.Hidden && !this.hasMine) {
      this._tileState = TileState.Revealed;
      if (this.adjacentMineCount === 0) {
        return true;
      }
    }
    return false;
  }

  public getTileTemplate(x: number, y: number): string {
    let tileTemplate: string = '<div xPos="' + x + '" yPos="' + y + '" class="tile ' + this._tileState + ' color-' + this.adjacentMineCount + '">';
    this._tilePos = new TilePosition(x, y);
    switch (this._tileState) {
      case TileState.Revealed: {
        tileTemplate += this.adjacentMineCount;
        break;
      }
      default: {

      }
    }
    return tileTemplate + '</div>';
  }
}
export class TilePosition {
  constructor(public x: number,
              public y: number) {}
}

export enum TileState {
  Hidden = 'hidden',
  Revealed = 'revealed',
  Mine = 'mine',
  Detonated = 'detonated',
  Flagged = 'flagged',
  Disarmed = 'disarmed',
  GameOverHidden = 'gameOverHidden'
}