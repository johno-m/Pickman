// 1 = wall
// 2 = path
// 3 = ghost-cave
// 4 = treat

// Cherry icon by https://www.flaticon.com/authors/good-ware

const map = document.getElementById('pickman-board')
const startScreen = document.getElementById('pickman-welcome')
const endScreen = document.getElementById('pickman-endscreen')

const layout = [
    [4, 7, 7, 7, 7, 7, 7, 1, 7, 7, 7, 7, 7, 7, 4],
    [7, 1, 7, 1, 7, 1, 7, 1, 7, 1, 7, 1, 7, 1, 7],
    [7, 7, 7, 7, 7, 1, 7, 4, 7, 1, 7, 7, 7, 7, 7],
    [7, 1, 7, 1, 1, 1, 7, 1, 7, 1, 1, 1, 7, 1, 7],
    [7, 7, 7, 1, 7, 7, 7, 7, 7, 7, 7, 1, 7, 7, 7],
    [1, 1, 7, 1, 7, 1, 1, 7, 1, 1, 7, 1, 7, 1, 1],
    [5, 7, 7, 7, 7, 1, 3, 3, 3, 1, 7, 7, 7, 7, 6],
    [1, 1, 7, 1, 7, 1, 1, 1, 1, 1, 7, 1, 7, 1, 1],
    [7, 7, 7, 7, 7, 7, 7, 1, 7, 7, 7, 7, 7, 7, 7],
    [7, 1, 1, 7, 1, 1, 7, 1, 7, 1, 1, 7, 1, 1, 7],
    [7, 7, 1, 7, 7, 7, 7, 4, 7, 7, 7, 7, 1, 7, 7],
    [1, 7, 1, 7, 1, 7, 1, 1, 1, 7, 1, 7, 1, 7, 1],
    [7, 7, 7, 7, 1, 7, 7, 1, 7, 7, 1, 7, 7, 7, 7],
    [7, 1, 1, 1, 1, 1, 7, 1, 7, 1, 1, 1, 1, 1, 7],
    [4, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 4]
]

// test layout for end game
const layout2 = [
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
    [4, 2, 2, 2, 2, 2, 2, 2, 2, 2, 7, 7, 2, 2, 4]
]

//** PickMan object */
let pickman
//** PickMan div */
let pickmanDiv
//** Ghost objects */
let ghosts = []
//** Ghost colors */
let colors = ['blue', 'pink', 'green', 'red']
//** Ghost starting locations */
let startingLocations = [{x: 6, y: 6}, {x: 7, y: 6}, {x: 8, y: 6}, {x: 7, y: 5}]
//**  colors */
let boxSize
//** Variable to store the timeout counter for window.resize */
let timeout = 50
//** Variable to store the ghost timeout */
let ghostTimeout = 20
let resizeInProgress = false

//** Global intervals */
let resizeInterval
let gameTickIntervalPlayer
let gameTickIntervalNPC
let collisionInterval
let flashInterval

let gameState = {
    treatRush: false,
    score: 0,
    active: false,
    boxSize: 0
}

function startGame(){
    // Switch the visible screen
    
    map.style.display = 'flex'
    endScreen.style.display = 'none'
    startScreen.style.display = 'none'
    // Change overall gamestate
    gameState.active = true
    // Make sure ghosts array is empty
    ghosts = []
    // Reset gameState to blank
    gameState = {
        treatRush: false,
        score: 0,
        active: true,
        boxSize: 0
    }
    map.innerHTML = ""
    buildBoard()
    drawCharacters()
    gameTickIntervalPlayer = setInterval(gameTickPlayer, 12)
    gameTickIntervalNPC = setInterval(gameTickNPC, 20)
    collisionInterval = setInterval(collisionDetection, 100)
    // Swipe Event for mobile devices

}

//** Event listener to adjust gameboard size depending on window size */
window.addEventListener('resize', resizeWindow)
//** Event listener for keys */
document.addEventListener('keyup', keyPressed)
//** Event listener for mobile swipe */
document.addEventListener('swiped', function(e) {
    if(e.detail.dir && e.detail.dir != pickman.currentDirection){
        pickman.nextDirection = e.detail.dir
    }
})

function endGame(reason){
    gameState.active = false
    document.getElementById('scoreH3').innerText = 'Final Score: '+gameState.score
    clearInterval(gameTickIntervalPlayer)
    clearInterval(gameTickIntervalNPC)
    clearInterval(collisionInterval)
    map.style.display = 'none'
    endScreen.style.display = 'flex'
    startScreen.style.display = 'none'
    if(reason == "win") {
        document.getElementById('endGameTitle').innerHTML = `YOU WIN!!` 
        console.log(document.getElementById('scoreH2').innerText)
    } else { 
        document.getElementById('endGameTitle').innerHTML = `Too bad... maybe try again?`
    }
}

