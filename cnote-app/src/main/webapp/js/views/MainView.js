define(
    [ 'text!templates/main-header-container.htm',
        'text!templates/main-header-bar.htm',
        'text!templates/main-header-collapse.htm',
        'text!templates/main-content-container.htm',
        'text!templates/main-content-row-item.htm',
        'text!templates/main-footer-container.htm', 'presenters/NotePresenter',
        'bootstrap-wysihtml5', 'jquery' ],
    function(hdrContainer, hdrBar, hdrCollapse, contentContainer,
        contentRowItem, ftrContainer, NotePresenter) {
      function MainView() {
        var me = this;
        var currentNote = '';
        var $editor;

        function getData() {
          return {
            note : currentNote,
            value : $('#wysihtml5-textarea').val()
          };
        }

        this.getData = getData;

        function appendNewNotesMenuItem($ul) {
          $ul.append('<li data-note-id="-1">New...</li>');
          $ul.append('<li class="divider"></li>');
        }
        function loadNotesMenu(notesData) {
          var $ul = $('.navbar-header ul');
          $ul.empty();
          appendNewNotesMenuItem($ul);

          for (var i = 0, len = notesData.length; i < len; i++) {
            $li = $('<li data-note-id="' + notesData[i].id + '">'
                + notesData[i].title + '</li>');
            $ul.append($li);
          }
        }

        function loadNote(note) {
          currentNote = note;
          $editor.setValue(note.data, true);
        }

        function onNoteMenuItem(event) {
          var noteId = $(event.currentTarget).attr('data-note-id');
          if (noteId < 0) {
            currentNote = '';
            $editor.setValue("");
          } else {
            NotePresenter.getNote(noteId, false, {
              success : loadNote
            });
          }
        }

        function getNotesMenuItems() {
          NotePresenter.getNote('', true, {
            success : loadNotesMenu
          });
        }

        function storeNote() {
          // TODO pass content view
          NotePresenter.storeNote(me, {
            success : getNotesMenuItems
          });
        }

        // TODO separate out to a header view
        function addHeader(parent) {
          var $hdrContainer = $(hdrContainer);
          parent.append($hdrContainer);
          var $hdr = $hdrContainer.children('.header-container:first-child');
          $hdr.append(hdrBar);
          $hdr.append(hdrCollapse);

          var $ul = $('.navbar-header ul');
          appendNewNotesMenuItem($ul);
          $ul.delegate('li', 'click', onNoteMenuItem);

          getNotesMenuItems();
        }

        // TODO separate out to a content view
        function addContent(parent) {
          var $contentContainer = $(contentContainer);
          parent.append($contentContainer);
          var $content = $contentContainer.children('.row:first-child');

          var $contentRowItem = $(contentRowItem);
          $content.append($contentRowItem);

          var $ta = $contentRowItem.children('textarea:first-child');
          $ta.wysihtml5({
            stylesheets : [ "css/wysiwyg-color.css" ]
          });
          $editor = $ta.data('wysihtml5').editor;
        }

        function addFooter(parent) {
          var $ftr = $(ftrContainer);
          parent.append($ftr);

          // TODO add Resource.get handling for i18n
          var btnHtml = '<a class="btn btn-default btn-store" href="#">Store</a>';
          var $storeButton = $(btnHtml);
          $ftr.append($storeButton);

          $storeButton.on('click', storeNote);
        }

        function load() {
          var $bodyContainer = $('body>.body-wrapper>.body-container');
          addHeader($bodyContainer);
          addContent($bodyContainer);
          addFooter($bodyContainer);
        }

        function init() {
          $(document).ready(load);
        }
        this.init = init;

      }

      return new MainView();
    });