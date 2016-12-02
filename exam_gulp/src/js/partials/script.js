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
            columnWidth: '.grid-sizer'
        });
    });
  };

  function search() {
    $('.ideas__container').find('div').remove();
    var $inputValue = $(":text").val();

    $.ajax({
      url:
      'https://pixabay.com/api/?key=3308117-c9257b382ed43215755094fa7&q='+$inputValue+'&image_type=photo',
      method: 'GET',
      dataType: 'jsonp',
      success: function(data) {

        var $html = $('#tmpl-ideas-grid').html();
        var $content = tmpl($html, data);
        $('.ideas__container').append($content);
        grid();
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
