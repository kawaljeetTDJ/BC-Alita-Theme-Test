import 'fancybox';
import utils from '@bigcommerce/stencil-utils';
import PageManager from './page-manager';
import haloSidebarToggle from './halothemes/haloSidebarToggle';
import haloProductLookbook from './halothemes/haloProductLookbook';
import haloCustomBanner from './halothemes/haloCustomBanner';
import haloAddOptionForProduct from './halothemes/haloAddOptionForProduct';

export default class Page extends PageManager {
    constructor(context) {
        super(context);
    }

    onReady() {
        haloSidebarToggle();
        haloProductLookbook($('#halo-lookbook-slider'));
        haloCustomBanner();

        this.faqsPage();
        this.faqsToggle();
        this.lookbookSlider();
        this.parallaxBanner();
        this.portfolioPage();
        this.galleryPage();
        this.loadProductByCategory();
        this.loadProductByEditorPick();
        this.loadOptionForProductCard();
        this.productGridLayout();
    }

    faqsPage(){
        $('.faq-desc').appendTo('.page-normal .page-description');
    }

    faqsToggle(){
        $('.page-normal .card .title').on('click', event => {
            event.preventDefault();

            var target = $(event.currentTarget);

            $('.page-normal .card .title').not(target).removeClass('collapsed');

            if(target.hasClass('collapsed')){
                target.removeClass('collapsed');
            } else{
                target.addClass('collapsed');
            }

            $('.page-normal .card').each((index, element) => {
                if($('.title', element).hasClass('collapsed')){
                    $(element).find('.collapse').slideDown("slow");
                } else{
                    $(element).find('.collapse').slideUp("slow");
                }
            });
        });
    }

    lookbookSlider() {
        if($('#halo-lookbook-slider').length > 0){
            var $block = $('#halo-lookbook-slider'),
                wrap = $block.find('.halo-lookbook-slider');

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
        }
    }

    parallaxBanner() {
        if($('[data-top-page]').length > 0){
            $('[data-top-page]').find('.page-normal-header--banner').prependTo('.page-normal-header');
            $('[data-top-page]').find('.page-description').appendTo('.page-normal-header--content .container');
            $('.page-normal-header').after($('[data-top-page]').find('.page-normal--container'));
            $('[data-top-page]').remove();
        }

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

    portfolioPage(){
        if($('.halo-image-tabs').length > 0){
            $('.halo-image-tabs .tab-content').each((index, element) =>{
                $(element).find('.halo-image-tabs--item:hidden').slice(0,12).css('display', 'inline-block');
                
                if($(element).find('.halo-image-tabs--item').length > 12){
                    $(element).find('.halo-image-tabs--button').css('display', 'block');
                }
            });

            $('[data-show-more-button]').on('click', event => {
                event.preventDefault();
                var wrap = $(event.currentTarget).parent().siblings();

                wrap.find('.halo-image-tabs--item:hidden').slice(0,12).css('display', 'inline-block');
        
                if(wrap.find('.halo-image-tabs--item:hidden').length == 0){
                    $(event.currentTarget).addClass('disable').text('No more items');
                }
            });
        }
    }

    galleryPage(){
        if($('.halo-block-product').length > 0){
            if($('.halo-middle-banner-block').length > 0){
                $('.halo-block-product').after($('.halo-middle-banner-block'));
            }
        }
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

    loadProductByCategory(){
        const context = this.context;

        var $options;

        if($('.halo-block[data-category-id]').length > 0){
            $('.halo-block[data-category-id]').each((index, element) => {
                var $wrap,
                    $catId = $(element).data('data-category'),
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

    productGridLayout(){
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
}
