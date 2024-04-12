let board;
let back_board;
let score = parseInt(localStorage.getItem("score")) > 0 ? parseInt(localStorage.getItem("score")) : 0;
let rows = 4;
let columns = 4;
let best_score = parseInt(localStorage.getItem("best_score")) > 0 ? parseInt(localStorage.getItem("best_score")) : 0;
let list_road_board = [];

window.onload = function() {
    setGame();
    const back_boardBtn = document.getElementById("back_score");
    back_boardBtn.addEventListener("click", () => {
        if (score > 0 && list_road_board.length > 0) {
            for (let i = 0; i < 4; i++) {
                for (let j = 0; j < 4; j++) {
                    board[i][j] = list_road_board[list_road_board.length - 1].list[i][j];
                }
            }
            score = list_road_board[list_road_board.length - 1].score;
            document.getElementById("score").innerText = score;
            list_road_board.pop();
            updateBoardView();

        };
    });

    const newGamedBtn = document.getElementById("newGamedBtn");
    newGamedBtn.addEventListener("click", () => {
        console.log("New game")
        resetGame();
        board = [
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ];

        back_board = [
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ];
        score = 0;
        document.getElementById("best_score").innerText = best_score;
        document.getElementById("score").innerText = score;
        updateBoardView();
    });
}



function setGame() {
    console.log("setGame()")
    console.log("score -", score)
    console.log("local - score", localStorage.getItem("score"))
    console.log("local - board", localStorage.getItem("board"))
    if (score > 0) {
        loadGame()
    } else {
        resetGame();
        board = [
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ];

        back_board = [
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ];
    }
    document.getElementById("best_score").innerText = best_score;
    document.getElementById("score").innerText = score;
    updateBoardView();
    // Добавляем сохранение игры при инициализации
}

document.addEventListener('keyup', (e) => {
    let new_list = {
        score: 0,
        list: [
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ]
    };
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            new_list.list[i][j] = board[i][j];
        }
    }
    new_list.score = score;
    list_road_board.push(new_list);
    console.log("list_road_board----", list_road_board)

    console.log("do - back board", back_board);
    if (e.code == "ArrowLeft") {
        slideLeft();
        setTwo();
    } else if (e.code == "ArrowRight") {
        slideRight();
        setTwo();
    } else if (e.code == "ArrowUp") {
        slideUp();
        setTwo();
    } else if (e.code == "ArrowDown") {
        slideDown();
        setTwo();
    }

    saveGame();
    console.log("posle - board", board);
    document.getElementById("score").innerText = score;
    if (isGameOver()) {
        alert("Игра окончена! Нажмите 'OK', чтобы начать заново.");
        resetGame();
        location.reload();
    }
});

function updateBoardView() {
    console.log("updateBoardView()")

    document.getElementById("board").innerHTML = '';
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            let num = board[r][c];
            updateTile(tile, num);
            document.getElementById("board").append(tile);
        }
    }
    console.log("Board new", board)
}

function filterZero(row) {
    return row.filter(num => num != 0);
}

function slide(row) {
    row = filterZero(row);
    for (let i = 0; i < row.length - 1; i++) {
        if (row[i] == row[i + 1]) {
            row[i] *= 2;
            row[i + 1] = 0;
            score += row[i];
        }
    }
    row = filterZero(row);
    while (row.length < columns) {
        row.push(0);
    }
    return row;
}

function slideLeft() {
    for (let r = 0; r < rows; r++) {
        let row = board[r];
        row = slide(row);
        board[r] = row;
        for (let c = 0; c < columns; c++) {
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}

function slideRight() {
    for (let r = 0; r < rows; r++) {
        let row = board[r];
        row.reverse();
        row = slide(row);
        board[r] = row.reverse();
        for (let c = 0; c < columns; c++) {
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}

function slideUp() {
    for (let c = 0; c < columns; c++) {
        let row = [board[0][c], board[1][c], board[2][c], board[3][c]];
        row = slide(row);
        for (let r = 0; r < rows; r++) {
            board[r][c] = row[r];
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}

function slideDown() {
    for (let c = 0; c < columns; c++) {
        let row = [board[0][c], board[1][c], board[2][c], board[3][c]];
        row.reverse();
        row = slide(row);
        row.reverse();
        for (let r = 0; r < rows; r++) {
            board[r][c] = row[r];
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}

function setTwo() {
    if (!hasEmptyTile()) {
        return;
    }
    let found = false;
    while (!found) {
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * columns);
        if (board[r][c] == 0) {
            board[r][c] = 2;
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            tile.innerText = "2";
            tile.classList.add("x2");
            found = true;
        }
    }
}


function hasEmptyTile() {
    let count = 0;
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            if (board[r][c] == 0) {
                return true;
            }
        }
    }
    return false;
}

function isGameOver() {
    if (hasEmptyTile()) {
        return false;
    }
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            if (c < columns - 1 && board[r][c] === board[r][c + 1]) {
                return false;
            }
            if (r < rows - 1 && board[r][c] === board[r + 1][c]) {
                return false;
            }
        }
    }
    return true;
}

function updateTile(tile, num) {
    tile.innerText = "";
    tile.classList.value = "";
    tile.classList.add("tile");
    if (num > 0) {
        tile.innerText = num.toString();
        if (num <= 4096) {
            tile.classList.add("x" + num.toString());
        } else {
            tile.classList.add("x8192");
        }
    }
}

function loadGame() {
    const savedBoard = localStorage.getItem("board");
    const savedScore = parseInt(localStorage.getItem("score"))
    board = JSON.parse(savedBoard);
    score = JSON.parse(savedScore);
    updateBoardView();
}

function saveGame() {
    localStorage.setItem("board", JSON.stringify(board));
    localStorage.setItem("score", score.toString());
    if (score > best_score)
        localStorage.setItem("best_score", score.toString());
}

function resetGame() {
    localStorage.removeItem("board");
    localStorage.removeItem("score");
}