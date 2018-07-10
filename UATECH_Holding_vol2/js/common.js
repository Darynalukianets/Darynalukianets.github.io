(function() {
    $('.contact-link__header, .header__contact-link').click(function(e) {
        e.preventDefault();
        window.scrollBy(0, window.innerHeight);
        $('.contact__form input:first').focus();
    });

    if($('.news__list').length) {
        var newsAmount = $('.news__item').length;
        if ( (newsAmount -  (8 * Math.floor( newsAmount / 8))) === 3 || (newsAmount -  (8 * Math.floor( newsAmount / 8))) === 6 ) {
            $('.news__item:last-child').css('width', '100%');
        }
    }
})();
