function BotRemoteControl(){
    var currentMovementInterval = null;
    var socket;

    this.getSocket = function(){
        return socket;
    }
    
    this.setSocket = function(_socket){
        socket = _socket;
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

BotRemoteControl.prototype.goForward = function(){
    this.createInterval( () => {
        console.info("Forward");
        this.sendSignal("F",100);
    })
}

BotRemoteControl.prototype.goBackward = function(){
    this.createInterval( () => {
        console.log("Backward!");
        this.sendSignal("B",100);
    })
}

BotRemoteControl.prototype.turnLeft = function(){
    this.createInterval( () => {
        console.log("Turning left!");
        this.sendSignal("L",100);
    })
}

BotRemoteControl.prototype.turnRight = function(){
    this.createInterval( () => {
        console.log("Turning right!");
        this.sendSignal("R",100);
    })
}

BotRemoteControl.prototype.stop = function(){
    console.log('stop!');
    this.releaseInterval();
    this.sendSignal("S",100);
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
