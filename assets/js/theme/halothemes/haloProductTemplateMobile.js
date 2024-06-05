import _ from 'lodash';
import mediaQueryListFactory from '../common/media-query-list';

export default function (context) {
    const mediumMedia = mediaQueryListFactory('small'),
        pageMobile = $('.page-product-mobile');

    if (mediumMedia && context.themeSettings.halo_product_template_mobile == true) {
        if (!mediumMedia.matches){
            const productNav = pageMobile.find('.productView-nav'),
                productFor = pageMobile.find('.productView-for');
                
            var listLength,
                videoLength = productNav.data('product-video-length'),
                imageLength = productNav.data('product-image-length');

            if(videoLength !== undefined && videoLength !== null && videoLength !== ''){
                if(imageLength !== undefined && imageLength !== null && imageLength !== ''){
                    listLength = parseInt(imageLength) + parseInt(videoLength);
                } else{
                    listLength = 1 + parseInt(videoLength);
                }
            } else{
                if(imageLength !== undefined && imageLength !== null && imageLength !== ''){
                    listLength = parseInt(imageLength);
                } else{
                    listLength = 1;
                }
            }

            productNav.append('<div class="customPag"><span class="number">1</span><span class="total">'+listLength+'</span></div>')

            if(listLength > 1){
                productNav.addClass('customSlickRight').removeClass('customSlick');
            } else{
                productNav.removeClass('customSlick');
            }

            productNav.on("afterChange", (event, slider, i) => {
                var number = parseInt($(slider.$slides[i]).data('slick-position')) + 1;

                productNav.find('.customPag .number').text(number);

                if($(slider.$slides[i]).next().length > 0){
                    productNav.removeClass('customSlickLeft').addClass("customSlickRight");
                } else{
                    productNav.removeClass('customSlickRight').addClass("customSlickLeft");
                }
            });
        }
    }
}
