'use strict';

var controls;
window.onload = () => {
    var call = new UserCall();
    var userSocket = io("/");

    call.setSocket(userSocket);
    call.setRemoteVideo(document.getElementById('bot-video'));
    call.setLocalVideo(document.getElementById('user-video'));

    var afterPrepareSuccess = userVideoIsEnabled.bind(this,call,userSocket);

    call.prepare()
        .then( afterPrepareSuccess, () => {
            console.log("nop");
        });
}


function userVideoIsEnabled(call,userSocket){
    console.info("Video is enabled");
    call.startListening();
    call.connectTo(1);

    controls = new BotRemoteControl();
    controls.setSocket(userSocket);
    controls.addKeyListeners(document);

    controls.setForwardButton(document.getElementById("forward"));
    controls.setLeftButton(document.getElementById("left"));
    controls.setBackwardButton(document.getElementById("backward"));
    controls.setRightButton(document.getElementById("right"));
    controls.addTouchListeners(document);


}
