$(function(){
  function sliderJS (obj) {
    var ul = $(".slider").find("ul");//находим контейнер с изображениями
    var step = $(".slider__item").width();//ширина шага анимации = ширине элемента слайдера
    $(ul).animate({marginLeft: "-"+step*(obj-1)}, 500);
  };

  $(document).on("click", ".slider-toggle__item", function() {
    var obj = $(this).attr("id").slice(6);//узнаем порядковый номер кликнутого элемента
    console.log(obj);
    $(".slider-toggle__item--active").removeClass("slider-toggle__item--active").addClass("slider-toggle__item");//находим элемент с модификатором активности, удаляем класс с модификатором и присваиваем класс неактивного переключателя
    $(this).removeClass("slider-toggle__item").addClass("slider-toggle__item--active");//добавляем модификатор кликнутого переключателя кликнутому переключателю
    sliderJS(obj); // слайдим
    return false;
  });

  $(document).on("click", ".accordion-panels__item", function() {
    $(".accordion-panels__item--active").removeClass("accordion-panels__item--active").addClass("accordion-panels__item");
    $(".accordion-panels__item").find(".text").hide();
    $(".item-state").html("+");
    $(this).addClass("accordion-panels__item--active");
    $(this).find(".item-state").html("_");
    $(this).find(".text").slideToggle("slow");
  });

  $(document).on("click", ".accordion-panels__item--active", function() {
    $(this).find(".text").hide();
    $(this).removeClass("accordion-panels__item--active").addClass("accordion-panels__item");
    $(this).find(".item-state").html("+");

  })

}())
