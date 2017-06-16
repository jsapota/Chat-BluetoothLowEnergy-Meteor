Meteor.startup(function(){
    var initializeResult = function(res){console.log("Result: " + res.status);};
    var error = function(){};
    if(Meteor.isCordova){
        bluetoothle.initialize(
            initializeResult,
            {
                "request": true,
                "statusReceiver": true
            }
        );

    };
});
//method that listens and push received message to array
adv = function(
    readRequested,  // not need
    writeRequested, // not need
    enabled,        // wlaczony blue
    disabled,       // wylaczony blue
    subscribed,     // subs do serwera
    unsubscribed,   // rozlaczenie
    connected,      // polaczone
    disconnected,   // rozlaczone
    failureCall,    // nie udalo sie wykonac
    successCall     // poszlo
)
{
        error = function(err){console.log("Error: "); console.log(err) ;};
        Meteor.startup(function(){
            if(Meteor.isCordova) {
                bluetoothle.initializePeripheral(
                    function(succ){
                        switch(succ.status) {
                            case "advertisingStarted":
                                successCall();
                                break;
                            case "readRequested":
                                readRequested();
                                break;
                            case "writeRequested":
                                writeRequested(succ);
                                break;
                            case "subscribed":
                                subscribed(succ);
                                break;
                            case "unsubscribed":
                                unsubscribed();
                                break;
                            case "connected":
                                connected(succ);
                                break;
                            case "disconnected":
                                disconnected(succ);
                                break;
                            default:
                                break;
                        }
                    },
                    function(err){console.log(err)},
                    {
                        "request": true
                    }
                );

            }
        })
        success = function(s){console.log(s)};
        error = function(err){"Error: " + console.log(err) ; failureCall();};
        error2 = function(err){"Error: " + console.log(err);
            Meteor.call('serverLog', "Twoje urzadzenie nie wspiera rozglaszania sygnalu BLE!");
            bluetoothle.removeAllServices(success, error); failureCall();
        };
        var params = {
          service: "2042",
          characteristics: [
            {
              uuid: "ABCD",
              permissions: {
                read: true,
                write: true
              },
              properties : {
                read: true,
                writeWithoutResponse: true,
                write: true,
                notify: true,
                indicate: true
              }
            }
          ]
        };
        var l;
        var params2 = {
            services: ["2042"],
            service: "2042",
            name: "BLEServ",
            mode: "lowLatency",
            connectable: true,
            timeout: 1,
            powerLevel: "high",
            manufacturerId: '01'
        };

    if(Meteor.isCordova) {
        bluetoothle.stopAdvertising(success, error);
        bluetoothle.removeAllServices(success, error);
        bluetoothle.addService(success, error, params);
        bluetoothle.startAdvertising(success, error2, params2);
    }
    var params3 = {
        service: "3053",
        characteristics: [
            {
                uuid: "ABCD",
                permissions: {
                    read: true,
                    write: true
                },
                properties : {
                    read: true,
                    writeWithoutResponse: true,
                    write: true,
                    notify: true,
                    indicate: true
                }
            }
        ]
    };
};

    





















