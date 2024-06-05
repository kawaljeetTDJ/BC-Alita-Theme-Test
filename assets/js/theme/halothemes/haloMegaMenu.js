import utils from '@bigcommerce/stencil-utils';

export default class haloMegaMenu{
    constructor() {}

    menuItem(num) {
        return {
            setMegaMenu(param) {
                param = $.extend({
                    style: '',
                    dropAlign: 'fullWidth',
                    dropWidth: '493px',
                    cateColumns: 1,
                    disabled: false,
                    bottomCates: '',
                    products:'',
                    productId: '',
                    label: '',
                    labelType: '',
                    content: '',
                    imagesTop: '',
                    imagesCustom: ''
                }, param);

                var $scope = $('.navPages-list:not(.navPages-list--user) > li:nth-child('+num+')');

                if(!$scope.hasClass('navPages-item-toggle')){
                    if (param.disabled === false) {
                        const subMegaMenu = $scope.find('> .navPage-subMenu');

                        if(param.style === 'style 1') {
                            if(!$scope.hasClass('has-megamenu')){
                                $scope.addClass('has-megamenu style-1 fullWidth');

                                if(!subMegaMenu.find('.cateArea').length){
                                    subMegaMenu.find('> .navPage-subMenu-list').wrap('<div class="cateArea columns-'+param.cateColumns+'"></div>');

                                    subMegaMenu.find('.cateArea').prepend(param.content);
                                }

                                if(!subMegaMenu.find('.imageArea').length){
                                    subMegaMenu.append('<div class="imageArea"><div class="megamenu-right-item">'+param.images+'</div></div>');
                                    
                                    if (param.products.length && (param.products !== '')) {
                                        subMegaMenu.find('.imageArea').prepend('<div class="megamenu-left-item megamenu-product-list">'+param.products+'</div>');
                                    }
                                }

                                subMegaMenu.find('.imageArea').css({
                                    'width': '100%',
                                    'max-width': param.imageAreaWidth
                                });

                                subMegaMenu.find('.cateArea').css({
                                    'width': '100%',
                                    'max-width': param.cateAreaWidth
                                });

                                subMegaMenu.addClass('haloCustomScrollbar');

                                if (param.productId.length && (param.productId !== '')) {
                                    var productIDS = param.productId,
                                        featuredProductCarousel = subMegaMenu.find('.megamenu-product-list');

                                    const $options = {
                                        template: 'halothemes/megamenu/halo-megamenu-tmp'
                                    };

                                    if (productIDS !== '') {
                                        var listIDs = JSON.parse("[" + productIDS + "]");

                                        if (featuredProductCarousel.length) {
                                            featuredProductCarousel.find('.megamenu-slider').addClass('is-loading');

                                            var n = 0;

                                            for (var i = 0; i < listIDs.length; i++) {
                                                var productId = listIDs[i];

                                                utils.api.product.getById(productId, $options, (err, response) => {
                                                    var hasProd = $(response).find('.card').data('product-id');

                                                    if(hasProd != undefined && hasProd !== null && hasProd !== ''){
                                                        if(featuredProductCarousel.find('.megamenu-slider').hasClass('slick-initialized')) {
                                                            featuredProductCarousel.find('.megamenu-slider').slick('unslick');
                                                            featuredProductCarousel.find('.megamenu-slider').append(response);
                                                        } else {
                                                            featuredProductCarousel.find('.megamenu-slider').append(response);
                                                        }

                                                        productSlider(featuredProductCarousel);
                                                    }
                                                });
                                            }

                                            featuredProductCarousel.find('.megamenu-slider').removeClass('is-loading');
                                        }
                                    }

                                    function productSlider(wrap){
                                        wrap.each((index, element) => {
                                            if($('.megamenu-slider', element).length > 0){
                                                if($('.megamenu-slider .item', element).length > 0){
                                                    $('.megamenu-slider', element).slick({
                                                        infinite: false,
                                                        dots: true,
                                                        arrows: false,
                                                        slidesToShow: 1,
                                                        slidesToScroll: 1,
                                                        slidesPerRow: 1,
                                                        adaptiveHeight: true,
                                                        rows: 2,
                                                        nextArrow: "<svg class='slick-next slick-arrow'><use xlink:href=#icon-arrow-right></use></svg>", 
                                                        prevArrow: "<svg class='slick-prev slick-arrow'><use xlink:href=#icon-arrow-left></use></svg>"
                                                    });
                                                }
                                            }
                                        });
                                    } 
                                }
                            }
                        }

                        if(param.style === 'style 2') {
                            if(!$scope.hasClass('has-megamenu')){
                                $scope.addClass('has-megamenu style-2 fullWidth');

                                if(!subMegaMenu.find('.cateArea').length){
                                    subMegaMenu.find('> .navPage-subMenu-list').wrap('<div class="cateArea columns-'+param.cateColumns+'"></div>');

                                    subMegaMenu.find('.cateArea').prepend(param.content);
                                }

                                if(!subMegaMenu.find('.imageArea').length){
                                    subMegaMenu.append('<div class="imageArea"><div class="megamenu-right-item">'+param.images+'</div></div>');
                                    
                                    if (param.products.length && (param.products !== '')) {
                                        subMegaMenu.find('.imageArea').prepend('<div class="megamenu-left-item megamenu-product-list">'+param.products+'</div>');
                                    }
                                }

                                subMegaMenu.find('.imageArea').css({
                                    'width': '100%',
                                    'max-width': param.imageAreaWidth
                                });

                                subMegaMenu.find('.cateArea').css({
                                    'width': '100%',
                                    'max-width': param.cateAreaWidth
                                });

                                subMegaMenu.addClass('haloCustomScrollbar');
                            }
                        }

                        if(param.style === 'style 3') {
                            if(!$scope.hasClass('has-megamenu')){
                                $scope.addClass('has-megamenu style-3 fullWidth');
                            }

                            if(!subMegaMenu.find('.centerArea').length){
                                subMegaMenu.find('> .navPage-subMenu-list').wrap('<div class="centerArea itemArea columns-'+param.cateColumns+'"></div>');
                            }

                            if(!subMegaMenu.find('.leftArea').length){
                                subMegaMenu.prepend('<div class="leftArea itemArea">'+param.imagesCustom+'</div>');
                            }

                            if(!subMegaMenu.find('.rightArea').length){
                                subMegaMenu.append('<div class="rightArea itemArea"><div class="megamenu-right-item">'+param.images+'</div></div>');
                                
                                if (param.products.length && (param.products !== '')) {
                                    subMegaMenu.find('.rightArea').prepend('<div class="megamenu-left-item megamenu-product-list">'+param.products+'</div>');
                                }
                            }

                            subMegaMenu.addClass('haloCustomScrollbar');

                            if (param.productId.length && (param.productId !== '')) {
                                var productIDS = param.productId,
                                    featuredProductCarousel = subMegaMenu.find('.megamenu-product-list');

                                const $options = {
                                    template: 'halothemes/megamenu/halo-megamenu-tmp-2'
                                };

                                if (productIDS !== '') {
                                    var listIDs = JSON.parse("[" + productIDS + "]");

                                    if (featuredProductCarousel.length) {
                                        featuredProductCarousel.find('.megamenu-slider2').addClass('is-loading');

                                        var n = 0;

                                        for (var i = 0; i < listIDs.length; i++) {
                                            var productId = listIDs[i];

                                            utils.api.product.getById(productId, $options, (err, response) => {
                                                var hasProd = $(response).find('.card').data('product-id');

                                                if(hasProd != undefined && hasProd !== null && hasProd !== ''){
                                                    if(featuredProductCarousel.find('.megamenu-slider2').hasClass('slick-initialized')) {
                                                        featuredProductCarousel.find('.megamenu-slider2').slick('unslick');
                                                        featuredProductCarousel.find('.megamenu-slider2').append(response);
                                                    } else {
                                                        featuredProductCarousel.find('.megamenu-slider2').append(response);
                                                    }

                                                    productSlider(featuredProductCarousel);
                                                }
                                            });
                                        }

                                        featuredProductCarousel.find('.megamenu-slider2').removeClass('is-loading');
                                    }
                                }

                                function productSlider(wrap){
                                    wrap.each((index, element) => {
                                        if($('.megamenu-slider2', element).length > 0){
                                            if($('.megamenu-slider2 .item', element).length > 0){
                                                $('.megamenu-slider2', element).slick({
                                                    infinite: false,
                                                    dots: false,
                                                    arrows: true,
                                                    slidesToShow: 1,
                                                    slidesToScroll: 1,
                                                    adaptiveHeight: true,
                                                    nextArrow: "<svg class='slick-next slick-arrow'><use xlink:href=#slick-arrow-next></use></svg>", 
                                                    prevArrow: "<svg class='slick-prev slick-arrow'><use xlink:href=#slick-arrow-prev></use></svg>",
                                                    responsive: [
                                                        {
                                                            breakpoint: 1025,
                                                            settings: {
                                                                dots: true,
                                                                arrows: false
                                                            }
                                                        }
                                                    ]
                                                });
                                            }
                                        }
                                    });
                                } 
                            }
                        }

                        if(param.style === 'style 4') {
                            if(!$scope.hasClass('has-megamenu')){
                                $scope.addClass('has-megamenu style-4 fullWidth');

                                if(!subMegaMenu.find('.cateArea').length){
                                    subMegaMenu.find('> .navPage-subMenu-list').wrap('<div class="container"><div class="cateArea columns-'+param.cateColumns+'"></div></div>');

                                    subMegaMenu.find('.cateArea').prepend(param.content);
                                }

                                if (param.imagesTop.length && (param.imagesTop !== '')) {
                                    function megamenuImageTop($_image_array) {
                                        var j = 2,
                                            listImg = $_image_array.slice(0,parseInt(param.cateColumns));

                                        for (var i = 0; i < listImg.length; i++) {
                                            j = j + 1;
                                            subMegaMenu.find('.cateArea > ul > li:nth-child(' + j + ') > .navPages-action').after(listImg[i]);
                                        }
                                    }

                                    megamenuImageTop(param.imagesTop);
                                }

                                if (param.bottomCates.length && (param.bottomCates !== '')) {
                                    subMegaMenu.append(param.bottomCates);
                                }

                                subMegaMenu.addClass('haloCustomScrollbar');
                            }
                        }

                        const navPagesAction = $scope.children('.navPages-action').children('.text');

                        if (param.labelType === 'new') {
                            navPagesAction.append('<span class="navPages-label new-label">'+param.label+'</span>');
                        } else if (param.labelType === 'sale') {
                            navPagesAction.append('<span class="navPages-label sale-label">'+param.label+'</span>');
                        } else if (param.labelType === 'hot') {
                            navPagesAction.append('<span class="navPages-label hot-label">'+param.label+'</span>');
                        }
                    } else{
                        const navPagesAction = $scope.children('.navPages-action').children('.text');

                        if (param.labelType === 'new') {
                            navPagesAction.append('<span class="navPages-label new-label">'+param.label+'</span>');
                        } else if (param.labelType === 'sale') {
                            navPagesAction.append('<span class="navPages-label sale-label">'+param.label+'</span>');
                        } else if (param.labelType === 'hot') {
                            navPagesAction.append('<span class="navPages-label hot-label">'+param.label+'</span>');
                        }
                    }
                }

                return this;
            }
        }
    }
}
