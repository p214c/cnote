require.config({
  // Sets the js folder as the base directory for all future relative paths
  baseUrl : 'js',
  paths : {
    // core libraries
    jquery : 'lib/jquery-1.10.2.min',
    // 'underscore': 'lib/lodash',

    // plugins
    text : 'lib/text',
    bootstrap : 'lib/bootstrap.min',
    lodash : 'lib/lodash',
    'jquery-hotkeys' : 'lib/jquery.hotkeys',
    'jquery-delayed' : 'lib/jquery.delayed-1.1.0.min',
    // switching to a more mobile friendly text editor
    // wysihtml5 : 'lib/wysihtml5-0.3.0.min',
    // 'bootstrap-wysihtml5' : 'lib/bootstrap-wysihtml5-0.0.3.min',
    'bootstrap-wysiwyg' : 'lib/bootstrap-wysiwyg',
    'jquery-blockui' : 'lib/jquery.blockUI',

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
    // wysihtml5 : [ 'jquery' ],
    // 'bootstrap-wysihtml5' : [ 'jquery', 'bootstrap', 'wysihtml5' ],
    'bootstrap-wysiwyg' : [ 'jquery', 'jquery-hotkeys', 'bootstrap' ],
    'deps' : [ 'lodash', 'jquery' ],
    'jquery-blockui' : [ 'jquery' ]
  // backbone: {
  // // Depends on underscore/lodash and jQuery
  // // Exports the global window.Backbone object
  // 'exports': 'Backbone'
  // },
  },

});

// load of bootstrap and the app
require([ 'jquery', 'app', 'bootstrap', 'lodash' ], function($, App) {
  App.initialize();
});
