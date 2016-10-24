'use strict';

var controls;
window.onload = () => {

    var pcConfig = {
      'iceServers': [{
        'url': 'stun:stun.l.google.com:19302'
      }]
    };
    requestTurn("https://computeengineondemand.appspot.com/turn?username=qaasd34234&key=asdjkagbdasghdwy34r3",pcConfig)
        .then( (config) => {
            var call = new UserCall(config);
            var userSocket = io("/");

            userSocket.on('sensor-report', handleSensorReport);

            call.setSocket(userSocket);
            call.setRemoteVideo(document.getElementById('bot-video'));
            call.setLocalVideo(document.getElementById('user-video'));

            var afterPrepareSuccess = userVideoIsEnabled.bind(this,call,userSocket);

            call.prepare()
                .then( afterPrepareSuccess, () => {
                    console.log("nop");
                });
        });
}

function requestTurn(turnURL, pcConfig) {
    return new Promise( (resolve,reject) => {

        var turnExists = false;
        for (var i in pcConfig.iceServers) {
            if (pcConfig.iceServers[i].url.substr(0, 5) === 'turn:') {
                turnExists = true;
                break;
            }
        }

        if (!turnExists) {
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    var turnServer = JSON.parse(xhr.responseText);
                    console.log('Got TURN server: ', turnServer);
                    pcConfig.iceServers.push({
                        'url': 'turn:' + turnServer.username + '@' + turnServer.turn,
                        'credential': turnServer.password
                    });
                }
                resolve(pcConfig);
            };

            xhr.open('GET', turnURL, true);
            xhr.send();
        }
    })//Promise
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
    controls.setLedState("0000FF",0);
    initializeSensors();

}

var sensorState = [];
var sensorCount = 8;

function handleSensorReport(report) {
    console.log(report);
    var aux = report.split('');
    var panel = aux[1];
    var position = aux[2];
    var distance = parseInt(report.substr(3,report.length-1));

    //FRONT SENSORS
    if(panel == 'F'){
        if(position == 'L')
            setSensorState(1,distance);
        if(position == 'R')
            setSensorState(2,distance);
    }

    //LEFT SENSORS
    if(panel == 'L'){
        if(position == 'L')
            setSensorState(3,distance);
        if(position == 'R')
            setSensorState(4,distance);
    }

    //BACK SENSORS
    if(panel == 'B'){
        if(position == 'L')
            setSensorState(5,distance);
        if(position == 'R')
            setSensorState(6,distance);
    }

    //RIGHT SENSORS
    if(panel == 'R'){
        if(position == 'L')
            setSensorState(7,distance);
        if(position == 'R')
            setSensorState(8,distance);
    }

    updateSensors();
}
function initializeSensors(){
    sensorState = Array(sensorCount).fill(0);
}

function setSensorState(sensor,state){
    sensorState[sensor-1] = state;
}

function getSensorColor(sensor){

    var distance = sensorState[sensor-1]

    if(distance > 30)
        return 'green';

    if(distance > 10)
        return 'orange';

    if(distance > 5)
        return 'yellow'

    return 'red';
}

function updateSensors(){

    console.log(sensorState);

    var front = document.getElementById("front-sensor");
    var left = document.getElementById("left-sensor");
    var back = document.getElementById("back-sensor");
    var right = document.getElementById("right-sensor");

    var frontLeftColor = getSensorColor(1);
    var frontRightColor = getSensorColor(2);
    var leftLeftColor = getSensorColor(3);
    var leftRightColor = getSensorColor(4);
    var backLeftColor = getSensorColor(5);
    var backRightColor = getSensorColor(6);
    var rightLeftColor = getSensorColor(7);
    var rightRightColor = getSensorColor(8);

    front.style.background = 'linear-gradient(-90deg, '+frontLeftColor+', '+frontRightColor+')';
    left.style.background = 'linear-gradient('+leftLeftColor+','+leftRightColor+')';
    back.style.background = 'linear-gradient(-90deg, '+backLeftColor+','+backRightColor+')';
    right.style.background = 'linear-gradient('+rightLeftColor+','+rightRightColor+')';

}
