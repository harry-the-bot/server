const rooms = require('../../core/room/bot-room');
//@TODO refactor pls :fire:

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
        return socket.emit('user-cant-join-room',
        "There's already an user controlling the bot!");
    }
    room.user_socket = socket;

    room.bot_socket.emit('user-joined');
    console.log('success');
    return socket.emit('user-joined-room-successfully');
}


module.exports = function(socket) {

    socket.on('disconnect', function() {
        rooms.destroyRoomByBotSocket(socket);
    });

    socket.on('bot-hello', (bot_id) => {
        console.log("bot-hello");
        botRequestedRoomCreation(socket,bot_id)
    });

    socket.on('user-join', (bot_id) => {
        console.log("user-join");
        userWantsToJoinRoom(socket,bot_id)
    })

    socket.on('bot-message', (contents) => {
        let sockRooms = rooms.getRoomBySocket(socket);
        if(sockRooms.length === 0)
            return;

        let room = sockRooms[0];
        if(room.user_socket != null){
            room.user_socket.emit('bot-message',contents);
        }

    })

    socket.on('user-message', (contents) => {
        let sockRooms = rooms.getRoomBySocket(socket);
        if(sockRooms.length === 0)
            return;

        let room = sockRooms[0];
        if(room.bot_socket != null){
            room.bot_socket.emit('user-message',contents);
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

}
