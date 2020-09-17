class Ghost {
    constructor(startLoc, color, i, id){
        this.icon = 'ghost-'+color+'.svg';
        this.location = startLoc;
        this.direction = null;
        this.isFlashing = false;
        this.id = id;
        this.num = i;
        this.savedPosition = startLoc; 
        this.flashInterval;
    }

    /** Returns the opposite direction the Ghost is currently travelling in */
    get oppositeDirection() {
        if(this.direction) {
            switch(this.direction){
                case 'up':
                    return 'down'
                    break;
                case 'right':
                    return 'left'
                    break;
                case 'down':
                    return 'up'
                    break;    
                case 'left':
                    return 'right'
                    break;
            }
        } else {
            return null;
        }
    }

    flash(count){
        let ghost = document.getElementById(this.id);
        let A = 'url("./assets/ghost-grey.svg")';
        let B = 'url("./assets/ghost-white.svg")';
        if(count < 5){
            A = 'url("./assets/'+this.icon+'")';
        }
        
        if(ghost.style.backgroundImage == B){
            ghost.style.backgroundImage = A;
        } else {
            ghost.style.backgroundImage = B;
        }
    }

    resetFlash(){
        document.getElementById(this.id).style.backgroundImage = 'url("./assets/'+this.icon+'")';
    }

}

class PickMan {
    constructor(target){
        this.nextDirection = null;
        this.currentDirection = null;
        this.startingLocation = {x: 7, y: 14};
        this.mouthAnimation();
        this.mouthOpen = false;
        this.savedPosition = {x: 7, y: 14}; 
    }
    
    flash(){
        if(this.isFlashing) {
            this.flashInterval = setInterval(this.flash(), 500);
        }
    }
    endFlash(){
        this.isFlashing = false;
    }

    get oppositeDirection() {
        if(this.currentDirection) {
            switch(this.currentDirection){
                case 'up':
                    return 'down'
                    break;
                case 'right':
                    return 'left'
                    break;
                case 'down':
                    return 'up'
                    break;    
                case 'left':
                    return 'right'
                    break;
            }
        } else {
            return null;
        }
    }

    mouthAnimation(){
        if(this.mouthOpen){
            document.getElementById('pickman').classList.remove("open-mouth");
            document.getElementById('pickman').classList.add("close-mouth");
            this.mouthOpen = false;
        } else {
            document.getElementById('pickman').classList.add("open-mouth");
            document.getElementById('pickman').classList.remove("close-mouth");
            this.mouthOpen = true;
        }
        setInterval(this.mouthAnimation, 500);
    }
}