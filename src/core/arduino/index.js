const SerialPort = require('serialport');
var isOpen = false;
var portName;
var baudRate = 9600;
var port;
var dataListeners = [];
var data_acm = "";

const processData = function(data){
    let aux = data.toString();
    aux = aux.replace(/(\r\n|\n|\r)/gm,"");
    let hasSemicolons = aux.match(/;/g)
    if(!hasSemicolons){
        data_acm += aux;
        return;
    }

    let commandChunks = aux.split(";");
    commandChunks.forEach( (chunk,index) => {
        if(index % 2 == 0){
            data_acm += chunk;
            dispatchData(data_acm);
            data_acm = "";
        }
    })

    //console.log("Received ",aux, hasSemicolons ? "and have semicolons" : "and don't have semicolons");

}

const dispatchData = function(data){

    if(data === 'HELLO'){
        console.log("Connected to arduino");
        isOpen = true;
        return;
    }

    dataListeners.map( (fn) => {
        fn(data_acm);
    })
}
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
                 port.on('data', (data) => {

                     processData(data);


                 })

                 port.on('error', (err) => {
                     console.warn(err)
                 })
             })
        })
    },

    addListener: function(fn){

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
