import parallax from './parallax/jquery.parallax-scroll.min';

export default function() {
    function fullWidthBannerSlider() {
        if($('.halo-fullwidth-banner-2').length > 0){
            var $block = $('.halo-fullwidth-banner-2'),
                wrap = $block.find('.halo-row');

            if ($(window).width() < 1025) {
                if (wrap.hasClass('slick-slider')){
                    wrap.slick('unslick');
                }
            } else{
                if (!wrap.hasClass('slick-slider')){
                    slickCarousel(wrap);
                }
            }
        }

        function slickCarousel(wrap){
            if(wrap.length > 0){
                wrap.slick({
                    dots: true,
                    arrows: false,
                    mobileFirst: true,
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    autoplay: false,
                    autoplaySpeed: 5000,
                    infinite: true,
                    fade: true
                });
            }
        }

        $(window).resize(function() {
           if($('.halo-fullwidth-banner-2').length > 0){
                var wrap = $('.halo-fullwidth-banner-2 .halo-row');

                if ($(window).width() < 1025) {
                    if (wrap.hasClass('slick-slider')){
                        wrap.slick('unslick');
                    }
                } else{
                    if (!wrap.hasClass('slick-slider')){
                        slickCarousel(wrap);
                    }
                }
            }
        });
    }
    fullWidthBannerSlider();

    function testimonialSlider(){
        if($('.halo-testimonial-2').length > 0){
            var $block = $('.halo-testimonial-2'),
                wrap1 = $block.find('.halo-row-1'),
                wrap2 = $block.find('.halo-row-2');

            if ($(window).width() < 1025) {
                if (wrap1.hasClass('slick-slider')){
                    wrap1.slick('unslick');
                }
                if (wrap2.hasClass('slick-slider')){
                    wrap2.slick('unslick');
                }
            } else{
                if (!wrap1.hasClass('slick-slider')){
                    slickCarousel(wrap1);
                }
                if (!wrap2.hasClass('slick-slider')){
                    slickCarousel2(wrap2);
                }
            }

            $block.find('[data-icon-facebook]').append('<svg class="icon"><use xlink:href="#icon-facebook-share"></use></svg>');
            $block.find('[data-icon-messenger]').append('<svg class="icon"><use xlink:href="#icon-messenger-share"></use></svg>');
            $block.find('[data-icon-linkedin]').append('<svg class="icon"><use xlink:href="#icon-linkedin-share"></use></svg>');
            $block.find('[data-icon-mail]').append('<svg class="icon"><use xlink:href="#icon-mail-share"></use></svg>');
        }

        if($('.halo-testimonial-1').length > 0){
            var $block = $('.halo-testimonial-1'),
                wrap = $block.find('.halo-row');

            if (!wrap.hasClass('slick-slider')){
                slickCarousel3(wrap);
            }
        }

        function slickCarousel(wrap){
            if(wrap.length > 0){
                wrap.slick({
                    dots: true,
                    arrows: true,
                    mobileFirst: true,
                    slidesToShow: 3,
                    slidesToScroll: 1,
                    autoplay: false,
                    autoplaySpeed: 5000,
                    infinite: true,
                    fade: false,
                    nextArrow: "<svg class='slick-next slick-arrow'><use xlink:href=#slick-arrow-next2></use></svg>", 
                    prevArrow: "<svg class='slick-prev slick-arrow'><use xlink:href=#slick-arrow-prev2></use></svg>",
                    asNavFor: ".halo-testimonial .halo-row-2"
                });
            }
        }

        function slickCarousel2(wrap){
            if(wrap.length > 0){
                wrap.slick({
                    dots: false,
                    arrows: false,
                    mobileFirst: true,
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    autoplay: false,
                    autoplaySpeed: 5000,
                    infinite: true,
                    fade: true,
                    asNavFor: ".halo-testimonial .halo-row-1"
                });
            }
        }

        function slickCarousel3(wrap){
            if(wrap.length > 0){
                wrap.slick({
                    dots: true,
                    arrows: false,
                    infinite: false,
                    adaptiveHeight: true,
                    mobileFirst: true,
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    autoplay: false,
                    autoplaySpeed: 5000,
                    infinite: true,
                    fade: true,
                    nextArrow: "<svg class='slick-next slick-arrow'><use xlink:href=#slick-arrow-next2></use></svg>", 
                    prevArrow: "<svg class='slick-prev slick-arrow'><use xlink:href=#slick-arrow-prev2></use></svg>",
                    responsive: [
                        {
                            breakpoint: 1024,
                            settings: {
                                arrows: true
                            }
                        }
                    ]
                });
            }
        }

        $(window).resize(function() {
           if($('.halo-testimonial').length > 0){
                var wrap1 = $('.halo-testimonial-2 .halo-row-1'),
                    wrap2 = $('.halo-testimonial-2 .halo-row-2');

                if ($(window).width() < 1025) {
                    if (wrap1.hasClass('slick-slider')){
                        wrap1.slick('unslick');
                    }
                    if (wrap2.hasClass('slick-slider')){
                        wrap2.slick('unslick');
                    }
                } else{
                    if (!wrap1.hasClass('slick-slider')){
                        slickCarousel(wrap1);
                    }
                    if (!wrap2.hasClass('slick-slider')){
                        slickCarousel2(wrap2);
                    }
                }
            }
        });
    }
    testimonialSlider();
}
