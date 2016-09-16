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
    }

}
