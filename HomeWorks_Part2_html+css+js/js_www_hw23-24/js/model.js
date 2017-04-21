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

        self.dataStorage(self.data);

        return self.data;
      };

      self.rmItem = function (item) {
        var index = self.data.indexOf(item);

        if (index === -1) {
          return;
        };

        self.data.splice(index, 1);

        self.dataStorage(self.data);

        return self.data;
      };

      self.editItem = function (item, editedItem) {
        var index = self.data.indexOf(item);

        if (index === -1) {
          return;
        };

        self.data[index] = editedItem;

        self.dataStorage(self.data);

        return self.data;
      };

      self.dataStorage = function(data) {
        localStorage.setItem('toDoList', JSON.stringify(data));
      }
    };

    if (localStorage.getItem('toDoList')) {
      var toDoList = localStorage.getItem('toDoList');
      toDoList = JSON.parse(toDoList);
      return new Model(toDoList);
    } else {
      return new Model(['Add first task in this list']);
    }
  }
);
