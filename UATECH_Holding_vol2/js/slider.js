$.fn.extend({
    scrollRight: function (val) {
        if (val === undefined) {
            return this[0].scrollWidth - (this[0].scrollLeft + this[0].clientWidth) + 1;
        }
        return this.scrollLeft(this[0].scrollWidth - this[0].clientWidth - val);
    }
});
var histList = {
    '2005': {
        id: '2005',
        date: '2005',
        text: 'A small team of IT entrepreneurs started to generate web traffic with help of SEO'
    },
    '2010': {
        id: '2010',
        date: '2010',
        text: 'Launch of internet- marketing business'
    },
    '2012': {
        id: '2012',
        date: '2012',
        text: 'Social responsibility through «Pomogator» sponsorship'
    },
    '2013': {
        id: '2013',
        date: '2013',
        text: 'Launch of product company - Pumpic'
    },
    '2016': {
        id: '2016',
        date: '2016',
        text: 'Acquisition of IT outsourcing business'
    },
    '2017': {
        id: '2017',
        date: '2017',
        text: ' A few Angel Investments was made'
    },
    '2018': {
        id: '2018',
        date: '2018',
        text: [
            'Exit from Pumpic',
            'Investment in high growth e-commerce business based on affiliate marketing and working at 40 countries'
        ]
    }
};
(function slider () {
    $('.hist__item').click(function() {
        //сохраняем айдишник выбранного года
        var chosenItem = $(this).attr('id');

        //манипуляции для нового порядка дат
        var histListArr = Object.keys(histList);
        var histListValuesArr = Object.values(histList);

        var chosenItemPosition;
        var newDatesList = [];
        var afterList = [];
        var prevList = [];

        for (var i = 0; i < histListArr.length; i++ ) {
            if (chosenItem === histListArr[i]) {
                chosenItemPosition = i;
            }
        }

        newDatesList[3] = histListValuesArr[chosenItemPosition];

        for (var i = chosenItemPosition + 1; i < chosenItemPosition + 4; i++) {
                prevList.push(histListValuesArr[i]);
        }

        for (var i = chosenItemPosition - 1; i > chosenItemPosition - 4; i--) {
                afterList.push(histListValuesArr[i]);
        }

        (function createNewDateList() {
            for (var i = 0; i < 3; i++) {
                afterList = afterList.reverse();
                newDatesList[i] = afterList[i];
            }
            for (var i = 4; i < 7; i++) {
                newDatesList[i] = prevList[i - 4];
            }
        })();

        //добавить класс запускающий анимацию смены точки с маленькой на большую
        $(this).find('.hist__item__dot').fadeOut('fast', function() {
            $(this).addClass('active');
            $('.hist__item__year').fadeOut('fast', function() {
            });
        });
        $(this).find('.hist__item__dot').fadeIn('fast', function() {});

        $('.centered').fadeOut('fast', function() {
            $(this).addClass('fadeactive');

            $(this).fadeIn('fast', function() {
                //снова делаем большой точку по центру
                $('.active.hist__item__dot').fadeOut('fast', function() {
                    $(this).removeClass('active');
                    $(this).fadeIn('fast', function() {
                        $('.centered').fadeOut('fast', function() {
                            $(this).removeClass('fadeactive').fadeIn('fast', function() {
                                //процесс 1 запускаем функцию расстановки дат по новым местам: сначала присваивается айдишник центральной точке, потом - вытягивая последовательность из объекта - айдишник и год каждой из точек
                                $('.centered').attr('id', chosenItem);
                                //убрать классы присвоенные при предыдущей выборке, если они есть
                                $('.hist__item').toArray().forEach(function(currval, i, arr) {
                                    arr[i].classList.remove('hide');
                                    arr[i].classList.remove('undefined');
                                    arr[i].classList.remove('show');
                                });
                                //определить какие даты в круге показывать, а какие - скрыть
                                $('.hist__item').toArray().forEach(function(currval, i, arr) {
                                    if ( newDatesList[i] === undefined ) {
                                        arr[i].classList.add('hide');
                                        arr[i].classList.add('undefined');
                                    } else {
                                        arr[i].classList.add('show');
                                        arr[i].id = newDatesList[i].id;
                                        arr[i].children[1].innerText = newDatesList[i].date;
                                    }
                                });
                                $('.hist__item.show .hist__item__year').fadeIn('fast', function() {
                                });

                                // процесс 2 постепенно прячем содержимое карточки
                                $('.slider__card__year, .slider__card__descr').fadeOut('fast', function() {
                                    //присваиваем в карточку новые значения
                                    $('.slider__card__year').html(histList[chosenItem].date);
                                    if (Array.isArray(histList[chosenItem].text)) {
                                        $('.slider__card__descr').html('');
                                        histList[chosenItem].text.forEach(function(currval, i, arr) {
                                            $('.slider__card__descr').append('<p>'+currval+ '</p>');
                                        });
                                    } else {
                                        $('.slider__card__descr').html(histList[chosenItem].text);
                                    }
                                    //постепенно показываем карточку
                                    $('.slider__card__year, .slider__card__descr').fadeIn('slow', function() {

                                    });
                                });
                            });
                        })
                    })
                });
            });
        });
    })
})();

