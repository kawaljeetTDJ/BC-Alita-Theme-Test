import utils from '@bigcommerce/stencil-utils';
import _ from 'lodash';
import modalFactory, { showAlertModal, ModalEvents } from '../global/modal';
import parallax from './parallax/jquery.parallax-scroll.min';
import haloCalculateFreeShipping from './haloCalculateFreeShipping';

export default function($scope, context) {
    const thisProuctId = parseInt(context.productId),
        $relateTab = $('#halo-related-products'),
        $bundle = $('#halo-bundle-products'),
        $bundleList = $bundle.find('.halo-product-list');

    const modal = modalFactory('#modal')[0];

    var currency = context.money;

    showBundle();

    $(document).on('click', '.halo-toggle-options', event => {
        event.preventDefault();

        var $target = $(event.currentTarget);

        $('.halo-toggle-options').not($target).removeClass('is-focus');
        $('.halo-detail-options').not($target.next('.halo-detail-options')).removeClass('is-open');

        if (!$target.next('.halo-detail-options').hasClass('is-open')) {
            $target.addClass('is-focus');
            $target.next('.halo-detail-options').addClass('is-open');
        } else {
            $target.next('.halo-detail-options').removeClass('is-open');
            $target.removeClass('is-focus');
        }
    });

    $(document).on('click', '.halo-option-close', event => {
        event.preventDefault();

        $('.halo-detail-options').removeClass('is-open');
        $('.halo-toggle-options').removeClass('is-focus');
    });

    $(document).on('click', event => {
        if ($('.halo-detail-options').hasClass('is-open')) {
            if (($(event.target).closest('.halo-detail-options').length === 0) && ($(event.target).closest('.halo-toggle-options').length === 0)){
                $('.halo-detail-options').removeClass('is-open');
                $('.halo-toggle-options').removeClass('is-focus');
            }
        }
    });

    $(document).on('change', '.halo-detail-checkbox', event => {
        var $target = $(event.currentTarget),
            id = $target.attr('id').replace('fbt_product',''),
            product = $('.halo-product-item[data-product-id="' + id + '"]');

        if($target.is(':checked') == false) {
            product.removeClass('isChecked');
        } else {
            product.addClass('isChecked');
        }

        totalPrice();
    });

    $(document).on('click', '#halo-addAll', event => {
        event.preventDefault();

        const $form = $('form', $bundle);
        var arrPro = new Array();

        $('.halo-detail-checkbox').each((index, val) => {
            if ($(val).is(':checked')) {
                arrPro.push(index);
            }
        });

        var check = false;

        if (arrPro.length > 0) {
            check = checkProduct($form, arrPro);
        }

        if (check) {
            if (arrPro.length > 0) {
                var k = arrPro.length;

                $bundle.find('.loadingOverlay').show();

                addToCart($form, 0, arrPro, k);
            }
        } else {
            const errorMessage = 'Please make sure all options have been filled in.';

            if (errorMessage) {
                const tmp = document.createElement('DIV');
                tmp.innerHTML = errorMessage;

                return showAlertModal(tmp.textContent || tmp.innerText);
            }
        }

        event.preventDefault();
    });

    function showBundle() {
        const options = {
                template: {
                    item: 'halothemes/product/halo-bundle-products-tmp',
                    options: 'halothemes/product/halo-bundle-products-options',
                },
            };

        var prodBundleId = [],
            totalBlock = '';

        firstItem();

        if($bundle.hasClass('halo-bundle-login')){
            totalBlock = '<div class="halo-product-total">\
                            <a class="button button--primary halo-product-total-button" disabled href="#">Log in for pricing</a>\
                        </div>';
        } else{
            totalBlock = '<div class="halo-product-total">\
                            <div class="total-price">\
                                <span class="text">Total:</span>\
                                <span class="price"></span>\
                            </div>\
                            <a class="button button--primary halo-product-total-button" id="halo-addAll" href="#">Add All To Bag</a>\
                        </div>';
        }

        $bundle.find('.bundle-product-right').append(totalBlock);

        $.each(context.productCustomFields, function(index, obj) {
            if (obj.name == '__bundleid') {
                prodBundleId = JSON.parse('['+obj.value+']');
            }
        });

        prodBundleId = $.grep(prodBundleId, (value) => {
            return value != thisProuctId;
        });

        if ($bundle.length > 0 && prodBundleId.length == 0) {
            var num = 0,
                list = [];

            $relateTab.find('.card').each((index, val) => {
                list.push({
                    index: index,
                    data: ""
                });

                var pId = $(val).data('product-id');

                if (pId != undefined) {
                    utils.api.product.getById(pId, options, (err, response) => {
                        if (err) {
                            return '';
                        }

                        list.forEach((element) => {
                            if(element.index == index){
                                element.data = response;
                            }
                        });
                        
                        num++;

                        if(num == $relateTab.find('.card').length){
                            showList(list);
                        }
                    });
                }
            });
        } else if ($bundle.length > 0 && prodBundleId.length > 0) {
            var num = 0,
                list = [],
                listFilter = $.unique(prodBundleId);

            $.each(listFilter, (index, val) =>{
                list.push({
                    index: index,
                    data: ""
                });

                var pId = val;

                if (pId != undefined) {
                    utils.api.product.getById(pId, options, (err, response) => {
                        if (err) {
                            return '';
                        }

                        if(response.item != undefined && response.item != null && response.item != ''){
                            var hasProd = $(response.item).find('.themvale-fbt-image-link').attr('href');

                            if(hasProd != undefined && hasProd != null && hasProd != ''){
                                list.forEach((element) => {
                                    if(element.index == index){
                                        element.data = response;
                                    }
                                });
                            }
                        }
                        
                        num++;

                        if(num == prodBundleId.length){
                            showList(list);
                        }
                    });
                }
            });
        }
    }

    function firstItem(){
        const firstItem = $bundleList.find('.halo-product-itemFirst'),
            pId = firstItem.data('product-id'),
            form = firstItem.find('form'),
            hasOptions = form.find('[data-fbt-option-change]').length,
            hasDefaultOptions = form.find('[data-default]').length;

        if (hasDefaultOptions && hasOptions) {
            utils.api.productAttributes.optionChange(pId, form.serialize(), 'products/bulk-discount-rates', (err, response) => {
                const attributesData = response.data || {};
                const attributesContent = response.content || {};

                updateProductAttributes(form, attributesData);

                if (hasDefaultOptions) {
                    updateView(form, attributesData, attributesContent);
                } else {
                    updateDefaultAttributesForOOS(attributesData);
                }
            });
        }
    }

    function showList(list){
        list.forEach((element) => {
            var response = element.data;

            if(response != undefined && response != null && response != ''){
                $bundleList.append(response.item);

                if (response.options.trim() != "") {
                    var pId = $(response.item).data('product-id'),
                    $form = $bundleList.find('.halo-product-item[data-product-id="' + pId + '"] form');

                    $form.append(response.options);

                    const $productOptionsElement = $('[data-fbt-option-change]', $form);
                    const hasOptions = $productOptionsElement.html().trim().length;
                    const hasDefaultOptions = $(response.options).find('[data-default]').length;

                    if (hasDefaultOptions && hasOptions) {
                        utils.api.productAttributes.optionChange(pId, $form.serialize(), 'products/bulk-discount-rates', (err, response) => {
                            if(response != undefined){
                                const attributesData = response.data || {};
                                const attributesContent = response.content || {};

                                updateProductAttributes($form, attributesData);

                                if (hasDefaultOptions) {
                                    updateView($form, attributesData, attributesContent);
                                } else {
                                    updateDefaultAttributesForOOS(attributesData);
                                }
                            }
                        });
                    }

                    setProductVariant();
                }
            }
        });

        productOptions();
        showSlickSlider($bundleList);

        if(!$bundle.hasClass('halo-bundle-login')){
            totalPrice();
        }

        $bundle.removeClass('halo-block-disable');
    }

    function showSlickSlider(wrap){
        if(wrap.length > 0){
            wrap.slick({
                dots: true,
                arrows: false,
                slidesToShow: 2,
                slidesToScroll: 1,
                mobileFirst: true,
                infinite: false,
                nextArrow: "<svg class='slick-next slick-arrow'><use xlink:href='#slick-arrow-next2'></use></svg>",
                prevArrow: "<svg class='slick-prev slick-arrow'><use xlink:href='#slick-arrow-prev2'></use></svg>",
                responsive: [
                    {
                        breakpoint: 1200,
                        settings: {
                            slidesToShow: 4,
                            slidesToScroll: 1,
                            dots: false,
                            arrows: true
                        }
                    },
                    {
                        breakpoint: 1025,
                        settings: {
                            slidesToShow: 3,
                            slidesToScroll: 1,
                            dots: false,
                            arrows: true
                        }
                    },
                    {
                        breakpoint: 551,
                        settings: {
                            slidesToShow: 3,
                            slidesToScroll: 1
                        }
                    }
                ]
            });
        }
    }

    function checkProduct(form, arrPro) {
        var check = true;

        for (var i = 0; i < arrPro.length; i++) {
            var k = arrPro[i],
                $form = $(form[k]);

            if ($form.find('[data-fbt-option-change]').length) {
                check = checkBeforeAdd($form);

                if (check == false){
                    return false;
                }
            }
        }

        return check;
    }

    function checkBeforeAdd($attributes) {
        var check = true,
            att = "";

        $attributes.find('input:text, input:password, input:file, textarea').each((index, element) => {
            if (!$(element).prop('required')) {} else {
                if ($(element).val()) {} else {
                    $(element).focus();
                    check = false;
                }
            }
        });

        $attributes.find('select').each((index, element) => {
            if (!$(element).prop('required')) {} else {
                if ($(element).val()) {} else {
                    $(element).focus();
                    check = false;
                }
            }
        });

        $attributes.find('input:radio, input:checkbox').each((index, element) => {
            if (att != $(element).attr("name")) {
                att = $(element).attr("name");
                if (!$(element).prop('required')) {
                    if ($(element).attr("type") == "checkbox") {
                        if ($("[name='" + att + "']:checked").val()) {}
                    }
                    if ($(element).attr("type") == "radio") {
                        if ($("[name='" + att + "']:checked").val()) {}
                    }
                } else {
                    if ($(element).attr("type") == "checkbox") {
                        if ($("[name='" + att + "']:checked").val()) {} else {
                            check = false;
                        }
                    }
                    if ($(element).attr("type") == "radio") {
                        if ($("[name='" + att + "']:checked").val()) {} else {
                            check = false;
                        }
                    }
                }
            }
        });

        return check;
    }

    function addToCart(form, i, arrP, k) {
        if (window.FormData === undefined) {
            return;
        }

        var prod = arrP[i];

        utils.api.cart.itemAdd(filterEmptyFilesFromForm(new FormData(form[prod])), (err, response) => {
            const errorMessage = err || response.data.error;

            if (errorMessage) {
                const tmp = document.createElement('DIV');
                tmp.innerHTML = errorMessage;
                alert(tmp.textContent || tmp.innerText);
                k = k - 1;
            }

            i++;

            if (i >= arrP.length) {
                $bundle.find('.loadingOverlay').hide();

                if (context.themeSettings.haloAddToCartAction === 'sidebar'){
                    const options = {
                        template: 'common/cart-preview'
                    };

                    const loadingClass = 'is-loading';
                    const $body = $('body');
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
                    modal.$modal.removeClass().addClass('modal modal--preview modal--previewMini');
                    modal.open({ size: 'small' });

                    var textResponse;

                    if(k > 0){
                        textResponse = '<div class="modal-header">\
                            <h2 class="modal-header-title" style="-webkit-box-orient: vertical;">\
                                Ok, '+k+' item was added to your cart. What\'s next?\
                            </h2>\
                        </div>\
                        <div class="modal-body">\
                            <div class="previewCart previewCart2">\
                                <section class="previewCartCheckout previewCartCheckout2">\
                                    <a href="/checkout.php" class="button button--primary">\
                                        Proceed To Checkout\
                                    </a>\
                                    <a class="button button--secondary button--transparent-2" href="'+context.urls.home+'">Continue Shopping</a>\
                                </section>\
                            </div>\
                        </div>';
                    } else {
                        textResponse = '<div class="modal-header">\
                            <h2 class="modal-header-title" style="-webkit-box-orient: vertical;">\
                                Ok, '+k+' item was added to your cart. What\'s next?\
                            </h2>\
                        </div>\
                        <div class="modal-body">\
                            <div class="previewCart previewCart2">\
                                <section class="previewCartCheckout previewCartCheckout2">\
                                    <p class="previewCartCheckout-text">Sorry! We don\'t have enough product for your selection!</p>\
                                </section>\
                            </div>\
                        </div>';
                    }

                    const options = {
                        template: 'cart/preview'
                    };

                    utils.api.cart.getContent(options, (err, response) => {
                        const quantity = $(response).find('[data-cart-quantity]').data('cartQuantity') || 0;

                        $('body').trigger('cart-quantity-update', quantity);
                    });

                    modal.updateContent(textResponse);
                } else {
                    redirectTo(context.urls.cart);
                }

                return;
            }

            addToCart(form, i, arrP, k);
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

    function totalPrice() {
        var total = 0,
            symbol,
            symbolChange,
            decimalPlaces,
            decimalSeparator,
            thousandsSeparator,
            symbolLocation,
            curr,
            token1,
            token2,
            length;

        decimalPlaces = currency.decimal_places;
        decimalSeparator = currency.decimal_token;
        thousandsSeparator = currency.thousands_token;
        symbolLocation = currency.currency_location;
        symbol = currency.currency_token;

        $bundleList.find('.halo-product-item.isChecked').each((index, val) => {
            var price = parseFloat($(val).find('[data-price-value]').attr('data-price-value'));

            total = total + price;
        });

        if ($('.productView-price > .price-section > .price.price--withTax', $scope).length) {
            curr = $('.productView-price > .price-section > .price.price--withTax', $scope).text();
        } else {
            curr = $('.productView-price > .price-section > .price.price--withoutTax', $scope).text();
        }

        symbolChange = curr.replace(/[0-9]/g, "").replace(".", "").replace(",", "");

        if(symbol != symbolChange){
            symbol = symbolChange;
            token1 = (curr.indexOf('.'));
            token2 = (curr.indexOf(','));
            length = curr.length - 1;

            if (curr.indexOf(symbol) != -1) {
                symbolLocation = curr.indexOf(symbol);
            }

            if (token1 < token2) {
                thousandsSeparator = '.';
                decimalSeparator = ',';

                if (symbolLocation == 0 || symbolLocation == "left") {
                    decimalPlaces = length - token2;
                } else {
                    decimalPlaces = length - token2 - 1;
                }
            } else {
                thousandsSeparator = ',';
                decimalSeparator = '.';
                if (symbolLocation == 0 || symbolLocation == "left") {
                    decimalPlaces = length - token1;
                } else {
                    decimalPlaces = length - token1 - 1;
                }
            }
        }

        if(total == 0){
            $bundle.find('#halo-addAll').attr('disabled', true);
        } else{
            $bundle.find('#halo-addAll').attr('disabled', false);
        }

        total = formatMoney(total, decimalPlaces, decimalSeparator, thousandsSeparator);

        if (symbolLocation == "left" || symbolLocation == 0){
            total = symbol + total;
        } else{
            total = total + symbol;
        }

        $bundle.find('.halo-product-total .price').html(total);
    }

    function formatMoney(n, c, d, t) {
        var c = isNaN(c = Math.abs(c)) ? 2 : c,
            d = d == undefined ? "." : d,
            t = t == undefined ? "," : t,
            s = n < 0 ? "-" : "",
            i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c))),
            j = (j = i.length) > 3 ? j % 3 : 0;

        return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
    };

    function productOptions() {
        if(!$bundle.hasClass('halo-bundle-login')){
            totalPrice();
        }

        const $form = $('form', $bundle),
            $productOptionsElement = $('[data-fbt-option-change]', $form);

        $(document).on('change', $productOptionsElement, event => {
            productOptionsChanged(event);
            setProductVariant(event);
        });
    }

    function setProductVariant() {
        const unsatisfiedRequiredFields = [];
        const options = [];

        $.each($('[data-fbt-option-change] [data-product-attribute]'), (index, value) => {
            const optionLabel = value.children[0].innerText;
            const optionTitle = optionLabel.split(':')[0].trim();
            const required = optionLabel.toLowerCase().includes('required');
            const type = value.getAttribute('data-product-attribute');

            if ((type === 'input-file' || type === 'input-text' || type === 'input-number') && value.querySelector('input').value === '' && required) {
                unsatisfiedRequiredFields.push(value);
            }

            if (type === 'textarea' && value.querySelector('textarea').value === '' && required) {
                unsatisfiedRequiredFields.push(value);
            }

            if (type === 'date') {
                const isSatisfied = Array.from(value.querySelectorAll('select')).every((select) => select.selectedIndex !== 0);

                if (isSatisfied) {
                    const dateString = Array.from(value.querySelectorAll('select')).map((x) => x.value).join('-');
                    options.push(`${optionTitle}:${dateString}`);

                    return;
                }

                if (required) {
                    unsatisfiedRequiredFields.push(value);
                }
            }

            if (type === 'set-select') {
                const select = value.querySelector('select');
                const selectedIndex = select.selectedIndex;

                if (selectedIndex !== 0) {
                    options.push(`${optionTitle}:${select.options[selectedIndex].innerText}`);
                    $(value.children[0]).find('[data-option-value]').text(select.options[selectedIndex].innerText);
                    return;
                }

                if (required) {
                    unsatisfiedRequiredFields.push(value);
                }
            }

            if (type === 'set-rectangle' || type === 'set-radio' || type === 'swatch' || type === 'input-checkbox' || type === 'product-list') {
                const checked = value.querySelector(':checked');
                if (checked) {
                    if (type === 'set-rectangle' || type === 'set-radio' || type === 'product-list') {
                        const label = checked.labels[0].innerText;
                        if (label) {
                            options.push(`${optionTitle}:${label}`);
                            $(value.children[0]).find('[data-option-value]').text(label);
                        }
                    }

                    if (type === 'swatch') {
                        const label = checked.labels[0].children[0];
                        if (label) {
                            options.push(`${optionTitle}:${label.title}`);
                            $(value.children[0]).find('[data-option-value]').text(label.title);
                        }
                    }

                    if (type === 'input-checkbox') {
                        options.push(`${optionTitle}:Yes`);
                    }

                    return;
                }

                if (type === 'input-checkbox') {
                    options.push(`${optionTitle}:No`);
                }

                if (required) {
                    unsatisfiedRequiredFields.push(value);
                }
            }
        });
    }

    function productOptionsChanged(event) {
        const $changedOption = $(event.target);
        const $form = $changedOption.parents('form');
        const productId = $('[name="product_id"]', $form).val();

        if ($changedOption.attr('type') === 'file' || window.FormData === undefined) {
            return;
        }

        if ($changedOption.attr('id') === 'fbt_product' + productId) {
            return;
        }
        
        utils.api.productAttributes.optionChange(productId, $form.serialize(), 'products/bulk-discount-rates', (err, response) => {
            const productAttributesData = response.data || {};
            const productAttributesContent = response.content || {};
            showProductImage(productId, productAttributesData);
            updateProductAttributes($form, productAttributesData);
            updateView($form, productAttributesData, productAttributesContent);

            if(!$bundle.hasClass('halo-bundle-login')){
                totalPrice();
            }
        });

        return false;
    }
    
    function updateProductAttributes($scope, data) {
        const behavior = data.out_of_stock_behavior;
        const inStockIds = data.in_stock_attributes;
        const outOfStockMessage = ` (${data.out_of_stock_message})`;

        if (behavior !== 'hide_option' && behavior !== 'label_option') {
            return;
        }

        $('[data-product-attribute-value]', $scope).each((i, attribute) => {
            const $attribute = $(attribute);
            const attrId = parseInt($attribute.data('productAttributeValue'), 10);

            if (inStockIds.indexOf(attrId) !== -1) {
                enableAttribute($attribute, behavior, outOfStockMessage);
            } else {
                disableAttribute($attribute, behavior, outOfStockMessage);
            }
        });
    }

    function disableAttribute($attribute, behavior, outOfStockMessage) {
        if (getAttributeType($attribute) === 'set-select') {
            return disableSelectOptionAttribute($attribute, behavior, outOfStockMessage);
        }

        if (behavior === 'hide_option') {
            $attribute.hide();
        } else {
            $attribute.addClass('unavailable');
        }
    }

    function disableSelectOptionAttribute($attribute, behavior, outOfStockMessage) {
        const $select = $attribute.parent();

        if (behavior === 'hide_option') {
            $attribute.toggleOption(false);

            if ($select.val() === $attribute.attr('value')) {
                $select[0].selectedIndex = 0;
            }
        } else {
            $attribute.attr('disabled', 'disabled');
            $attribute.html($attribute.html().replace(outOfStockMessage, '') + outOfStockMessage);
        }
    }

    function enableAttribute($attribute, behavior, outOfStockMessage) {
        if (getAttributeType($attribute) === 'set-select') {
            return enableSelectOptionAttribute($attribute, behavior, outOfStockMessage);
        }

        if (behavior === 'hide_option') {
            $attribute.show();
        } else {
            $attribute.removeClass('unavailable');
        }
    }

    function enableSelectOptionAttribute($attribute, behavior, outOfStockMessage) {
        if (behavior === 'hide_option') {
            $attribute.toggleOption(true);
        } else {
            $attribute.prop('disabled', false);
            $attribute.html($attribute.html().replace(outOfStockMessage, ''));
        }
    }

    function getAttributeType($attribute) {
        const $parent = $attribute.closest('[data-product-attribute]');

        return $parent ? $parent.data('productAttribute') : null;
    }

    function showProductImage(productId, data) {
        if (_.isPlainObject(data.image)) {
            const mainImageUrl = utils.tools.imageSrcset.getSrcset(
                data.image.data, { '1x': context.themeSettings.productgallery_size },
            );

            $('.halo-product-item[data-product-id="' + productId + '"]').find('img').attr({
                'srcset': mainImageUrl,
                'data-srcset': $(this).attr('srcset'),
            });
        } else {
            const mainImageUrl = $('.halo-product-item[data-product-id="' + productId + '"]').find('img').attr('data-srcset');
            $('.halo-product-item[data-product-id="' + productId + '"]').find('img').attr({
                'srcset': mainImageUrl,
                'data-srcset': $(this).attr('srcset'),
            });
        }
    }

    function updateView($scope, data, content = null) {
        const viewModel = getViewModel($scope);

        if (_.isNumber(data.stock)) {
            if((data.stock <= parseInt(context.themeSettings.halo_stock_level_limit)) && (data.stock > 0)) {
                viewModel.$stockLeftWrapper.removeClass('u-hiddenVisually');
                viewModel.$stockLeft.text(data.stock);
            } else{
                viewModel.$stockLeftWrapper.addClass('u-hiddenVisually');
            }
        }

        showMessageBox(data.stock_message || data.purchasing_message, $scope);

        if (_.isObject(data.price)) {
            updatePriceView(viewModel, data.price);
        }

        var productId = $('[name="product_id"]', $scope).val(),
            product = $bundleList.find('.halo-product-item[data-product-id="' + productId + '"]'),
            productCheckbox = product.find('.halo-detail-checkbox');

        if (!data.purchasable || !data.instock) {
            product.removeClass('isChecked hasOptions--selected');
            productCheckbox.prop('checked', false).prop('disabled', true);
        } else {
            product.addClass('isChecked');
            productCheckbox.prop('checked', true).prop('disabled', false);

            if ($scope.find('[data-fbt-option-change]').length > 0) {

                var check = checkBeforeAdd($scope);

                if (check == true) {
                    product.addClass('hasOptions--selected');
                }
            }
        }
    }

    function updateDefaultAttributesForOOS($scope, data) {
        var productId = $('[name="product_id"]', $scope).val(),
            product = $bundleList.find('.halo-product-item[data-product-id="' + productId + '"]'),
            productCheckbox = product.find('.halo-detail-checkbox');

        if (!data.purchasable || !data.instock) {
            product.removeClass('isChecked hasOptions--selected');
            productCheckbox.prop('checked', false).prop('disabled', true);
        } else {
            product.addClass('isChecked');
            productCheckbox.prop('checked', true).prop('disabled', false);

            if ($scope.find('[data-fbt-option-change]').length > 0) {
                var check = checkBeforeAdd($scope);

                if (check == true) {
                    product.addClass('hasOptions--selected');
                }
            }
        }
    }

    function getViewModel($scope) {
        return {
            $priceWithTax: $('[data-product-price-with-tax]', $scope),
            $priceWithoutTax: $('[data-product-price-without-tax]', $scope),
            rrpWithTax: {
                $div: $('.rrp-price--withTax', $scope),
                $span: $('[data-product-rrp-with-tax]', $scope),
            },
            rrpWithoutTax: {
                $div: $('.rrp-price--withoutTax', $scope),
                $span: $('[data-product-rrp-price-without-tax]', $scope),
            },
            nonSaleWithTax: {
                $div: $('.non-sale-price--withTax', $scope),
                $span: $('[data-product-non-sale-price-with-tax]', $scope),
            },
            nonSaleWithoutTax: {
                $div: $('.non-sale-price--withoutTax', $scope),
                $span: $('[data-product-non-sale-price-without-tax]', $scope),
            },
            priceSaved: {
                $div: $('.price-section--saving', $scope),
                $span: $('[data-product-price-saved]', $scope),
            },
            priceNowLabel: {
                $span: $('.price-now-label', $scope),
            },
            priceLabel: {
                $span: $('.price-label', $scope),
            },
            priceData: {
                $div: $('[data-price-value]', $scope),
            },
            $weight: $('.productView-info [data-product-weight]', $scope),
            $increments: $('.form-field--increments :input', $scope),
            $addToCart: $('#form-action-addToCart', $scope),
            $wishlistVariation: $('[data-wishlist-add] [name="variation_id"]', $scope),
            $stockLeft: $('[data-stock-left]', $scope),
            $stockLeftWrapper: $('.productView-optionsStock', $scope),
            stock: {
                $container: $('.form-field--stock', $scope),
                $input: $('[data-product-stock]', $scope),
            },
            $sku: $('[data-product-sku]'),
            $upc: $('[data-product-upc]'),
            quantity: {
                $text: $('.incrementTotal', $scope),
                $input: $('[name=qty\\[\\]]', $scope),
            },
            $bulkPricing: $('.productView-info-bulkPricing', $scope),
        };
    }

    function showMessageBox(message, $scope) {
        const $messageBox = $('.productAttributes-message', $scope);

        if (message) {
            $('.alertBox-message', $messageBox).text(message);
            $messageBox.show();
        } else {
            $messageBox.hide();
        }
    }

    function clearPricingNotFound(viewModel) {
        viewModel.rrpWithTax.$div.hide();
        viewModel.rrpWithoutTax.$div.hide();
        viewModel.nonSaleWithTax.$div.hide();
        viewModel.nonSaleWithoutTax.$div.hide();
        viewModel.priceSaved.$div.hide();
        viewModel.priceNowLabel.$span.hide();
        viewModel.priceLabel.$span.hide();
    }
    
    function updatePriceView(viewModel, price) {
        clearPricingNotFound(viewModel);

        if (price.with_tax) {
            viewModel.priceLabel.$span.show();
            viewModel.$priceWithTax.html(price.with_tax.formatted);
            viewModel.priceData.$div.attr('data-price-value', price.with_tax.value);
        }

        if (price.without_tax) {
            viewModel.priceLabel.$span.show();
            viewModel.$priceWithoutTax.html(price.without_tax.formatted);
            viewModel.priceData.$div.attr('data-price-value', price.without_tax.value);
        }

        if (price.rrp_with_tax) {
            viewModel.rrpWithTax.$div.show();
            viewModel.rrpWithTax.$span.html(price.rrp_with_tax.formatted);
        }

        if (price.rrp_without_tax) {
            viewModel.rrpWithoutTax.$div.show();
            viewModel.rrpWithoutTax.$span.html(price.rrp_without_tax.formatted);
        }

        if (price.saved) {
            viewModel.priceSaved.$div.show();
            viewModel.priceSaved.$span.html(price.saved.formatted);
        }

        if (price.non_sale_price_with_tax) {
            viewModel.priceLabel.$span.hide();
            viewModel.nonSaleWithTax.$div.show();
            viewModel.priceNowLabel.$span.show();
            viewModel.nonSaleWithTax.$span.html(price.non_sale_price_with_tax.formatted);
        }

        if (price.non_sale_price_without_tax) {
            viewModel.priceLabel.$span.hide();
            viewModel.nonSaleWithoutTax.$div.show();
            viewModel.priceNowLabel.$span.show();
            viewModel.nonSaleWithoutTax.$span.html(price.non_sale_price_without_tax.formatted);
        }
    }

    function filterEmptyFilesFromForm(formData) {
        try {
            for (const [key, val] of formData) {
                if (val instanceof File && !val.name && !val.size) {
                    formData.delete(key);
                }
            }
        } catch (e) {
            console.error(e);
        }

        return formData;
    }
}
