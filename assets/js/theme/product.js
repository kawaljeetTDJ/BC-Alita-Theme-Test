/*
 Import all product specific js
 */
import utils from '@bigcommerce/stencil-utils';
import Sortable from 'sortablejs';
import PageManager from './page-manager';
import Review from './product/reviews';
import collapsibleFactory from './common/collapsible';
import ProductDetails from './common/product-details';
import videoGallery from './product/video-gallery';
import { classifyForm } from './common/utils/form-utils';
import modalFactory, { modalTypes } from './global/modal';
import haloYoutubeCarousel from './halothemes/haloYoutubeVideo';
import haloNextProducts from './halothemes/haloNextProducts';
import haloNotifyMe from './halothemes/haloNotifyMe';
import haloStickyAddToCart from './halothemes/haloStickyAddToCart';
import haloBundleProducts from './halothemes/haloBundleProducts';
import haloAddOptionForProduct from './halothemes/haloAddOptionForProduct';
import haloProductTemplateMobile from './halothemes/haloProductTemplateMobile';

const { WRITE_REVIEW } = modalTypes;

export default class Product extends PageManager {
    constructor(context) {
        super(context);
        this.url = window.location.href;
        this.$reviewLink = $('[data-reveal-id="modal-review-form"]');
        this.$bulkPricingLink = $('[data-reveal-id="modal-bulk-pricing"]');
        this.reviewModal = modalFactory('#modal-review-form')[0];
    }

    onReady() {
        // Listen for foundation modal close events to sanitize URL after review.
        $(document).on('close.fndtn.reveal', () => {
            if (this.url.indexOf('#write_review') !== -1 && typeof window.history.replaceState === 'function') {
                window.history.replaceState(null, document.title, window.location.pathname);
            }
        });

        let validator;

        // Init collapsible
        collapsibleFactory();

        this.productDetails = new ProductDetails($('.halo-productView'), this.context, window.BCData.product_attributes);
        this.productDetails.setProductVariant();

        this.productReviewHandler();
        this.initThumbnailsHeight();
        this.bulkPricingHandler();
        this.soldProduct($('.productView-soldProduct'));
        this.viewingProduct($('.productView-ViewingProduct'));
        this.countDownProduct($('.productView-countDown'));
        this.loadOptionForProductCard();
        this.productGridLayout();
        this.compareColors();
        this.toggleTabs();
        this.productCustomTab();
        this.productShippingTab();
        this.imageGallery();
        this.showmoreDescription();

        haloProductTemplateMobile(this.context);
        videoGallery();
        haloNextProducts();
        haloYoutubeCarousel($('.halo-productView [data-slick]'));
        haloBundleProducts($('.halo-productView'), this.context);
        haloNotifyMe($('.halo-productView'), this.context);
        haloStickyAddToCart($('.halo-productView'), this.context);

        const $reviewForm = classifyForm('.writeReview-form');

        if ($reviewForm.length > 0){
            const review = new Review($reviewForm);

            $(document).on('opened.fndtn.reveal', () => this.reviewModal.setupFocusableElements(WRITE_REVIEW));

            $('body').on('click', '[data-reveal-id="modal-review-form"]', () => {
                validator = review.registerValidation(this.context);
                this.ariaDescribeReviewInputs($reviewForm);
            });

            $reviewForm.on('submit', () => {
                if (validator) {
                    validator.performCheck();
                    return validator.areAll('valid');
                }

                return false;
            });
        }
    }

    ariaDescribeReviewInputs($form) {
        $form.find('[data-input]').each((_, input) => {
            const $input = $(input);
            const msgSpanId = `${$input.attr('name')}-msg`;

            $input.siblings('span').attr('id', msgSpanId);
            $input.attr('aria-describedby', msgSpanId);
        });
    }

    productReviewHandler() {
        if (this.url.indexOf('#write_review') !== -1) {
            this.$reviewLink.trigger('click');
        }
    }

    bulkPricingHandler() {
        if (this.url.indexOf('#bulk_pricing') !== -1) {
            this.$bulkPricingLink.trigger('click');
        }
    }

    soldProduct($wrapper) {
        if($wrapper.length > 0) {
            var numbersProduct_text = this.context.themeSettings.product_soldProduct_products,
                numbersHours_text = this.context.themeSettings.product_soldProduct_hours,
                soldProductText = this.context.themeSettings.product_soldProduct_text,
                soldProductText2 = this.context.themeSettings.product_soldProduct_hours_text;

            var numbersProductList =  JSON.parse("[" + numbersProduct_text + "]"), 
                numbersProductItem = (Math.floor(Math.random()*numbersProductList.length)),
                numbersHoursList =  JSON.parse("[" + numbersHours_text + "]"),
                numbersHoursItem = (Math.floor(Math.random()*numbersHoursList.length));
         
            $wrapper.html('<svg class="icon"><use xlink:href="#icon-fire"/></svg><span class="text">' + numbersProductList[numbersProductItem] + " " + soldProductText + " " + numbersHoursList[numbersHoursItem] + " " + soldProductText2 + '</span>');
            $wrapper.show();
        }
    }

