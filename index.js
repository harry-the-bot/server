'use strict';

const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const handleSocketConnection = require('./src/socket');
const helmet = require('helmet');
const session = require('express-session');
const crypto = require('crypto');
const nocache = require('nocache')
const referrerPolicy = require('referrer-policy')


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

server.listen(8091);
app.use('/', require('./src/web'));
io.on('connection', handleSocketConnection);
