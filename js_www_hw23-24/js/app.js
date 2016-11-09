requirejs.config({
  paths: {
    'jquery': 'https://code.jquery.com/jquery-1.12.3',
    'tmpl': ['tmpl']
  },
  shim: {
    'jquery': {
      exports: 'jQuery'
    },
    'tmpl': {
      exports: 'tmpl'
    }
  }
});

require(
  [
    'model',
    'view',
    'controller',
    'jquery',
    'tmpl'
  ],
  function (model, view, controller, $, tmpl) {
    
  }
);
