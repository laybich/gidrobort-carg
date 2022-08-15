'use strict';

$('.wrapper').addClass('loaded');

$('.icon-menu').on('click', e => {
	$(e.currentTarget).toggleClass('active');
	$('.menu').toggleClass('active');
	$(body).toggleClass('lock');
});

function ibg() {
	$.each($('.ibg'), (index, val) => {
		if($(val).find('img').length > 0) {
			$(val).css('background-image', `url('${$(val).find('img').attr('src')}')`);
		}
	});
}

AOS.init({
	// Global settings:
	disable: 'phone', // accepts following values: 'phone', 'tablet', 'mobile', boolean, expression or function
	startEvent: 'DOMContentLoaded', // name of the event dispatched on the document, that AOS should initialize on

	// Settings that can be overridden on per-element basis, by `data-aos-*` attributes:
	once: true, // whether animation should happen only once - while scrolling down
	anchorPlacement: 'top-bottom',  // defines which position of the element regarding to window should trigger the animation
});

$('#vehicle-slider').slick({
	autoplay: true,
	centerMode: true,
	centerPadding: '10px',
	variableWidth: true,
	dots: true,
	autoplaySpeed: 6000,
	draggable: false,
	pauseOnDotsHover: true,
	dotsClass: 'slick-dots slick-dots_yellow',
	prevArrow: '<button class="slick-prev slick-arrow slick-arrow_yellow" aria-label="Previous" type="button" style=""><svg style="display: block" viewBox="0 0 11.3 21" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"> <desc>Left</desc> <polyline fill="none" stroke="#333333" stroke-linejoin="butt" stroke-linecap="butt" stroke-width="1" points="0.5,0.5 10.5,10.5 0.5,20.5"></polyline> </svg></button>',
	nextArrow: '<button class="slick-next slick-arrow slick-arrow_yellow" aria-label="Next" type="button" style=""><svg style="display: block" viewBox="0 0 11.3 21" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"> <desc>Right</desc> <polyline fill="none" stroke="#333333" stroke-linejoin="butt" stroke-linecap="butt" stroke-width="1" points="0.5,0.5 10.5,10.5 0.5,20.5"></polyline> </svg></button>',
	responsive: [
		{
			breakpoint: 768,
      	settings: {
				centerMode: false,
				centerPadding: '0',
			}
		}
	]
});

$('#slider').slick({
	autoplay: true,
	dots: true,
	autoplaySpeed: 6000,
	draggable: false,
	pauseOnDotsHover: true,
	adaptiveHeight: false,
	prevArrow: '<button class="slick-prev slick-arrow" aria-label="Previous" type="button" style=""><svg style="display: block" viewBox="0 0 11.3 21" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"> <desc>Left</desc> <polyline fill="none" stroke="#333333" stroke-linejoin="butt" stroke-linecap="butt" stroke-width="1" points="0.5,0.5 10.5,10.5 0.5,20.5"></polyline> </svg></button>',
	nextArrow: '<button class="slick-next slick-arrow" aria-label="Next" type="button" style=""><svg style="display: block" viewBox="0 0 11.3 21" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"> <desc>Right</desc> <polyline fill="none" stroke="#333333" stroke-linejoin="butt" stroke-linecap="butt" stroke-width="1" points="0.5,0.5 10.5,10.5 0.5,20.5"></polyline> </svg></button>'
});

ibg();

$(window).on('resize', () => {
	ibg();
});

$('[data-toggle="modal"]').on('click', e => {
	e.preventDefault();
	$('.modal').removeClass('active');
	$($(e.currentTarget).data('target')).addClass('active');
});

$('.modal').on('click', e => {
	if($(e.target).last().children().last().attr('class') !== 'modal-dialog') return;
	$(e.currentTarget).removeClass('active');
});

$('nav a[href^="#"], .main-screen__arrow').on('click', function(event) {
	event.preventDefault();
	
	let sc = $(this).attr("href"),
		 dn = $(sc).offset().top;
	
	$('html, body').animate({scrollTop: dn}, 1000);
});

$('#calc').on('submit', e => e.preventDefault());

function calcDistance() {
	const directionsService = new google.maps.DirectionsService();
	const origin = $('[name="address1"]').val();
	const destination = $('[name="address2"]').val();

	const request = {
		origin,
		destination,
		travelMode: 'DRIVING'
	};

	directionsService.route(request, (result, status) => {
		if (status == 'OK') {
			$('#distance').text(result.routes[0].legs[0].distance.text);
			$('#origin').text(result.routes[0].legs[0].start_address);
			$('#destination').text(result.routes[0].legs[0].end_address);
			calcPrice(result.routes[0].legs[0].distance.value);
		}
	});
}

function calcPrice(distance) {
	let price = 8000;

	let weight = $('#calc [name="weight"]').val();
	let volume = $('#calc [name="volume"]').val();
	let isInTTK = $('#calc [name="ttk"]').is(':checked');
	let isFOP = $('#calc [value="fop"]').is(':checked');
	let isOOO = $('#calc [value="ooo"]').is(':checked');

	let k = 40;
	if(+weight > 5 || +volume > 36) {
		price = 10000;
		k = 50;
	}
	if(distance > 650) {
		k *= 1.5;
	}

	price += distance / 1000 * k;

	if(isInTTK) price += 1000;
	if(isFOP) price += price / 10;
	if(isOOO) price += price / 5;

	$('#price').text(Math.floor(price) + 'руб');
}