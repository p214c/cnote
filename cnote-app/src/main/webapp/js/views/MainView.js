define([ 'text!templates/main-header-container.htm', 'text!templates/main-header-bar.htm', 'text!templates/main-header-collapse.htm', 'text!templates/main-content-container.htm', 'text!templates/main-content-row-item.htm',
    'text!templates/main-footer-container.htm', 'text!templates/main-footer-bar.htm', 'presenters/NotePresenter', 'bootstrap-wysiwyg', 'jquery-delayed', 'jquery-blockui' ], function(hdrContainer, hdrBar, hdrCollapse, contentContainer, contentRowItem,
    ftrContainer, ftrBar, NotePresenter) {
  function MainView() {
    var me = this;
    var currentNote = '';
    var $editor;

    function getData() {
      return {
        note : currentNote,
        value : $('#cnote-editor').html()
      };
    }

    this.getData = getData;

    function appendNewNotesMenuItem($ul) {
      $ul.append('<li data-note-id="-1">New...</li>');
      $ul.append('<li class="divider"></li>');
    }

    function disableApp() {
      // mask the content and footer
      var blockOptions = {
        message : null,
        overlayCSS : {
          cursor : 'default'
        }
      };

      $('div.body-container').block(blockOptions);
      $('div.footer-container').block(blockOptions);

      // disable header notes menu
      $('div.navbar-header button.navbar-btn').attr('disabled', 'disabled');

      // display login menu header
      $('div.header-container .navbar-toggle').click();
    }

    function enableApp() {
      $('div.body-container').unblock();
      $('div.footer-container').unblock();

      // enable header notes menu
      $('div.navbar-header button.navbar-btn').removeAttr('disabled');
    }

    function loadNotesFailed(resp) {
      if (resp.status == 401) {
        disableApp();
      }
    }

    function loadNotesMenu(notesData) {
      enableApp();
      var $ul = $('.navbar-header ul');
      $ul.empty();
      appendNewNotesMenuItem($ul);

      for (var i = 0, len = notesData.length; i < len; i++) {
        $li = $('<li data-note-id="' + notesData[i].id + '">' + notesData[i].title + '</li>');
        $ul.append($li);
      }
    }

    function loadNote(note) {
      currentNote = note;
      $editor.removeClass('watermark');
      $editor.html(note.data || '');
    }

    function onNoteMenuItem(event) {
      var $li = $(event.currentTarget);
      $li.parent().children('.active').removeClass('active');
      $li.addClass('active');

      var noteId = $(event.currentTarget).attr('data-note-id');
      if (noteId < 0) {
        currentNote = '';
        $editor.empty();
      } else {
        NotePresenter.getNote(noteId, false, {
          success : loadNote
        });
      }
    }

    function getNotesMenuItems() {
      NotePresenter.getNote('', true, {
        success : loadNotesMenu,
        failure : loadNotesFailed
      });
    }

    function storeNote() {
      // TODO pass content view
      NotePresenter.storeNote(me, {
        success : getNotesMenuItems
      });
    }

    function loginFailed(response) {
      // TODO: move css to css file
      $('form.navbar-form').block({
        message : 'Sign in failed. Please verify and retry.',
        timeout : 2000,
        css : {
          border : 'none',
          padding : '15px',
          backgroundColor : '#000',
          '-webkit-border-radius' : '10px',
          '-moz-border-radius' : '10px',
          opacity : .5,
          color : '#fff'
        }
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

      // set focus to email input field when settings button selected
      // TODO: why is the show event not being captured to set focus?
      $hdrContainer.find('form.navbar-form').on('show', function() {
        $hdrContainer.find('input[placeholder="email"]').focus();
      });

      // add submit handler to login
      $hdrContainer.find('form.navbar-form button:submit').on('click', function(event) {
        var $form = $(this).parent();
        NotePresenter.login(me, {
          email : $form.find('input[placeholder="email"]').val(),
          password : $form.find('input[placeholder="password"]').val()
        }, {
          success : function() {
            // close the settings menu and load the user notes
            $('div.header-container .navbar-toggle').click();
            getNotesMenuItems();
          },
          failure : loginFailed
        });

        // prevent from default that refreshes the page
        event.preventDefault();
      });

      // add handler to logout
      $hdrContainer.find('form.navbar-form button[value="logout"]').on('click', function(event) {
        // logout and force reload
        NotePresenter.logout(me, {
          success : function() {
            location.reload();
          },
          failure : function() {
            location.reload();
          }
        });
      });

      getNotesMenuItems();
    }

    function initToolbarBootstrapBindings(parent) {
      var fonts = [ 'Serif', 'Sans', 'Arial', 'Arial Black', 'Courier', 'Courier New', 'Comic Sans MS', 'Helvetica', 'Impact', 'Lucida Grande', 'Lucida Sans', 'Tahoma', 'Times', 'Times New Roman', 'Verdana' ];
      var $fontTarget = $(parent.find('[title=Font]')).siblings('.dropdown-menu');
      _.forEach(fonts, function(fontName) {
        $fontTarget.append($('<li><a data-edit="fontName ' + fontName + '" style="font-family:\'' + fontName + '\'">' + fontName + '</a></li>'));
      });

      $(parent.find('a[title]')).tooltip({
        container : 'body'
      });

      $(parent.find('.dropdown-menu input')).click(function() {
        return false;
      }).change(function() {
        $(this).parent('.dropdown-menu').siblings('.dropdown-toggle').dropdown('toggle');
      }).keydown('esc', function() {
        this.value = '';
        $(this).change();
      });

      $(parent.find('[data-role=magic-overlay]')).each(function() {
        var overlay = $(this), target = $(overlay.data('target'));
        overlay.css('opacity', 0).css('position', 'absolute').offset(target.offset()).width(target.outerWidth()).height(target.outerHeight());
      });
      // if ("onwebkitspeechchange" in document.createElement("input")) {
      // var editorOffset = $('#editor').offset();
      // $('#voiceBtn').css('position','absolute').offset({top: editorOffset.top, left:
      // editorOffset.left+$('#editor').innerWidth()-35});
      // } else {
      // $('#voiceBtn').hide();
      // }
    }

    function showErrorAlert(reason, detail) {
      var msg = '';
      if (reason === 'unsupported-file-type') {
        msg = "Unsupported format " + detail;
      } else {
        console.log("error uploading file", reason, detail);
      }
      $('<div class="alert"> <button type="button" class="close" data-dismiss="alert">&times;</button>' + '<strong>File upload error</strong> ' + msg + ' </div>').prependTo('#alerts');
    }

    function watermark(editor) {
      var mark = 'Capture your thoughts here!';

      $(editor).focus(function() {
        var $div = $(this);
        if ($div.hasClass('watermark')) {
          $div.empty();
        }
      }).blur(function() {
        var $div = $(this);
        if (!$div.html()) {
          $div.html(mark);
        }
      }).keyup(function() {
        var $div = $(this);
        $div.removeClass('watermark');
      }).text(mark);
    }

    // TODO separate out to a content view
    function addContent(parent) {
      var $contentContainer = $(contentContainer);
      parent.append($contentContainer);
      var $content = $contentContainer.children('.row:first-child');

      var $contentRowItem = $(contentRowItem);
      $content.append($contentRowItem);

      $editor = $contentRowItem.children('#cnote-editor');
      $editor.wysiwyg({
        fileUploadError : showErrorAlert
      });
      watermark($editor);

      initToolbarBootstrapBindings($contentRowItem);

      return $contentContainer;
    }

    function addFooter(parent) {
      var $ftr = $(ftrContainer);
      parent.append($ftr);
      var $ftrBar = $(ftrBar);
      $ftr.append($ftrBar);

      var $storeButton = $(".btn-store");
      $storeButton.on('click', storeNote);
    }

    /*
     * be sure the body container has a size set in pixels to allow content to fill
     */
    function setMainViewHeight() {
      var $bodyContainer = $('body>.body-wrapper>.body-container');
      $bodyContainer.height($('body').innerHeight());

      var $contentContainer = $bodyContainer.children('.content-container');
      var height = $bodyContainer.innerHeight();

      // calculate height of the content container excluding the other children from overall height
      _.forEach($bodyContainer.children(), function(child) {
        if (_.isEqual(child, $contentContainer[0])) {
          return;
        }

        height -= $(child).outerHeight(true);
      });

      // set the content con
      $contentContainer.height(height);
    }

    function load() {
      var $bodyContainer = $('body>.body-wrapper>.body-container');

      addHeader($bodyContainer);
      addContent($bodyContainer);
      addFooter($bodyContainer);

      setMainViewHeight();
      $(window).debounce('resize', setMainViewHeight);
    }

    function init() {
      $(document).ready(load);
    }
    this.init = init;

  }

  return new MainView();
});
