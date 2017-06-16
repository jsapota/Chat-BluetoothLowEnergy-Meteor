Meteor.methods({
    'exportMessage': function(nick, time, message){
        var messageObject = {
            nick: nick,
            time: time,
            message:message
        };
        sendMessage(
            Session.get("serverId"),
            messageObject,
            function(err){console.log(err);
                var messageInput = "Nie udalo sie wyslac wiadomosci";
                var chatId = Session.get('chatId');
                console.log(err);
                if (messageInput !== "") {
                    ChatCol.update({
                        _id: chatId
                    }, {
                        $push: {
                            newmessage: {
                                nick:"%%&&%%&&",
                                message:messageInput
                            }
                        }
                    })
                }}
            );
    },
    'importMessage': function(nick,time,messageInput,chatId) {
        if (ChatCol.findOne({_id: chatId})) {
            if (messageInput !== "") {
                ChatCol.update({
                    _id: chatId
                }, {
                    $push: {
                        newmessage: {
                                nick:nick,
                                message:messageInput
                        }
                    }
                })
            }
        }
    },
    'listenFailure': function(){
        return 'listenfail';
    },
    'messageFailure': function(){
        return 'messagefail';
    },
    'sendFailure': function(){
        return 'sendfail';
    },
    'connectAgain': function(){
        console.log('Lacze again');
    },
    'serverLog': function(messageInput){
        var chatId = Session.get('chatId');
        messageInput = Meteor.call('normalize',messageInput);
        if (messageInput !== "") {
            ChatCol.update({
                _id: chatId
            }, {
                $push: {
                    newmessage: {
                        nick:"%%&&%%&&",
                        message:messageInput
                    }
                }
            })
        }
        var msg = {nick:"%%&&%%&&" , time:new Date() , message:messageInput };
        msg = JSON.stringify(msg);
        var ret = btoa(msg);
        var lista = Session.get("clientList");
        for(var i = 0; i < lista.length; i++){
            var adr = lista[i];
            bluetoothle.notify(
                function(succ){console.log(succ)},
                function(err){console.log(err)},
                {
                    "service": "2042",
                    "characteristic": "ABCD",
                    "value": ret,
                    "address": adr
                }
            )
        }
    },

    'serverLogAdd': function(messageInput){
        var chatId = Session.get('chatId');
        var msg = {nick:"%&$addr" , time:new Date() , message:messageInput };
        msg = JSON.stringify(msg);
        var ret = btoa(msg);
        var lista = Session.get("clientList");
        for(var i = 0; i < lista.length; i++){
            var adr = lista[i];
            console.log("Ad: " + adr);
            bluetoothle.notify(
                function(succ){console.log(succ)},
                function(err){console.log(err)},
                {
                    "service": "2042",
                    "characteristic": "ABCD",
                    "value": ret,
                    "address": adr
                }
            )
        }
    },
    'normalize': function(str) {
     //TODO get ride of polish letters
        return str;
    }
});
