// 1 = wall
// 2 = path
// 3 = ghost-cave
// 4 = treat

// Cherry icon by https://www.flaticon.com/authors/good-ware

const map = document.getElementById('pickman-board');

const layout = [
    [4, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 4],
    [2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2],
    [2, 2, 2, 2, 2, 1, 2, 4, 2, 1, 2, 2, 2, 2, 2],
    [2, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 2],
    [2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2],
    [1, 1, 2, 1, 2, 1, 1, 2, 1, 1, 2, 1, 2, 1, 1],
    [5, 2, 2, 2, 2, 1, 3, 3, 3, 1, 2, 2, 2, 2, 6],
    [1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1],
    [2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2],
    [2, 1, 1, 2, 1, 1, 2, 1, 2, 1, 1, 2, 1, 1, 2],
    [2, 2, 1, 2, 2, 2, 2, 4, 2, 2, 2, 2, 1, 2, 2],
    [1, 2, 1, 2, 1, 2, 1, 1, 1, 2, 1, 2, 1, 2, 1],
    [2, 2, 2, 2, 1, 2, 2, 1, 2, 2, 1, 2, 2, 2, 2],
    [2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2],
    [4, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 4]
]

let pickman;
let pickmanDiv;
let ghosts = [];
let colors = ['blue', 'pink', 'green', 'red'];
let startingLocations = [{x: 6, y: 6}, {x: 7, y: 6}, {x: 8, y: 6}, {x: 7, y: 5}];

let gameTickIntervalPlayer;
let gameTickIntervalNPC;
document.addEventListener('keyup', keyPressed);

let gameState = {
    treatRush: false,
    score: 0,
    active: true
}

startGame();

// Game tick functions

function startGame(){
    buildBoard();
    drawCharacters();
    gameTickIntervalPlayer = setInterval(gameTickPlayer, 12);
    gameTickIntervalNPC = setInterval(gameTickNPC, 15);
}

function gameTickPlayer(){
    if(pickman.nextDirection){
        movePickman(pickman.nextDirection);
    }
}

function gameTickNPC(){
    for(let i in ghosts){
        moveGhost(ghosts[i]);
    }
}

// Pickman functions

function movePickman(nextDirection){
    /*
        This function moves the Pickman
        It continues the current course unless:
            - it hits a wall
            - it is at a junction and the nextDirection is possible
        It will allow the PickMan to turn backwards immeditately
    */

    let topChange = 0;
    let leftChange = 0;
    let pickmanCoords = currentCoords(pickmanDiv);
    let options = canGo(pickmanCoords);

    if(pickmanCoords.inBox){
        // if the PickMan is at a junction or box then it can change its direction

        // if the PickMan is not moving yet then the user can choose any direction available.
        if(!pickman.currentDirection){
            // no currentDirection? Allow any available direction
            if(options.array.indexOf(nextDirection) != -1){
                pickman.currentDirection = nextDirection;
            } else {
                pickman.currentDirection = null;
            }
        } else if(options.array.indexOf(nextDirection) != -1){
            // if we are at a junction and the next direction is available then keep going
            pickman.currentDirection = nextDirection;
        } else if(options.array.indexOf(pickman.currentDirection) == -1){
            console.log(pickman.currentDirection);
            pickman.currentDirection = null;
        }

    } else {
        // if the PickMan is NOT at a junction then it can only reverse its direction
        if(nextDirection == pickman.oppositeDirection){
            console.log("test");
            pickman.currentDirection = nextDirection;
        }
    }

    switch(pickman.currentDirection){
        case 'up':
            topChange = -1;
            break;
        case 'right':
            leftChange = 1;
            break;
        case 'down':
            topChange = 1;
            break;    
        case 'left':
            leftChange = -1;
            break;
    }

    // move the selected ghost
    pickmanDiv.style.top = parseInt(pickmanDiv.style.top) + topChange + 'px';
    pickmanDiv.style.left = parseInt(pickmanDiv.style.left) + leftChange + 'px';

}

function keyPressed(e){
    if(gameState.active){
        let key = false;
        if (e.keyCode === 40) {
            key = 'down';
        } else if (e.keyCode === 38) {
            key = 'up';
        } else if (e.keyCode === 37) {
            key = 'left';
        } else if (e.keyCode === 39) {
            key = 'right';
        }
        if(key && key != pickman.currentDirection){
            pickman.nextDirection = key;
        }
    }
}

// Game Setup

/** Function to draw the divs that contain the ghosts and Pickman */
function drawCharacters(){

    // Ghosts
    for(let i = 0; i < colors.length; i++){
        let ghost = document.createElement('div');
        let ghostPos = returnLocOnBoard(startingLocations[i].x, startingLocations[i].y);
        let id = 'ghost'+i;
        ghost.id = id;
        ghost.classList.add('ghost-'+colors[i], 'ghost', 'char');
        
        ghost.style.top = ghostPos.y;
        ghost.style.left = ghostPos.x;
        ghosts.push(new Ghost(startingLocations[i], colors[i], i, id));
        map.appendChild(ghost);
    }

    // Set Up Pickman Div
    pickmanDiv = document.createElement('div');
    pickmanDiv.id = "pickman";
    pickmanDiv.classList.add('char');
    map.appendChild(pickmanDiv);
    
    //Set Up Pickman Object
    pickman = new PickMan(pickmanDiv);

    pickmanPos = returnLocOnBoard(pickman.startingLocation.x, pickman.startingLocation.y);
    pickmanDiv.style.top = pickmanPos.y;
    pickmanDiv.style.left = pickmanPos.x;
}

