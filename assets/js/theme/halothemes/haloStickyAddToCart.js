import _ from 'lodash';
import 'foundation-sites/js/foundation/foundation';
import 'foundation-sites/js/foundation/foundation.dropdown';
import utils from '@bigcommerce/stencil-utils';
import request from '@bigcommerce/stencil-utils/src/lib/request.js';
import modalFactory, { showAlertModal, ModalEvents } from '../global/modal';
import haloCalculateFreeShipping from './haloCalculateFreeShipping';

export default function($scope, context) {
    var offsetScroll = $scope.find('[data-cart-item-add]'),
        scroll = offsetScroll.offset().top + offsetScroll.outerHeight(true);

    const showPrice = context.themeSettings.restrict_to_login;

    const modal = modalFactory('#modal')[0],
        $sticky = $('.sticky-add-to-cart'),
        $stickyClose = $sticky.find('.sticky-product-close'),
        $stickyExpand = $sticky.find('.sticky-product-expand'),
        $prodId = $sticky.find('[data-cart-item-add-2] [name="product_id"]').val(),
        $prodPrice = $sticky.find('.sticky-price'),
        $prodOptions = $sticky.find('.sticky-options'),
        $prodOptionLabel = $prodOptions.find('.sticky-options-label'),
        $prodOptionDropdown = $prodOptions.find('.sticky-options-dropdown'),
        $imageWrapper = $sticky.find('.sticky-image'),
        $prodBtn = $sticky.find('.sticky-actions .button'),
        $prodWLBtn = $sticky.find('.sticky-wishlist'),
        waitMessage = $prodBtn.data('waitMessage'),
        originalBtnVal = $prodBtn.text(),
        $body = $('body');

    function loadSticky() {
        if((context.themeSettings.halo_sticky_add_to_cart == true) && ($sticky.length > 0)){
            if(context.themeSettings.halo_product_template_mobile == true){
                if($(window).width() > 550){
                    loadOptions();
                }
            } else{
                loadOptions();
            }

            $(window).scroll(function() {
                if ($(window).scrollTop() > scroll + 100) {
                    if (!$sticky.hasClass('show-sticky')) {
                        $sticky.addClass('show-sticky');

                        if ($body.hasClass('page-type-product')) {
                            $body.addClass('openStickyAddToCart');
                        }
                    }
                } else {
                    $sticky.removeClass('show-sticky hidden-sticky show-full-sticky');

                    if ($body.hasClass('page-type-product')) {
                        $body.removeClass('openStickyAddToCart');
                    }
                }
            });

            $prodOptionLabel.on('click', event => {
                $prodOptionDropdown.toggleClass('is-open');
            });

            $stickyClose.on('click', event => {
                event.preventDefault();

                if($sticky.hasClass('show-full-sticky')){
                    $sticky.removeClass('show-full-sticky');
                } else{
                    $sticky.addClass('hidden-sticky');
                    
                    if ($body.hasClass('page-type-product')) {
                        $body.removeClass('openStickyAddToCart');
                    }
                }
            });

            $stickyExpand.on('click', event => {
                event.preventDefault();

                $sticky.addClass('show-full-sticky');
            });

            $prodOptionDropdown.on('click', '.option-item', event => {
                var $target = $(event.currentTarget);

                if (!$target.hasClass('is-select')) {
                    var optionLabel = $target.find('.option-itemWrapper').html(),
                        optionAttr = $target.data('variant-attr');

                    utils.api.productAttributes.optionChange($prodId, optionAttr, 'products/bulk-discount-rates', (err, response) => {
                        const productAttributesData = response.data || {};
                        updateView(productAttributesData);
                    });

                    $prodOptionDropdown.find('.option-item').removeClass('is-select');
                    $target.addClass('is-select');
                    $prodOptionLabel.find('.text').html(optionLabel);
                    $prodOptionDropdown.removeClass('is-open');
                }
            });

            $prodBtn.on('click', event => {
                event.preventDefault();

                var attr = $prodBtn.attr('disabled2');

                if (typeof attr !== typeof undefined && attr !== false) {
                    var form = $('form[data-cart-item-add]', $scope),
                        height = $(window).scrollTop(),
                        formHeight = form.offset().top + form.height()/2;
                    
                    if(height > formHeight){
                        $('body,html').animate({
                            scrollTop: form.offset().top - 50
                        }, 700);
                    }
                } else{
                    addToCart();
                }
            });

            $prodWLBtn.on('click', event => {
                event.preventDefault();

                var $this_wl = $(event.currentTarget),
                    url_awl = $this_wl.attr('href');

                $.post(url_awl).done(() => {
                    window.location.href = url_awl;
                });
            });

            $(document).on('click', event => {
                if ($prodOptionDropdown.hasClass('is-open')) {
                    if (($(event.target).closest('.sticky-options-dropdown').length === 0) && ($(event.target).closest('.sticky-options-label').length === 0)) {
                        $prodOptionDropdown.removeClass('is-open');
                    }
                }
            });
        }
    }

    loadSticky();

    function loadOptions() {
        if ($prodOptions.length > 0) {
            const rows = [],
                rowLimits = [],
                rowObjects = [],
                newOptions = [];

            $('[data-product-attribute]', $scope).each((index, element) => {
                var id = $(element).data('product-option-id'),
                    type = $(element).data('product-attribute');

                if(type === 'input-checkbox' || type === 'product-list' || type === 'date' || type === 'input-file' || type === 'input-text' || type === 'input-number' || type === 'textarea'){}
                else{
                    rows.push(0);

                    if (type === 'set-rectangle' || type === 'set-radio' || type === 'swatch') {
                        rowLimits.push($(element).find('.form-radio').length);
                    }

                    if (type === 'set-select') {
                        rowLimits.push($(element).find('.form-select option:not(:first-child)').length);
                    }

                    const rowObject = [];

                    if (type === 'set-rectangle' || type === 'set-radio' || type === 'swatch') {
                        $(element).find('.form-radio').each((index2, element2) => {
                            rowObject.push({
                                attribute: id,
                                attributeValue: $(element2).attr('value'),
                                attributeLabel: $(element2).attr('name'),
                                attributeName: $(element2).attr('data-title'),
                                attributeIndex: $(element2).attr('data-index'),
                                invisible: false,
                                instock: true,
                            });
                        });
                    }

                    if (type === 'set-select') {
                        var setLabel = $(element).find('.form-select').attr('name');

                        $(element).find('.form-select option:not(:first-child)').each((index2, element2) => {
                            rowObject.push({
                                attribute: id,
                                attributeValue: $(element2).attr('value'),
                                attributeLabel: setLabel,
                                attributeName: $(element2).attr('data-title'),
                                attributeIndex: $(element2).attr('data-index'),
                                invisible: false,
                                instock: true,
                            });
                        });
                    }

                    rowObjects.push(rowObject);
                }
            });

            let isNewOptionsReady = false;

            function decrementRows(dLength) {
                const currenIndex = dLength - 1;
                rows[currenIndex] += 1;

                if ((rows[currenIndex] < rowLimits[currenIndex]) === false) {
                    if (currenIndex === 0) {
                        isNewOptionsReady = true;
                    } else {
                        rows[currenIndex] = 0;

                        decrementRows(currenIndex);
                    }
                }
            }

            let currentOptionIndex = 0;

            while (isNewOptionsReady === false) {
                newOptions[currentOptionIndex] = {
                    attributes: [],
                    label: '',
                    name: '',
                    position: '',
                };

                rows.forEach((r, rIndex) => {
                    newOptions[currentOptionIndex].attributes.push(rowObjects[rIndex][r]);
                    newOptions[currentOptionIndex].label += `${rowObjects[rIndex][r].attributeLabel} `;
                    newOptions[currentOptionIndex].name += `<span>${rowObjects[rIndex][r].attributeName}</span>`;
                    newOptions[currentOptionIndex].position += `${rowObjects[rIndex][r].attributeIndex}`;
                });

                decrementRows(rows.length);

                currentOptionIndex += 1;
            }

            let currentNewOptionIndex = 0;

            newOptions.forEach((newOption, newOptionIndex, newEl) => {
                var attributeString = '';

                newOption.attributes.forEach(attribute => {
                    attributeString = attributeString + `&attribute[${attribute.attribute}]=` + attribute.attributeValue;
                });

                $(document.createElement("div")).attr({
                    class: 'option-item',
                    'data-variant-index': newOption.position,
                    'data-variant-attr': attributeString
                })
                .append('<div class="option-itemWrapper">'+newOption.name+'</div>')
                .appendTo($prodOptionDropdown);
            });
        }
    }

    function addToCart() {
        const $form = $sticky.find('[data-cart-item-add-2]');
        var sku = $form.find('.sticky-actions').attr('data-product-sku-add');
        var att = $form.find('.option-item.is-select').data('variant-attr');
        const options = {
            template: 'common/cart-preview'
        };

        var url;

        if (sku != undefined && sku != null && sku != '') {
            url = `/cart.php?action=add&sku=` + sku + `&qty=1`;
        } else {
            url = `/cart.php?action=add&product_id=` + $prodId + att;
        }

        $prodBtn
            .text(waitMessage)
            .prop('disabled', true);

        request(encodeURI(url), {
            method: 'POST',
            requestOptions: options,
        }, (err, response) => {
            if (err) {
                throw new Error(err);
            }

            const errorMessage = err;

            if (errorMessage) {
                const tmp = document.createElement('DIV');
                tmp.innerHTML = errorMessage;

                return showAlertModal(tmp.textContent || tmp.innerText);
            }

            $prodBtn
                .text(originalBtnVal)
                .prop('disabled', false);

            if (context.themeSettings.haloAddToCartAction === 'sidebar'){
                const loadingClass = 'is-loading';
                const $cartDropdown = $('#halo-cart-sidebar .halo-sidebar-wrapper');
                const $cartLoading = $('<div class="loadingOverlay"></div>');

                $body.toggleClass('openCartSidebar');

                $cartDropdown
                    .addClass(loadingClass)
                    .html($cartLoading);
                $cartLoading
                    .show();

                utils.api.cart.getContent(options, (err, response) => {
                    $cartDropdown
                        .removeClass(loadingClass)
                        .html(response);
                    $cartLoading
                        .hide();

                    const quantity = $(response).find('[data-cart-quantity]').data('cartQuantity') || 0;

                    $body.trigger('cart-quantity-update', quantity);
                    haloCalculateFreeShipping(context);
                });
            } else if (context.themeSettings.haloAddToCartAction === 'popup'){
                modal.$modal.removeClass().addClass('modal modal--preview');
                modal.open({ size: 'large' });

                updateCartContent(modal, response.data.cart_item.hash);

                haloCalculateFreeShipping(context);
            } else{
                redirectTo(context.urls.cart);
            }
        });
    }

    function isRunningInIframe() {
        try {
            return window.self !== window.top;
        } catch (e) {
            return true;
        }
    }

    function redirectTo(url) {
        if (isRunningInIframe() && !window.iframeSdk) {
            window.top.location = url;
        } else {
            window.location = url;
        }
    }

    function updateCartContent(modal, cartItemHash) {
        getCartContent(cartItemHash, (err, response) => {
            if (err) {
                return;
            }

            modal.updateContent(response);

            const quantity = $(response).find('[data-cart-quantity]').data('cartQuantity') || 0;

            $body.trigger('cart-quantity-update', quantity);
        });
    }

    function getCartContent(cartItemHash, onComplete) {
        const options = {
            template: 'cart/preview',
            params: {
                suggest: cartItemHash,
            },
            config: {
                cart: {
                    suggestions: {
                        limit: 4
                    },
                },
            },
        };

        utils.api.cart.getContent(options, onComplete);
    }

    function showVariantImage(image) {
        if (_.isPlainObject(image)) {
            const mainImageUrl = utils.tools.imageSrcset.getSrcset(
                image.data, { '1x': context.themeSettings.productgallery_size },
            );

            return mainImageUrl;
        }
    }

    function updateView(data){
        var inStock = data.instock,
            image = data.image,
            sku = data.sku,
            price = data.price;

        if(inStock){
            $prodBtn.attr('disabled', false);
            $prodOptionLabel.removeClass('option-hidden').addClass('option-visible');
        } else{
            $prodBtn.attr('disabled', true);
            $prodOptionLabel.removeClass('option-visible').addClass('option-hidden');
        }

        if (image != undefined && image !== null && image !== '') {
            $imageWrapper.find('img').attr('srcset', showVariantImage(image));
        }

        if (sku) {
            $('[data-product-sku-add]').attr('data-product-sku-add', sku);
        }

        if (_.isObject(price)) {
            updatePriceView(price);
        }
    }

    function updatePriceView(price){
        if (price.with_tax) {
            $('.price-label', $prodPrice).show();
            $('[data-product-price-with-tax]', $prodPrice).html(price.with_tax.formatted);
        }

        if (price.without_tax) {
            $('.price-label', $prodPrice).show();
            $('[data-product-price-without-tax]', $prodPrice).html(price.without_tax.formatted);
        }

        if (price.rrp_with_tax) {
            $('.rrp-price--withTax', $prodPrice).show();
            $('[data-product-rrp-with-tax]', $prodPrice).html(price.rrp_with_tax.formatted);
        }

        if (price.rrp_without_tax) {
            $('.rrp-price--withoutTax', $prodPrice).show();
            $('[data-product-rrp-price-without-tax]', $prodPrice).html(price.rrp_without_tax.formatted);
        }

        if (price.saved) {
            $('.price-section--saving', $prodPrice).show();
            $('[data-product-price-saved]', $prodPrice).html(price.saved.formatted);
        }

        if (price.non_sale_price_with_tax) {
            $('.price-label', $prodPrice).hide();
            $('.non-sale-price--withTax', $prodPrice).show();
            $('.price-now-label', $prodPrice).show();
            $('[data-product-non-sale-price-with-tax]', $prodPrice).html(price.non_sale_price_with_tax.formatted);
        }

        if (price.non_sale_price_without_tax) {
            $('.price-label', $prodPrice).hide();
            $('.non-sale-price--withoutTax', $prodPrice).show();
            $('.price-now-label', $prodPrice).show();
            $('[data-product-non-sale-price-without-tax]', $prodPrice).html(price.non_sale_price_without_tax.formatted);
        }
    }

    window.onload = function() {
        if ($sticky.length > 0) {
            if ($(window).scrollTop() > scroll - 160) {
                if (!$sticky.hasClass('show-sticky')) {
                    $sticky.addClass('show-sticky');

                    if ($body.hasClass('page-type-product')) {
                        $body.addClass('openStickyAddToCart');
                    }
                }
            }
        }
    }
}
