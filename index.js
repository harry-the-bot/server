'use strict';

const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const handleSocketConnection = require('./src/socket');
const arduinoInterface = require('./src/core/arduino');
const helmet = require('helmet');
const session = require('express-session');
const crypto = require('crypto');
const nocache = require('nocache')
const referrerPolicy = require('referrer-policy')
const path = require('path');

app.use(helmet());
app.use(referrerPolicy({ policy: 'same-origin' }))
app.use(nocache());

//express-session config
let sessionSecret = crypto.randomBytes(64).toString('hex');
let sessionName = crypto.randomBytes(32).toString('hex');
app.set('trust proxy', 1) // trust first proxy
app.use( session({
        secret: sessionSecret,
        name: sessionName,
        secure: false, //browser only sends the cookie over HTTPS
        httpOnly: true, //ensure cookie was sent by browser, not js on client,
        //domain: '',
        //expires: ''
        resave: false,
        saveUninitialized: true
    })
);

//Views and Static files
app.set('view engine', 'jade');
app.set('views', path.join(__dirname,'public','views'));

app.use('/images', express.static(path.join(__dirname,'public','images')));
app.use('/scripts', express.static(path.join(__dirname,'public','js')));
app.use('/stylesheets', express.static(path.join(__dirname,'public','css')));
app.use('/fonts', express.static(path.join(__dirname,'public','fonts')));


server.listen(8091);
app.use('/', require('./src/web'));
io.on('connection', handleSocketConnection);

//Initializing arduino
//@TODO fix bot interface and move this stuff to the right place
arduinoInterface.setPortName("COM4");
arduinoInterface.addListener( function(data) {
    let aux = data.split('');
    if(aux[0] === 'S'){
        io.sockets.emit('sensor-report', data);
    }

})
arduinoInterface.start().then( () => {
    setTimeout( () => {
        console.log(arduinoInterface.send("LCFF0000;"))//red leds
    },1000)

    setTimeout(  () => {
        console.log(arduinoInterface.send("LS1;"))//blinking leds
    },1600);

})

console.log("Running.");
