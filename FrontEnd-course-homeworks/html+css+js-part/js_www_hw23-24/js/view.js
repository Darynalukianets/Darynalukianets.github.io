define(
  'view',
  ['model', 'jquery', 'tmpl'],
  function (model) {

    function View(model) {
      var self = this;

      function init() {
        var wrapper = tmpl($('#wrapper-template').html());

        $('body').append(wrapper);
        self.elements = {
          input: $('.new-item-value'),
          addBtn: $('.item-add'),
          listContainer: $('.item-list'),
          listInput: $('.item-value'),
          listItem: $('.item'),
          saveBtn: $('.item-save'),
          cancelBtn: $('.item-cancel-edit')
        };
        self.renderList(model.data);
      };

      self.renderList = function (data) {
        var list = tmpl($('#list-template').html(), {data: data});
        self.elements.listContainer.html(list);
      };

      self.show = function (e) {
        e.show();
      };

      init();
    };

    return new View(model);

  }
);
