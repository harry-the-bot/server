'use strict';

const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const handleSocketConnection = require('./src/socket');

server.listen(8091);

app.use('/', require('./src/web'));
io.on('connection', handleSocketConnection);
