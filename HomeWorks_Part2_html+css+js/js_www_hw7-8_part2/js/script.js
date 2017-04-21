$(function () {

  $('input').hover(function() {
    $(this).next().animate({opacity: 'show'}, 'slow');
  }, function() {
    $(this).next().animate({opacity: 'hide'}, 'fast');
  });

  $('button').bind('click', function() {
    $('.tooltip').animate({opacity: 'show'}, 'slow');
  });

});
