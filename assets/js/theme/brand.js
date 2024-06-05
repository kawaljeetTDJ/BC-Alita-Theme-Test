import { hooks } from '@bigcommerce/stencil-utils';
import CatalogPage from './catalog';
import compareProducts from './global/compare-products';
import FacetedSearch from './common/faceted-search';
import { createTranslationDictionary } from '../theme/common/utils/translations-utils';
import haloAddOptionForProduct from './halothemes/haloAddOptionForProduct';
import haloSideAllCategory from './halothemes/haloSideAllCategory';
import haloproductDisplayMode from './halothemes/haloProductDisplayMode';
import haloSidebarToggle from './halothemes/haloSidebarToggle';
import haloStickyToolbar from './halothemes/haloStickyToolbar';
import haloCustomBanner from './halothemes/haloCustomBanner';

export default class Brand extends CatalogPage {
    constructor(context) {
        super(context);
        this.validationDictionary = createTranslationDictionary(context);
    }

    onReady() {
        compareProducts(this.context.urls);

        if ($('#facetedSearch').length > 0) {
            this.initFacetedSearch();
        } else {
            this.onSortBySubmit = this.onSortBySubmit.bind(this);
            hooks.on('sortBy-submitted', this.onSortBySubmit);
        }

        haloSideAllCategory();
        haloproductDisplayMode();
        haloSidebarToggle();
        haloStickyToolbar(this.context);
        haloCustomBanner();

        this.showItem();
        this.loadOptionForProductCard(this.context);
        this.showProductsPerPage();
        this.showMoreProducts();
    }

    initFacetedSearch() {
        const {
            price_min_evaluation: onMinPriceError,
            price_max_evaluation: onMaxPriceError,
            price_min_not_entered: minPriceNotEntered,
            price_max_not_entered: maxPriceNotEntered,
            price_invalid_value: onInvalidPrice,
        } = this.validationDictionary;
        const $productListingContainer = $('#product-listing-container .productListing');
        const $facetedSearchContainer = $('#faceted-search-container');
        const $paginatorContainer = $('.pagination');
        const $showMoreContainer = $('.halo-product-show-more');
        const productsPerPage = this.context.brandProductsPerPage;
        const requestOptions = {
            template: {
                productListing: 'halothemes/gallery/halo-product-listing',
                sidebar: 'brand/sidebar',
                paginator: 'halothemes/gallery/halo-product-paginator',
            },
            config: {
                shop_by_brand: true,
                brand: {
                    products: {
                        limit: productsPerPage,
                    },
                },
            },
            showMore: 'brand/show-more',
        };

        this.facetedSearch = new FacetedSearch(requestOptions, (content) => {
            $productListingContainer.html(content.productListing);
            $facetedSearchContainer.html(content.sidebar);
            $paginatorContainer.html($(content.paginator).find('.pagination').children());
            $showMoreContainer.html($(content.paginator).find('.halo-product-show-more').children());

            $('body').triggerHandler('compareReset');

            if($('#product-listing-container .product').length > 0){
                haloAddOptionForProduct(this.context, 'product-listing-container');
            }

            this.showItem();
            this.showProductsPerPage();
            this.showMoreProducts();

            $('html, body').animate({
                scrollTop: 0,
            }, 100);
        }, {
            validationErrorMessages: {
                onMinPriceError,
                onMaxPriceError,
                minPriceNotEntered,
                maxPriceNotEntered,
                onInvalidPrice,
            },
        });
    }

    loadOptionForProductCard(context){
        if($('#featured-products .card').length > 0){
            haloAddOptionForProduct(context, 'featured-products');
        }

        if($('#product-listing-container .product').length > 0){
            haloAddOptionForProduct(context, 'product-listing-container');
        }
    }

    showItem() {
        var total = parseInt($('.pagination-info .total').text()),
            limit = this.getUrlParameter('limit'),
            productPerPage;

        if (limit !== undefined) {
            productPerPage = limit;
        } else{
            productPerPage = this.context.brandProductsPerPage;
        }

        var start = 1,
            end = total,
            checkLastPage = false,
            lastPage = 1;
            
        var checkLink = $(".pagination-list .pagination-item--current").next();
        var pageNotLast = lastPage - 1;
        var totalNotLast = pageNotLast * productPerPage;
        var productsLastPage = total - totalNotLast;
        var currentPage = parseInt($('.pagination-item--current > a').text());
        var prevPage = currentPage - 1;

        if (checkLink.length === 0) {
            lastPage = parseInt($(".pagination-item--current").find("a").text());
            checkLastPage = true;
        } else {
            lastPage = parseInt(checkLink.find("a").text());
            checkLastPage = false;
        }
        
        if (total <= productPerPage) {
            $('.pagination-info .start').text(start);
            $('.pagination-info .end').text(end);
        } else {
            if (currentPage <= 1) {
                end = productPerPage;
            } else {
                start = (prevPage * productPerPage) + 1;
                
                if (checkLastPage = true) {
                    if($('.pagination-list .pagination-item--next').length > 0){
                        end = totalNotLast + productsLastPage - 1;
                    } else{
                        end = totalNotLast + productsLastPage;
                    }
                } else {
                    end = currentPage * productPerPage - 1;
                }
            }

            $('.pagination-info .start').text(start);
            $('.pagination-info .end').text(end);
        }
    }

    showProductsPerPage(){
        try {
            var url = new URL(window.location.href);
            var c = url.searchParams.get("limit");
            if(c != null){
                var limit = document.querySelectorAll('select#limit option');
                Array.prototype.forEach.call(limit, function(element) {
                    if(element.value == c){
                        element.selected = true;
                    }
                });
            }
        } catch(e) {}
    }

    showMoreProducts() {
        const context = this.context;

        const getUrlParameter = this.getUrlParameter('limit');
        
        $('#listing-showmoreBtn > a').on('click', (event) => {
            event.preventDefault();

            var nextPage = $(".pagination-item--current").next(),
                link = nextPage.find("a").attr("href");

            $('#listing-showmoreBtn > a').addClass('loading');

            $.ajax({
                type: 'get',
                url: link.replace("http://", "//"),
                success: function(data) {
                    if ($(data).find('#product-listing-container .productListing').length > 0) {
                        $('#product-listing-container .productListing').append($(data).find('#product-listing-container .productListing').children());

                        $('.pagination-list').html($(data).find(".pagination-list").html());

                        $('#listing-showmoreBtn > a').removeClass('loading').blur();

                        nextPage = $(".pagination-item--current").next();

                        if (nextPage.length === 0) {
                            $('#listing-showmoreBtn > a').addClass('disable').text('No more products');
                            $('.pagination .pagination-info .end').text($('.pagination-info .total').text());
                        } else{
                            var limit = getUrlParameter,
                                productPerPage,
                                pageCurrent = parseInt($(".pagination-item--current > a").text());

                            if (limit !== undefined) {
                                productPerPage = limit;
                            } else{
                                productPerPage = context.brandProductsPerPage;
                            }

                            $('.pagination .pagination-info .end').text(parseInt(productPerPage)*pageCurrent);
                        }

                        if($(data).find('#product-listing-container .product').length > 0){
                            haloAddOptionForProduct(context, 'product-listing-container');
                        }
                    }
                }
            });
        });
    }

    getUrlParameter(sParam) {
        var sPageURL = decodeURIComponent(window.location.search.substring(1)),
            sURLVariables = sPageURL.split('&'),
            sParameterName,
            i;

        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');

            if (sParameterName[0] === sParam) {
                return sParameterName[1] === undefined ? true : sParameterName[1];
            }
        }
    }
}
