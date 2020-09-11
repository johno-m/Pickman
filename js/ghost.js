class Ghost {
    constructor(startLoc, color, i, id){
        this.icon = 'ghost-'+color+'.svg';
        this.location = startLoc;
        this.direction = null;
        this.isFlashing = false;
        this.id = id;
        this.num = i;
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

    flash(){
        if(this.isFlashing) {
            setInterval(this.flash(), 500);
        }
    }
    endFlash(){
        this.isFlashing = false;
    }
}

class PickMan {
    constructor(target){
        this.nextDirection = null;
        this.currentDirection = null;
        this.startingLocation = {x: 7, y: 14};
        this.mouthAnimation();
        this.mouthOpen = false;
    }
    
    flash(){
        if(this.isFlashing) {
            setInterval(this.flash(), 500);
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