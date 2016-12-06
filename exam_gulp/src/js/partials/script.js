$(function () {

  // slider
  $('.bxslider').bxSlider();

  // Masonry grid layout
  function grid() {
    var $grid = $('.grid');
    $grid.imagesLoaded(function () {
        $grid.masonry({
            itemSelector: '.grid-item',
            percentPosition: true,
            columnWidth: '.grid-sizer',
            gutter: '.gutter-sizer'
        });
    });
  };

  function search() {
    var $inputValue = $(":text").val();

    $.ajax({
      url:
      'https://pixabay.com/api/?key=3308117-c9257b382ed43215755094fa7&q='+$inputValue+'&image_type=photo',
      method: 'GET',
      dataType: 'jsonp',
      success: function(data) {
        if (data.hits.length > 0) {
          for (var i = 0; i < 7; i++) {
            $('.image' + [i + 1]).append('<a href=" ' + data.hits[i].webformatURL + ' " class="grid-item__title">' + data.hits[i].tags.split(', ')[1] + '</a>');
            $('.image' + [i + 1]).css({
              'backgroundImage': 'url("' + data.hits[i].webformatURL + '")'
            });
          }
        }
      },
      error: function() {
        console.log('Some error happened');
      }
    });
  };

  search();

  $('.ideas__form__search').on('click', function (e) {
    e.preventDefault();
    search();
    $('.ideas__form__input').val('');
  })
});
