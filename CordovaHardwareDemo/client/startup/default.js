// Run this when the meteor app is started
Meteor.startup(function () {
    Session.set('status','waitingToMeasure')
});