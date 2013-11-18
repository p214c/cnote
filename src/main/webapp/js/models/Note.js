define([], function() {
  function Note(context) {
    context = context || {};
    
    var note = context.data;
    // TODO add accessors for fields?
//    cabinet
//    drawer
//    data
//    title
//    last-modified
//    created
//    keywords
    
    function getNote() {
      return note;
    }
  }

  return Note;
});