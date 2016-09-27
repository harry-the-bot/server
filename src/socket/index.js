module.exports = (socket) => {

    const appliers = [
                        require('./p2p-chat'), //P2P events
                    ];
                                    
    appliers.map( (applier,idx) => {
        if(typeof applier != 'function')
            throw new Error("[Sockets] Applier #" +
                                 idx.toString() +
                                 " is not a function!");

        applier(socket);

    });
}
