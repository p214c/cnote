define([ 'jquery' ], function() {
  function Crypt() {
    var cnoteCrypt;

    function getCrypt() {
      if (!cnoteCrypt) {
        var $cnoteCrypt = $('#encrypt-container');
        $cnoteCrypt.on('message', handleMessage);

        cnoteCrypt = $('#cnote_encrypt')[0];
      }

      return cnoteCrypt;
    }
    ;

    function encrypt(value) {
      // Send a message to the Native Client module
      getCrypt().postMessage(value);
    }
    this.encrypt = encrypt;

    // The 'message' event handler. This handler is fired when the NaCl module
    // posts a message to the browser by calling PPB_Messaging.PostMessage()
    // (in C) or pp::Instance.PostMessage() (in C++). This implementation
    // simply displays the content of the message in an alert panel.
    function handleMessage(event) {
      alert(event.data);
    }
  }

  return new Crypt();
});
