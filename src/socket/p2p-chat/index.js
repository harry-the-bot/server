const rooms = require('../../core/room/bot-room');
//@TODO refactor pls :fire:

let botRequestedRoomCreation = function(socket,botId){

    botId = parseInt(botId);

    if(isNaN(botId))
        return socket.emit('server-cant-create-room', {
            message: "This bot is not supplying an valid ID " +
                     "Please, contact support"
        });

    if(rooms.botRoomExists(botId)){
        return socket.emit('server-cant-create-room',{
            message: "There's already some bot using this ID. " +
                     "Please, contact support"
        });
    }

    rooms.createBotRoom(socket, botId);
    return socket.emit('server-room-created-successfully');
}

let userWantsToJoinRoom = function(socket,botId){


    if(!rooms.botRoomExists(botId))
        return socket.emit('user-cant-join-room', {
            message:"There's no bot #"+botId
        });


    let room = rooms.getRoom(botId);
    if(room.userSocket != null)
        return socket.emit('user-cant-join-room', {
            message: "There's already an user controlling the bot!"
        });

    room.userSocket = socket;

    room.botSocket.emit('user-joined');
    socket.emit('user-joined-room-successfully');
    return socket;
}


module.exports = function(socket) {

    socket.on('disconnect', function() {

        let sockRooms = rooms.getRoomBySocket(socket);
        if(sockRooms.length === 0)
            return;

        let room = sockRooms[0];

        if(socket === room.userSocket){
            room.userSocket = null;
            return;
        }
        rooms.destroyRoomByBotSocket(socket);
    });

    //Bot joined server and is open for connections
    socket.on('bot-hello', (botId) => {
        console.log("bot-hello");
        botRequestedRoomCreation(socket,botId)
    });

    //User is joining a room
    socket.on('user-join', (botId) => {
        console.log("user-join");
        userWantsToJoinRoom(socket,botId)
    })

    //Bot and User are in the same room and the bot is calling the user
    socket.on('bot-created-offer', (description) => {
        console.log("bot-created-offer")
        let sockRooms = rooms.getRoomBySocket(socket);
        if(sockRooms.length === 0)
            return;

        let room = sockRooms[0];
        room.userSocket.emit('bot-created-offer',description);
    });

    socket.on('user-answered-offer', (description) => {
        console.log("user-answered-offer")
        let sockRooms = rooms.getRoomBySocket(socket,true);
        if(sockRooms.length === 0)
            return;

        let room = sockRooms[0];
        room.botSocket.emit('user-answered-offer',description);
    });

    socket.on('ice-candidate', (candidate) => {
        console.log('ice-candidate');
        let sockRooms = rooms.getRoomBySocket(socket,true);
        if(sockRooms.length === 0)
            return;

        let room = sockRooms[0];
        console.log(socket === room.userSocket, socket === room.botSocket)
        if(socket === room.userSocket){
            room.botSocket.emit('ice-candidate',candidate);
            console.log("send to bot")
        }else{
            room.userSocket.emit('ice-candidate',candidate);
            console.log("send to user")
        }
    })

}
