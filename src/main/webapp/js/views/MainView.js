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
        me.note = '';

        function getData() {
          return {
            note : me.note,
            value : $('#wysihtml5-textarea').val()
          };
        }

        this.getData = getData;

        function storeNote() {
          // TODO pass content view
          NotePresenter.storeNote(me);
        }

        function addHeader(parent) {
          var $hdrContainer = $(hdrContainer);
          parent.append($hdrContainer);
          var $hdr = $hdrContainer.children('.header-container:first-child');
          $hdr.append(hdrBar);
          $hdr.append(hdrCollapse);
        }

        // TODO separate out to a content view
        function addContent(parent) {
          var $contentContainer = $(contentContainer);
          parent.append($contentContainer);
          var $content = $contentContainer.children('.row:first-child');

          var $contentRowItem = $(contentRowItem);
          $content.append($contentRowItem);

          $contentRowItem.children('textarea:first-child').wysihtml5({
            stylesheets : [ "css/wysiwyg-color.css" ]
          });
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