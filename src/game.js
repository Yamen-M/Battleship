import Player from "./player.js";
import Gameboard from "./gameboard.js";
import Ship from "./ship.js";

const game = (() => {
  let players = [];
  let currentPlayerIndex = 0;

  const initializeGame = () => {
    const player1 = new Player("Player 1");
    const player2 = new Player("Computer");

    player1.setGameboard(new Gameboard());
    player2.setGameboard(new Gameboard());

    players = [player1, player2];

    // Place ships for computer initially
    // Player will place ships manually
    placeShips(player2.gameboard);
  };

  const placeShips = (gameboard) => {
    const shipLengths = [5, 4, 3, 3, 2]; 
    
    shipLengths.forEach((length) => {
      const ship = new Ship(length);
      let placed = false;
      let attempts = 0;
      
      while (!placed && attempts < 100) {
        // Random position and orientation
        const x = Math.floor(Math.random() * 10);
        const y = Math.floor(Math.random() * 10);
        const isHorizontal = Math.random() < 0.5;
        
        try {
          gameboard.placeShip(ship, x, y, isHorizontal);
          placed = true;
        } catch (error) {
          // If placement fails, try again
          attempts++;
        }
      }
      
      // Fallback if random fails
      if (!placed) {
        const y = shipLengths.indexOf(length) * 2;
        gameboard.placeShip(ship, 0, y, true);
      }
    });
  };

  const switchTurn = () => {
    currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
  };

  const makeComputerMove = () => {
    const computer = players.find((player) => player.name === "Computer");
    const enemy = players.find((player) => player.name !== "Computer");

    let x, y;
    do {
      x = Math.floor(Math.random() * 10);
      y = Math.floor(Math.random() * 10);
    } while (enemy.gameboard.hasBeenAttacked(x, y));

    enemy.gameboard.receiveAttack(x, y);
  };

  const checkGameEnd = () => {
    return players.some((player) => player.gameboard.allShipsSunk());
  };

  return {
    initializeGame,
    switchTurn,
    makeComputerMove,
    checkGameEnd,
    get players() {
      return players;
    },
    get currentPlayerIndex() {
      return currentPlayerIndex;
    },
  };
})();

export default game;
