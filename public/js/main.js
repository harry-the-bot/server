'use strict';

window.onload = () => {
    var call = new UserCall();
    var userSocket = io("http://192.168.0.101:8091");

    call.setSocket(userSocket);
    call.setRemoteVideo(document.getElementById('bot-video'));
    call.setLocalVideo(document.getElementById('user-video'));

    var afterPrepareSuccess = userVideoIsEnabled.bind(this,call);

    call.prepare()
        .then( afterPrepareSuccess, () => {
            console.log("nop");
        });
}


function userVideoIsEnabled(call){
    console.info("Video is enabled");
    call.startListening();
    call.connectTo(1);
}
