define([ 'lodash', 'jquery' ], function() {
  function Crypt() {
    var cnoteCrypt;

    var waiting = {};

    function getCrypt() {
      if (!cnoteCrypt) {
        var cnoteCryptDiv = $('#encrypt-container')[0];
        cnoteCryptDiv.addEventListener('message', handleMessage, true);
        // $cnoteCrypt.bind('message', handleMessage);

        cnoteCrypt = $('#cnote_encrypt')[0];
      }

      return cnoteCrypt;
    }

    function endecrypt(value) {
      // set an id to key the message processing on return
      var deferred = $.Deferred();
      var msgId = _.uniqueId();
      value = msgId + '||||' + value;
      waiting[msgId] = {
        deferred : deferred,
        value : value
      };

      // send encrypt message to the Native Client module
      getCrypt().postMessage(value);

      return deferred.promise();
    }
    this.encrypt = endecrypt;
    
    function decrypt(value) {
      // check if decryption is needed
      if (typeof value == 'undefined' || value.indexOf('encrypted||||') < 0) {
        var deferred = $.Deferred();
        deferred.resolve(value);
        return deferred.promise();
      }
      
      return endecrypt(value);
    }
    this.decrypt = decrypt;
    
    // The 'message' event handler. This handler is fired when the NaCl module
    // posts a message to the browser by calling PPB_Messaging.PostMessage()
    // (in C) or pp::Instance.PostMessage() (in C++). This implementation
    // simply displays the content of the message in an alert panel.
    function handleMessage(event) {
      var data = event.data || "";
      if (data.indexOf('ERROR: ') == 0 || data.indexOf('INFO: ') == 0) {
        console.log(data);
        return;
      }

      // expect encrypted response array to be
      // [0] - message id
      // [1] - "encrypted" token start
      // [2] - encrypted data
      // expect decrypted response array to be
      // [0] - message id
      // [1] - decrypted data
      var response = data.split('||||');
      if (response.length < 2) {
        console.log('error parsing id and encrypted value from encrypt plugin response');
      } else {
        var msgId = response[0];
        try {
          var entry = waiting[msgId];
          if (entry && response.length == 3) {
            entry.deferred.resolve(response[1] + "||||" + response[2]);
          } else if (entry && response.length == 2) {
            entry.deferred.resolve(response[1]);
          } else {
            console.log('error finding waiting request with id ' + msgId);
          }
        } finally {
          if (waiting[msgId]) {
            delete waiting[msgId];
          }
        }
      }
    }
  }

  return new Crypt();
});
