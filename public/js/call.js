var userSocket = io("http://localhost:8091");
var videoStream = null;
var connectedToBot = false;

setTimeout( start, 1000 );

/******* MOVEMENT **************/
var currentMovementInterval;
function goForward(){
    if(currentMovementInterval != null)
        return;
    console.log("triggered");
    currentMovementInterval = setInterval( () => {
        console.log("Forward!");
    },300)
}

function goBackward(){
    if(currentMovementInterval != null)
        return;

    currentMovementInterval = setInterval( () => {
        console.log("Backward!");
    },300)
}

function turnLeft(){
    if(currentMovementInterval != null)
        return;

    currentMovementInterval = setInterval( () => {
        console.log("Turning left!");
    },300)
}

function turnRight(){
    if(currentMovementInterval != null)
        return;
        
    currentMovementInterval = setInterval( () => {
        console.log("Turning right!");
    },300)
}

function stop(){
    console.log("Stop!");
    clearInterval(currentMovementInterval);
    currentMovementInterval = null;
}

document.addEventListener("keydown", (e) => {
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

document.addEventListener("keyup", (e) => {
    switch(e.keyCode){
        case 38:
        case 40:
        case 37:
        case 39:
            return stop();
    }
});

/******* CALL **************/
function start(){
    var videoObject = document.getElementById("user-video");
    turnVideoOn(videoObject);
    connectToBot(1);
}

function connectToBot(botId){
    userSocket.emit('user-join',botId);
}

function userConnectedToBot(botInfo){
    connectedToBot = true;
    alert('connected');
}

userSocket.on('user-joined-room-successfully', userConnectedToBot);
userSocket.on('bot-socket', () => {
    console.log("WOW");
});

function turnVideoOn(videoObject){

    //$('[selector]')[0] returns the same as document.getElementById(...)
    var obj = typeof $ != 'undefined' && videoObject instanceof $ ? videoObject[0] : videoObject;
    console.log(obj)
    navigator.mediaDevices.getUserMedia({
        audio: false,
        video: true
    }).then( (stream) => {
        obj.src = window.URL.createObjectURL(stream);
        videoStream = stream;

        var peerConnection = createPeerConnection();
        peerConnection.addStream(videoStream);
    })
}

/********************* PEER CONNECTION *********************************/
function createPeerConnection(){
    try {
        var pc = new RTCPeerConnection(null);
        pc.onicecandidate = handleIceCandidate;
        pc.onaddstream = handleRemoteStreamAdded;
        pc.onremovestream = handleRemoteStreamRemoved;
        console.log('Created RTCPeerConnnection');
        return pc;
    } catch (e) {
        console.log('Failed to create PeerConnection, exception: ' + e.message);
        return false;
    }
}

function handleIceCandidate(event){
    console.log('icecandidate event: ', event);
    if (event.candidate) {
        emitMessage({
            type: 'candidate',
            label: event.candidate.sdpMLineIndex,
            id: event.candidate.sdpMid,
            candidate: event.candidate.candidate
        });
    } else {
        console.log('End of candidates.');
    }
}

function handleRemoteStreamAdded(event) {
    console.log('Remote stream added.');
    remoteVideo.src = window.URL.createObjectURL(event.stream);
    remoteStream = event.stream;
}

function handleRemoteStreamRemoved(event) {
  console.log('Remote stream removed. Event: ', event);
}

/********************* PEER CONNECTION *********************************/
