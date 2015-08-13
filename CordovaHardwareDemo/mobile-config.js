// This section sets up some basic app metadata,
// the entire section is optional.
App.info({
  id: 'com.CM.doctor',
  name: 'meteor_ihealth_bp',
  author: 'Hongfeng Zhou',
  email: 'hongfengzhou@yahoo.com',
  website: ''
});

// Pass preferences for a particular PhoneGap/Cordova plugin
App.configurePlugin('com.ihealth.plugin.bpmanagercordova', {
  APP_ID: '2015042801',
  API_KEY: 'supersecretapikey',
  APP_NAME: 'BpManagerCordova'
});


