import { Tile } from './tile';
import { TileState } from './tile';

describe('tile', () => {
  let gameOver: boolean;
  let tileWithMine: Tile;
  let tileWithoutMine: Tile;
  let tileWithNoAdjacent: Tile;
  let tileString = "<div class='tile'></div>";
  let docFrag: DocumentFragment;
  beforeAll(() => {
    docFrag = new DocumentFragment();
    let el: HTMLElement = document.createElement('div');
    el.classList.add('tile');
    docFrag.appendChild(el);
  });
  beforeEach(() => {
    tileWithMine = new Tile();
    tileWithMine.hasMine = true;
    tileWithMine.adjacentMineCount = 4;
    tileWithoutMine = new Tile();
    tileWithoutMine.adjacentMineCount = 7;
    tileWithNoAdjacent = new Tile();
    tileWithNoAdjacent.adjacentMineCount = 0;
    gameOver = false;
  })

  it('hasMine returns correct value', () => {
    expect(tileWithMine.hasMine).toBe(true);
    expect(tileWithoutMine.hasMine).toBe(false);
  });
  it('adjacentMineCount returns correct value', () => {
    expect(tileWithMine.adjacentMineCount).toBe(4);
    expect(tileWithoutMine.adjacentMineCount).toBe(7);
  });
  describe('revealOnAdjacentReveal behavior tests', () => {
    let eventPerpetuated: boolean;
    beforeEach(() => {
      eventPerpetuated = false;
    });
    it('if revealed, stay revealed and do not perpetuate event', () => {
      tileWithoutMine.revealOnClick();
      eventPerpetuated = tileWithoutMine.revealOnAdjacentReveal();
      expect(tileWithoutMine.tileState).toBe(TileState.Revealed);
      expect(eventPerpetuated).toBe(false);
    });
    it('if flagged, stay flagged and do not perpetuate event', () => {
      tileWithoutMine.toggleFlagTile();
      eventPerpetuated = tileWithoutMine.revealOnAdjacentReveal();
      expect(tileWithoutMine.tileState).toBe(TileState.Flagged);
      expect(eventPerpetuated).toBe(false);
    });
    it('if hidden, and no adjacent mines reveal and perpetuate event', () => {
      eventPerpetuated = tileWithNoAdjacent.revealOnAdjacentReveal();
      expect(tileWithNoAdjacent.tileState).toBe(TileState.Revealed);
      expect(eventPerpetuated).toBe(true);
    });
  });
  describe('revealOnGameOver behavior tests', () => {
    it('if revealed, stay revealed', () => {
      tileWithoutMine.revealOnClick();
      tileWithoutMine.revealOnGameOver();
      expect(tileWithoutMine.tileState).toBe(TileState.Revealed);
    });
    it('if hidden and has mine, show mine', () => {
      tileWithMine.revealOnGameOver();
      expect(tileWithMine.tileState).toBe(TileState.Mine);
    });
    it('if hidden and has no mine, stay hidden', () => {
      tileWithoutMine.revealOnGameOver();
      expect(tileWithoutMine.tileState).toBe(TileState.GameOverHidden);
    });
    it('if flag and has mine, disarm', () => {
      tileWithMine.toggleFlagTile();
      tileWithMine.revealOnGameOver();
      expect(tileWithMine.tileState).toBe(TileState.Disarmed);
    });
    it('if flag and has no mine, stay flagged', () => {
      tileWithoutMine.toggleFlagTile();
      tileWithoutMine.revealOnGameOver();
      expect(tileWithoutMine.tileState).toBe(TileState.Flagged);
    });
  });
});
