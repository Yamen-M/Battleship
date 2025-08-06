import game from "./game.js";
import Ship from "./ship.js";

const dom = (() => {
  const playerBoardElement = document.getElementById("player-board");
  const computerBoardElement = document.getElementById("computer-board");
  const shipSelectionElement = document.getElementById("ship-selection");
  let selectedShip = null;
  let isHorizontal = true;
  let isGameOver = false;
  let computerMoveTimeout;

  const renderShipSelection = () => {
    const shipLengths = [5, 4, 3, 3, 2];
    shipSelectionElement.innerHTML = "<h3>Select a ship to place:</h3>";

    shipLengths.forEach((length, index) => {
      const shipElement = document.createElement("div");
      shipElement.className = "ship-option";
      shipElement.style.cssText = `
                padding: 10px;
                margin: 5px;
                background: #4d9be6;
                border: 2px solid #2a4a6f;
                border-radius: 4px;
                cursor: pointer;
                text-align: center;
            `;
      shipElement.textContent = `Ship ${index + 1} (Length: ${length})`;
      shipElement.onclick = () => {
        document.querySelectorAll(".ship-option").forEach((el) => {
          el.style.background = "#4d9be6";
        });
        shipElement.style.background = "#ff9e6d";
        selectedShip = { length, index };
      };
      shipSelectionElement.appendChild(shipElement);
    });

    const rotateButton = document.createElement("button");
    rotateButton.textContent = "Rotate Ship (R)";
    rotateButton.style.cssText = `
            padding: 10px;
            margin: 10px;
            background: #5a7d9a;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        `;
    rotateButton.onclick = () => {
      isHorizontal = !isHorizontal;
      rotateButton.textContent = `Rotate Ship (${
        isHorizontal ? "Horizontal" : "Vertical"
      })`;
    };
    shipSelectionElement.appendChild(rotateButton);
  };

  const renderBoard = (boardElement, gameboard, isPlayerBoard) => {
    boardElement.innerHTML = "";
    for (let y = 0; y < 10; y++) {
      for (let x = 0; x < 10; x++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.dataset.x = x;
        cell.dataset.y = y;

        const coord = `${x},${y}`;

        let hasShip = false;
        for (const shipData of gameboard.ships) {
          for (let i = 0; i < shipData.ship.length; i++) {
            const shipX = shipData.isHorizontal ? shipData.x + i : shipData.x;
            const shipY = shipData.isHorizontal ? shipData.y : shipData.y + i;

            if (shipX === x && shipY === y) {
              hasShip = true;
              if (isPlayerBoard) {
                cell.classList.add("ship");
              }
              break;
            }
          }
          if (hasShip) break;
        }

        if (gameboard.hits.has(coord)) {
          cell.classList.add("hit");
        } else if (gameboard.missedAttacks.has(coord)) {
          cell.classList.add("miss");
        }

        boardElement.appendChild(cell);
      }
    }
  };

  const renderGameboards = () => {
    renderBoard(playerBoardElement, game.players[0].gameboard, true);
    renderBoard(computerBoardElement, game.players[1].gameboard, false);
  };

  const showGameOver = (winner) => {
    if (document.querySelector(".game-over-message")) return;

    const message = document.createElement("div");
    message.className = "game-over-message";
    message.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(145deg, #000 0%, #1a1a1a 50%, #000 100%);
            color: #00ff41;
            border: 3px solid #00ff41;
            font-family: "Orbitron", monospace;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: 3px;
            box-shadow: 0 0 30px rgba(0, 255, 65, 0.8), inset 0 0 20px rgba(0, 0, 0, 0.8);
            z-index: 1000;
            padding: 30px;
            border-radius: 8px;
            text-align: center;
            animation: gameOverPulse 1s ease-in-out infinite alternate;
        `;

    const winnerText = document.createElement("div");
    winnerText.style.cssText = `
            font-size: 28px;
            margin-bottom: 20px;
            text-shadow: 0 0 15px #00ff41;
        `;
    winnerText.textContent = `Game Over! ${winner} wins!`;

    const restartButton = document.createElement("button");
    restartButton.textContent = "🚀 RESTART GAME 🚀";
    restartButton.style.cssText = `
            padding: 15px 30px;
            background: linear-gradient(145deg, #1a0033 0%, #330066 50%, #1a0033 100%);
            border: 2px solid #ff0080;
            color: #ff0080;
            cursor: pointer;
            transition: all 0.3s ease;
            text-transform: uppercase;
            font-weight: 700;
            letter-spacing: 2px;
            font-family: "Orbitron", monospace;
            margin-top: 15px;
            font-size: 16px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.1);
            border-radius: 4px;
        `;

    restartButton.addEventListener("mouseenter", () => {
      restartButton.style.background =
        "linear-gradient(145deg, #330033 0%, #660099 50%, #330033 100%)";
      restartButton.style.borderColor = "#ff40a0";
      restartButton.style.color = "#ff40a0";
      restartButton.style.boxShadow =
        "0 0 15px rgba(255, 0, 128, 0.6), 0 4px 8px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.2)";
      restartButton.style.transform = "translateY(-2px)";
    });

    restartButton.addEventListener("mouseleave", () => {
      restartButton.style.background =
        "linear-gradient(145deg, #1a0033 0%, #330066 50%, #1a0033 100%)";
      restartButton.style.borderColor = "#ff0080";
      restartButton.style.color = "#ff0080";
      restartButton.style.boxShadow =
        "0 4px 8px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.1)";
      restartButton.style.transform = "translateY(0)";
    });

    restartButton.onclick = () => {
      message.remove();

      isGameOver = false;
      selectedShip = null;
      isHorizontal = true;
      clearTimeout(computerMoveTimeout);

      computerBoardElement.style.pointerEvents = "auto";

      game.restartGame();

      renderShipSelection();
      renderGameboards();
    };

    message.appendChild(winnerText);
    message.appendChild(restartButton);
    document.body.appendChild(message);

    computerBoardElement.style.pointerEvents = "none";
    isGameOver = true;
  };

  const canPlaceShip = (x, y, length, horizontal) => {
    if (horizontal && x + length > 10) return false;
    if (!horizontal && y + length > 10) return false;

    const playerGameboard = game.players[0].gameboard;
    for (let i = 0; i < length; i++) {
      const checkX = horizontal ? x + i : x;
      const checkY = horizontal ? y : y + i;

      for (const shipData of playerGameboard.ships) {
        for (let j = 0; j < shipData.ship.length; j++) {
          const shipX = shipData.isHorizontal ? shipData.x + j : shipData.x;
          const shipY = shipData.isHorizontal ? shipData.y : shipData.y + j;

          if (shipX === checkX && shipY === checkY) {
            return false;
          }
        }
      }
    }
    return true;
  };

  const handlePlayerAttack = (x, y) => {
    if (isGameOver) return;
    clearTimeout(computerMoveTimeout);

    const computerGameboard = game.players[1].gameboard;

    if (computerGameboard.hasBeenAttacked(x, y)) return;

    computerGameboard.receiveAttack(x, y);
    renderGameboards();

    if (game.checkGameEnd()) {
      const winner = game.players[0].gameboard.allShipsSunk()
        ? "Computer"
        : "Player";
      showGameOver(winner);
      return;
    }

    game.switchTurn();
    computerMoveTimeout = setTimeout(handleComputerMove, 800);
  };

  const handleComputerMove = () => {
    if (isGameOver) return;

    game.makeComputerMove();
    renderGameboards();
    if (game.checkGameEnd()) {
      const winner = game.players[0].gameboard.allShipsSunk()
        ? "Computer"
        : "Player";
      showGameOver(winner);
      return;
    }

    game.switchTurn();
  };

  const setupEventListeners = () => {
    computerBoardElement.addEventListener("click", (event) => {
      if (!event.target.classList.contains("cell")) return;
      if (game.currentPlayerIndex !== 0) return;
      if (isGameOver) return;

      const x = parseInt(event.target.dataset.x);
      const y = parseInt(event.target.dataset.y);
      handlePlayerAttack(x, y);
    });

    playerBoardElement.addEventListener("mouseover", (event) => {
      if (!event.target.classList.contains("cell") || !selectedShip) return;

      const x = parseInt(event.target.dataset.x);
      const y = parseInt(event.target.dataset.y);

      document.querySelectorAll(".ship-preview").forEach((el) => {
        el.classList.remove("ship-preview");
        if (el.classList.contains("ship")) {
          el.style.background = "";
        } else {
          el.style.background = "";
        }
      });

      const canPlace = canPlaceShip(x, y, selectedShip.length, isHorizontal);

      for (let i = 0; i < selectedShip.length; i++) {
        const previewX = isHorizontal ? x + i : x;
        const previewY = isHorizontal ? y : y + i;

        if (previewX >= 10 || previewY >= 10) continue;

        const previewCell = playerBoardElement.querySelector(
          `[data-x="${previewX}"][data-y="${previewY}"]`
        );
        if (previewCell) {
          previewCell.classList.add("ship-preview");
          if (canPlace) {
            previewCell.style.setProperty(
              "background",
              "rgba(0, 255, 0, 0.7)",
              "important"
            );
          } else {
            previewCell.style.setProperty(
              "background",
              "rgba(255, 0, 0, 0.7)",
              "important"
            );
          }
        }
      }
    });

    playerBoardElement.addEventListener("mouseleave", () => {
      document.querySelectorAll(".ship-preview").forEach((el) => {
        el.classList.remove("ship-preview");
        el.style.removeProperty("background");
      });
    });

    playerBoardElement.addEventListener("click", (event) => {
      if (!event.target.classList.contains("cell") || !selectedShip) return;

      const x = parseInt(event.target.dataset.x);
      const y = parseInt(event.target.dataset.y);

      // Check if ship can be placed
      if (!canPlaceShip(x, y, selectedShip.length, isHorizontal)) {
        alert("Cannot place ship here!");
        return;
      }

      try {
        // Create a proper Ship object and place it
        const newShip = new Ship(selectedShip.length);
        game.players[0].gameboard.placeShip(newShip, x, y, isHorizontal);

        // Remove the ship from selection (mark as used)
        const shipOptions = document.querySelectorAll(".ship-option");
        if (shipOptions[selectedShip.index]) {
          shipOptions[selectedShip.index].style.opacity = "0.5";
          shipOptions[selectedShip.index].style.pointerEvents = "none";
          shipOptions[selectedShip.index].textContent += " (Placed)";
        }

        // Clear selection
        selectedShip = null;

        // Remove any preview properly
        document.querySelectorAll(".ship-preview").forEach((el) => {
          el.classList.remove("ship-preview");
          el.style.removeProperty("background");
        });

        renderGameboards();

        // Check if all ships are placed
        if (game.players[0].gameboard.ships.length === 5) {
          shipSelectionElement.innerHTML =
            "<h3>All ships placed! Click on enemy board to attack!</h3>";
        }
      } catch (error) {
        alert(error.message);
      }
    });

    playerBoardElement.addEventListener("contextmenu", (event) => {
      event.preventDefault();
      if (!selectedShip) return;

      // Toggle ship orientation
      isHorizontal = !isHorizontal;

      // Update button text
      const rotateButton = document.querySelector("button");
      if (rotateButton) {
        rotateButton.textContent = `Rotate Ship (${
          isHorizontal ? "Horizontal" : "Vertical"
        })`;
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "r" || event.key === "R") {
        if (selectedShip) {
          isHorizontal = !isHorizontal;
          const rotateButton = document.querySelector("button");
          if (rotateButton) {
            rotateButton.textContent = `Rotate Ship (${
              isHorizontal ? "Horizontal" : "Vertical"
            })`;
          }
        }
      }
    });
  };

  const init = () => {
    game.initializeGame();

    renderShipSelection();
    renderGameboards();
    setupEventListeners();
  };

  return { init };
})();

export default dom;
