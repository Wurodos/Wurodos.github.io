const gridParent = document.getElementById("gridParent")
const turnText = document.getElementById("turnText")
const cellImgs = gridParent.querySelectorAll("img")

function random(min,max) {
    return Math.floor((Math.random())*(max-min+1))+min;
}
   
const CellState = Object.freeze({
    EMPTY: Symbol("empty"),
    CROSS: Symbol("cross"),
    CIRCLE: Symbol("circle")
})

const CellImage = Object.freeze({
    [CellState.CROSS]: "sprite/img_cross.png",
    [CellState.CIRCLE]: "sprite/img_circle.png"
})

const CellNameRU = Object.freeze({
    [CellState.CROSS] : "КРЕСТЫ",
    [CellState.CIRCLE] : "НОЛИКИ"
})

const board = Array(3).fill(null).map(()=>Array(3).fill(CellState.EMPTY))

const playerShape = random(1, 2) == 1 ? CellState.CROSS : CellState.CIRCLE
turnText.textContent = `Вы играете за ${CellNameRU[playerShape]}`
let currentTurn = CellState.CROSS

// [0,0][0,1][0,2]
// [1,0][1,1][1,2]
// [2,0][2,1][2,2]

function start()
{
    for (let i = 0; i < 9; i++)
    {
        cellImgs[i].onclick = function(){
            if (currentTurn == playerShape && board[Math.floor(i/3)][i%3] == CellState.EMPTY)
                claim(Math.floor(i/3), i%3)
        }
    }
    if (playerShape != currentTurn)
        opponentTurn()
}

function passTurn()
{
    currentTurn = currentTurn == CellState.CROSS ? CellState.CIRCLE : CellState.CROSS
    if (currentTurn != playerShape)
        opponentTurn();
}

function opponentTurn()
{
    let coords = []
    for (let i = 0; i < 3; i++)
        for (let j = 0; j < 3; j++)
            if (board[i][j] == CellState.EMPTY)
                coords.push([i, j])
    const randomCell = coords[random(0, coords.length-1)]
    claim(randomCell[0], randomCell[1])
}

function claim(row, column)
{
    board[row][column] = currentTurn
    cellImgs[row*3 + column%3].src = CellImage[currentTurn]
    if (!gameOverCheck())
        passTurn()
}

function gameOverCheck()
{

    // Rows

    for (let i = 0; i < 3; i++)
    {
        let rowFull = true
        for (let j = 1; j < 3; j++)
        {
            if (board[i][j] == CellState.EMPTY || board[i][j] != board[i][j-1])
                {rowFull = false; break;}
        }
        
        if (rowFull)
            { console.log(`row ${i} full`); endGame(); return true;}
    }

    // Columns

    for (let i = 0; i < 3; i++)
    {
        let colFull = true
        for (let j = 1; j < 3; j++)
        {
            if (board[j][i] == CellState.EMPTY || board[j][i] != board[j-1][i])
                {colFull = false; break;}
        }
        
        if (colFull)
            { console.log(`col ${i} full`); endGame(); return true;}
    }

    // Diagonals

    let nwFull = true
    let neFull = true

    for (let i = 1; i < 3; i++)
    {
        if (board[i][i] === CellState.EMPTY || board[i][i] !== board[i-1][i-1])
            {nwFull = false;}
        if (board[i][2-i] === CellState.EMPTY || board[i][2-i] !== board[i-1][3-i])
            {neFull = false;}
    }

    if (nwFull || neFull)
    {
        console.log("diagonal full");
        endGame()
        return true;
    }

    // Board is full
    for (let i =0; i< 3; i++)
        for (let j = 0; j < 3; j++)
            if (board[i][j] == CellState.EMPTY)
                return false;
    
    endGameDraw();
    return true;
}

function endGame()
{
    window.alert(`Игра окончена. Победа ${CellNameRU[currentTurn]}`)
}

function endGameDraw()
{
    window.alert(`Игра окончена. Ничья`)
}

start()




