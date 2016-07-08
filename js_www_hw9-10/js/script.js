$(function() {
  // Carousel
    $('.jcarousel').jcarousel();

    $('.jcarousel-prev')
            .on('jcarouselcontrol:active', function() {
                $(this).removeClass('inactive');
            })
            .on('jcarouselcontrol:inactive', function() {
                $(this).addClass('inactive');
            })
            .jcarouselControl({
                target: '-=1'
            });

    $('.jcarousel-next')
            .on('jcarouselcontrol:active', function() {
                $(this).removeClass('inactive');
            })
            .on('jcarouselcontrol:inactive', function() {
                $(this).addClass('inactive');
            })
            .jcarouselControl({
                target: '+=1'
            });

    $('.jcarousel-pagination')
            .on('jcarouselpagination:active', 'a', function() {
                $(this).addClass('active');
            })
            .on('jcarouselpagination:inactive', 'a', function() {
                $(this).removeClass('active');
            })
            .jcarouselPagination();

// Select plagin inicialisation
    $(document).ready(function(){
            $("#styledSelect").heapbox();
        });

// alternative select plagin
        // $(document).ready(function(){
        //     $('#styledSelect').customSelect();
        // });

    $('.niceCheck').each(
      function() {
        changeCheckStart($(this));
      });

// slide down menu + changing color with jquery.color plagin
    $('.dropdown').hover(function() {
      $(this).children('.sub-menu')
         .slideDown(200)
         .animate({backgroundColor:'#464443',}, 500);
      },
      function(){
        $(this).children('.sub-menu')
          .slideUp(200)
          .animate({backgroundColor:'#6a6766',}, 500);
      });
});

function changeCheck(el) {
  var el = el,
      input = el.find('input').eq(0);
  if(el.attr('class').indexOf('niceCheckDisabled') == -1) {

    if(!input.attr('checked')) {
      el.addClass('niceChecked');
      input.attr('checked', true);
    } else {
      el.removeClass('niceChecked');
      input.attr('checked', false).focus();
    }
  }
  return true;
}

function changeVisualCheck(input) {
  var wrapInput = input.parent();

  if(!input.attr('checked')) {
    wrapInput.removeClass('niceChecked');
  }
  else {
    wrapInput.addClass('niceChecked');
  }
}

function changeCheckStart (el) {
  try {
    var el = el,
        checkName = el.attr('name'),
        checkId = el.attr('id'),
        checkChecked = el.attr('checked'),
        checkDisabled = el.attr('disabled'),
        checkTab = el.attr('tabindex'),
        checkValue = el.attr('value');

    if(checkChecked)
        el.after('<span class="niceCheck niceChecked">' +
                 '<input type="checkbox"' +
                 'name="' + checkName + '"' +
                 'id="' + checkId + '"' +
                 'checked="' + checkChecked + '"' +
                 'value="' + checkValue + '"' +
                 'tabindex="' + checkTab + '" /></span>');
    else
        el.after('<span class="niceCheck">' +
                 '<input type="checkbox"' +
                 'name="' + checkName + '"' +
                 'id="' + checkId + '"' +
                 'value="' + checkValue + '"' +
                 'tabindex="' + checkTab + '" /></span>');
    if(checkDisabled) {
      el.next().addClass('niceCheckDisabled');
      el.next().find('input').eq(0).attr('disabled','disabled');
    }

    el.next().bind('mousedown', function(e) {
      changeCheck($(this))
    });
    el.next().find('input').eq(0).bind('change', function(e) {
      changeVisualCheck($(this))
    });

    if($.browser.msie) {
      el.next().find('input').eq(0).bind('click', function(e) {
        changeVisualCheck($(this))
      });
    }
    el.remove();
  }
  catch(e) {

  }
  return true;
  }