/** Function checks what directions the ghost can move, if it is at a junction and then moves it. */
function moveGhost(ghost){

    // do not allow it to go back on itself unless its forward path is blocked
    let ghostDiv = document.getElementById(ghost.id);
    let ghostCoords = currentCoords(ghostDiv);
    let choice = null;
    let leftChange = 0;
    let topChange = 0;

    // check if the ghost is in a box or not (at a junction)
    if(ghostCoords.inBox){
        /** List of directions available to character */
        let options = canGo(ghostCoords);
        /** remove the opposite of current travelling direction to avoid Ghost going backwards and forwards unless that is the only options */
        if(ghost.oppositeDirection){
            let index = options.array.indexOf(ghost.oppositeDirection);
            if (index > -1 && options.array.length > 1) {
                options.array.splice(index, 1);
            }
        }

        /** Choice made by NPC from available list - returns 'up', 'down' etc */
        choice = null;
        let randomChoice = null;
        if(options.array.length == 1){
            choice = options.array[0];
        } else if(options.array.length > 1) {       
            randomChoice = Math.floor(Math.random() * Math.floor(options.array.length));
            choice = options.array[randomChoice];
        }
        
    } else {
        // if the ghost is not fully in a box at the moment, keep going in the same direction
        choice = ghost.direction;
    }   
    
    switch(choice){
        case 'up':
            topChange = -1;
            ghost.direction = 'up';
            break;
        case 'right':
            leftChange = 1;
            ghost.direction = 'right';
            break;
        case 'down':
            topChange = 1;
            ghost.direction = 'down';
            break;    
        case 'left':
            leftChange = -1;
            ghost.direction = 'left';
            break;
    }

    // move the selected ghost
    ghostDiv.style.top = parseInt(ghostDiv.style.top) + topChange + 'px';
    ghostDiv.style.left = parseInt(ghostDiv.style.left) + leftChange + 'px';

}

// Utility functions here 

/** Function to return an .x and .y in px extrapolated from board coords */
function returnLocOnBoard(x, y){
    return {
        x: ((x) * 40)+'px',
        y: ((y) * 40)+'px',
    }
}

/** Function to return what XY Coords the chosen character is closest to */
function currentCoords(character){
    let characterDiv = document.getElementById(character.id);
    let x = parseInt(characterDiv.style.left);
    let y = parseInt(characterDiv.style.top);
    
    return {
        x: Math.round(x / 40),
        y: Math.round(y / 40),
        inBox: isFullyInBox(x, y)
    }
}

/** Function to return which directions are clear from a given box */
function canGo(coords){
    let results = {
        'up': false,
        'right': false,
        'down': false,
        'left': false,
        'array': []
    }
    
    let aboveDiv = document.getElementById('box_'+coords.x+'_'+(coords.y-1));
    let belowDiv = document.getElementById('box_'+coords.x+'_'+(coords.y+1));
    let rightDiv = document.getElementById('box_'+(coords.x+1)+'_'+coords.y);
    let leftDiv = document.getElementById('box_'+(coords.x-1)+'_'+coords.y);


    if(aboveDiv){
        if(aboveDiv.classList.contains('path')) {
            results.up = true;
            results.array.push('up');
        }
        if(aboveDiv.classList.contains('ghost-cave')) {
            results.up = 'cave';
        }
    }
    if(belowDiv){
        if(belowDiv.classList.contains('path')) {
            results.down = true;
            results.array.push('down');
        }
        if(belowDiv.classList.contains('ghost-cave')) {
            results.down = 'cave';
        }
    }
    if(rightDiv){
        if(rightDiv.classList.contains('path')) {
            results.right = true;
            results.array.push('right');
        }
        if(rightDiv.classList.contains('ghost-cave')) {
            results.right = 'cave';
        }
    }
    if(leftDiv){
        if(leftDiv.classList.contains('path')) {
            results.left = true;
            results.array.push('left');
        }
        if(leftDiv.classList.contains('ghost-cave')) {
            results.left = 'cave';
        }
    }
    
    return results;

}

function isFullyInBox(x, y){
    if(x % 40 == 0 && y % 40 == 0){
        return true;
    } else {
        return false;
    }
}

// Gameboard building functions below here

function addTreats(){
    let treatLocations = document.getElementsByClassName('treat');
}

function buildBoard(){
    for(let i = 0; i < layout.length; i++){
        let row = document.createElement('div');
        row.id = 'row_'+i;
        row.classList.add('box-row');
        map.appendChild(row);
        for(let j = 0; j < layout[i].length; j++){
            let box = document.createElement('div');
            box.id = 'box_'+j+'_'+i;
            box.classList.add('box');
            if(layout[i][j] === 1){
                box.classList.add('wall');
            } else if(layout[i][j] === 2){
                box.classList.add('path');
            } else if(layout[i][j] === 3){
                box.classList.add('ghost-cave', 'path');
            } else if(layout[i][j] === 4){
                box.classList.add('path', 'treat');
            } else if(layout[i][j] === 5){
                box.classList.add('gate-left');
            } else if(layout[i][j] === 6){
                box.classList.add('gate-right');
            } else {
                throwError('Error with layout number provided to buildBoard. Number provided: '+layout[i][j]);
            }
            row.appendChild(box);
        }
    }
}



// Error Handling

function throwError(err){
    console.log(err);
}