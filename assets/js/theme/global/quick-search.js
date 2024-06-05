import _ from 'lodash';
import utils from '@bigcommerce/stencil-utils';
import urlUtils from '../common/utils/url-utils';

export default function (context) {
    const TOP_STYLING = 'top: unset;';
    const $quickSearchResults = $('.quickSearchResults');
    const $quickSearchResultsCustom = $('.quickSearchResultsCustom');
    const $quickSearchForms = $('[data-quick-search-form]');
    const $searchQuery = $quickSearchForms.find('[data-search-quick]');
    const $searchQuery2 = $('#search_query2');
    const $searchBtn = $('[data-search-popup]');
    const $searchBox = $('.halo-search-box');
    const $searchBoxClose = $searchBox.find('.halo-search-box-close');
    const $searchBtnMobile = $('.item--searchMobile [data-search]');
    const $searchMobileClose = $('#halo-search-sidebar .halo-sidebar-header .close');

    $searchBtnMobile.on('click', event => {
        event.preventDefault();

        $(event.currentTarget).toggleClass('is-open');

        if($(event.currentTarget).hasClass('is-open')){
            $('body').addClass('openSearchMobile');
        } else{
            $('body').removeClass('openSearchMobile');
        }
    });

    $searchMobileClose.on('click', event => {
        event.preventDefault();
        
        $searchBtnMobile.removeClass('is-open');
        $('body').removeClass('openSearchMobile');
    });

    $searchBtn.on('click', event => {
        event.preventDefault();

        $(event.currentTarget).toggleClass('is-open');

        if($(event.currentTarget).hasClass('is-open')){
            var topSearchDropdown;

            if($('body').hasClass('stickyNavigation')){
                topSearchDropdown = 0;
            } else if($('.header .halo-top-bar-promotion').length > 0){
                topSearchDropdown = $('.header .halo-top-bar-promotion').outerHeight();
            } else{
                topSearchDropdown = 0;
            }

            $searchBox.css('top', topSearchDropdown);
            $('body').addClass('openQuickSearch');
            $searchQuery.trigger('click');
        } else{
            $('body').removeClass('openQuickSearch');
        }
    });

    $(document).on('click', event => {
        if ($searchBtn.hasClass('is-open')) {
            if (($(event.target).closest('[data-search-popup]').length === 0) && ($(event.target).closest('.halo-search-box').length === 0)){
                $searchBtn.removeClass('is-open');
                $('body').removeClass('openQuickSearch');
            }
        }

        if ($searchBtnMobile.hasClass('is-open')) {
            if (($(event.target).closest('.item--searchMobile [data-search]').length === 0) && ($(event.target).closest('#halo-search-sidebar').length === 0)){
                $searchBtnMobile.removeClass('is-open');
                $('body').removeClass('openSearchMobile');
            }
        }

        if (($(event.target).closest('[data-prevent-quick-search-close]').length === 0) && ($(event.target).closest('.before-you-leave-search').length === 0) && ($(event.target).closest('[data-search-popup]').length === 0))  {
            $quickSearchResults.removeClass('is-open');
            $quickSearchResultsCustom.removeClass('is-open');
        }
    });

    $searchBoxClose.on('click', event => {
        event.preventDefault();

        $searchBtn.removeClass('is-open');
        $('body').removeClass('openQuickSearch');
    });

    // stagger searching for 200ms after last input
    const doSearch = _.debounce((searchQuery) => {
        utils.api.search.search(searchQuery, { template: 'search/quick-results' }, (err, response) => {
            if (err) {
                return false;
            }

            $quickSearchResultsCustom.removeClass('is-open');
            $quickSearchResults.html(response).addClass('is-open');

            if ($(window).width() > 1024) {
                if($quickSearchResults.find('.product').length > 3){
                    $quickSearchResults.find('.productGrid').slick({
                        dots: false,
                        arrows: true,
                        infinite: false,
                        mobileFirst: true,
                        slidesToShow: 3,
                        slidesToScroll: 1,
                        nextArrow: "<svg class='slick-next slick-arrow'><use xlink:href=#slick-arrow-next2></use></svg>", 
                        prevArrow: "<svg class='slick-prev slick-arrow'><use xlink:href=#slick-arrow-prev2></use></svg>"
                    });
                }
            }
        });
    }, 200);

    utils.hooks.on('search-quick', (event, currentTarget) => {
        const searchQuery = $(currentTarget).val();

        // server will only perform search with at least 3 characters
        if (searchQuery.length < 3) {
            $quickSearchResults.removeClass('is-open');
            $quickSearchResultsCustom.addClass('is-open');
            return;
        }

        doSearch(searchQuery);
    });

    // Catch the submission of the quick-search forms
    $quickSearchForms.on('submit', event => {
        event.preventDefault();

        const $target = $(event.currentTarget);
        const searchQuery = $target.find('input').val();
        const searchUrl = $target.data('url');

        if (searchQuery.length === 0) {
            return;
        }

        urlUtils.goToUrl(`${searchUrl}?search_query=${searchQuery}`);
        window.location.reload();
    });

    $searchQuery.on('click', event => {
        $quickSearchResults.empty().removeClass('is-open');
        $quickSearchResultsCustom.addClass('is-open');

        var listIDs = context.themeSettings.quickSearchPopularId.split(','),
            listID = listIDs.slice(0,parseInt(context.themeSettings.quickSearchResultLimit));

        const $options = {
            template: 'halothemes/search/halo-quick-results-tmp'
        };

        if(!$quickSearchResultsCustom.find('.productGrid .product').length){
            $quickSearchResultsCustom.find('.quickResults-product').addClass('is-loading');

            var num = 0;

            for (var i = 0; i <= listID.length; i++) {
                var $prodId = listID[i];

                if($prodId != undefined){
                    utils.api.product.getById($prodId, $options, (err, response) => {
                        if(err){
                            return false;
                        }

                        var hasProd = $(response).find('.card').data('product-id');

                        if(hasProd != undefined && hasProd !== null && hasProd !== ''){
                            if($quickSearchResultsCustom.find('.productGrid .product').length < listID.length){
                                $quickSearchResultsCustom.find('.productGrid').append(response);
                            }
                        }

                        num++;

                        if(num == listID.length){
                            if(listID.length > 3){
                                if($quickSearchResultsCustom.find('.productGrid .product').length > 0){
                                    $quickSearchResultsCustom.find('.productGrid').slick({
                                        dots: false,
                                        arrows: true,
                                        infinite: false,
                                        mobileFirst: true,
                                        slidesToShow: 3,
                                        slidesToScroll: 1,
                                        nextArrow: "<svg class='slick-next slick-arrow'><use xlink:href=#slick-arrow-next2></use></svg>", 
                                        prevArrow: "<svg class='slick-prev slick-arrow'><use xlink:href=#slick-arrow-prev2></use></svg>"
                                    });
                                }
                            }
                            $quickSearchResultsCustom.find('.quickResults-product').removeClass('is-loading');
                        }
                    });            
                }
            }
        }
    });

    $searchQuery2.on('click', event => {
        $quickSearchResults.empty().removeClass('is-open');
        $quickSearchResultsCustom.addClass('is-open');

        var listIDs = context.themeSettings.quickSearchPopularId.split(','),
            listID = listIDs.slice(0,parseInt(context.themeSettings.quickSearchResultLimit));

        const $options = {
            template: 'halothemes/search/halo-quick-results-tmp'
        };

        if(!$quickSearchResultsCustom.find('.productGrid .product').length){
            $quickSearchResultsCustom.find('.quickResults-product').addClass('is-loading');

            var num = 0;

            for (var i = 0; i <= listID.length; i++) {
                var $prodId = listID[i];

                if($prodId != undefined){
                    utils.api.product.getById($prodId, $options, (err, response) => {
                        if(err){
                            return false;
                        }

                        if($quickSearchResultsCustom.find('.productGrid .product').length < listID.length){
                            $quickSearchResultsCustom.find('.productGrid').append(response);
                        }

                        num++;

                        if(num == listID.length){
                            $quickSearchResultsCustom.find('.quickResults-product').removeClass('is-loading');
                        }
                    });            
                }
            }
        }
    });
}
