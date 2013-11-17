define([ 'text!templates/main-header-container.htm',
    'text!templates/main-header-bar.htm',
    'text!templates/main-header-collapse.htm',
    'text!templates/main-content-container.htm',
    'text!templates/main-content-row-item.htm',
    'text!templates/main-footer-container.htm',
    'text!templates/main-footer-bar.htm', 'jquery' ], function(
    hdrContainer, hdrBar, hdrCollapse, contentContainer, contentRowItem,
    ftrContainer, ftrBar) {
  function MainView() {

    function load() {
      var $bodyContainer = $('body>.body-wrapper>.body-container');
      var $hdrContainer = $(hdrContainer);
      $bodyContainer.append($hdrContainer);
      var $hdr = $hdrContainer.children('.header-container:first-child');
      $hdr.append(hdrBar);
      $hdr.append(hdrCollapse);

      var $contentContainer = $(contentContainer);
      $bodyContainer.append($contentContainer);
      var $content = $contentContainer.children('.row:first-child');
      for (var i = 0; i < 3; i++) {
        $content.append(contentRowItem);
      }

      var $ftr = $(ftrContainer);
      $bodyContainer.append($ftr);
      $ftr.append(ftrBar);
    }
    
    function init() {
      $(document).ready(load);
    }
    this.init = init;

  }

  return new MainView();
});