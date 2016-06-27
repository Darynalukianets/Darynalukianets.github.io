$(function () {

  $('h6:eq(1)').click (function(){
    $('h6.active').removeClass('active');
    $('.visible').removeClass('visible');
    $(this).addClass('active');
    $('#content2').addClass('visible');
});

  $('h6:eq(2)').click (function(){
    $('h6.active').removeClass('active');
    $('.visible').removeClass('visible');
    $(this).addClass('active');
    $('#content3').addClass('visible');
});

$('h6:eq(0)').click (function(){
  $('h6.active').removeClass('active');
  $('.visible').removeClass('visible');
  $(this).addClass('active');
  $('#content1').addClass('visible');
});

});
