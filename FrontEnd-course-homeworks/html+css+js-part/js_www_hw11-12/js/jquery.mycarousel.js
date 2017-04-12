(function($) {

  $.fn.myCarousel = function(options) {

    var $leftArrow = $('.carousel-arrow-left'),
        $rightArrow = $('.carousel-arrow-right'),
        $elemsList = $('.carousel-list'),
        $pixelsOffset = 325,
        $currentLeftValue = 0,
        $elemsCount = $elemsList.find('li').length,
        $minOffset = - (($elemsCount - 2) * $pixelsOffset),
        $maxOffset = 0;

    $leftArrow.click(function() {
      if ($currentLeftValue != $maxOffset) {
          $currentLeftValue += 325;
          $elemsList.animate({ left : $currentLeftValue + "px"}, 500);
      }
    });

    $rightArrow.click(function() {
      if ($currentLeftValue != $minOffset) {
          $currentLeftValue -= 325;
          $elemsList.animate({ left : $currentLeftValue + "px"}, 500);
      }
    });

    return this;
  }

})(jQuery);
