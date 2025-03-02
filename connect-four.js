function playerFactory() {
    let makePlayer = function(name, color) {
        return {"name": name, "color": color};
    };
    return {"makePlayer": makePlayer};
};


function winCheck() {
    let checkWinner = function(board, row, col) {
        const color = board[row][col];
        if (color == "O") {
            return false;
        }

        const minMatches = 4;
        const positionChanges  = [
            [[1, 0], [-1, 0]],
            [[0, -1], [0, 1]],
            [[-1, -1], [1, 1]],
            [[-1, 1], [1, -1]]
        ];

        for (let i = 0; i < positionChanges.length; i += 1) {
            const posChange = positionChanges[i];
            const result = checkWinOnLine(board, row, col, color, new Set(), posChange[0], posChange[1]);
            if (result >= minMatches) {
                return true;
            }
        }
        return false;
    };

    let checkWinOnLine = function(board, row, col, color, visited, firstChange, secondChange) {
        const rowValid = 0 <= row && row < board.length;
        const colValid = 0 <= col && col < board[0].length;
        const pos = [row, col];
        if (!rowValid || !colValid) {
            return 0;
        } else if (visited.has(JSON.stringify(pos))) {
            return 0;
        } else if (board[row][col] !== color) {
            return 0;
        }

        visited.add(JSON.stringify(pos));

        let firstPos = checkWinOnLine(
            board, row + firstChange[0], col + firstChange[1],
            color, visited, firstChange, secondChange
        );
        let secondPos = checkWinOnLine(
            board, row + secondChange[0], col + secondChange[1],
            color, visited, firstChange, secondChange
        );
        return 1 + firstPos + secondPos;
    }
    return {"checkWinner": checkWinner};
};


function board() {
    let boardArray = [
        ["O", "O", "O", "O", "O", "O", "O"],
        ["O", "O", "O", "O", "O", "O", "O"],
        ["O", "O", "O", "O", "O", "O", "O"],
        ["O", "O", "O", "O", "O", "O", "O"],
        ["O", "O", "O", "O", "O", "O", "O"],
        ["O", "O", "O", "O", "O", "O", "O"]
    ];

    let emptySpace = "O";


    let reset = function() {
        let newBoardArray = [
            ["O", "O", "O", "O", "O", "O", "O"],
            ["O", "O", "O", "O", "O", "O", "O"],
            ["O", "O", "O", "O", "O", "O", "O"],
            ["O", "O", "O", "O", "O", "O", "O"],
            ["O", "O", "O", "O", "O", "O", "O"],
            ["O", "O", "O", "O", "O", "O", "O"]
        ];
        boardArray = newBoardArray;
    };


    let getBoard = function() {
        return boardArray;
    };


    let addToken = function(col, color) {
        let row = 0;
        col = Number(col);
        const colValid = 0 <= col && col < boardArray[0].length;
        if (!colValid) {
            return [false, 0, 0];
        } else if (boardArray[row][col] !== emptySpace) {
            return [false, 0, 0];
        }
        
        let dfsAddToken = function(row, col, color) {
            const nextRowValid = 0 <= row + 1 && row + 1 < boardArray.length;
            const currentPos = boardArray[row][col];
            if (!nextRowValid || boardArray[row + 1][col] !== emptySpace) {
                if (currentPos === emptySpace) {
                    boardArray[row][col] = color;
                    return [true, row, col];
                }
                return [false, 0, 0];
            }

            return dfsAddToken(row + 1, col, color);
        };

        return dfsAddToken(row, col, color);
    };

    return {
        "getBoard": getBoard, "addToken": addToken,
        "reset": reset
    };
};