    countDownProduct($wrapper) {
        if($wrapper.length > 0) {
            var countDown = $wrapper.data('countdown'),
                countDownDate = new Date(countDown).getTime(),
                seft = $wrapper;

            var countdownfunction = setInterval(function() {
                var now = new Date().getTime(),
                    distance = countDownDate - now;

                if (distance < 0) {
                    clearInterval(countdownfunction);
                    seft.remove();
                } else {
                    var days = Math.floor(distance / (1000 * 60 * 60 * 24)),
                        hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                        minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                        seconds = Math.floor((distance % (1000 * 60)) / 1000),
                        strCountDown = '<svg class="icon"><use xlink:href="#icon-bell"/></svg><span class="text"><span>Limited time offer, end in:</span></span> <span class="num">'+days+'d :</span> <span class="num">'+hours+'h :</span> <span class="num">'+minutes+'m :</span> <span class="num">'+seconds+'s</span>';

                    seft.html(strCountDown);
                }
            }, 1000);
        }
    }

    initThumbnailsHeight(){
        var el = $('.halo-productView'),
            $carousel_nav = el.find('.productView-nav'),
            $carousel_for = el.find('.productView-for');

        if ($(window).width() > 1199) {
            if ($carousel_for.find('.slick-arrow').length > 0) {
                var $height_for = $carousel_for.outerHeight(),
                    $height_nav = $carousel_nav.outerHeight(),
                    $position = ($height_nav - $height_for)/2;

                $carousel_for.parent().addClass('arrows-visible');
                $carousel_for.parent().css('top', $position);
            } else {
                $carousel_for.parent().addClass('arrows-disable');
            }
        } else {
            if ($carousel_for.find('.slick-arrow').length > 0) {
                $carousel_for.parent().css('top', 'unset');
            }
        }

        $(window).resize(function() {
            if ($(window).width() > 1199) {
                if ($carousel_for.find('.slick-arrow').length > 0) {
                    var $height_for = $carousel_for.outerHeight(),
                        $height_nav = $carousel_nav.outerHeight(),
                        $position = ($height_nav - $height_for)/2;

                    $carousel_for.parent().addClass('arrows-visible');
                    $carousel_for.parent().css('top', $position);
                } else {
                    $carousel_for.parent().addClass('arrows-disable');
                }
            } else {
                if ($carousel_for.find('.slick-arrow').length > 0) {
                    $carousel_for.parent().css('top', 'unset');
                }
            }
        });
    }

    viewingProduct($wrapper) {
        if($wrapper.length > 0) {
            var viewerText = this.context.themeSettings.product_viewingProduct_text,
                numbersViewer_text = this.context.themeSettings.product_viewingProduct_viewer,
                numbersViewerList =  JSON.parse("[" + numbersViewer_text + "]"),
                timeViewer =  parseInt(this.context.themeSettings.product_viewingProduct_change)*1000;
            
            setInterval(function() {
                var numbersViewerItem = (Math.floor(Math.random()*numbersViewerList.length));

                $wrapper.html('<svg class="icon"><use xlink:href="#icon-eye"/></svg>' + numbersViewerList[numbersViewerItem] + " " + viewerText);
            }, timeViewer);  
        }
    }

