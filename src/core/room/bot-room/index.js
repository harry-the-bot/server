let bot_rooms = [];

module.exports = {
    botRoomExists: function(botId){
        return bot_rooms.filter( room => room.botId === botId ).length > 0;
    },

    createBotRoom: function(botSocket, botId){
        if(this.botRoomExists(botId))
            return;

        let room = {
            botId: botId,
            botSocket: botSocket,
            userSocket: null,
            botDescription: null,
            userDescription: null
        }

        bot_rooms.push(room);
        return bot_rooms.indexOf(room);
    },

    getRoom: function(botId){
        let rooms = bot_rooms.filter( room => room.botId === botId );

        if( rooms.length < 1 )
            return null;

        return bot_rooms[bot_rooms.indexOf(rooms[0])];
    },

    getRoomBySocket: function(socket,checkUser){
        return bot_rooms.filter( room => ( checkUser ?
                                                room.botSocket === socket ||
                                                room.userSocket === socket :
                                                room.botSocket === socket) );
    },

    destroyRoomByBotSocket: function(socket){
        let rooms = this.getRoomBySocket(socket);
        if(rooms.length == 0)
            return false;

        let room_index = bot_rooms.indexOf(rooms[1]);
         bot_rooms.splice(room_index);
        return true;
    }

}
