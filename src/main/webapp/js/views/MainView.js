define([ 'text!templates/main-header-container.htm',
    'text!templates/main-header-bar.htm',
    'text!templates/main-header-collapse.htm',
    'text!templates/main-content-container.htm',
    'text!templates/main-content-row-item.htm',
    'text!templates/main-footer-container.htm', 'presenters/NotePresenter',
    'jquery' ], function(hdrContainer, hdrBar, hdrCollapse, contentContainer,
    contentRowItem, ftrContainer, NotePresenter) {
  function MainView() {

    function addHeader(parent) {
      var $hdrContainer = $(hdrContainer);
      parent.append($hdrContainer);
      var $hdr = $hdrContainer.children('.header-container:first-child');
      $hdr.append(hdrBar);
      $hdr.append(hdrCollapse);
    }

    function addContent(parent) {
      var $contentContainer = $(contentContainer);
      parent.append($contentContainer);
      var $content = $contentContainer.children('.row:first-child');
      for (var i = 0; i < 3; i++) {
        $content.append(contentRowItem);
      }
    }

    function addFooter(parent) {
      var $ftr = $(ftrContainer);
      parent.append($ftr);

      // TODO add Resource.get handling for i18n
      var btnHtml = '<a class="btn btn-default btn-store" href="#">Store</a>';
      var $storeButton = $(btnHtml);
      $ftr.append($storeButton);

      $storeButton.on('click', NotePresenter.storeNote);
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