function DOMLogic() {
    const dropZone = document.querySelector(".drop-zone");
    const board = document.querySelector(".board");
    const menuBtnDiv = document.querySelector(".btn-container");
    const redInput = document.querySelector("#red-player");
    const blueInput = document.querySelector("#blue-player");
    const htmlRoot = document.querySelector("html");
    const winPopup = document.querySelector(".winner-popup");
    const winNameSpan = document.querySelector(".winner-name");
    const newGameBtn = document.querySelector(".new-game-btn");
    
    winPopup.addEventListener("click", function(event) {
        if (event.target.matches("button")) {
            togglePopup();
        }
    });

    let boardHoverLogic = function(callBack) {
        board.addEventListener("mouseover", function(event) {
            if (event.target.matches(".board-cell")) {
                if (!callBack()) {
                    handleBoardHover(event.target);
                }
            }
        });

        board.addEventListener("mouseout", function(event) {
            if (event.target.matches(".board-cell")) {
                if (!callBack()) {
                    handleBoardHover(event.target);
                }
            };
        });
    };

    let togglePopup = function(toggle=true) {
        if (toggle) {
            winPopup.classList.toggle("hide-popup");
        } else {
            winPopup.classList.add("hide-popup");
        }
    };

    let handleBtnAnimation = function(remove=true) {
        if (remove) {
            newGameBtn.classList.remove("blink");
        } else {
            newGameBtn.classList.add("blink");
        }
    };

    let displayWinnerName = function(name) {
        winNameSpan.textContent = name.toUpperCase();
    };

    let clearDropZone = function() {
        const dropZoneCells = dropZone.children;
        for (let cell of dropZoneCells) {
            cell.classList.remove("turn-color");
        }
    };

    let handleBoardHover = function(element) {
        const colNumber = element.dataset.col;
        const dropZoneCell = document.querySelector(`.drop-zone-cell.col-${colNumber}`);
        dropZoneCell.classList.toggle("turn-color");
    };

    let boardClickLogic = function(callBack) {
        board.addEventListener("click", function(event) {
            if (event.target.matches(".board-cell")) {
                callBack(event.target);
            };
        });
    };

    let menuClickLogic = function(startCallBack, newCallBack) {
        menuBtnDiv.addEventListener("click", function(event) {
            if (event.target.matches(".start-btn")) {
                startCallBack();
            } else if (event.target.matches(".new-game-btn")) {
                newCallBack();
            }
        })
    };

    let getPlayerNames = function() {
        const maxLength = 20;
        let redName = redInput.value;
        if (redName === "" || redName.length > maxLength) {
            redName = redInput.placeholder;
            redInput.value = redName;
        }

        let blueName = blueInput.value;
        if (blueName === "" || blueName.length > maxLength) {
            blueName = blueInput.placeholder;
            blueInput.value = blueName;
        }
        return [redName, blueName];
    };

    let changeTurnColor = function(redTurn) {
        if (redTurn) {
            htmlRoot.style.setProperty("--color", "red");
        } else {
            htmlRoot.style.setProperty("--color", "blue");
        }
    };

    let toggleInputsDisabled = function(bool) {
        redInput.disabled = bool;
        blueInput.disabled = bool;
    };

    let completeBoardReset = function() {
        const boardCells = board.children;
        for (let cell of boardCells) {
            cell.classList.remove("blue");
            cell.classList.remove("red");
        }
    };

    let boardUpdate = function(row, col, className) {
        const cell = document.querySelector(`.row-${row}.col-${col}`);
        cell.classList.add(className);
    };

    return {
        "boardClickLogic": boardClickLogic,
        "menuClickLogic": menuClickLogic,
        "getPlayerNames": getPlayerNames,
        "toggleInputsDisabled": toggleInputsDisabled,
        "completeBoardReset": completeBoardReset,
        "boardUpdate": boardUpdate,
        "changeTurnColor": changeTurnColor,
        "togglePopup": togglePopup,
        "displayWinnerName": displayWinnerName,
        "boardHoverLogic": boardHoverLogic,
        "clearDropZone": clearDropZone,
        "handleBtnAnimation": handleBtnAnimation
    };
};

function audioManager() {
    const cheerSound = new Audio("./audio/cheer.mp3");

    let playTokenSound = function() {
        document.getElementById("tokenSound").play();
    };

    let playCheerSound = function() {
        cheerSound.play();
    };

    return {
        "playTokenSound": playTokenSound,
        "playCheerSound": playCheerSound
    }
};

const game = (function() {
    const gameBoard = board();
    const endCheck = winCheck();
    const playerMaker = playerFactory();
    const audio = audioManager();
    
    let gameStarted = false;
    let gameWon = false;
    const colorRed = "R";
    const colorBlue = "B";
    let redPlayer = playerMaker.makePlayer("Red Player", colorRed);
    let bluePlayer = playerMaker.makePlayer("Blue Player", colorBlue);
    let playerTurn = redPlayer;
    
    const displayLink = DOMLogic();
    displayLink.menuClickLogic(gameStartEvent, newGameEvent);
    displayLink.boardClickLogic(tokenPlaceEvent);
    displayLink.boardHoverLogic(gameWonCheck);

    let startGame = function() {
        const [redName, blueName] = displayLink.getPlayerNames();
        redPlayer.name = redName;
        bluePlayer.name = blueName;
        displayLink.toggleInputsDisabled(true);
        gameStarted = true;
    };

    function gameWonCheck() {
        return gameWon;
    };

    function gameStartEvent() {
        if (!gameStarted) {
            startGame();
        }
    };

    function changePlayerTurn() {
        if (playerTurn === redPlayer) {
            playerTurn = bluePlayer;
        } else {
            playerTurn = redPlayer;
        }
    };

    function newGameEvent() {
        gameBoard.reset();
        displayLink.togglePopup(false);
        gameStarted = false;
        gameWon = false;
        displayLink.toggleInputsDisabled(false);
        displayLink.completeBoardReset();
        playerTurn = redPlayer;
        displayLink.changeTurnColor(true);
        displayLink.handleBtnAnimation();
    };

    function getClassName(color) {
        if (color === colorBlue) {
            return "blue";
        } else {
            return "red";
        }
    };

    function gameOver() {
        audio.playCheerSound();
        gameWon = true;
        displayLink.displayWinnerName(playerTurn.name);
        displayLink.clearDropZone();
        displayLink.togglePopup();
        displayLink.handleBtnAnimation(false);
    };

    function tokenPlaceEvent(element) {
        if (gameWon) {
            return;
        }
        if (!gameStarted) {
            startGame();
        }
        const colNumber = element.dataset.col;
        const color = playerTurn.color;
        const [success, row, col] = gameBoard.addToken(colNumber, color);
        if (!success) {
            return;
        }

        audio.playTokenSound();
        const className = getClassName(color);
        displayLink.boardUpdate(row, col, className);
        if (endCheck.checkWinner(gameBoard.getBoard(), row, col)) {
            gameOver();
            return;
        }

        changePlayerTurn();
        const redTurn = playerTurn.color == colorRed;
        displayLink.changeTurnColor(redTurn);
    };

})();