    compareColors(){
        const $swatchWrapper = $('.halo-compareColors-swatch'),
            $imageWrapper = $('.halo-compareColors-image'),
            $textWrapper = $('.halo-compareColors-text');

        $('.form-option', $swatchWrapper).on('click',  event => {
            var $this = $(event.currentTarget);

            $this.toggleClass('show-color');

            var title = $this.find('.form-option-variant').attr('title'),
                id = $this.data('product-swatch-value'),
                $color, $color2, $color3, $img, $pattern;

            if ($this.hasClass('show-color')){
                if($this.find('.form-option-variant--color').length){
                    $color = $this.find('.form-option-variant--color').attr('style');

                    $imageWrapper.append('<div class="item item-color item-'+id+'"><span class="color" style="'+$color+';"></span><span class="title">'+title+'</span></div>');
                } else if($this.find('.form-option-variant--color2').length){
                    $color = $this.find('.form-option-variant--color2 span:nth-child(1)').attr('style');
                    $color2 = $this.find('.form-option-variant--color2 span:nth-child(2)').attr('style');

                    $('.halo-compareColors-image').append('<div class="item item-color item-'+id+'"><span class="color color2"><span style="'+$color+';"></span><span style="'+$color2+';"></span></span><span class="title">'+title+'</span></div>');
                } else if($this.find('.form-option-variant--color3').length){
                    $color =  $this.find('.form-option-variant--color3 span:nth-child(1)').attr('style');
                    $color2 =  $this.find('.form-option-variant--color3 span:nth-child(2)').attr('style');
                    $color3 =  $this.find('.form-option-variant--color3 span:nth-child(3)').attr('style');

                    $imageWrapper.append('<div class="item item-color item-'+id+'"><span class="color color3"><span style="'+$color+';"></span><span style="'+$color2+';"></span><span style="'+$color3+';"></span></span><span class="title">'+title+'</span></div>');
                } else if($this.find('.form-option-variant--pattern').length){
                    $img = $this.find('.form-option-variant--pattern').attr('style');
                    $pattern = $this.find('.form-option-variant--pattern').attr('data-pattern');

                    $imageWrapper.append('<div class="item item-partern item-'+id+'"><span class="image"><img src='+$pattern+' alt='+title+' title='+title+'></span><span class="title">'+title+'</span></div>');
                }
            } else{
                $('.item-'+id+'', $imageWrapper).remove();
            }

            if($imageWrapper.children().length > 0){
                $textWrapper.hide();
            } else{
                $textWrapper.show();
            }

            if ($(window).width() >= 1025) {
                var el = document.getElementById('color-swatch-image');
                
                new Sortable(el, {
                    animation: 150
                });
            }
        });
    }

    toggleTabs(){
        $('.productView-tab [data-collapsible]').on('click', event => {
            var $target = $(event.currentTarget);

            if($target.hasClass('is-open')){
                $target.parent('.toggle-title').siblings('.toggle-content').slideDown("slow");
            } else{
                $target.parent('.toggle-title').siblings('.toggle-content').slideUp("slow");
            }
        });
    }

    productCustomTab(){
        if(this.context.themeSettings.show_product_details_tabs == true){
            if(this.context.themeSettings.show_custom_tab == true){
                if(this.context.themeSettings.show_custom_tab_type == "all"){
                    const url = this.context.themeSettings.show_custom_tab_link;

                    const option = {
                        template: 'halothemes/halo-page-template'
                    };

                    utils.api.getPage(url, option, (err, response) => {
                        $(response).appendTo('#tab-custom-mobile');
                    });

                    $('#tab-description').find('[data-custom-tab]').remove();
                } else if(this.context.themeSettings.show_custom_tab_type == "custom"){
                    $('#tab-description').find('[data-custom-tab]').appendTo('#tab-custom-mobile');
                }
            }
        } else {
            $('.productView-description').find('[data-custom-tab]').remove();
        }
    }

    productShippingTab(){
        if(this.context.themeSettings.show_product_details_tabs == true){
            if(this.context.themeSettings.show_shipping_tab == true){
                if(this.context.themeSettings.show_shipping_tab_type == "all"){
                    const url = this.context.themeSettings.show_shipping_tab_link;

                    const option = {
                        template: 'halothemes/halo-page-template'
                    };

                    utils.api.getPage(url, option, (err, response) => {
                        $(response).appendTo('#tab-shipping-mobile');
                    });

                    $('#tab-description').find('[data-shipping-tab]').remove();
                } else if(this.context.themeSettings.show_shipping_tab_type == "custom"){
                    $('#tab-description').find('[data-shipping-tab]').appendTo('#tab-shipping-mobile');
                }
            }
        } else {
            $('.productView-description').find('[data-shipping-tab]').remove();
        }
    }

    loadOptionForProductCard(){
        if($('.productCarousel').length > 0){
            $('.productCarousel').each((index, element) => {
                var $prodWrapId = $(element).attr('id');

                haloAddOptionForProduct(this.context, $prodWrapId);
            });
        }

        if($('.productGrid').length > 0){
            $('.productGrid').each((index, element) => {
                var $prodWrapId = $(element).attr('id');

                haloAddOptionForProduct(this.context, $prodWrapId);
            });
        }
    }

    productGridLayout(){
        if($('.productGrid').length > 0){
            const col = this.context.themeSettings.productpage_product_block_col,
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

    imageGallery(){
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

    showmoreDescription(){
        const showMorebtn = $('#tab-descriptionShowmore'),
            descMobile = $('#tab-description-mobile'),
            textShowMore = showMorebtn.find('.button').data('show-more-text'),
            textShowLess = showMorebtn.find('.button').data('show-less-text');

        showMorebtn.find('.button').on('click', event => {
            event.preventDefault();

            if(showMorebtn.hasClass("less")) {
                showMorebtn.removeClass("less").addClass('show');
                showMorebtn.find('.button').text(textShowMore);
                descMobile.css('max-height','300px');
            } else {
                showMorebtn.removeClass('show').addClass("less");
                descMobile.css('max-height','unset');
                showMorebtn.find('.button').text(textShowLess);
            }
        });
    }
}
