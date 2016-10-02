function BotRemoteControl(botSocket){
    var currentMovementInterval = null;

    this.createInterval = function(action){
        if(currentMovementInterval != null)
            return false;

        currentMovementInterval = setInterval( action, 300 );
        return true;
    }

    this.releaseInterval = function(){
        clearInterval(currentMovementInterval);
        currentMovementInterval = null;
    }
}

BotRemoteControl.prototype.goForward = function(){
    this.createInterval( () => {
        console.log("Forward!");
    })
}

BotRemoteControl.prototype.goBackward = function(){
    this.createInterval( () => {
        console.log("Backward!");
    })
}

BotRemoteControl.prototype.turnLeft = function(){
    this.createInterval( () => {
        console.log("Turning left!");
    })
}

BotRemoteControl.prototype.turnRight = function(){
    this.createInterval( () => {
        console.log("Turning right!");
    })
}

BotRemoteControl.prototype.stop = function(){
    this.releaseInterval();
}

BotRemoteControl.prototype.addKeyListeners = function(target){
    target.addEventListener("keydown", (e) => {
        if(currentMovementInterval != null)
            return;
        switch(e.keyCode){
            case 38:
                return goForward();
            case 40:
                return goBackward();
            case 37:
                return turnLeft();
            case 39:
                return turnRight();
        }
    });

    target.addEventListener("keyup", (e) => {
        switch(e.keyCode){
            case 38:
            case 40:
            case 37:
            case 39:
                return stop();
        }
    });
}
