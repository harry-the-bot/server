let bot_rooms = [];

module.exports = {
    botRoomExists: function(bot_id){
        return bot_rooms.filter( room => room.bot_id === bot_id ).length > 0;
    },

    createBotRoom: function(bot_socket, bot_id){
        if(this.botRoomExists(bot_id))
            return;

        let room = {
            bot_id: bot_id,
            bot_socket: bot_socket,
            user_socket: null,
        }

        bot_rooms.push(room);
        return bot_rooms.indexOf(room);
    },

    getRoom: function(bot_id){
        let rooms = bot_rooms.filter( room => room.bot_id === bot_id );

        if( rooms.length < 1 )
            return null;

        return bot_rooms[bot_rooms.indexOf(rooms[0])];
    },

    getRoomBySocket: function(socket,checkUser){
        return bot_rooms.filter( room => ( checkUser ?
                                                room.bot_socket === socket ||
                                                room.user_socket === socket :
                                                room.bot_socket === socket) );
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
