import Player from "./player.js";
import Gameboard from "./gameboard.js";
import Ship from "./ship.js";

const game = (() => {
  let players = [];
  let currentPlayerIndex = 0;

  let aiTargetQueue = [];
  let lastHit = null;
  let huntMode = false;

  const initializeGame = () => {
    const player1 = new Player("Player 1");
    const player2 = new Player("Computer");

    player1.setGameboard(new Gameboard());
    player2.setGameboard(new Gameboard());

    players = [player1, player2];

    aiTargetQueue = [];
    lastHit = null;
    huntMode = false;

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

  const getAdjacentCoordinates = (x, y) => {
    const adjacent = [];
    const directions = [
      { dx: 0, dy: -1 },
      { dx: 1, dy: 0 },
      { dx: 0, dy: 1 },
      { dx: -1, dy: 0 },
    ];

    directions.forEach(({ dx, dy }) => {
      const newX = x + dx;
      const newY = y + dy;

      if (newX >= 0 && newX < 10 && newY >= 0 && newY < 10) {
        adjacent.push({ x: newX, y: newY });
      }
    });

    return adjacent;
  };

  const shipStatus = (gameboard, x, y) => {
    for (const shipData of gameboard.ships) {
      for (let i = 0; i < shipData.ship.length; i++) {
        const shipX = shipData.isHorizontal ? shipData.x + i : shipData.x;
        const shipY = shipData.isHorizontal ? shipData.y : shipData.y + i;
        
        if (shipX === x && shipY === y) {
          return shipData.ship.isSunk();
        }
      }
    }
    return false;
  };


  const makeComputerMove = () => {
    const computer = players.find((player) => player.name === "Computer");
    const enemy = players.find((player) => player.name !== "Computer");

    let x, y;
    let targetAcquired = false;

    //This is STATE 1 of AI State Machine, Smart Targeting
    while (aiTargetQueue.length > 0 && !targetAcquired) {
      const target = aiTargetQueue.shift();

      if (!enemy.gameboard.hasBeenAttacked(target.x, target.y)) {
        x = target.x;
        y = target.y;
        targetAcquired = true;
      }
    }

    //STATE 2, Random Targeting
    if (!targetAcquired) {
        do {
        x = Math.floor(Math.random() * 10);
        y = Math.floor(Math.random() * 10);
        } while (enemy.gameboard.hasBeenAttacked(x, y));

        huntMode = false; // Not hunting anymore
    }

    const wasHit = enemy.gameboard.receiveAttack(x, y);

    //STATE 3, Process Attack Result
    if (wasHit) {
        // Check if ship was sunk
        const shipSunk = shipStatus(enemy.gameboard, x, y);

        if (shipSunk) {
            // Ship is sunk, JOB IS DONE! Clear the queue and reset hunt mode
            aiTargetQueue = [];
            lastHit = null;
            huntMode = false;
        } else {
            // Ship hit but not sunk, enter/continue hunt mode
            huntMode = true;
            lastHit = { x, y };

            // Add adjacent coordinates to target queue
            const adjacentCoords = getAdjacentCoordinates(x, y);
            adjacentCoords.forEach(coord => {
                // Only add to SMART TARGETING if not already attacked and not already in queue
                if (!enemy.gameboard.hasBeenAttacked(coord.x, coord.y) &&
                    !aiTargetQueue.some(target => target.x === coord.x && target.y === coord.y)) {
                    aiTargetQueue.push(coord);
                }
            });
        }
    }
  };

  const checkGameEnd = () => {
    return players.some((player) => player.gameboard.allShipsSunk());
  };

  const restartGame = () => {
    players = [];
    currentPlayerIndex = 0;
    initializeGame();
  };

  return {
    initializeGame,
    switchTurn,
    makeComputerMove,
    checkGameEnd,
    restartGame,
    get players() {
      return players;
    },
    get currentPlayerIndex() {
      return currentPlayerIndex;
    },
  };
})();

export default game;
