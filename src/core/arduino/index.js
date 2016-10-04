const SerialPort = require('serialport');
var isOpen = false;
var portName;
var baudRate = 9600;
var port;
var dataListeners = [];

module.exports = {

    setPortName: function(name){
        portName = name;
    },

    start: function(){
        
        port = new SerialPort(portName,{
             'baudRate': baudRate
         });

        return new Promise( (resolve, reject) => {

             port.on('open', () => {
                 console.log("Port is open");
                 port.on('data', (data) => {
                     if(data === 'HEL'){
                         isOpen = true;
                         return;
                     }

                     dataListeners.map( (fn) => {
                         fn(data);
                     })

                 })

                 port.on('error', (err) => {
                     console.warn(err)
                 })
             })
        })
    },

    addListener: function(fn){
        console.log(typeof fn);
        if(typeof fn != 'function')
            throw Error("This listener is not a function");

        dataListeners.push(fn);
    },

    send: function(data){
        console.log("Sending to arduino ",data);
        port.write(data);

        return true;
    }


}
