function startBL(){
    Meteor.startup(function () {
    if (Meteor.isCordova) {
     ble.isEnabled(
          function(){
            // Bluetooth is enabled
          },
          function(){
            // Bluetooth not yet enabled so we try to enable it
            ble.enable(
              function(){
                // bluetooth now enabled
              },
              function(err){
                console.log('Cannot enable bluetooth'); //TODO Add reaction for not enabled bl
              }
            );
          }
        );
    }
    })

}
//starting scanning for client
var serverList = [];
function deviceData(id,name){
    this.name = name;
    this.id = id;
}
//method that scans for avaible servers
scanForServers = function(succes, failure){
    var Lista = [];
    var alertMsg = '';
    var err = "Nope";
    ble.startScan(
        [], //TODO consider certain range of services to avoid connecting to random peripherials
        function(device){

            if(device.name){ //only proceed if server is found
                console.log("InScan with name");
                Lista.push({name: device.name, id: device.id});
                console.log("InScan 2");
                succes(Lista); //calling succes method that will show all found servers !!ARGS
                console.log("InScan3");
            }
        },
        function(err){failure(err); }
    );
};

//method that stops scanning 
stopScanForServers = function(stopCallback){
    
    ble.stopScan(
        function(succ){
            stopCallback(succ); // !!ARGS (probably none)
        },
        function(err){console.log("scan dalej trwa")}
    );
};

//method that connects client to server
connect = function(id,succes,failure){
    var params = {"address": id};    
    bluetoothle.connect(
        function(device){ //invokes succes method with parsed callback data 
            succes(device);
        },
        function(err){ //invokes failure method with parsed callback data 
            failure(err);
        },
        params
    );
};

//method that extends maximum message size up to 512
setMtu= function(mtu, id, succes, failure){
    var params = {
        "address": id,
        "mtu": mtu
    };
    bluetoothle.mtu(
        function(succ){succes(succ)},
        function(err){failure(err)},
        params
    )
};

//method that reads message from characteristic
readMsg = function(servId,succes,failure){
    characteristic_id = '66ef'; // care for uuids can change conception above
    service_id = '55ef';
        ble.read(
            servId,
            service_id,
            characteristic_id,
            succes(),   // !!ARGS
            failure()  // !!ARGS
        )
};

//method that listens for notification from servers and calls readMsg when is notificated
//TODO create method to parse from string encoded
listenForMessages = function(servId, succes, failure, listenFailure){
        characteristic_id = '66ef'; //uuids in danger aas above
        service_id = '55ef';
        ble.startNotification(
            servId,
            service_id,
            characteristic_id,
            readMsg(servId,succes, failure), // !!ARGS
                listenFailure()    // !!ARGS
        )
};

//method that sends given message to given server
sendMessage = function(servId, msg, failure){
    msg = Meteor.call('normalize',msg);
    var characteristic_id = 'ABCD';
    var service_id = '2042';
    var sendSucces = function(msg){};
    msg = JSON.stringify(msg);
    msg = btoa(msg);
    var params = {
        "address": servId,
        "service": "2042",
        "characteristic": characteristic_id,
        "value": msg,
        "type":"noResponse"
    };

    bluetoothle.write(
        function(response){
            console.log("Response is: ");
            console.log(response);
        },
        function(err){console.log(err)},
        params
    );
};

setUpSer = function(){};

























