Template.landing.onCreated(function () {
    Session.set("nick", "");
    Session.set("nickAlert", false);
    Session.set("chatId", "");
    Session.set("serverId", "");
    Session.set("wiadomosc", "");
    Session.set("parts", 0);
    Session.set("admin", false);
    Session.set("address", "");
    Session.set("clientList", []);

});

Template.landing.events({
    'click .buttonNewChat': function(nick){
        Session.set("admin", true);
        var nick = document.getElementById("nickId").value;
        if(nick !== ""){
            Session.set("nick", nick);
            adv(
                //read request
                function(s){
                    bluetoothle.respond({requestId: 1, value: s});
                },
                //write request
                function(s){
                    status = s.status;
                    var address = s.address;
                    var value = s.value;
                    console.log("Read: " + value);
                    var lista = Session.get("clientList");
                    for(var i = 0; i < lista.length; i++) {
                        var adr = lista[i];
                        bluetoothle.notify(
                            function (succ) {
                                console.log(succ)
                            },
                            function (err) {
                                console.log(err)
                            },
                            {
                                "service": "2042",
                                "characteristic": "ABCD",
                                "value": value,
                                "address": adr
                            }
                        )
                    };
                    var msg = atob(value);
                    try {
                        var obj = JSON.parse(msg);
                    } catch (ex) {
                        console.error(ex);
                    }
                    Meteor.call('importMessage', obj.nick ,obj.time  ,obj.message  , Session.get("chatId"));
                },
                //enable
                function(s){
                    console.log(s);
                },
                //disabled
                function(s){
                    console.log(s);
                },
                //subscibed
                function(s){
                    Meteor.call('serverLog', "Nowy uzytkownik sie polaczyl!");
                    var add = Session.get('clientList');
                    add = JSON.stringify(add);
                    Meteor.call('serverLogAdd', add);
                },
                //unsubscribed
                function(s){
                    console.log(s);
                },
                //connected
                function(s){
                    var adr = s.address;
                    // TODO to co w addres dodaj do LIST
                    var lista = Session.get("clientList");
                    lista.push(adr);
                    Session.set("clientList", lista);
                },
                //disconnected
                function(s){
                    var disId = s.address;
                    var lis = Session.get("clientList");
                    var i = -1;
                    i = lis.indexOf(disId);
                    if(i > -1){
                        lis.splice(i,1);
                    }
                    Session.set("clientList", lis);
                    Meteor.call('serverLog', "Uzytkownik sie rozlaczyl!");
                    var add = Session.get('clientList');
                    add = JSON.stringify(add);
                    Meteor.call('serverLogAdd', add);
                },
                //great success
                function(){
                    Session.set('isConnecting', false);
                    Session.set('connectionStatus', true);
                },
                //major fakap
                function(err){
                    console.log(err);
                    Session.set('isConnecting', false);
                    Session.set('connectionStatus', false);
                }
            );
            var exist = ChatCol.find({author: Session.get("nick")}).count();
            Session.set("exist", exist);
            var nick = "";
            nick = nick + Session.get("nick");
            if(Session.get("exist") === 1){
                Session.set("chatId", ChatCol.findOne({author: nick})._id);
                Session.set("serverId", ChatCol.findOne({author: nick})._id);
                FlowRouter.go("/chat");
            }
            else{
                var nick = "";
                nick = nick + Session.get("nick");
                ChatCol.insert({newmessage: [], author: nick});
                Session.set("chatId", ChatCol.findOne({author: nick})._id);
                Session.set("serverId", ChatCol.findOne({author: nick})._id);
                FlowRouter.go("/chat");
            }
        }
        else
            Session.set("nickAlert", true);
    },
    'click .buttonJoinChat': function(){
        var nick = document.getElementById("nickId").value;
        if(Meteor.isCordova){
            ChatCol.insert({newmessage: [], author: nick});
            Session.set("chatId", ChatCol.findOne()._id);
        }

        if(nick !== ""){
            Session.set("admin", false);
            Session.set("nick", nick);
            FlowRouter.go("/list");

        }
        else{
            Session.set("admin", false);
            if(Meteor.isCordova){
                Session.set('isConnecting', false);
                Session.set('connectionStatus', true);
                Session.set('isConnecting', false);
                Session.set('connectionStatus', false);
            }
            Session.set("nickAlert", true);
        }
    }
});
Template.landing.helpers({
    nickError: function(){
        return Session.get("nickAlert");
    },
    nickIsEmpty: function(){
        if(Session.get("nick") !== "") {
            document.getElementById("nickId").value = Session.get("nick");
        }
    }
});