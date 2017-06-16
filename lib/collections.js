ChatCol = new Mongo.Collection('chatcol');
ListaSerwerow = new Mongo.Collection('listaserwerow');

Wiadomosc = new SimpleSchema({
    nick: {
        type: String,
        label: 'Nick',
        optional: true,
        // autoform: {
        //     afFieldInput: {
        //         type: "hidden"
        //     },
        //     afFormGroup: {
        //         label: false
        //     }
        // }
    },
    message:{
        type: String,
        label: "Wiadomosc"
    },
    createdAt: {
        type: Date,
        autoValue: function() {
            return (new Date())
        },
        // autoform: {
        //     afFieldInput: {
        //         type: "hidden"
        //     },
        //     afFormGroup: {
        //         label: false
        //     }
        // }
    }
});

ChatColSchema = new SimpleSchema({
    newmessage: {
        type: [Wiadomosc],
        optional: true
    },
    author: {
        type: String,
        label: 'Autor'
    }
});
ChatCol.attachSchema(ChatColSchema);