function BotRemoteControl(){
    var currentMovementInterval = null;
    var socket;
    var forwardButton = null;
    var leftButton = null;
    var backwardButton = null;
    var rightButton = null;

    this.getForwardButton = function(){
        return forwardButton;
    }

    this.setForwardButton = function(element){

        element.addEventListener("mousedown", this.goForward.bind(this), false);
        element.addEventListener("mouseup", this.stop.bind(this), false);
        forwardButton = element;

    }

    this.getLefButton = function(){
        return leftButton;
    }
    this.setLeftButton = function(element){

        element.addEventListener("mousedown", this.turnLeft.bind(this), false);
        element.addEventListener("mouseup", this.stop.bind(this), false);
        leftButton = element;

    }

    this.getBackwardButton = function(){
        return bacwardButton;
    }
    this.setBackwardButton = function(element){

        element.addEventListener("mousedown", this.goBackward.bind(this), false);
        element.addEventListener("mouseup", this.stop.bind(this), false);
        backwardButton = element;

    }

    this.getRightButton = function(){
        return rightButton;
    }
    this.setRightButton = function(element){

        element.addEventListener("mousedown", this.turnRight.bind(this), false);
        element.addEventListener("mouseup", this.stop.bind(this), false);
        rightButton = element;

    }

    this.getSocket = function(){
        return socket;
    }

    this.setSocket = function(_socket){
        socket = _socket;
    }

    this.hasInterval = function(){
        return currentMovementInterval != null;
    }

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

    this.sendSignal = function(direction, speed){
        if(direction.length === 0)
            direction = 'S';

        direction = direction.substring(0,1).toUpperCase();


        speed = parseInt(speed);

        if(isNaN(parseInt(speed)))
            speed = 0;

        if(speed < 0)
            speed = 0;

        if(speed > 100)
            speed = 100

        socket.emit("move",{
            'direction': direction,
            'speed': speed
        });
    }

}

BotRemoteControl.prototype.goForward = function(e){

    this.createInterval( () => {
        console.info("Forward");
        this.sendSignal("F",100);
    })
}

BotRemoteControl.prototype.goBackward = function(e){
    if(typeof e != 'undefined'){
        if( typeof e.preventDefault === 'function' )
            e.preventDefault();
    }
    this.createInterval( () => {
        console.log("Backward!");
        this.sendSignal("B",100);
    })
}

BotRemoteControl.prototype.turnLeft = function(e){
    if(typeof e != 'undefined'){
        if( typeof e.preventDefault === 'function' )
            e.preventDefault();
    }
    this.createInterval( () => {
        console.log("Turning left!");
        this.sendSignal("L",100);
    })
}

BotRemoteControl.prototype.turnRight = function(e){
    if(typeof e != 'undefined'){
        if( typeof e.preventDefault === 'function' )
            e.preventDefault();
    }
    this.createInterval( () => {
        console.log("Turning right!");
        this.sendSignal("R",100);
    })
}

BotRemoteControl.prototype.stop = function(e){
    if(typeof e != 'undefined'){
        if( typeof e.preventDefault === 'function' )
            e.preventDefault();
    }
    console.log('stop!');
    this.releaseInterval();
    this.sendSignal("S",100);
}

BotRemoteControl.prototype.addTouchListeners = function(target){
    target.addEventListener("touchstart", (e) => {
        e.preventDefault();

        switch(e.target){
            case this.getForwardButton():
                return this.goForward();
            case this.getLefButton():
                return this.turnLeft();
            case this.getRightButton():
                return this.turnRight();
            case this.getBackwardButton():
                return this.goBackward();

        }
    })

    target.addEventListener("touchend", () => {
        this.stop();
    })
}

BotRemoteControl.prototype.addKeyListeners = function(target){
    target.addEventListener("keydown", (e) => {
        if(this.hasInterval())
            return;

        switch(e.keyCode){
            case 38:
                return this.goForward();
            case 40:
                return this.goBackward();
            case 37:
                return this.turnLeft();
            case 39:
                return this.turnRight();
        }
    });

    target.addEventListener("keyup", (e) => {
        switch(e.keyCode){
            case 38:
            case 40:
            case 37:
            case 39:
                return this.stop();
        }
    });
}
