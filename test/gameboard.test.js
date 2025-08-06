import Ship from "../src/ship";
import Gameboard from "../src/gameboard";

describe("Gameboard", () => {
    let gameboard;

    beforeEach(() => {
        gameboard = new Gameboard();
    });

    it('places a ship correctly on the gameboard', () => {
        const ship = new Ship(3);

        gameboard.placeShip(ship, 0, 0, true);

        expect(gameboard.ships).toHaveLength(1);
        expect(gameboard.ships[0].ship).toBe(ship);
        expect(gameboard.ships[0].x).toBe(0);
        expect(gameboard.ships[0].y).toBe(0);
        expect(gameboard.ships[0].isHorizontal).toBe(true);
    });


    it('throws an error when placing a ship out of horizontal bounds', () => {
        const ship = new Ship(3);
        // Attempt to place a ship out of horizontal bounds
        expect(() => gameboard.placeShip(ship, 8, 0, true)).toThrow("Ship placement exceeds horizontal boundaries.");
    });

    it('throws an error when placing a ship out of vertical bounds', () => {
        const ship = new Ship(3);
        // Attempt to place a ship out of vertical bounds
        expect(() => gameboard.placeShip(ship, 0, 8, false)).toThrow("Ship placement exceeds vertical boundaries.");
    });

    it('throws an error when placing a ship overlapping with an existing ship', () => {
        const ship1 = new Ship(3);
        const ship2 = new Ship(3);

        gameboard.placeShip(ship1, 0, 0, true);

        // Attempt to place the second ship overlapping with the first
        expect(() => gameboard.placeShip(ship2, 0, 0, true)).toThrow("Ship placement overlaps with an existing ship.");
    });
})