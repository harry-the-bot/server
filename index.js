'use strict';

const os = require('os');
const nodeStatic = require('node-static');
const http = require('http');
const socketIO = require('socket.io');
const rooms = require('./src/room.js');

let fileServer = new(nodeStatic.Server)();
let app = http.createServer(function(req, res) {
    fileServer.serve(req, res);
}).listen(8082);


let botRequestedRoomCreation = function(socket,bot_id){
    if(rooms.botRoomExists(bot_id)){
        return socket.emit('server-cant-create-room');
    }

    rooms.createBotRoom(socket, bot_id);
    console.log('server-room-created-successfully');
    return socket.emit('server-room-created-successfully');
}

let userWantsToJoinRoom = function(socket,bot_id){

    if(!rooms.botRoomExists(bot_id)){
        return socket.emit('user-cant-join-room',"There's no such room!");
    }

    let room = rooms.getRoom(bot_id);
    if(room.user_socket != null){
        return socket.emit('user-cant-join-room',"There's already an user controlling the bot!");
    }
    room.user_socket = socket;

    room.bot_socket.emit('join');
    return socket.emit('user-joined-room-successfully');
}

let io = socketIO.listen(app);
io.sockets.on('connection', function(socket) {

    socket.on('disconnect', function() {
        rooms.destroyRoomByBotSocket(socket);
    });

    socket.on('bot-hello', (bot_id) => {
        console.log("bot-hello");
        botRequestedRoomCreation(socket,bot_id)
    });

    socket.on('user-join', (bot_id) => {
        userWantsToJoinRoom(socket,bot_id)
    })

    socket.on('ipaddr', function() {
        let ifaces = os.networkInterfaces();
        for (let dev in ifaces) {
            ifaces[dev].forEach(function(details) {
                if (details.family === 'IPv4' && details.address !== '127.0.0.1') {
                    socket.emit('ipaddr', details.address);
                }
            });
        }
    });

    socket.on('bye', function(){
        console.log('received bye');
    });

});
