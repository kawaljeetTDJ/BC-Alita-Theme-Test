import 'fancybox';
import PageManager from './page-manager';
import utils from '@bigcommerce/stencil-utils';
import parallax from './halothemes/parallax/jquery.parallax-scroll.min';
import haloAddOptionForProduct from './halothemes/haloAddOptionForProduct';
import haloProductLookbook from './halothemes/haloProductLookbook';

export default class Home extends PageManager {
    constructor(context) {
        super(context);
    }

    onReady() {
        this.imageGallerySlider();
    	this.loadProductByCategory();
        this.loadProductByEditorPick();
        this.loadOptionForProductCard();
        this.homeProductGrid();
        this.homeParallaxBanner();
        this.homeParallaxBanner2();
        this.homeLookbookSlider();
        this.homeBlogTitle();
        this.checkCarousel();

        haloProductLookbook($('#halo-lookbook-slider'));
    }

    checkCarousel(){
        if(!$('.heroCarousel .js-hero-slide').length > 0){
            $('body').addClass('page-no-carousel');

            if($('.header').hasClass('header-transparent')){
                $('.header').removeClass('header-transparent');
            }
        } else{
            if(!$('.heroCarousel').hasClass('heroCarousel-arrows')){
                var positionInit = $('.heroCarousel').find('.slick-current [data-position]').data('position');

                if(positionInit === 'right'){
                    $('.heroCarousel').addClass('heroCarouselRight');
                } else{
                    $('.heroCarousel').addClass('heroCarouselLeft');
                }

                $('.heroCarousel').on('beforeChange', (event, slider, i) => {
                    $('.heroCarousel').find('.slick-dots').addClass('u-hidden');
                });

                $('.heroCarousel').on('afterChange', (event, slider, i) => {
                    var positionChange = $(slider.$slides[i]).find('[data-position]').data('position');

                    if(positionChange === 'right'){
                        $('.heroCarousel').removeClass('heroCarouselLeft').addClass('heroCarouselRight');
                    } else{
                        $('.heroCarousel').removeClass('heroCarouselRight').addClass('heroCarouselLeft')
                    }

                    $('.heroCarousel').find('.slick-dots').removeClass('u-hidden');
                });
            }
        }
    }

	loadProductByCategory(){
        const context = this.context;

        var $options;

        if($('.halo-block[data-category-id]').length > 0){
            $('.halo-block[data-category-id]').each((index, element) => {
                var $wrap,
                    $catId = $(element).data('category'),
                    $catUrl = $(element).data('category-url'),
                    $blockId = $(element).attr('id');

                if($(element).find('.productCarousel').length > 0){
                    $wrap = $(element).find('.productCarousel');
                    $options = {
                        template: 'products/carousel-2'
                    };
                } else {
                    $wrap = $(element).find('.productGrid');
                    $options = {
                        template: 'products/no-carousel-2'
                    };
                }

                if(!$('#product-by-cate-'+$catId+' .productCarousel .productCarousel-slide').length){
                    loadCategory($catId, $catUrl, $options, $wrap, $blockId);
                }
            });
        }

        function loadCategory(id, url, option, wrap, blockId){
            utils.api.getPage(url, option, (err, response) => {
                wrap.html(response);
                if(wrap.hasClass('productCarousel')){
                    slickCarousel(wrap);
                } else{
                    gridLayout(wrap, id, url);
                }
                wrap.parents('.halo-block[data-category-id]').find('.loadingOverlay').remove();

                haloAddOptionForProduct(context, blockId);
            }); 
        }

        function slickCarousel($wrap){
            $wrap.slick({
                dots: true,
                arrows: false,
                infinite: false,
                mobileFirst: true,
                slidesToShow: 1,
                slidesToScroll: 1,
                nextArrow: "<svg class='slick-next slick-arrow'><use xlink:href=#slick-arrow-next2></use></svg>", 
                prevArrow: "<svg class='slick-prev slick-arrow'><use xlink:href=#slick-arrow-prev2></use></svg>",
                responsive: [
                {
                    breakpoint: 1279,
                    settings: {
                        arrows: true,
                        slidesToShow: parseInt(context.themeSettings.home_product_block_col),
                        slidesToScroll: 1
                    }
                },
                {
                    breakpoint: 1024,
                    settings: {
                        slidesToShow: parseInt(context.themeSettings.home_product_block_col),
                        slidesToScroll: 1
                    }
                },
                {
                    breakpoint: 991,
                    settings: {
                        slidesToShow: 4,
                        slidesToScroll: 1
                    }
                },
                {
                    breakpoint: 767,
                    settings: {
                        slidesToShow: 3,
                        slidesToScroll: 1
                    }
                },
                {
                    breakpoint: 320,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 1
                    }
                }]
            });
        }

