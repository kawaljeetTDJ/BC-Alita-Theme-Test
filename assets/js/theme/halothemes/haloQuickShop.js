import utils from '@bigcommerce/stencil-utils';
import ProductDetails from '../common/product-details-quick-shop';

export default function (context) {
    if(context.themeSettings.halo_quick_shop == true) {
        $('body').on('click', '.halo-quick-shop', event => {
            event.preventDefault();

            const target = $(event.currentTarget),
                productId = target.data('productId'),
                popup = target.parents('.card').find('.card-footer');

            $('.card').find('.card-footer').removeClass('is-open').empty();

            popup
                .addClass('is-open is-loading')
                .html('<div class="loadingOverlay"></div>');

            utils.api.product.getById(productId, { template: 'halothemes/product/halo-quick-shop' }, (err, response) => {
                popup.find('.loadingOverlay').remove();
                popup
                    .removeClass('is-loading')
                    .append(response);

                var productDetails = new ProductDetails(popup.find('.halo-quickShop'), context);
                productDetails.setProductVariant(popup.find('.halo-quickShop'));

                return productDetails;
            });
        });

        $(document).on('click','.halo-quickShop-close', event => {
            event.preventDefault();
            
            $(event.currentTarget)
                .parents('.card-footer')
                .removeClass('is-open')
                .empty();
        });

        $(document).on('click', event => {
            if (($(event.target).closest('.card-footer').length === 0) && ($(event.target).closest('.halo-quick-shop').length === 0)){
                $('.card')
                    .find('.card-footer')
                    .removeClass('is-open')
                    .empty();
            }
        });
    }
}
