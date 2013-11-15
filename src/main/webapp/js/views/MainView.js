define([ 'text!templates/main-header-container.htm',
    'text!templates/main-header-bar.htm',
    'text!templates/main-header-collapse.htm',
    'text!templates/main-content-container.htm',
    'text!templates/main-content-row-item.htm',
    'text!templates/main-footer-container.htm', 'jquery' ], function(
    hdrContainer, hdrBar, hdrCollapse, contentContainer, contentRowItem,
    ftrContainer) {
  function MainView() {

    function load() {
      var $body = $('body');
      var $hdrContainer = $(hdrContainer);
      $body.append($hdrContainer);
      var $hdr = $hdrContainer.children('.container:first-child');
      $hdr.append(hdrBar);
      $hdr.append(hdrCollapse);

      var $contentContainer = $(contentContainer);
      $body.append($contentContainer);
      var $content = $contentContainer.children('.row:first-child');
      for (var i = 0; i < 3; i++) {
        $content.append(contentRowItem);
      }

      $body.append(ftrContainer);
    }
    
    function init() {
      $(document).ready(load);
    }
    this.init = init;

  }

  return new MainView();
});