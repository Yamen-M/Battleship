import game from "../src/game.js";

describe("Game", () => {
  beforeEach(() => {
    game.initializeGame();
  });

  it("Game initializes with two players and their gameboards", () => {
    expect(game.players).toHaveLength(2);
    expect(game.players[0].gameboard).not.toBeNull();
    expect(game.players[1].gameboard).not.toBeNull();
  });

  it("Switching turns changes the current player", () => {
    const initialPlayerIndex = game.currentPlayerIndex;
    game.switchTurn();
    expect(game.currentPlayerIndex).not.toBe(initialPlayerIndex);
  });

  it("Computer makes a move without errors", () => {
    expect(() => game.makeComputerMove()).not.toThrow();
  });

  it("Game ends when all ships of a player are sunk", () => {
    const player = game.players[0];

    // Simulate hitting all parts of each ship
    player.gameboard.ships.forEach(({ ship, x, y, isHorizontal }) => {
      for (let i = 0; i < ship.length; i++) {
        const coordX = isHorizontal ? x + i : x;
        const coordY = isHorizontal ? y : y + i;
        player.gameboard.receiveAttack(coordX, coordY);
      }
    });
    expect(game.checkGameEnd()).toBe(true);
  });
});
