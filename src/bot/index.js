const rooms = require('./room.js');

let botRequestedRoomCreation = function(socket,botId){
    if(rooms.botRoomExists(botId)){
        return socket.emit('server-cant-create-room');
    }

    rooms.createBotRoom(socket, botId);
    console.log('server-room-created-successfully');
    return socket.emit('server-room-created-successfully');
}

let userWantsToJoinRoom = function(socket,botId){

    if(!rooms.botRoomExists(botId)){
        return socket.emit('user-cant-join-room',"There's no such room!");
    }

    let room = rooms.getRoom(botId);
    if(room.userSocket != null){
        return socket.emit('user-cant-join-room',
        "There's already an user controlling the bot!");
    }
    room.userSocket = socket;

    room.botSocket.emit('user-joined');
    console.log('success');
    return socket.emit('user-joined-room-successfully');
}

let io = socketIO.listen(app);
io.sockets.on('connection', function(socket) {
    socket.on("aaa", (a) =>{
        console.log("AAAA",a);
    })
    socket.on('disconnect', function() {
        rooms.destroyRoomByBotSocket(socket);
    });

    socket.on('bot-hello', (botId) => {
        console.log("bot-hello");
        botRequestedRoomCreation(socket,botId)
    });

    socket.on('user-join', (botId) => {
        console.log("user-join");
        userWantsToJoinRoom(socket,botId)
    });



    socket.on('bot-description', (description) => {
        console.log("got bot description")
        let sockRooms = rooms.getRoomBySocket(socket);
        if(sockRooms.length === 0)
            return;

        let room = sockRooms[0];
        room.botDescription = description;
        if(room.userDescription != null)
            socket.emit('user-description', room.userDescription)

        if(room.userSocket != null)
            socket.emit('bot-description', room.botDescription)
    });

    socket.on('user-description', (description) => {
        console.log("got user description")
        let sockRooms = rooms.getRoomBySocket(socket);
        if(sockRooms.length === 0)
            return;

        let room = sockRooms[0];
        room.userDescription = description;
        if(room.botDescription != null)
            socket.emit('bot-description', room.botDescription)

        if(room.botSocket != null)
            socket.emit('user-description', room.userDescription);
    });

    socket.on('bot-message', (contents) => {
        let sockRooms = rooms.getRoomBySocket(socket);
        if(sockRooms.length === 0)
            return;

        let room = sockRooms[0];
        if(room.userSocket != null){
            room.userSocket.emit('bot-message',contents);
        }

    })

    socket.on('user-message', (contents) => {
        let sockRooms = rooms.getRoomBySocket(socket);
        if(sockRooms.length === 0)
            return;

        let room = sockRooms[0];
        if(room.botSocket != null){
            room.botSocket.emit('user-message',contents);
        }

    })

    socket.on('ipaddr', function() {
        let ifaces = os.networkInterfaces();
        for (let dev in ifaces) {
            ifaces[dev].forEach(function(details) {
                if ( details.family === 'IPv4' &&
                     details.address !== '127.0.0.1') {
                    socket.emit('ipaddr', details.address);
                }
            });
        }
    });

    socket.on('bye', function(){
        console.log('received bye');
    });

});
