import utils from '@bigcommerce/stencil-utils';

export default function(element) {
    var $element = element,
        $popup = $element.find('.halo-lookbook-popup');
        
    const $options = {
        template: 'halothemes/lookbook/halo-lookbook-tmp'
    };

    $element.find('[data-product-lookbook]').on('click', event => {
        $popup.removeClass('is-open').empty();

        var $prodId = $(event.currentTarget).data('product-id'),
            position = $(event.currentTarget).offset(),
            container = $element.offset();

        if($prodId != undefined){
            utils.api.product.getById($prodId, $options, (err, response) => {
                if(err){
                    return false;
                }

                $popup.html(response);
            });

            if ($(window).width() >= 551) {
                $popup.css({'top': position.top - container.top - 200, 'left': position.left - container.left + 30});
            } else {
                $popup.css({'top': position.top - container.top + 15, 'left': 15});
            }

            $popup.addClass("is-open");
        }
    });

    $(document).on('click', '.halo-lookbook-close', event => {
        event.preventDefault();

        if ($popup.hasClass("is-open")) {
            $popup.removeClass("is-open");
        }
    });

    $(document).on('click', event => {
        if($popup.hasClass("is-open")) {
            if(($(event.target).closest($popup).length === 0) && ($(event.target).closest('[data-product-lookbook]').length === 0)) {
                $popup.removeClass("is-open");
            }
        }
    });
}
