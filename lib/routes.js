FlowRouter.triggers.enter([function(context, redirect) {}]);

FlowRouter.route('/', {
    name: 'landing',
    action:function() {
        BlazeLayout.render('MainLayout', {
            content: 'landing'
        });
    }
});

FlowRouter.route('/chat', {
    name: 'chat',
    action:function() {
        BlazeLayout.render('MainLayout', {
            content: 'chat'
        });
    }
});

FlowRouter.route('/list', {
    name: 'list',
    action:function() {
        BlazeLayout.render('MainLayout', {
            content: 'list'
        });
    }
});
