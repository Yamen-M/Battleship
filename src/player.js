export default class Player {
    constructor(name) {
        this.name = name;
        this.gameboard = null;
    }
    setGameboard(gameboard) {
        this.gameboard = gameboard;
    }
}