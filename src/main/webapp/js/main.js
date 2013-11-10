require.config({
  // Sets the js folder as the base directory for all future relative paths
  baseUrl: './js',
  paths: {
      // core libraries
      jquery: 'vendor/jquery-1.10.1.min',
//      'underscore': 'vendor/lodash',

      // plugins
      bootstrap: 'vendor/bootstrap.min.js'

      // application folders
//      collections: 'app/collections',
//      models: 'app/models',
//      routers: 'app/routers',
//      templates: 'app/templates',
//      views: 'app/views',
//      layouts: 'app/layouts',
//      configs: 'app/config'

  },

  // sets the configuration for your AMD incompatible third party scripts
  shim: {
      bootstrap: ['jquery']
//      backbone: {
//        // Depends on underscore/lodash and jQuery
//        'deps': ['underscore', 'jquery'],
//        // Exports the global window.Backbone object
//        'exports': 'Backbone'
//      },
  },

  enforceDefine: true

});
