define(
  'model',
  ['jquery'],
  function (data) {

    function Model (data) {
      var self = this;
      self.data = data;

      self.addItem = function (item) {
        if (item.length === 0){
          return;
        };

        self.data.push(item);

        return self.data;
      };

      self.rmItem = function (item) {
        var index = self.data.indexOf(item);

        if (index === -1) {
          return;
        };

        self.data.splice(index, 1);

        return self.data;
      };

      self.editItem = function (item, editedItem) {
        var index = self.data.indexOf(item);

        if (index === -1) {
          return;
        };

        self.data[index] = editedItem;

        return self.data;
      };
    };

    var firstToDoList = ["Wake up", "Make a cup of coffee", "Plan today's 'To do list'"];
    return new Model(firstToDoList);

  }
);
