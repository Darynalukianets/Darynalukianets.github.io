
$(function() {

  var html = $('#tmpl-searh-result').html();
  var searchResults = [];

  $(":submit").click(function(event){
    event.preventDefault();
    var inputValue = $(":text").val();
    $('.results-wrapper').remove();

    $.ajax({
      url:
      'https://pixabay.com/api/?key=3308117-c9257b382ed43215755094fa7&q='+inputValue+'&image_type=photo?',
      method: 'GET',
      dataType: 'jsonp',
      success: function() {
        for (var i = 0; i < arguments[0].hits.length; i++) {
          searchResults.push(arguments[0].hits[i].webformatURL);
        };
        var content = tmpl(html, {
          data: searchResults
        });
        $('body').append(content);
        searchResults = [];
      },
      error: function() {
        console.log('Some error happened');
      }
    });

  });

});

// вторая часть ДЗ
function Human() {
  this.name = 'Vasilevs';
  this.age = 25;
  this.sex = 'male';
  this.height = '150cm';
  this.weight = '100kg'
};

function Worker() {
  this.company = 'Heaven';
  this.salary = '200$';
  this.work = function() {
    console.log('Working!')
  }
};


function Student() {
  this.university = 'Some University';
  this.grant = 0;
  this.watching = function() {
    console.log('Watching lots of TV shows!')
  };
};

newHuman = new Human();
Student.prototype = Worker.prototype = newHuman;

var newWorker = new Worker();
var newStudent = new Student();
console.log(newWorker.age);
console.log(newStudent.sex);
