function Call(){
    var socket;
    var localVideo;
    var remoteVideo;
    var localStream;
    var remoteStream

    this.setSocket = function(_socket){
        socket = _socket;
        return this;
    }

    this.getSocket = function(){
        return socket;
    }

    this.setLocalVideo = function(_localVideo){
        localVideo = _localVideo;
        return this;
    }

    this.getLocalVideo = function(){
        return localVideo;
    }

    this.setRemoteVideo = function(_remoteVideo){
        remoteVideo = _remoteVideo;
        return this;
    }

    this.getRemoteVideo = function(){
        return remoteVideo;
    }

    this.setLocalStream = function(_localStream){
        localStream = _localStream;
        return this;
    }

    this.getLocalStream = function(){
        return localStream;
    }

    this.setRemoteStream = function(_remoteStream){
        remoteStream = _remoteStream;
        return this;
    }

    this.getRemoteStream = function(){
        return remoteStream;
    }
}

Call.prototype.getUserMedia = function() {
    return navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true
    })
}

Call.prototype.prepare = function() {
    return new Promise( (resolve,reject) => {
        this.getUserMedia()
            .then( (stream) => {
                this.getLocalVideo().src = window.URL.createObjectURL(stream);
                this.setLocalStream(stream);
                resolve();
            })
            .catch( (error) => {
                reject(error);
            });
    })

}
