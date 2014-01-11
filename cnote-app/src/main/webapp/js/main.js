require.config({
  // Sets the js folder as the base directory for all future relative paths
  baseUrl : 'js',
  paths : {
    // core libraries
    jquery : 'vendor/jquery-1.10.2.min',
    // 'underscore': 'vendor/lodash',

    // plugins
    text : 'vendor/text',
    bootstrap : 'vendor/bootstrap.min',
    lodash : 'vendor/lodash',
    'jquery-hotkeys' : 'vendor/jquery.hotkeys',
    'jquery-delayed' : 'vendor/jquery.delayed-1.1.0.min',
    // switching to a more mobile friendly text editor
    //wysihtml5 : 'vendor/wysihtml5-0.3.0.min',
    //'bootstrap-wysihtml5' : 'vendor/bootstrap-wysihtml5-0.0.3.min',
    'bootstrap-wysiwyg' : 'vendor/bootstrap-wysiwyg',

    // application folders
    // collections: 'app/collections',
    // models: 'app/models',
    // routers: 'app/routers',
    templates : '../templates'
  // views: 'app/views',
  // layouts: 'app/layouts',
  // configs: 'app/config'

  },

  // sets the configuration for your AMD incompatible third party scripts
  shim : {
    bootstrap : [ 'jquery' ],
    // switching to a more mobile friendly text editor
//    wysihtml5 : [ 'jquery' ],
//    'bootstrap-wysihtml5' : [ 'jquery', 'bootstrap', 'wysihtml5' ],
    'bootstrap-wysiwyg' : ['jquery', 'jquery-hotkeys', 'bootstrap'],
  // backbone: {
  // // Depends on underscore/lodash and jQuery
  // 'deps': ['underscore', 'jquery'],
  // // Exports the global window.Backbone object
  // 'exports': 'Backbone'
  // },
  },

});

// load of bootstrap and the app
require([ 'jquery', 'app', 'bootstrap', 'lodash' ], function($, App) {
  App.initialize();
});
