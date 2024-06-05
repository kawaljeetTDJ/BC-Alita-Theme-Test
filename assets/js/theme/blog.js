import 'fancybox';
import utils from '@bigcommerce/stencil-utils';
import PageManager from './page-manager';
import haloSidebarToggle from './halothemes/haloSidebarToggle';
import haloAddOptionForProduct from './halothemes/haloAddOptionForProduct';
import haloProductLookbook from './halothemes/haloProductLookbook';

export default class Blog extends PageManager {
    constructor(context) {
        super(context);
    }

	onReady() {
        haloSidebarToggle();
        haloProductLookbook($('.lookbook-wrapper'));
        
        this.getAllTags(this.context);
        this.loadOptionForProductCard(this.context);
        this.lookbookSlider();
        this.fancyboxVideoBanner();
    }

    getAllTags(context){
        if (context.themeSettings.halo_sidebar_popular_tags == true) {
            const requestOptions = {
                config: {
                    blog: {
                        posts: {
                            limit: 100,
                        },
                    },
                },
                template: 'halothemes/halo-all-tags',
            };

            utils.api.getPage('/blog', requestOptions, (error, response) => {
               if (error) {
                    return '';
                }

                $('.tags-list').html(response);

                var arr = {};

                $('.tags-list [data-tag]').each((index, element) => {
                    var txt = $(element).data('tag');

                    if (arr[txt]){
                        $(element).remove();
                    } else{
                        arr[txt] = true;
                    }
                });
            });
        }
    }

    loadOptionForProductCard(context){
        if($('#featured-products .card').length > 0){
            haloAddOptionForProduct(context, 'featured-products');
        }
    }

    lookbookSlider(){
        if($('.halo-lookbook-slider').length > 0){
            var wrap = $('.halo-lookbook-slider');

            if (!wrap.hasClass('slick-slider')){
                slickCarousel(wrap);
            }

            if(wrap.find('[data-fancybox]') > 0){
                fancyBoxImage(wrap.find('[data-fancybox]'));
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
                    nextArrow: "<svg class=&apos;slick-next slick-arrow&apos;><use xlink:href=&apos;#slick-arrow-next&apos;></use></svg>", 
                    prevArrow: "<svg class=&apos;slick-prev slick-arrow&apos;><use xlink:href=&apos;#slick-arrow-prev&apos;></use></svg>",
                    responsive: [
                    {
                        breakpoint: 551,
                        settings: {
                            slidesToShow: 3,
                            slidesToScroll: 1
                        }
                    },
                    {
                        breakpoint: 375,
                        settings: {
                            slidesToShow: 2,
                            slidesToScroll: 1
                        }
                    }]
                });
            }
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
    }

    fancyboxVideoBanner(){
        if ($(".custom-description [data-fancybox]").length > 0) {
            $(".custom-description [data-fancybox]").fancybox({
                'autoDimensions': false,
                'padding' : 0,
                'width' : 970,
                'height' : 600,
                'autoScale' : false,
                'transitionIn' : 'none',
                'transitionOut' : 'none'
            });
        }
    }
}
