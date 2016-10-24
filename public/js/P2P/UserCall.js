function UserCall(){

    var peerConnection;

    this.getPeerConnection = function(){
        return peerConnection;
    }
    this.createPeerConnection = function(){
        peerConnection = new RTCPeerConnection(null);
        peerConnection.onicecandidate = handleIceCandidate.bind(this);
        peerConnection.onaddstream = handleRemoteStreamAdded.bind(this);
        peerConnection.onremovestream = handleRemoteStreamRemoved.bind(this);

        return this;
    }

    /*************************************************************************
     *                  ICE Candidate Handlers
     ************************************************************************/

    function handleIceCandidate(event){
        if(event.candidate){
            console.info("Sending ice candidate");
            this.getSocket().emit('ice-candidate', {
                id: event.candidate.sdpMid,
                type: 'candidate',
                label: event.candidate.sdpMLineIndex,
                candidate: event.candidate.candidate
            });
        }else{
            console.info("End of candidates");
        }
    }

    function handleRemoteStreamAdded(event){
        console.info("User is sending video to us!");
        this.getRemoteVideo().src = window.URL.createObjectURL(event.stream);
        this.setRemoteStream(event.stream);
    }

    function handleRemoteStreamRemoved(event){
        console.warn("remoteStream removed ",event);
    }

    /*************************************************************************
     *            PeerConnection.createAnswer Handlers
     ************************************************************************/
   function answerOffer(sessionDescription){
       console.info("Emitting session description", sessionDescription);
       sessionDescription.sdp = preferOpus(sessionDescription.sdp);
       this.getPeerConnection().setLocalDescription(sessionDescription);
       this.getSocket().emit('user-answered-offer',sessionDescription);
   }

   function answeringError(event){
       console.warn('Failed while creating offer: ', event);
   }

    /*************************************************************************
     *                  Socket.IO Events
     ************************************************************************/

    /**
    *   Handles "user-joined-room-successfully" event from server
    */
    this.handleConnectionSuccess = function(){
        console.info("Bot said hello");
    }

    /**
    *   Handles "user-cant-join-room" event from server
    */
    this.handleConnectionFailure = function(err){
        console.info("Bot said fuck you (respectfully)",err);
    }

    /**
    *   Handles "bot-created-offer" event from server
    */
    this.handleBotOffer = function(offer){
        console.info("Bot is offering!");
        try{
            this.createPeerConnection();
            var peerConnection = this.getPeerConnection();
            console.log(this.getLocalStream());
            peerConnection.addStream( this.getLocalStream() );

            var description = new RTCSessionDescription(offer);
            peerConnection.setRemoteDescription(description);

            peerConnection.createAnswer()
                          .then( answerOffer.bind(this),
                                 answeringError.bind(this)
                               );

        }catch(e){
            console.warn("Failed to create peerConnection!",e)
        }
    }

    /**
    *   Handles "ice-candidate" event from server
    */
    this.handleIceCandidate = function(iceCandidate){
        console.info("got candidate");

        var candidate = new RTCIceCandidate({
            sdpMLineIndex: iceCandidate.label,
            candidate: iceCandidate.candidate
        })

        this.getPeerConnection().addIceCandidate(candidate, () => {
            console.log("Add peer");
        }, () => {
            console.log("Failed to add peer")
        });

    }

}

UserCall.prototype = new Call();

UserCall.prototype.startListening = function() {
    var socket = this.__proto__.getSocket();

    socket.on('user-joined-room-successfully', this.handleConnectionSuccess.bind(this));
    socket.on('user-cant-join-room', this.handleConnectionFailure.bind(this));
    socket.on('bot-created-offer', this.handleBotOffer.bind(this));
    socket.on('ice-candidate', this.handleIceCandidate.bind(this));

}

UserCall.prototype.connectTo = function(botId) {
    this.__proto__.getSocket().emit('user-join',botId);
}
