Template.chat.onCreated(function(){
    Session.set('startConnecting', false);
    Session.set('isConnecting', false);
    Session.set('connectionStatus', false);
});

Template.chat.helpers({
    chat: function(){
        return ChatCol.findOne({_id: Session.get("serverId")})
    },
    short: function(date){
        var str = date + "";
        var res = str.substr(0,10);
        return res
    },
    isConnecting: function(){
        return Session.get('isConnecting')
    },
    startConnecting: function(){
        return Session.get('startConnecting')
    },
    connectionStatus: function(){
        return Session.get('connectionStatus')
    },
    admin: function(){
        return Session.get('admin');
    },
    connectionSuccess: function(){
        Session.set('isConnecting', false);
        Session.set('connectionStatus', true);
    },
    connectionFailure: function(){
        Session.set('isConnecting', false);
        Session.set('connectionStatus', false);
    },
    server: function(nick){
        if(nick == "%%&&%%&&")
            return true;
        else
            return false;
    },
    serverList: function(nick){
        if(nick == "%&$addr")
            return true;
        else
            return false;
    },
    updateServerList: function(message){
        var obj = JSON.parse(message);
        Session.set("clientList", obj);
    },
    me:function(nick){
        if(nick == Session.get('nick'))
            return true;
        else
            return false;
    }

});


Template.chat.events({
    'click .cancelConnecting':function(){
        FlowRouter.go('/');
    },
    'click .tryAgain': function(){
        Meteor.call('connectAgain');
    },
    'click .closeStatusWindow': function(){
         Session.set('startConnecting',false);
    },
    'click .buttonMessageClient': function(){
        var messageInput = document.getElementById("messageId").value;
        var nick = Session.get("nick");
        document.getElementById("messageId").value = "";
        if(Meteor.isCordova){
            Meteor.call('exportMessage', nick, new Date(), messageInput);
        } else {
            console.log(nick + new Date() + messageInput + Session.get("chatId"));
            Meteor.call('importMessage',nick, new Date(), messageInput, Session.get("serverId"));
        }
    },
    'click .buttonMessageAdmin': function(){
        var messageInput = document.getElementById("messageId").value;
        var nick = Session.get("nick");
        document.getElementById("messageId").value = "";
        Meteor.call('importMessage',nick, new Date(), messageInput, Session.get("chatId"));
        if(Meteor.isCordova){
            var msg = {nick:nick , time:new Date() , message:messageInput };
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
        }
    }
});
