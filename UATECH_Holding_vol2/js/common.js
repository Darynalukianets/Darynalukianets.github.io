(function() {
    $('.contact-link__header, .header__contact-link').click(function(e) {
        e.preventDefault();
        // window.scrollBy(0, window.innerHeight);
        var scrollBottom = $(window).scrollTop() + $(window).height();
        $(window).scrollTop(scrollBottom);
        $('.contact__form input:first').focus();
    });

    $('.contact-link__header--main').click(function (e) {
        e.preventDefault();
        $('.contact--main').show();
        $('.contact--main input:first').focus();
    });

    $('.popup__close').click(function() {
        $('.contact--main').hide();
    });

    if($('.news__list').length) {
        var newsAmount = $('.news__item').length;
        if ( (newsAmount -  (8 * Math.floor( newsAmount / 8))) === 3 || (newsAmount -  (8 * Math.floor( newsAmount / 8))) === 6 ) {
            $('.news__item:last-child').css('width', '100%');
        }
    }

    $('.header__btn').click(function() {
        $('.video__container').show();
        video = document.getElementById("media");
        video.play();
    });

    $('.popup__close--video').click(function() {
        $('.video__container').hide();
        video = document.getElementById("media");
        video.pause();
    })
})();
