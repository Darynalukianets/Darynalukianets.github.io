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
    '2018_1': {
        id: '2018_1',
        date: '2018',
        text: 'Exit from Pumpic'
    },
    '2018_2': {
        id: '2018_2',
        date: '2018',
        text: 'Investment in high growth e-commerce business based on affiliate marketing and working at 40 countries'
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
            if (i <= 7) {
                afterList.push(histListValuesArr[i]);
            } else {

                afterList.push(histListValuesArr[i - histListValuesArr.length]);
            }
        }
        var afterListReversed = afterList.reverse();

        for (var i = chosenItemPosition - 1; i > chosenItemPosition - 4; i--) {
            if (i >= 0) {
                prevList.push(histListValuesArr[i]);
            } else {
                prevList.push(histListValuesArr[i + histListValuesArr.length]);
            }

        }

        (function createNewDateList() {
            for (var i = 0; i < 3; i++) {
                newDatesList[i] = afterListReversed[i];
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
                                //постепенно прячем содержимое карточки
                                $('.slider__card__year, .slider__card__descr').fadeOut('fast', function() {
                                    //присваиваем в карточку новые значения
                                    $('.slider__card__year').html(histList[chosenItem].date);
                                    $('.slider__card__descr').html(histList[chosenItem].text);
                                    //постепенно показываем карточку
                                    $('.slider__card__year, .slider__card__descr').fadeIn('slow', function() {
                                        //запускаем функцию расстановки дат по новым местам: сначала присваивается айдишник центральной точке, потом - вытягивая последовательность из объекта - айдишник и год каждой из точек
                                        $('.centered').attr('id', chosenItem);
                                        // $('.centered').prev().attr('id', );
                                       $('.hist__item').toArray().forEach(function(currval, i, arr) {
                                           arr[i].id = newDatesList[i].id;
                                           arr[i].children[1].innerText = newDatesList[i].date;
                                       })
                                        $('.hist__item__year').fadeIn('fast', function() {

                                        });
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
        $('.centered--mob').toggleClass('centered--mob');
        $(this).toggleClass('centered--mob');
        var neYearId = $(this).attr('id');
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
    })
})();
