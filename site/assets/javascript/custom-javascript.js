
var pagedelay = 1500;
var contentdelay = 2000;

/* -------------------- Page Loader Setting -------------------- */


setTimeout(function () {
    $(".loader").fadeOut("slow");
},
pagedelay
);


/* -------------------- AOS Setting -------------------- */

setTimeout(function () {
    AOS.init();
},
contentdelay
);


/* -------------------- Count Up Setting -------------------- */

$('.count-up-number').each(function () {
    var size = $(this).text().split(".")[1] ? $(this).text().split(".")[1].length : 0;
    $(this).prop('Counter', 0).animate({
        Counter: $(this).text()
    }, {
        duration: 5000,
        step: function (func) {
            $(this).text(parseFloat(func).toFixed(size));
        }
    });
});

/* -------------------- Navbar Setting -------------------- */

$(window).scroll(function () {
    $(".navbar").toggleClass("scroll", $(this).scrollTop() > 1)
    $("#scroll-top").toggleClass("scroll", $(this).scrollTop() > 1)
});

/* -------------------- Scroll To Setting -------------------- */

$(".scroll-to").click(function (event) {
    $('html, body').animate({ scrollTop: '+=850px' }, 600);
});

/* -------------------- Slick Setting -------------------- */

/* Single Slick */

$('.slick-responsive-auto.single').slick({
    lazyLoad: 'ondemand',
    mobileFirst: false,
    dots: true,
    arrows: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    infinite: false,
    autoplay: false,
    autoplaySpeed: 3500,
});

/* Quadruple Slick */

$('.slick-responsive-auto.quadruple').slick({
    lazyLoad: 'ondemand',
    mobileFirst: false,
    dots: true,
    arrows: true,
    slidesToShow: 4,
    slidesToScroll: 1,
    infinite: false,
    autoplay: false,
    autoplaySpeed: 3500,
    responsive: [
    {
        breakpoint: 800,
        settings: {
            slidesToShow: 3,
        }
    },
    {
        breakpoint: 500,
        settings: {
            slidesToShow: 2,
        }
    }]
});

/* Quintuple Slick */

$('.slick-responsive-auto.quintuple').slick({
    lazyLoad: 'ondemand',
    mobileFirst: false,
    dots: true,
    arrows: true,
    slidesToShow: 5,
    slidesToScroll: 1,
    infinite: false,
    autoplay: false,
    autoplaySpeed: 3500,
    responsive: [
    {
        breakpoint: 1000,
        settings: {
            slidesToShow: 4,
        }
    },
    {
        breakpoint: 800,
        settings: {
            slidesToShow: 3,
        }
    },
    {
        breakpoint: 500,
        settings: {
            slidesToShow: 1,
        }
    }]
});