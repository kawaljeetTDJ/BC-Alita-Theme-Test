import utils from '@bigcommerce/stencil-utils';

export default function (context) {
    if (context.themeSettings.halo_CalculateFreeShipping == true){
        const upsellMessage = ['<span>'+context.themeSettings.halo_CalculateFreeShipping_required+'</span>',
                       '<span>'+context.themeSettings.halo_CalculateFreeShipping_remaining+'</span>',
                       '<span>'+context.themeSettings.halo_CalculateFreeShipping_matched+'</span>'];

        function loadFreeShippingMessage(){
            const options = {
                template: 'halothemes/halo-calculate-free-shipping-tmp'
            };

            utils.api.cart.getContent(options, (err, response) => {
                showFreeShippingMessage(response);
            });
        }

        loadFreeShippingMessage();

        function showFreeShippingMessage(message) {
            if($(message).length > 0) {
                $(message).find('.haloCalulateFreeShipping-text').each((index, element) => {
                    if($('.condition_remaining', element).text() != "" || $('.congratulation', element).text()){
                        if(context.themeSettings.halo_CalculateFreeShipping_type == 'all'){
                            showProgress(message, element);
                        } else if (context.themeSettings.halo_CalculateFreeShipping_type == 'custom'){
                            var countryCode,
                                country,
                                countryList;

                            $.getScript('https://ssl.geoplugin.net/javascript.gp?k=9247556ec91c71e9', event => {
                                countryCode = geoplugin_countryCode();
                                country = $('.country', element).text();
                                countryList = country.split(",");

                                if ($.inArray(countryCode, countryList) != -1){
                                    showProgress(message, element);
                                }
                            });
                        }
                    }
                });
            }
        }

        function showProgress(message, scope) {
            var max_percent = 0,
                classProgress;

            const condition_required = $('.condition_required', scope).text(),
                condition_matched = $('.condition_matched', scope).text(),
                condition_remaining = $('.condition_remaining', scope).text(),
                num_required = (condition_required != "" ? Number(condition_required.replace(/[^0-9.-]+/g,"")) : 0),
                num_matched = (condition_matched != "" ? Number(condition_matched.replace(/[^0-9.-]+/g,"")) : 0),
                num_remaining = (condition_remaining != "" ? Number(condition_remaining.replace(/[^0-9.-]+/g,"")) : 0);

            var percent = parseInt(num_matched/num_required * 100);
            percent = (percent > 100 ? 100 : percent);

            if(num_required == num_remaining){
                percent = 100;
            }

            if($('.congratulation', scope).text() != ""){
                percent = 100;
            }


            if(percent > max_percent){
                max_percent = percent;
            } else{
                return;
            }

            if(percent <= 50) {
                classProgress = "progress-shipping-50";
                message = upsellMessage[1].replace('{remaining}', condition_remaining);
            } else if(percent <= 90) {
                classProgress = "progress-shipping-90";
                message = upsellMessage[1].replace('{remaining}', condition_remaining);
            } else if(percent < 100) {
                classProgress = "progress-shipping-100";
                message = upsellMessage[1].replace('{remaining}', condition_remaining);
            } else if(percent == 100){
                classProgress = "progress-shipping-full";
                message = upsellMessage[2];
            }

            var progress = '<div class="progress-shipping '+classProgress+'" role="progressbar">\
                            <div class="progress-meter" style="width: '+percent+'%;">'+percent+'%</div>\
                        </div>';
            if(window.location.pathname == context.urls.cart){
                var pageCart = $('.page-cart');

                if (percent < 100 ){
                    progress += '<div class="shipping-message">'+message+'<span>'+percent+'%</span></div>';
                } else if (percent == 100){
                    progress = '<div class="shipping-message-100">'+message+'</div>';
                }

                if(pageCart.find('.halo-free-shipping-message').length > 0){
                    pageCart.find('.halo-free-shipping-message').html(progress);
                } else {
                    pageCart.find('.page-header').after('<div class="halo-free-shipping-message">' + progress + '</div>');
                }
            } else if($('body').hasClass('openCartSidebar')){
                var previewCart = $('.previewCart:not(.previewCart2)');

                if (percent < 100 ){
                    progress += '<div class="shipping-message">'+message+'</div>';
                } else if (percent == 100){
                    progress = '<div class="shipping-message-100">'+message+'</div>';
                }

                if(previewCart.find('.halo-free-shipping-message').length > 0){
                    previewCart.find('.halo-free-shipping-message').html(progress);
                } else {
                    previewCart.find('.previewCartHeader').after('<div class="halo-free-shipping-message">' + progress + '</div>');
                }
            }  else if($('body').hasClass('has-activeModal')){
                var previewCart = $('.previewCart.previewCart2');

                if (percent < 100 ){
                    progress += '<div class="shipping-message">'+message+'</div>';
                } else if (percent == 100){
                    progress = '<div class="shipping-message-100">'+message+'</div>';
                }

                if(previewCart.find('.halo-free-shipping-message').length > 0){
                    previewCart.find('.halo-free-shipping-message').html(progress);
                } else {
                    previewCart.prepend('<div class="halo-free-shipping-message">' + progress + '</div>');
                }
            }
        }
    }
}
