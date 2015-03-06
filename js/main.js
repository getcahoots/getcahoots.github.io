// Gumby is ready to go
Gumby.ready(function() {
	Gumby.log('Gumby is ready to go...', Gumby.dump());

	// placeholder polyfil
	if(Gumby.isOldie || Gumby.$dom.find('html').hasClass('ie9')) {
		$('input, textarea').placeholder();
	}

	// skip link and toggle on one element
	// when the skip link completes, trigger the switch
	$('#skip-switch').on('gumby.onComplete', function() {
		$(this).trigger('gumby.trigger');
	});

// Oldie document loaded
}).oldie(function() {
	Gumby.warn("This is an oldie browser...");

// Touch devices loaded
}).touch(function() {
	Gumby.log("This is a touch enabled device...");
});

$(document).ready(function() {
    if ($(window).width() > 1025) {
        $(window).scroll(function() {
            if ($(window).scrollTop() > 100) {
                $('.header').css({
                    height: '66px',
                });
                $('.twelve').css({
                    marginTop: '7px',
                });
            } else if ($(window).scrollTop() < 100) {
                $('.header').css({
                    height: '114px',
                });
                $('.twelve').css({
                    marginTop: '32px',
                });
            } 
        });
    }
}); 