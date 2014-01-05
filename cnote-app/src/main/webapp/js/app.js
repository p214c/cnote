define([ 'jquery', 'views/MainView' ], function($, MainView) {
  var me = this;

  // Update DOM on a Received Event
  function receivedEvent(id) {
    var parentElement = document.getElementById(id);
    var listeningElement = parentElement.querySelector('.listening');
    var receivedElement = parentElement.querySelector('.received');

    listeningElement.setAttribute('style', 'display:none;');
    receivedElement.setAttribute('style', 'display:block;');

    console.log('Received Event: ' + id);
  }
  this.receivedEvent = receivedEvent;

  // deviceready Event Handler
  //
  // The scope of 'this' is the event. In order to call the 'receivedEvent'
  // function, we must explicity call 'app.receivedEvent(...);'
  function onDeviceReady() {
    me.receivedEvent('deviceready');
    MainView.init();
  }
  this.onDeviceReady = onDeviceReady;

  // Bind Event Listeners
  //
  // Bind any events that are required on startup. Common events are:
  // 'load', 'deviceready', 'offline', and 'online'.
  function bindEvents() {
    document.addEventListener('deviceready', this.onDeviceReady, false);
  }

  var initialize = function() {
    bindEvents();
  };

  return {
    initialize : initialize
  };
});
