Template.elementOfList.onCreated(function(){
    Session.set('notClicked', true);
})
Template.elementOfList.events({
    'click .buttonJoin': function(event){
        Session.set("serverId", this.id);
        if(Meteor.isCordova){
            stopScanForServers(function(){});
            var idd = this.id;
            Session.set('notClicked', false);
            connect(
                this.id,
                function(succ){
                    if(succ.status == "disconnected" || succ.message == "Device is disconnected" || succ.error == "isDisconnected"){
                        var messageInput = "Zostales rozlaczony :((";
                        if (messageInput !== "") {
                            ChatCol.update({
                                _id: Session.get("chatId")
                            }, {
                                $push: {
                                    newmessage: {
                                        nick:"%%&&%%&&",
                                        message:messageInput
                                    }
                                }
                            })
                        }
                        setUpSer();
                        }
                    else{
                    setMtu(
                        512,
                        idd,
                        function(succ){console.log("MTU set at:-- " + 512); console.log(succ);
                            var params2 = {
                                "address": idd,
                                "clearCache": true
                            };
                            bluetoothle.discover(
                                function(succ){
                                    FlowRouter.go("/chat");
                                    bluetoothle.subscribe(
                                        function(succ){
                                            if(succ.status == "subscribedResult") {
                                                var value = succ.value;
                                                var msg = atob(value);
                                                try {
                                                    var obj = JSON.parse(msg);
                                                } catch (ex) {
                                                    console.error(ex);
                                                }
                                                Meteor.call('importMessage', obj.nick ,obj.time  ,obj.message  , ChatCol.findOne()._id);
                                                var zmienna = ChatCol.find().count();
                                            }
                                        },
                                        function(err){
                                            var messageInput = "Nie udalo sie polaczyc :(";
                                            var chatId = Session.get('chatId');
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
                                        },
                                        {
                                            "address": idd,
                                            "service": '2042',
                                            "characteristic": 'ABCD'
                                        });
                                },
                                function(err){console.log(err)},
                                params2
                            );
                        },
                        function(err){console.log("Setting MTU failed: " );
                            var messageInput = "Nie udalo sie polaczyc :(";
                            var chatId = Session.get('chatId');
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
                    }

                },
                function(err){console.log("Connection error");

                    var messageInput = "Nie udalo sie polaczyc :(";
                    var chatId = Session.get('chatId');
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
                    console.log(err)}
            )
        } else {
            FlowRouter.go("/chat");
        }
    }
});

Template.elementOfList.helpers({
    'notClicked': function(){
        return Session.get('notClicked');
    }
});