Router.configure({
    //layoutTemplate: 'mainLayout',
    notFoundTemplate: 'notFound'

});



Router.route('/', function () {
    this.render('measureBP');
});

