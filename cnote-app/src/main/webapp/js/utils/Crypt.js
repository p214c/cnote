define([ 'jquery' ], function() {
  function Crypt() {
    function encrypt() {
      CModule = document.getElementById('hello_tutorial');
      updateStatus('SUCCESS');
      // Send a message to the Native Client module
      HelloTutorialModule.postMessage('hello');
    }
    this.encrypt = encrypt;

    // The 'message' event handler. This handler is fired when the NaCl module
    // posts a message to the browser by calling PPB_Messaging.PostMessage()
    // (in C) or pp::Instance.PostMessage() (in C++). This implementation
    // simply displays the content of the message in an alert panel.
    function handleMessage(message_event) {
      alert(message_event.data);
    }

    $('encrypt_listener').bind('message', handleMessage, true);
  }

  return new Crypt();
});
