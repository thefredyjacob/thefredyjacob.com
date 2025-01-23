(function($) {

	"use strict";


	// settings
	// --------------------

	var ww = window.innerWidth,
		wh = window.innerHeight,
		page_loaded = false,
		ajax_first_load = false,
		ajax_loading = false,
		ajax_location = '';


	after_load();
	open_close_nav();
	shortcodes();
	ajax();


	// ready
	// --------------------

	$(window).on('load', function() {
		$('body').waitForImages({
			finished: function() {
				setTimeout(function() {
					fade();
				}, 500);
			},
			waitForAll: true
		});
	});


	// fade
	// --------------------

	function fade() {
		$('.fade').addClass('show-content');

		setTimeout(function() {
			$('.fade').addClass('hide-content').removeClass('show-content');
		}, 1500);

		setTimeout(function() {
			$('.fade').addClass('hide');
			page_loaded = true;
			reveals();
		}, 2000);
	}


	// after load
	// --------------------

	function after_load() {
		// scroll
		$(window).on('scroll', function() {
			var scroll = $(this).scrollTop();

			// headline
			$('.headline').css({
				opacity: (1 - (scroll / 25) / 20),
				transform: 'translate3d(0, ' + scroll / 2 + 'px, 0)'
			});

			// to top
			if (scroll > wh / 2) {
				$('.to-top').addClass('visible');
			} else {
				$('.to-top').removeClass('visible');
			}
		});

		$('body').on('click', '.to-top', function() {
			$('html, body').animate({
				scrollTop: 0
			}, 1000, 'easeInOutCubic');
		});

		$('body').on('mouseenter', '.footer .footer-social li a', function() {
			$('.footer .footer-social li a').stop().animate({
				opacity: 0.3
			}, 300);

			$(this).stop().animate({
				opacity: 1
			}, 300);
		}).on('mouseleave', '.footer .footer-social li a', function() {
			$('.footer .footer-social li a').stop().animate({
				opacity: 1
			}, 300);
		});
	}


	// open/close nav
	// --------------------

	function open_close_nav() {
		// open nav
		$('body').on('click', '.burger', function() {
			$('.nav').addClass('visible');

			setTimeout(function() {
				for (var i = 0; i <= $('.menu li').length; i++) {
					$($('.menu li')[i]).delay(i * 100).queue(function(next) {
						$(this).addClass('visible');
						next();
					});
				}
			}, 300);
		});

		// close nav
		$('body').on('click', '.close-nav', function() {
			for (var i = $('.menu li').length - 1; i >= 0; i--) {
				$($('.menu li')[i]).delay((($('.menu li').length - 1) - i) * 100).queue(function(next) {
					$(this).removeClass('visible');
					next();
				});
			}

			setTimeout(function() {
				$('.nav').removeClass('visible');
			}, ($('.menu li').length + 1) * 100);
		});
	}


	// ajax
	// --------------------

	function ajax() {
		$('body').on('click', '.ajax-link', function(event) {
			event.preventDefault();

			var page = $(this).data('url');

			if (!ajax_loading)
				load_content(page, true);

			ajax_first_load = true;
		});

		$(window).on('popstate', function() {
			if (ajax_first_load) {
				var newPageArray = location.pathname.split('/'),
					newPage = newPageArray[newPageArray.length - 1];

				if (!ajax_loading && ajax_location != newPage)
					load_content(newPage, false);
			}

			ajax_first_load = true;
		});

		function load_content(page, bool) {
			ajax_loading = true;
			ajax_location = page;

			$('.fade').removeClass('hide hide-content');

			page_loaded = false;

			setTimeout(function() {
				$('html, body').animate({
					scrollTop: 0
				}, 10);

				setTimeout(function() {
					$('#main').load(page + ' #main-content', function(data) {
						shortcodes();

						$('#main-content').waitForImages({
							finished: function() {
								ajax_loading = false;

								fade();

								var page_title = data.match(/<title>(.*?)<\/title>/);
								document.title = page_title[1];

								if (page != window.location && bool) {
									window.history.pushState({
										path: page
									}, '', page);
								}
							},
							waitForAll: true
						});
					});
				}, 500);
			}, 1000);
		}
	}


	// reveals
	// --------------------

	function reveals() {
		$(window).on('scroll', function() {
			var scroll = $(this).scrollTop();

			if (page_loaded) {
				setTimeout(function() {
					$('.reveal').each(function(i) {
						var el_top = $(this).offset().top,
							win_bottom = wh + $(window).scrollTop();

						if (el_top < win_bottom) {
							$(this).delay(i * 100).queue(function() {
								$(this).addClass('reveal-in');
							});
						}
					});
				}, 500);
			}
		}).scroll();
	}


	// shortcodes
	// --------------------

	function shortcodes() {
		// sliders
		$('.slider').each(function() {
			var slider = $(this),
				dots = slider.data('dots') == true ? 1 : 0,
				arrows = slider.data('arrows') == true ? 1 : 0;

			slider.owlCarousel({
				autoplay: true,
				items: 1,
				loop: true,
				nav: arrows,
				dots: dots,
				navText: ['', '']
			});
		});

		// background image
		$('[data-bg]').each(function() {
			var bg = $(this).data('bg');

			$(this).css({
				'background-image': 'url(' + bg + ')',
				'background-size': 'cover',
				'background-position': 'center center'
			});
		});

		// background color
		$('[data-bg-color]').each(function() {
			var bg = $(this).data('bg-color');

			$(this).css('background-color', bg);
		});
	}

})(jQuery);
