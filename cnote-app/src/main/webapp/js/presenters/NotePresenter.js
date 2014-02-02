define([ 'models/Note', 'jquery' ], function(Note) {
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
    
    function getNote(id, justIds, callbacks) {
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
    this.getNote = getNote;
    
    function store(note, callbacks) {
      var type = note.id ? 'PUT' : 'POST';
      var url = '/notes' + (note.id ? '/' + note.id : '');
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

    function storeNote(view, callbacks) {
      var data = view.getData();
      var note = data.note || new Note();
      note.data = data.value;
      store(note, callbacks);
    }
    this.storeNote = storeNote;
  }

  return new NotePresenter();
});