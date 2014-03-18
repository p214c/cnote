define([ 'models/Note', 'utils/Crypt', 'jquery' ], function(Note, Crypt) {
  // TODO encrypt all payloads locally when plugin and user key are available
  function NotePresenter() {
    var me = this;

    me.success = '';
    me.failure = function(jqXHR, error) {
      alert(error + '\n\t' + jqXHR.responseText);
    };

    function login(view, formFields, callbacks) {
      var success = callbacks ? callbacks.success : me.success;
      var failure = callbacks ? callbacks.failure : me.failure;

      $.ajax({
        type : 'POST',
        url : '/login',
        data : JSON.stringify(formFields),
        success : success,
        contentType : 'application/json'
      }).fail(failure);
    }
    this.login = login;

    function logout(view, callbacks) {
      var success = callbacks ? callbacks.success : me.success;
      var failure = callbacks ? callbacks.failure : me.failure;

      $.ajax({
        type : 'GET',
        url : '/logout',
        success : success
      }).fail(failure);
    }
    this.logout = logout;

    function load(id, justIds, callbacks) {
      var type = 'GET';
      var url = '/notes' + (id ? '/' + id : '');
      if (justIds) {
        url += '?ids=true';
      }
      var success = callbacks ? callbacks.success : me.success;
      var failure = callbacks ? callbacks.failure : me.failure;

      $.ajax({
        type : type,
        url : url,
        success : success
      }).fail(failure);
    }

    function store(note, callbacks) {
      var type = note._id ? 'PUT' : 'POST';
      var url = '/notes' + (note._id ? '/' + note._id : '');
      var success = callbacks ? callbacks.success : me.success;
      var failure = callbacks ? callbacks.failure : me.failure;

      $.ajax({
        type : type,
        url : url,
        data : JSON.stringify(note),
        success : success,
        contentType : 'application/json'
      }).fail(failure);
    }

    function remove(note, callbacks) {
      var type = 'DELETE';
      var url = '/notes/' + note._id;
      var success = callbacks ? callbacks.success : me.success;
      var failure = callbacks ? callbacks.failure : me.failure;

      $.ajax({
        type : type,
        url : url,
        success : success
      }).fail(failure);
    }

    function storeNote(view, callbacks) {
      var data = view.getData();
      Crypt.encrypt(data.value).then(function(value) {
        var note = data.note || new Note();
        note.data = value;
        store(note, callbacks);
      });
    }
    this.storeNote = storeNote;

    function getNote(id, justIds, callbacks) {
      if (justIds) {
        load(id, justIds, callbacks);
      } else {
        // route ajax note returned through decrypt
        load(id, justIds, {
          failure : callbacks.failure,
          success : function(note) {
            Crypt.decrypt(note.data).then(function(value) {
              note.data = value;
              if (callbacks.success) {
                callbacks.success(note);
              }
            });
          }
        });
      }
    }
    this.getNote = getNote;

    function removeNote(view, callbacks) {
      var data = view.getData();
      var note = data.note;
      remove(note, callbacks);
    }
    this.removeNote = removeNote;
  }

  return new NotePresenter();
});
