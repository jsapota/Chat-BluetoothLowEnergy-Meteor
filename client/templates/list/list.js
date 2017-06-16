Template.list.onCreated(function () {
    this.ServerList = new ReactiveVar();
    Session.set("Lista", []);
});

Template.list.helpers({
    setServerList: function () {
        if(Meteor.isCordova){
            scanForServers(
                function (Lista) {
                    Session.set("Lista", Lista)
                },
                function () {}
            );
        } else {
            var list = ChatCol.find({}).map(function(c) {
                return {id: c._id, name: c.author};
            });
            Session.set("Lista", list);
        }
    },
    listElement: function () {
        return Session.get("Lista");
    }
});


Template.list.events({
    'click .buttonrefresh': function () {
        if(Meteor.isCordova){
            stopScanForServers(function (arg) {
                console.log(arg)
            });
            scanForServers(
                function (Lista) {
                    Session.set("Lista", Lista)
                },
                function () {}
            );
        } else {
            var list = ChatCol.find({}).map(function(c) {
                return {id: c._id, name: c.author};
            });
            Session.set("Lista", list);
        }
    }
});
