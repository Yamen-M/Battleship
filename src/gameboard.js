import Ship from './ship.js';

export default class Gameboard {
  constructor() {
    this.gridSize = 10;
    this.ships = [];
    this.missedAttacks = new Set();
  }

  placeShip(ship, x, y, isHorizontal) {
    if (isHorizontal) {
      if (x + ship.length > this.gridSize) {
        throw new Error("Ship placement exceeds horizontal boundaries.");
      }
    } else {
      if (y + ship.length > this.gridSize) {
        throw new Error("Ship placement exceeds vertical boundaries.");
      }
    }

    for (let i = 0; i < ship.length; i++) {
      const coordX = isHorizontal ? x + i : x;
      const coordY = isHorizontal ? y : y + i;

      for (const existingShip of this.ships) {
        for (let j = 0; j < existingShip.ship.length; j++) {
          const existingCoordX = existingShip.isHorizontal
            ? existingShip.x + j
            : existingShip.x;
          const existingCoordY = existingShip.isHorizontal
            ? existingShip.y
            : existingShip.y + j;

          if (coordX === existingCoordX && coordY === existingCoordY) {
            throw new Error("Ship placement overlaps with an existing ship.");
          }
        }
      }
    }
    this.ships.push({ ship, x, y, isHorizontal });
  }

  recieveAttack(x, y) {
    if( this.missedAttacks.has(`${x},${y}`)) return false;

    for (const { ship, x: shipX, y: shipY, isHorizontal } of this.ships) {
      for (let i = 0; i < ship.length; i++) {
        const coordX = isHorizontal ? shipX + i : shipX;
        const coordY = isHorizontal ? shipY : shipY + i;

        if (coordX === x && coordY === y) {
          ship.hit();
          if (ship.isSunk()) {
            ship.sunk = true;
          }
          return true;
        }
      }
    }
    this.missedAttacks.add(`${x},${y}`);
    return false;
  }

  allShipsSunk() {
    return this.ships.every(({ ship }) => ship.isSunk());
  }
}