        function gridLayout($wrap, id, url){
            if($wrap.length > 0){
                const col = context.themeSettings.home_product_block_col,
                    limitProduct = 2*parseInt(col);

                var $prodWrapId = $wrap.attr('id');

                $wrap.find('.product:visible').css('display', 'none');
                $wrap.find('.product:hidden').slice(0,limitProduct).css('display', 'inline-block');

                if($wrap.find('.product').length > limitProduct){
                    $wrap.after('<div class="productGrid-showMore"><a class="button button--primary" href="#" data-href="'+id+'">Show More</a></div>');
                }

                $wrap.siblings('.productGrid-showMore').find('.button').on('click', event => {
                    event.preventDefault();

                    $(event.currentTarget).blur();

                    $wrap.find('.product:hidden').slice(0,limitProduct).css('display', 'inline-block');

                    if($wrap.find('.product:hidden').length == 0){
                        $(event.currentTarget).attr('href', url).text('View All');
                    }
                });
            }
        }
    }

    loadProductByEditorPick(){
        const context = this.context;

        var $options;

        if($('.halo-block[data-list-id]').length > 0){
            $('.halo-block[data-list-id]').each((index, element) => {
                var $prodWrapId = $(element).attr('id'),
                    $wrap,
                    $listId = $(element).data('list-id');

                if($(element).find('.productCarousel').length > 0){
                    $wrap = $(element).find('.productCarousel');
                    $options = {
                        template: 'halothemes/home/halo-product-by-editor-pick-tmp'
                    };
                } else {
                    $wrap = $(element).find('.productGrid');
                    $options = {
                        template: 'halothemes/home/halo-product-by-editor-pick-tmp-2'
                    };
                }

                if(!$('#product-by-list-'+$prodWrapId+' .productCarousel .productCarousel-slide').length){
                    loadListID($listId, $options, $wrap);
                }
            });
        }

        function loadListID(id, options, wrap){
            var arr = id.split(','),
                list = arr.slice(0,parseInt(context.themeSettings.home_product_block_limit)),
                num = 0;

            for (var i = 0; i <= list.length; i++) {
                var $prodId = list[i];

                if($prodId != undefined){
                    utils.api.product.getById($prodId, options, (err, response) => {
                        if(wrap.hasClass('slick-slider')){
                            wrap.slick('unslick');
                            wrap.append(response);
                        } else{
                            wrap.append(response);
                        }

                        if(wrap.hasClass('productCarousel')){
                            slickCarousel(wrap);
                        } else{
                            gridLayout(wrap, id);
                        }

                        num++;

                        if(num == list.length){
                            wrap.parents('.halo-block[data-list-id]').find('.loadingOverlay').remove();
                            return;
                        }
                    });            
                }
            }
        }

        function slickCarousel($wrap){
            $wrap.slick({
                dots: true,
                arrows: false,
                infinite: false,
                mobileFirst: true,
                slidesToShow: 1,
                slidesToScroll: 1,
                nextArrow: "<svg class='slick-next slick-arrow'><use xlink:href=#slick-arrow-next2></use></svg>", 
                prevArrow: "<svg class='slick-prev slick-arrow'><use xlink:href=#slick-arrow-prev2></use></svg>",
                responsive: [
                {
                    breakpoint: 1279,
                    settings: {
                        arrows: true,
                        slidesToShow: parseInt(context.themeSettings.home_product_block_col),
                        slidesToScroll: 1
                    }
                },
                {
                    breakpoint: 1024,
                    settings: {
                        slidesToShow: parseInt(context.themeSettings.home_product_block_col),
                        slidesToScroll: 1
                    }
                },
                {
                    breakpoint: 991,
                    settings: {
                        slidesToShow: 4,
                        slidesToScroll: 1
                    }
                },
                {
                    breakpoint: 767,
                    settings: {
                        slidesToShow: 3,
                        slidesToScroll: 1
                    }
                },
                {
                    breakpoint: 320,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 1
                    }
                }]
            });
        }

        function gridLayout($wrap, id){
            if($wrap.length > 0){
                const col = context.themeSettings.home_product_block_col,
                    limitProduct = 2*parseInt(col);

                $wrap.find('.product:visible').css('display', 'none');
                $wrap.find('.product:hidden').slice(0,limitProduct).css('display', 'inline-block');

                if($wrap.find('.product').length > limitProduct){
                    $wrap.after('<div class="productGrid-showMore"><a class="button button--primary" href="#" data-href="'+id+'">Show More</a></div>');
                }

                $wrap.siblings('.productGrid-showMore').find('.button').on('click', event => {
                    event.preventDefault();

                    $(event.currentTarget).blur();

                    $wrap.find('.product:hidden').slice(0,limitProduct).css('display', 'inline-block');

                    if($wrap.find('.product:hidden').length == 0){
                        $(event.currentTarget).addClass('disable').text('No more items');
                    }
                });
            }
        }
    }

    imageGallerySlider(){
        if($('.halo-image-gallery').length > 0){
            var $imageRow = $('.halo-image-gallery').find('.halo-row');

            if ($(window).width() > 1024) {
                if (!$imageRow.hasClass('slick-slider')){
                    slickImageCarousel($imageRow);
                }
            }
        }

        if($('.halo-instagram-gallery').length > 0){
            var $imageInstaRow = $('.halo-instagram-gallery').find('.halo-row');

            if ($(window).width() > 1024) {
                if (!$imageInstaRow.hasClass('slick-slider')){
                    slickImageInstaCarousel($imageInstaRow);
                }
            }

            if($imageInstaRow.find('[data-fancybox]') > 0){
                fancyBoxImage($imageInstaRow.find('[data-fancybox]'));
            }
        }

        function slickImageCarousel($wrap){
            $wrap.slick({
                dots: true,
                arrows: false,
                autoplay: false,
                autoplaySpeed: 5000,
                infinite: false,
                mobileFirst: true,
                slidesToShow: 3,
                slidesToScroll: 1,
                responsive: [
                {
                    breakpoint: 1399,
                    settings: {
                        slidesToShow: 4,
                        slidesToScroll: 1
                    }
                }]
            });
        }

        function slickImageInstaCarousel($wrap){
            $wrap.slick({
                dots: true,
                arrows: true,
                autoplay: false,
                autoplaySpeed: 5000,
                infinite: false,
                mobileFirst: true,
                slidesToShow: 4,
                slidesToScroll: 1,
                nextArrow: "<svg class='slick-next slick-arrow'><use xlink:href=#slick-arrow-next2></use></svg>", 
                prevArrow: "<svg class='slick-prev slick-arrow'><use xlink:href=#slick-arrow-prev2></use></svg>"
            });
        }

        function fancyBoxImage($image){
            $image.fancybox({
                buttons: [
                    "zoom",
                    //"share",
                    "slideShow",
                    //"fullScreen",
                    //"download",
                    // "thumbs",
                    "close"
                ]
            });
        }

        $(window).resize(function() {
            if($('.halo-image-gallery').length > 0){
                var $imageRow = $('.halo-image-gallery').find('.halo-row');

                if ($(window).width() < 1025) {
                    if ($imageRow.hasClass('slick-slider')){
                        $imageRow.slick('unslick');
                    }
                } else{
                    if (!$imageRow.hasClass('slick-slider')){
                        slickImageCarousel($imageRow);
                    }
                }
            }

            if($('.halo-image-gallery').length > 0){
                var $imageInstaRow = $('.halo-instagram-gallery').find('.halo-row');

                if ($(window).width() < 1025) {
                    if ($imageInstaRow.hasClass('slick-slider')){
                        $imageInstaRow.slick('unslick');
                    }
                } else{
                    if (!$imageInstaRow.hasClass('slick-slider')){
                        slickImageInstaCarousel($imageInstaRow);
                    }
                }
            }
        });
    }

    loadOptionForProductCard(){
        const context = this.context;

        if($('.productCarousel').length > 0){
            $('.productCarousel').each((index, element) => {
                var $prodWrapId = $(element).attr('id');

                haloAddOptionForProduct(context, $prodWrapId);
            });
        }

        if($('.productGrid').length > 0){
            $('.productGrid').each((index, element) => {
                var $prodWrapId = $(element).attr('id');

                haloAddOptionForProduct(context, $prodWrapId);
            });
        }
    }

    homeProductGrid(){
        const context = this.context;

        if($('.productGrid').length > 0){
            const col = context.themeSettings.home_product_block_col,
                limitProduct = 2*parseInt(col);

            $('.productGrid').each((index, element) => {
                var $prodWrapId = $(element).attr('id');

                $(element).find('.product:visible').css('display', 'none');
                $(element).find('.product:hidden').slice(0,limitProduct).css('display', 'inline-block');

                if($(element).find('.product').length > limitProduct){
                    $(element).after('<div class="productGrid-showMore"><a class="button button--primary" href="#" data-href="'+$prodWrapId+'">Show More</a></div>');
                }
            });

            $('.productGrid-showMore .button').on('click', event => {
                event.preventDefault();
                var target = $(event.currentTarget),
                    targetId = target.data('href');

                target.blur();

                $('[data-block='+targetId+']').find('.product:hidden').slice(0,limitProduct).css('display', 'inline-block');

                if($('[data-block='+targetId+']').find('.product:hidden').length == 0){
                    target.addClass('disable').text('No more items');
                }
            });
        }
    }

    homeParallaxBanner(){
        if($('#halo-top-banner').length > 0){
            var $block = $('#halo-top-banner'),
                image,
                wrapImage,
                wrapProd,
                listIds;

            const options = {
                template: 'halothemes/home/halo-home-top-banner-tmp'
            };

            image = $block.find('[data-background]').data('background');
            wrapImage = $block.find('.halo-top-banner--slider-2 .halo-row');
            listIds = $block.find('.halo-top-banner--slider').data('product-slider');
            wrapProd = $block.find('.halo-top-banner--slider .productCarousel');

            if(image !== ''){
                $block.find('[data-background]').css('background-image', 'url('+image+')');
            }

            if ($(window).width() < 1025) {
                if (wrapImage.hasClass('slick-slider')){
                    wrapImage.slick('unslick');
                }
            } else{
                if (!wrapImage.hasClass('slick-slider')){
                    slickImageCarousel(wrapImage);
                }
            }

            if(wrapProd.length > 0){
                loadListID(listIds, options, wrapProd);
            }

            fancyBoxVideo(wrapImage);
        }

        function loadListID(id, options, wrap){
            var list = id.split(','),
                num = 0;

            for (var i = 0; i <= list.length; i++) {
                var $prodId = list[i];

                if($prodId != undefined){
                    utils.api.product.getById($prodId, options, (err, response) => {
                        if(wrap.hasClass('slick-slider')){
                            wrap.slick('unslick');
                            wrap.append(response);
                        } else{
                            wrap.append(response);
                        }

                        slickCarousel(wrap);

                        num++;

                        if(num == list.length){
                            wrap.parents('.halo-top-banner--slider').find('.loadingOverlay').remove();
                            return;
                        }
                    });            
                }
            }
        }

        function slickCarousel($wrap){
            $wrap.slick({
                dots: true,
                arrows: false,
                infinite: false,
                mobileFirst: true,
                slidesToShow: 1,
                slidesToScroll: 1,
                fade: true,
                nextArrow: "<svg class='slick-next slick-arrow'><use xlink:href=#slick-arrow-next2></use></svg>", 
                prevArrow: "<svg class='slick-prev slick-arrow'><use xlink:href=#slick-arrow-prev2></use></svg>",
                responsive: [
                {
                    breakpoint: 1025,
                    settings: {
                        dots: false,
                        arrows: true
                    }
                }]
            });
        }

        function slickImageCarousel($wrap){
            $wrap.slick({
                dots: true,
                arrows: false,
                autoplay: false,
                autoplaySpeed: 5000,
                infinite: false,
                mobileFirst: true,
                fade: true,
                slidesToShow: 1,
                slidesToScroll: 1
            });
        }

        function fancyBoxVideo($wrap){
            $wrap.find('[data-fancybox]').fancybox({
                'autoDimensions': false,
                'padding' : 0,
                'width' : 970,
                'height' : 600,
                'autoScale' : false,
                'transitionIn' : 'none',
                'transitionOut' : 'none'
            });
        }

        $(window).resize(function() {
           if($('#halo-top-banner').length > 0){
                var wrapImage = $block.find('.halo-top-banner--slider-2 .halo-row');

                if ($(window).width() < 1025) {
                    if (wrapImage.hasClass('slick-slider')){
                        wrapImage.slick('unslick');
                    }
                } else{
                    if (!wrapImage.hasClass('slick-slider')){
                        slickImageCarousel(wrapImage);
                    }
                }
            }
        });
    }

    homeParallaxBanner2(){
        if($('#halo-middle-banner-2').length > 0){
            var $block = $('#halo-middle-banner-2'),
                image;
            
            image = $block.find('[data-background]').data('background');

            if(image !== ''){
                $block.find('[data-background]').css('background-image', 'url('+image+')');
            }
        }

        if($('#halo-middle-banner-3').length > 0){
            var $block = $('#halo-middle-banner-3'),
                image;
            
            image = $block.find('[data-background]').data('background');

            if(image !== ''){
                $block.find('[data-background]').css('background-image', 'url('+image+')');
            }
        }
    }

    homeLookbookSlider() {
        if($('#halo-lookbook-slider').length > 0){
            var $block = $('#halo-lookbook-slider'),
                wrap = $block.find('.halo-lookbook-slider');

            $block.find('.halo-lookbook-slider-slide').each((index, element) => {
                var image = $(element).find('[data-background]').data('background');

                $(element).find('[data-background]').css('background-image', 'url('+image+')');
            });

            if ($(window).width() < 551) {
                $block.find('.halo-lookbook-slider-slide').each((index, element) => {
                    var point = $(element).find('.halo-lookbook-slider-point'),
                        pointX = point.css('left'),
                        pointY = point.css('top');

                    point.css({
                        'top': pointY,
                        'left': pointX
                    });
                });
            }

            slickCarousel(wrap);
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
    }

    homeBlogTitle(){
        if ($(window).width() > 1024) {
            var blogHeight = $('.halo-recent-post-item .itemFirst').outerHeight(true),
                titleHeight = $('.halo-recent-post-item.halo-block-header').outerHeight(true),
                position = (blogHeight - titleHeight)/2;

            $('.halo-recent-post-item.halo-block-header').css({
                'top': position
            });
        } else{
            $('.halo-recent-post-item.halo-block-header').css({
                'top': 'unset'
            });
        }

        $(window).resize(function() {
            if ($(window).width() > 1024) {
                var blogHeight = $('.halo-recent-post-item .itemFirst').outerHeight(true),
                    titleHeight = $('.halo-recent-post-item.halo-block-header').outerHeight(true),
                    position = (blogHeight - titleHeight)/2;

                $('.halo-recent-post-item.halo-block-header').css({
                    'top': position
                });
            } else {
                $('.halo-recent-post-item.halo-block-header').css({
                    'top': 'unset'
                });
            }
        });
    }
}