(function() {
    var scrollLeft = (115 * ((($('.slider__item--mob').length) / 2) - 2) ) + (2 * 57) - ($(window).width() / 2) + 50;
    $('.slider__list--mob').scrollLeft(scrollLeft);

    $('.slider__item--mob').click(function() {
        var neYearId = $(this).attr('id');
        $('.centered--mob').toggleClass('centered--mob');
        $(this).toggleClass('centered--mob');


        //switch nav pointer
        $('.slider__nav__item').toArray().forEach(function(currval, i, arr) {
            if (currval.id === neYearId + 'btn') {
                $('.slider__nav__item').removeClass('active');
                currval.classList.add('active');
            }
        });

        $('.slider__year--mob').html();
        var histListArr = Object.keys(histList);

        histListArr.forEach(function(currval, i, arr) {
            if (currval === neYearId){
                $('.slider__card--mob').fadeOut('fast', function() {
                    $('.slider__card__year--mob').html( Object.values(histList)[i].date);
                    $('.slider__card__descr--mob').html( Object.values(histList)[i].text);
                    $('.slider__card--mob').fadeIn('fast', function(){});
                })
            }
         });
    });

    $('.slider__nav__item').click(function() {
        var currId = $('.centered--mob').attr('id');
        var currSide = $('.centered--mob').attr('data-side');
        var currPosition;
        var newId = $(this).attr('id').slice(0, 4);
        var newPosition;
        $('.slider__nav__item').removeClass('active');
        $(this).addClass('active');
        $('.centered--mob').removeClass('centered--mob');

        Object.values(histList).forEach(function(currval, i, arr) {
            if (currval.id === currId) {
                currPosition = i;
            }
            if (currval.id === newId) {
                newPosition = i;
            }
        });

        var scrollSteps = (currPosition + 1)  - (newPosition + 1);

        if (currSide === 'right') {
            if (currPosition > newPosition) {
                $('.slider__list--mob').scrollLeft(($('.slider__list--mob')[0].scrollLeft) - (115 * Math.abs(scrollSteps)));
            } else {
                $('.slider__list--mob').scrollLeft(($('.slider__list--mob')[0].scrollLeft) - (115 * scrollSteps));
            }
            $('#' + newId + '.slider__item--mob[data-side="right"]').addClass('centered--mob');

        }
        if (currSide === 'left') {
            if (currPosition > newPosition) {
                $('.slider__list--mob').scrollLeft(($('.slider__list--mob')[0].scrollLeft) - (115 * scrollSteps));
            } else {
                $('.slider__list--mob').scrollLeft(($('.slider__list--mob')[0].scrollLeft) + (115 * Math.abs(scrollSteps)));
            }
            $('#' + newId + '.slider__item--mob[data-side="left"]').addClass('centered--mob');
        }

        Object.keys(histList).forEach(function(currval, i, arr) {
            if (currval === newId){
                $('.slider__card--mob').fadeOut('fast', function() {
                    $('.slider__card__year--mob').html( Object.values(histList)[i].date);
                    if (Array.isArray(Object.values(histList)[i].text)) {
                        $('.slider__card__descr--mob').html('');
                        Object.values(histList)[i].text.forEach(function(currval, i, arr) {
                            $('.slider__card__descr--mob').append('<p>'+currval+ '</p>');
                        });
                    } else {
                        $('.slider__card__descr--mob').html( Object.values(histList)[i].text);
                    }
                    $('.slider__card--mob').fadeIn('fast', function(){});
                })
            }
        });

        if (Array.isArray(histList[chosenItem].text)) {
            $('.slider__card__descr').html('');
            histList[chosenItem].text.forEach(function(currval, i, arr) {
                $('.slider__card__descr').append('<p>'+currval+ '</p>');
            });
        } else {
            $('.slider__card__descr').html(histList[chosenItem].text);
        }

    })
})();
