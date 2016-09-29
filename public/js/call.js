var userSocket = io("http://localhost:8091");
var userStream = null;
var userVideo = document.getElementById("user-video");
var botVideo = document.getElementById("bot-video");
var connectedToBot = false;
var botSessionDescription = null;
var peerConnection = null;


console.log(userVideo,botVideo)

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

    var videoObject = typeof $ != 'undefined' && userVideo instanceof $ ? userVideo[0] : userVideo;
    turnVideoOn(videoObject);
    connectToBot(1);
}

function connectToBot(botId){
    userSocket.emit('user-join',botId);
}

function userConnectedToBot(sessionDescription){
    connectedToBot = true;
    console.log("connected");

    if(peerConnection != null){
        peerConnection.setRemoteDescription(new RTCSessionDescription(sessionDescription));
        console.log("set up description");
    }

    console.log("store description");
    botSessionDescription = sessionDescription;
    console.log("description is:", sessionDescription);
}

userSocket.on('user-joined-room-successfully', userConnectedToBot);
userSocket.on('bot-message', (data) => {
    console.log("Bot message",data);
});
userSocket.on('ice-candidate', (candidate) => {
    console.log('got ice candidate',candidate);
    var newCandidate = new RTCIceCandidate({
        sdpMLineIndex: message.label,
        candidate: message.candidate
    });
    peerConnection.addIceCandidate(newCandidate);
})

function turnVideoOn(videoObject){

    //$('[selector]')[0] returns the same as document.getElementById(...)
    navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true
    }).then( (stream) => {
        userVideo.src = window.URL.createObjectURL(stream);
        userStream = stream;

        peerConnection = createPeerConnection();
        peerConnection.addStream(userStream);
        if(botSessionDescription != null){
            console.log("setRemoteDescription")
            peerConnection.setRemoteDescription(new RTCSessionDescription(botSessionDescription))
        }
    })
}

function makeCall(){
    if(peerConnection === null)
        return;

    peerConnection.createAnswer()
                  .then( () => {
                      sendUserDescription,
                      createAnswerFailed
                  })
}

function sendUserDescription(sessionDescription){

    peerConnection.setLocalDescription(sessionDescription);
    userSocket.emit('user-description',sessionDescription);
    console.log("sending user description");


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
        userSocket.emit('ice-candidate',{
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
    botVideo.src = window.URL.createObjectURL(event.stream);
    botStream = event.stream;
}

function handleRemoteStreamRemoved(event) {
    console.log('Remote stream removed. Event: ', event);
}

/********************* PEER CONNECTION *********************************/
