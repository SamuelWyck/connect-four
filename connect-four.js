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
            [(1, 0), (-1, 0)],
            [(0, -1), (0, 1)],
            [(-1, -1), (1, 1)],
            [(-1, 1), (1, -1)]
        ];

        for (let posChange of positionChanges) {
            if (checkWinOnLine(board, row, col, color, new Set(), posChange[0], posChange[1]) >= minMatches) {
                return color;
            }
        }
        return false;
    };

    let checkWinOnLine = function(board, row, col, color, visited, firstChange, secondChange) {
        const rowValid = 0 <= row && row < board.length;
        const colValid = 0 <= col && col < board[0].length;
        const pos = (row, col);
        if (!rowValid || !colValid) {
            return 0;
        } else if (pos in visited) {
            return 0;
        } else if (board[row][col] !== color) {
            return 0;
        }

        visited.add(pos);

        firstPos = checkWinOnLine(
            board, row + firstChange[0], col + firstChange[1],
            color, visited, firstChange, secondChange
        );
        secondPos = checkWinOnLine(
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
        const colValid = 0 <= col && col < boardArray[0].length;
        if (!colValid) {
            return false;
        } else if (boardArray[row][col] !== emptySpace) {
            return false;
        }
        
        let dfsAddToken = function(row, col, color) {
            const nextRowValid = 0 <= row + 1 && row + 1 < boardArray.length;
            const currentPos = boardArray[row][col];
            if (!nextRowValid || boardArray[row + 1][col] !== emptySpace) {
                if (currentPos === emptySpace) {
                    boardArray[row][col] = color;
                    return true;
                }
                return false;
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
    const board = document.querySelector(".board");
    const menuBtnDiv = document.querySelector(".btn-container");
    const redInput = document.querySelector("#red-player");
    const blueInput = document.querySelector("#blue-player");

    board.addEventListener("mouseover", function(event) {
        if (event.target.matches(".board-cell")) {
            handleBoardHover(event.target);
        }
    });

    board.addEventListener("mouseout", function(event) {
        if (event.target.matches(".board-cell")) {
            handleBoardHover(event.target);
        };
    });

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

    let menuClickLogic = function(callBack) {
        menuBtnDiv.addEventListener("click", function(event) {
            if (event.target.matches(".start-btn")) {
                callBack(event.target);
            }
        }) 
    };

    let getPlayerNames = function() {
        let redName = redInput.value;
        if (redName === "" || redName.length > 20) {
            redName = redInput.placeholder;
            redInput.value = redName;
        }

        let blueName = blueInput.value;
        if (blueName === "" || blueName.length > 20) {
            blueName = blueInput.placeholder;
            blueInput.value = blueName;
        }
        return [redName, blueName];
    };

    let toggleInputs = function() {
        redInput.disabled = !redInput.disabled;
        blueInput.disabled = !blueInput.disabled;
    };

    return {
        "boardClickLogic": boardClickLogic,
        "menuClickLogic": menuClickLogic,
        "getPlayerNames": getPlayerNames,
        "toggleInputs": toggleInputs,
    };
};


const game = (function() {
    const gameBoard = board();
    const endCheck = winCheck();
    const playerMaker = playerFactory();

    const displayLink = DOMLogic();
    displayLink.menuClickLogic(gameStartEvent);

    let gameStarted = false;
    const colorRed = "R";
    const colorBlue = "B";
    let redPlayer = playerMaker.makePlayer("Red Player", colorRed);
    let bluePlayer = playerMaker.makePlayer("Blue Player", colorBlue);

    let startGame = function() {
        const [redName, blueName] = displayLink.getPlayerNames();
        redPlayer.name = redName;
        bluePlayer.name = blueName;
        displayLink.toggleInputs();
    };

    function gameStartEvent(element) {
        if (!gameStarted) {
            startGame();
        }
    };

})();