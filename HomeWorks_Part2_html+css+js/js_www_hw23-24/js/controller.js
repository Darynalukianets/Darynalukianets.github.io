define(
  'controller',
  ['model', 'view'],
  function (model, view) {

    function Controller(model, view) {
      var self = this;

      view.elements.addBtn.on('click', addItem);
      view.elements.input.keyup(function() {
        if(event.keyCode==13) {
          view.elements.addBtn.click();
          return false;
        }
      });
      view.elements.listContainer.on('click', '.item-delete', removeItem);
      view.elements.listContainer.on('dblclick', '.item', editItem);

      function addItem() {
        var newItem = view.elements.input.val();
        model.addItem(newItem);
        view.renderList(model.data);
        view.elements.input.val('');
      };

      function removeItem() {
        var item = $(this).attr('data-value');

        model.rmItem(item);
        view.renderList(model.data);
      };

      function editItem(item, editedItem) {
        var item = $(this).attr('data-value'),
            itemChildren = $(this).children();

        view.show(itemChildren);

        view.elements.listContainer.on('click', '.item-save', saveEditedItem);
        view.elements.listContainer.on('click', '.item-cancel-edit', cancelEdit);

        function saveEditedItem () {
          var editedItem = $(this).parent().find('.item-value').val();
          var editedItem = itemChildren[0].value;
          model.editItem(item, editedItem);

          view.renderList(model.data);
        };

        function cancelEdit () {
          editedItem, item = '';
          view.renderList(model.data);
        };
      };
    };

    return new Controller(model, view);

  }
);
