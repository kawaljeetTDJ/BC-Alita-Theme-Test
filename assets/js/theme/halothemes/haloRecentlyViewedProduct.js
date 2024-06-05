import utils from '@bigcommerce/stencil-utils';

export default function(context){
	if (context.themeSettings.halo_recently_viewed_products == true) {
		var view = true,
			wrapIcon = $("#halo-recently-viewed-wrap"),
			wrapList = $("#halo-recently-viewed-list");

		if(context.themeSettings.halo_recently_viewed_products_layout != 'default'){
			view = false;
		}

		var BC_Products = function() {
		    var e = {
		        howManyToShow: 3,
		        howManyToStoreInMemory: 10,
		        wrapperId: "recently-viewed-products",
		        onComplete: null
		    };
		    var t = [];
		    var n = null;
		    var r = null;
		    var i = 0;
		    var s = {
		        configuration: {
		            expires: context.themeSettings.halo_recently_viewed_products_expires_date,
		            path: "/",
		            domain: window.location.hostname
		        },
		        name: "bigcommerce_recently_viewed",
		        write: function(e) {
		            setCookie(this.name, e.join(" "), this.configuration.expires)
		        },
		        read: function() {
		            var e = [];
		            var t = getCookie(this.name);

		            if (t !== null && t != undefined){
		                e = t.split(" ")
		            }

		            return e
		        },
		        destroy: function() {
		            setCookie(this.name, null, this.configuration.expires)
		        },
		        remove: function(e){
		            var t = this.read();
		            var n = $.inArray(e, t);

		            if (n !== -1) {
		                t.splice(n, 1);
		                this.write(t)
		            }
		        }
		    };
		    var o = function() {
		    	for(var j = 0; j < e.howManyToShow; j++){
		    		var productId = t[j];
		    		jQuery('#halo-recently-viewed-tmp').find('.item[data-item-id="product-'+productId+'"]').appendTo(n);
		    	}

		    	jQuery('#halo-recently-viewed-tmp').remove();

		        n.show();

		        if (e.onComplete){
		            try {
		                e.onComplete();
		            } catch (t) {}
		        }
		    };
		    var u = function() {
		    	var tmp = jQuery('#halo-recently-viewed-tmp');
		    	const options = {
	                template: 'halothemes/popup/halo-recently-viewed-tmp',
	            };

		    	for(var j = 0; j < e.howManyToShow; j++){
		    		var productId = t[j];

		    		utils.api.product.getById(productId, options, (err, response) => {
			            if (err) {
			                return false;
			            }

			            $(response).appendTo(tmp);

			            i++;

	                	if(i >= e.howManyToShow){
	                		o();
	                	}
			        });
		    	}
		    };
		    return {
		        resizeImage: function(e, t){
		            if (t == null){
		                return e
		            }
		            if (t == "master"){
		                return e.replace(/http(s)?:/, "")
		            }
		            var n = e.match(/\.(jpg|jpeg|gif|png|bmp|bitmap|tiff|tif)(\?v=\d+)?/i);
		            if (n != null && n != undefined){
		                var r = e.split(n[0]);
		                var i = n[0];
		                return (r[0] + "_" + t + i).replace(/http(s)?:/, "")
		            } else {
		                return null
		            }
		        },
		        showRecentlyViewed: function(i){
		            var i = i || {};
		            jQuery.extend(e, i);
		            t = s.read();
		            n = jQuery("#" + e.wrapperId);
		            e.howManyToShow = Math.min(t.length, e.howManyToShow);
		            
		            if (e.howManyToShow && n.length) {
		                u()
		            }
		        },
		        getConfig: function(){
		            return e
		        },
		        clearList: function(){
		            s.destroy()
		        },
		        recordRecentlyViewed: function(t){
		            var t = t || {};
		            var product_id = $('.productView').find('form[data-cart-item-add] [name="product_id"]').val();
		            
		            jQuery.extend(e, t);
		            var n = s.read();
		            
		            if (product_id) {
		                var r = product_id;
		                var i = jQuery.inArray(r, n);
		                if (i === -1) {
		                    n.unshift(r);
		                    n = n.splice(0, e.howManyToStoreInMemory)
		                } else {
		                    n.splice(i, 1);
		                    n.unshift(r)
		                }
		                s.write(n)
		            }
		        }
		    }
		}();
		
		BC_Products.recordRecentlyViewed();

		var cookieValue = getCookie("bigcommerce_recently_viewed");

		if (!(cookieValue !== null && cookieValue !== undefined && cookieValue !== "")){
		    $('#halo-recently-viewed-popup').find(".no-products").show();
		    $('#recently-viewed-products-list').css("padding", "0");

		    if (window.innerWidth > 767 && view){
		        wrapList.addClass("is-show");
		        wrapIcon.removeClass("collapsed");
		    } else {
		        wrapIcon.addClass("collapsed");
		        wrapList.removeClass("is-show");
		    }
		} else{
			BC_Products.showRecentlyViewed({
			    howManyToShow: context.themeSettings.halo_recently_viewed_products_number,
			    howManyToStoreInMemory: context.themeSettings.halo_recently_viewed_products_number,
			    wrapperId: 'recently-viewed-products-list',
			    onComplete: function() {
			        var recentlyViewBlock = $('#halo-recently-viewed-popup'),
			        	recentlyGrid = recentlyViewBlock.find('.products-grid'),
			        	productGrid = recentlyGrid.children();

			        recentlyGrid.find(".no-products").remove();
			        
			        if (productGrid.length){
			            if (window.innerWidth > 767 && view){
			                wrapList.addClass("is-show");
			                wrapIcon.removeClass("collapsed");
			            } else {
			                wrapIcon.addClass("collapsed");
			            }

			            if (recentlyViewBlock.is(':visible')){
			            	if (window.innerWidth < 767) {
	                            if (productGrid.length > 2) {
	                                $("#halo-recently-viewed-popup").addClass("has-arrow");
	                            }
		                    } else{
		                        if (productGrid.length > 4) {
		                           $("#halo-recently-viewed-popup").addClass("has-arrow");
		                        }
		                    }

			                if (!recentlyGrid.hasClass('slick-initialized')){
			                	if (productGrid.length > 3) {
				                    recentlyGrid.slick({
				                        infinite: false,
				                        speed: 1000,
				                        slidesToShow: 3,
				                        dots: false,
				                        arrows: true,
				                        vertical: true,
				                        slidesToScroll: 1,
				                        adaptiveHeight: true,
				                        nextArrow: "<svg class='slick-next slick-arrow'><use xlink:href='#icon-chevron-down'></use></svg>", 
	        							prevArrow: "<svg class='slick-prev slick-arrow'><use xlink:href='#icon-chevron-up'></use></svg>",
				                        responsive: [
				                            {
				                                breakpoint: 768,
				                                settings: {
				                                    slidesToScroll: 1,
				                                    slidesToShow: 1
				                                }
				                            }
				                        ]
				                    });
		                        } else if (productGrid.length > 2) {
		                        	recentlyGrid.slick({
				                        infinite: false,
				                        speed: 1000,
				                        slidesToShow: 2,
				                        dots: false,
				                        arrows: true,
				                        vertical: true,
				                        slidesToScroll: 1,
				                        adaptiveHeight: true,
				                        nextArrow: "<svg class='slick-next slick-arrow'><use xlink:href='#icon-chevron-down'></use></svg>", 
	        							prevArrow: "<svg class='slick-prev slick-arrow'><use xlink:href='#icon-chevron-up'></use></svg>",
				                        responsive: [
				                            {
				                                breakpoint: 768,
				                                settings: {
				                                    slidesToScroll: 1,
				                                    slidesToShow: 1
				                                }
				                            }
				                        ]
				                    });
		                        }

			                    recentlyGrid.prepend('<div class="product-info"></div>');
			                };
			            };
			        }
			    }
			});
		}

		$(document).on("click", "[data-collapse-popup]", event => {
		    wrapList.removeClass("is-show");
		    wrapIcon.addClass("collapsed");
		});

		$(document).on("click", "[data-expand-popup]", event => {
		   	wrapList.addClass("is-show");
			wrapIcon.removeClass("collapsed");
		});
		
	    $(document).on('click', '[data-product-url]', event => {
	        if (window.innerWidth <= 768) {
	            event.preventDefault();
	        }
	    });

	    if (window.innerWidth < 768) {
	       	wrapList.removeClass("is-show");
	        wrapIcon.addClass("collapsed");
	    }

	    $('#halo-recently-viewed-popup .products-grid').on('mouseenter', '.item', event => {
	        event.preventDefault();

	        var $currTarget = $(event.currentTarget),
	            index = $currTarget.index('#halo-recently-viewed-popup .products-grid .slick-active'),
				margin_top = index * $('#halo-recently-viewed-popup .product-info').outerHeight();
	            
	        $("#halo-recently-viewed-popup .product-info").html($currTarget.find(".second-info").html()).css("margin-top", margin_top).show();
	    });

	    $('#halo-recently-viewed-popup .products-grid').on('mouseenter', '.slick-arrow', event => {
	        $("#halo-recently-viewed-popup .product-info").hide();
	    });

	    $(window).scroll(event => {
	        if ($(event.currentTarget).scrollTop() > 220) {
	            $('#halo-recently-viewed-popup').addClass("slided-up");
	        } else {
	            $('#halo-recently-viewed-popup').removeClass("slided-up");
	        };
	    });

	    $('[data-scroll-top-popup]').on('click', event => {
	        event.preventDefault();

	        $('html, body').animate({
	            scrollTop: 0
	        }, 700);
	        
	        return false;
	    });

		function setCookie(cname, cvalue, exdays) {
	    	const d = new Date();
	    	d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
	    	const expires = 'expires=' + d.toUTCString();
	    	document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/';
	   	}

	   	function getCookie(cname) {
	    	const name = cname + '=';
	    	const ca = document.cookie.split(';');

	    	for (var i = 0; i < ca.length; i++){
	        	var c = ca[i];

	         	while (c.charAt(0) === ' '){
	            	c = c.substring(1);
	         	}

	         	if (c.indexOf(name) === 0){
	            	return c.substring(name.length, c.length);
	         	}
	      	}

	      	return '';
	   	}

	   	function deleteCookie(name) {
	    	document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
	   	};
	}
}
