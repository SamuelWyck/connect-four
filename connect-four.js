function player(name, color) {
    return {"name": name, "color": color};
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


const game = (function() {
    let board = [
        ["O", "O", "O", "O", "O", "O", "O"],
        ["O", "O", "O", "O", "O", "O", "O"],
        ["O", "O", "O", "O", "O", "O", "O"],
        ["O", "O", "O", "O", "O", "O", "O"],
        ["O", "O", "O", "O", "O", "O", "O"],
        ["O", "O", "O", "O", "O", "O", "O"]
    ];




    return {"board": board, };
})();