function gameTickPlayer(){
    if(gameState.active){
        if(pickman.nextDirection){
            movePickman(pickman.nextDirection)
        }
    }
}

function gameTickNPC(){
    if(gameState.active){
        for(let i in ghosts){
            moveGhost(ghosts[i])
        }
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

    let topChange = 0
    let leftChange = 0
    let pickmanCoords = currentCoords(pickmanDiv)
    let options = canGo(pickmanCoords)

    if(pickmanCoords.inBox){
        // if the PickMan is at a junction or box then it can change its direction

        // if the PickMan is not moving yet then the user can choose any direction available.
        if(!pickman.currentDirection){
            // no currentDirection? Allow any available direction
            if(options.array.indexOf(nextDirection) != -1){
                pickman.currentDirection = nextDirection
            } else {
                pickman.currentDirection = null
            }
        } else if(options.array.indexOf(nextDirection) != -1){
            // if we are at a junction and the next direction is available then keep going
            pickman.currentDirection = nextDirection
        } else if(options.array.indexOf(pickman.currentDirection) == -1){
            console.log(pickman.currentDirection)
            pickman.currentDirection = null
        }

    } else {
        // if the PickMan is NOT at a junction then it can only reverse its direction
        if(nextDirection == pickman.oppositeDirection){
            pickman.currentDirection = nextDirection
        }
    }

    switch(pickman.currentDirection){
        case 'up':
            topChange = -1
            break
        case 'right':
            leftChange = 1
            break
        case 'down':
            topChange = 1
            break    
        case 'left':
            leftChange = -1
            break
    }

    // move the selected ghost
    pickmanDiv.style.top = parseInt(pickmanDiv.style.top) + topChange + 'px'
    pickmanDiv.style.left = parseInt(pickmanDiv.style.left) + leftChange + 'px'

}

function keyPressed(e){
    if(gameState.active){
        let key = false
        switch(e.keyCode) {
            case 40:
                key = 'down'
                break
            case 38:
                key = 'up'
                break
            case 37: 
                key = 'left'
                break
            case 39:
                key = 'right'
                break
        }
        if(key && key != pickman.currentDirection){
            pickman.nextDirection = key
        }
    }
}

// Game Setup

/** Function to draw the divs that contain the ghosts and Pickman */
function drawCharacters(){

    // Ghosts
    for(let i = 0; i < colors.length; i++){
        let ghost = document.createElement('div')
        let ghostPos = returnLocOnBoard(startingLocations[i].x, startingLocations[i].y)
        let id = 'ghost'+i
        ghost.id = id
        ghost.classList.add('ghost-'+colors[i], 'ghost', 'char')
        ghost.setAttribute('num', i)
        ghost.style.top = ghostPos.y
        ghost.style.left = ghostPos.x
        ghosts.push(new Ghost(startingLocations[i], colors[i], i, id))
        map.appendChild(ghost)
    }

    // Set Up Pickman Div
    pickmanDiv = document.createElement('div')
    pickmanDiv.id = "pickman"
    pickmanDiv.classList.add('char')
    map.appendChild(pickmanDiv)
    
    //Set Up Pickman Object
    pickman = new PickMan(pickmanDiv)

    pickmanPos = returnLocOnBoard(pickman.startingLocation.x, pickman.startingLocation.y)
    pickmanDiv.style.top = pickmanPos.y
    pickmanDiv.style.left = pickmanPos.x
}

/** Function checks what directions the ghost can move, if it is at a junction and then moves it. */
function moveGhost(ghost){

    // do not allow it to go back on itself unless its forward path is blocked
    let ghostDiv = document.getElementById(ghost.id)
    let ghostCoords = currentCoords(ghostDiv)
    let choice = null
    let leftChange = 0
    let topChange = 0

    // check if the ghost is in a box or not (at a junction)
    if(ghostCoords.inBox){
        /** List of directions available to character */
        let options = canGo(ghostCoords)
        /** remove the opposite of current travelling direction to avoid Ghost going backwards and forwards unless that is the only options */
        if(ghost.oppositeDirection){
            let index = options.array.indexOf(ghost.oppositeDirection)
            if (index > -1 && options.array.length > 1) {
                options.array.splice(index, 1)
            }
        }

        /** Choice made by NPC from available list - returns 'up', 'down' etc */
        choice = null
        let randomChoice = null
        if(options.array.length == 1){
            choice = options.array[0]
        } else if(options.array.length > 1) {       
            randomChoice = Math.floor(Math.random() * Math.floor(options.array.length))
            choice = options.array[randomChoice]
        }
        
    } else {
        // if the ghost is not fully in a box at the moment, keep going in the same direction
        choice = ghost.direction
    }   
    
    switch(choice){
        case 'up':
            topChange = -1
            ghost.direction = 'up'
            break
        case 'right':
            leftChange = 1
            ghost.direction = 'right'
            break
        case 'down':
            topChange = 1
            ghost.direction = 'down'
            break    
        case 'left':
            leftChange = -1
            ghost.direction = 'left'
            break
    }

    // move the selected ghost
    ghostDiv.style.top = parseInt(ghostDiv.style.top) + topChange + 'px'
    ghostDiv.style.left = parseInt(ghostDiv.style.left) + leftChange + 'px'

}

// Utility functions here 

/** Function to return an .x and .y in px extrapolated from board coords */
function returnLocOnBoard(x, y){
    return {
        x: ((x) * gameState.boxSize)+'px',
        y: ((y) * gameState.boxSize)+'px',
    }
}

/** Function to return what XY Coords the chosen character is closest to */
function currentCoords(character){
    let characterDiv = document.getElementById(character.id)
    let x = parseInt(characterDiv.style.left)
    let y = parseInt(characterDiv.style.top)
    return {
        x: Math.round(x / gameState.boxSize),
        y: Math.round(y / gameState.boxSize),
        inBox: isFullyInBox(x, y)
    }
}

/** Function to check for collision and items */
function collisionDetection(){
    let ghostDivs = document.getElementsByClassName('ghost')
    let treats = document.getElementsByClassName('treat')
    let numOfDots = document.getElementsByClassName('dot')
    let pickmanLoc = currentCoords(pickmanDiv)
    /** the square the PickMan is currently on */
    let currentSquare = document.getElementById("box_"+pickmanLoc.x+"_"+pickmanLoc.y)
    console.log(`numOfDots = ${numOfDots.length}`)
    if(numOfDots.length < 1){
        endGame('win')
    }
    if(currentSquare.classList.contains('dot')){
        currentSquare.classList.remove('dot')
        gameState.score += 10
    }
    
    Array.prototype.forEach.call(ghostDivs, function(el) {
        // Get box XY
        let ghostLoc = currentCoords(el)
        if(pickmanLoc.x == ghostLoc.x && pickmanLoc.y == ghostLoc.y){
            collisionHasHappened(el, 'ghost')
        }
    })
    
    Array.prototype.forEach.call(treats, function(el) {
        // Use treat div id to get XY coords. Split by the _ to get [ box, x, y ]
        let treatLoc = el.id.split('_')
        if(pickmanLoc.x == treatLoc[1] && pickmanLoc.y == treatLoc[2]){
            collisionHasHappened(el, 'treat')
        }
    })
    
    // check if PickMan is on side gate
    if(pickmanLoc.x == 0 && pickmanLoc.y == 6 && pickman.currentDirection == "left"){
        //Pickman is on left gate
        const newLoc = returnLocOnBoard(14, 6)
        console.log((newLoc.y)+'px')
        console.log((newLoc.x)+'px')
        pickmanDiv.style.top = newLoc.y
        pickmanDiv.style.left = newLoc.x
    }
    if(pickmanLoc.x == 14 && pickmanLoc.y == 6 && pickman.currentDirection == "right"){
        //Pickman is on right gate
        const newLoc = returnLocOnBoard(0, 6)
        pickmanDiv.style.top = newLoc.y
        pickmanDiv.style.left = newLoc.x
    }

    document.getElementById("scoreH2").innerHTML = "Score: "+gameState.score

}

//** Function called when a Ghost is 'killed' */
function killGhost(target){
    target.style.top = (gameState.boxSize*6) + 'px'
    target.style.left = (gameState.boxSize*8) + 'px'
    if(target.getAttribute(num)){
        ghosts[target.getAttribute(num)].currentDirection = null
    } else {
        console.log(target)
    }
}

//** Function looped by 'flashInterval' */
function flashGhosts(){
    ghostTimeout -= 1
    if(ghostTimeout > 1){
        for(let i = 0; i < ghosts.length; i++){
            ghosts[i].flash(ghostTimeout)
        }
    } else {
        for(let i = 0; i < ghosts.length; i++){
            clearInterval(flashInterval)
            gameState.treatRush = false
            ghosts[i].resetFlash()
        }
    }
}

/** Function called when collision has been detected */
function collisionHasHappened(target, type){
    if(type == 'treat'){
        gameState.score += 50
        gameState.treatRush = true
        target.classList.remove('treat')
        ghostTimeout = 20
        clearInterval(flashInterval)
        flashInterval = setInterval(flashGhosts, 600)
    }
    if(type == 'ghost'){
        if(gameState.treatRush){
            gameState.score += 100
            killGhost(target)
        } else {
            endGame('ghost')
        }
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
    
    let aboveDiv = document.getElementById('box_'+coords.x+'_'+(coords.y-1))
    let belowDiv = document.getElementById('box_'+coords.x+'_'+(coords.y+1))
    let rightDiv = document.getElementById('box_'+(coords.x+1)+'_'+coords.y)
    let leftDiv = document.getElementById('box_'+(coords.x-1)+'_'+coords.y)

    if(aboveDiv){
        if(aboveDiv.classList.contains('path')) {
            results.up = true
            results.array.push('up')
        }
        if(aboveDiv.classList.contains('ghost-cave')) {
            results.up = 'cave'
        }
    }
    if(belowDiv){
        if(belowDiv.classList.contains('path') && !belowDiv.classList.contains('ghost-cave')) {
            results.down = true
            results.array.push('down')
        }
    }
    if(rightDiv){
        if(rightDiv.classList.contains('path') || rightDiv.classList.contains('gate-right')) {
            results.right = true
            results.array.push('right')
        }
        if(rightDiv.classList.contains('ghost-cave')) {
            results.right = 'cave'
        }
    }
    if(leftDiv){
        if(leftDiv.classList.contains('path') || leftDiv.classList.contains('gate-left')) {
            results.left = true
            results.array.push('left')
        }
        if(leftDiv.classList.contains('ghost-cave')) {
            results.left = 'cave'
        }
    }
    
    return results

}

function isFullyInBox(x, y){
    if(x % gameState.boxSize == 0 && y % gameState.boxSize == 0){
        return true
    } else {
        return false
    }
}

// Gameboard building functions below here

function addTreats(){
    let treatLocations = document.getElementsByClassName('treat')
}

function resizeLoop(){
    
    if(timeout < 0){
        findBoxSize()
        clearInterval(resizeInterval)
        resetPositions()
        gameState.active = true
        resizeInProgress = false
        
    } else {
        timeout--
        resizeInProgress = true
    }
}

function resizeWindow(){
    gameState.active = false
    timeout = 50
    if(!resizeInProgress){
        resizeInProgress = true
        savePositions()
        resizeInterval = setInterval(resizeLoop, 20)
    }
}

function savePositions(){
    let ghostDivs = document.getElementsByClassName('ghost')
    let pickmanDiv = document.getElementById('pickman')
    Array.prototype.forEach.call(ghostDivs, function(el) {
        let coords = currentCoords(el)
        
        if(coords.x < 0 || coords.x > 14 || coords.y < 0 || coords.y > 14){
            el.savedPosition = el.location
            console.log(el.id)
        } else {
            el.savedPosition = currentCoords(el)
        }
    })
    pickmanDiv.savedPosition = currentCoords(pickmanDiv)
}

function resetPositions(){
    let ghostDivs = document.getElementsByClassName('ghost')
    let pickmanDiv = document.getElementById('pickman')
    Array.prototype.forEach.call(ghostDivs, function(el) {
        el.style.top = (el.savedPosition.y * gameState.boxSize)+'px'
        el.style.left = (el.savedPosition.x * gameState.boxSize)+'px'
    })
    pickmanDiv.style.top = (pickmanDiv.savedPosition.y * gameState.boxSize)+'px'
    pickmanDiv.style.left = (pickmanDiv.savedPosition.x * gameState.boxSize)+'px'
}

function findBoxSize(){
    // get the box size by dividing the row width by the number of boxes
    gameState.boxSize = document.getElementById('row_0').offsetWidth / 15
}

function buildBoard(){
    for(let i = 0; i < layout.length; i++){
        let row = document.createElement('div')
        row.id = 'row_'+i
        row.classList.add('box-row')
        map.appendChild(row)
        for(let j = 0; j < layout[i].length; j++){
            let box = document.createElement('div')
            box.id = 'box_'+j+'_'+i
            box.classList.add('box')
            if(layout[i][j] === 1){
                box.classList.add('wall')
            } else if(layout[i][j] === 2){
                box.classList.add('path')
            } else if(layout[i][j] === 3){
                box.classList.add('ghost-cave', 'path')
            } else if(layout[i][j] === 4){
                box.classList.add('path', 'treat')
            } else if(layout[i][j] === 5){
                box.classList.add('gate-left')
            } else if(layout[i][j] === 6){
                box.classList.add('gate-right')
            } else if(layout[i][j] === 7){
                box.classList.add('path', 'dot')
            } else {
                throwError('Error with layout number provided to buildBoard. Number provided: '+layout[i][j])
            }
            row.appendChild(box)
        }
    }
    // store the size of the box for future use
    findBoxSize()
}

// Error Handling

function throwError(err){
    console.log(err)
}

window.addEventListener('resize', adjustWidth)
window.addEventListener('load', adjustWidth)

function adjustWidth(){
    const width = (Math.floor(window.innerWidth / 15) * 15) + 20
    document.documentElement.style.setProperty('--cw', `${width}px`);
}