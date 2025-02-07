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


const game = (function() {
    const gameBoard = board();
    const endCheck = winCheck();
    const playerMaker = playerFactory();

    const color1 = "R";
    const color2 = "B";

    let getPlayers = function() {
        const [playerName1, playerName2] = getPlayerNames();

        const player1 = playerMaker.makePlayer(playerName1, color1);
        const player2 = playerMaker.makePlayer(playerName2, color2);
        return [player1, player2];
    };

    let getPlayerNames = function() {

    };

})();