import utils from '@bigcommerce/stencil-utils';

export default function(context){
	const $beforeLeave = $('#halo-leave-sidebar');

	if (context.themeSettings.halobeforeyouleave == true) {
		beforeYouLeave();
	} 

   	var BC_Products = function() {
	    var e = {
	        howManyToShow: 3,
	        howManyToStoreInMemory: 10,
	        onComplete: null
	    };

	    var t = [];
	    var n = null;
	    var r = null;
	    var i = 0;

	    var s = {
	        configuration: {
	            expires: context.themeSettings.before_you_leave_history_expires_date,
	            path: "/",
	            domain: window.location.hostname
	        },
	        name: "bigcommerce_history",
	        write: function(e) {
	            setCookie(this.name, e.join(" "), this.configuration.expires)
	        },
	        read: function() {
	            var e = [];
	            var t = getCookie(this.name);
	            if (t !== null && t != undefined) {
	                e = t.split(" ")
	            }
	            return e
	        },
	        destroy: function() {
	            setCookie(this.name, null, this.configuration.expires)
	        },
	        remove: function(e) {
	            var t = this.read();
	            var n = $.inArray(e, t);
	            if (n !== -1) {
	                t.splice(n, 1);
	                this.write(t)
	            }
	        }
	    };

	    var o = function() {
	        if (e.onComplete) {
	            try {
	                e.onComplete()
	            } catch (t) {}
	        }
	    };

	    var u = function() {
	    	const $option = {
	            template: 'halothemes/sidebar/halo-before-you-leave-tmp'
	        };

			var unique = (function(t){
				var m = {}, unique = []
			  	
			  	for (var i=0; i<t.length; i++) {
			    	var v = t[i];
			    	
			    	if (!m[v]) {
			      		unique.push(v);
			      		m[v]=true;
			    	}
			  	}

			  	return unique;
			})(t);

			const limit = context.themeSettings.before_you_leave_product_count;

	        var count = unique.length,
	        	$tab = $beforeLeave.find('#tab-history');

	        if($tab.length) {
	        	$tab.find('.product-slider').empty();

		    	for (var j = 0; j < e.howManyToShow; j++) {
		    		var $prodId = unique[j];

		    		utils.api.product.getById($prodId, $option, (err, response) => {
			            if (err) {
			                return false;
			            }

			            if ($tab.find('.product').length < limit){
			            	$tab.find('.product-slider').append(response);
			            }

			            i++;

	                	if(i >= e.howManyToShow){
	                		$tab.find('.no-products').remove();
	                	}
			        });
		    	}
		    }

		    $beforeLeave.find('.tab.history .count').text(count);
	    };

	    return {
	        showHistory: function(i) {
	            var i = i || {};
	            jQuery.extend(e, i);
	            t = s.read();
	            e.howManyToShow = Math.min(t.length, e.howManyToShow);
	            
	            if (e.howManyToShow) {
	                u();
	            }
	        },

	        getConfig: function() {
	            return e
	        },

	        clearList: function() {
	            s.destroy();
	        },

	        recordHistory: function(t) {
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

	function ProductsCarousel(tab) {
		if(!tab.hasClass('slick-slider')) {
			if(tab.find('.card').length > 0){
		        tab.slick({
		            dots: true,
		            arrows: true,
		            slidesToShow: 1,
		            slidesToScroll: 1,
		            slidesPerRow: 1,
	                rows: 3,
		            infinite: false,
		            adaptiveHeight: true,
		            nextArrow: "<svg class='slick-next slick-arrow slick-arrow-large'><use xlink:href=#slick-arrow-next3></use></svg>", 
	                prevArrow: "<svg class='slick-prev slick-arrow slick-arrow-large'><use xlink:href=#slick-arrow-prev3></use></svg>"
		        });
			}
	    }
	}

    function beforeYouLeave() {
        var beforeYouLeave_time = $beforeLeave.data("time");
        var beforeYouLeave = $beforeLeave;
        var idleTime = 0;

        if (!$(beforeYouLeave).length) {
            return;
        } else{
        	setTimeout(function() {
        		recommendedProducts();
        		historyProducts();
            }, beforeYouLeave_time/2 + 100);

            var slickInterval = setInterval(function() {
            	timerIncrement();
            }, beforeYouLeave_time);
	        
	        $(document).on('mousemove keydown scroll', event => {
	        	resetTimer();
	        });

	        $(document).on('click', '#halo-leave-sidebar .halo-sidebar-close', event => {
	        	event.preventDefault();

	            $('body').removeClass('openBeforeYouLeave');
	        });

	        $('#halo-leave-sidebar .before-you-leave-tab .tab').on('click', event => {
				var tabId= $(event.currentTarget).data('id'),
					tab = $beforeLeave.find('#tab-'+tabId+' .product-slider');

					if(tab.find('.card').length > 0){
						if(!tab.hasClass('slick-initialized')){
				    		ProductsCarousel(tab);
						} else{
							tab.get(0).slick.setPosition();
							tab.slick('refresh');
						}
					}
		    });

		    $(document).on('click', event => {
	            if ($('body').hasClass('openBeforeYouLeave')) {
	                if ($(event.target).closest('.halo-leave-sidebar').length === 0){
	                    $('body').removeClass('openBeforeYouLeave');
	                }
	            }
	        });

	        $(document).on('click', '.before-you-leave-search [data-search-leave]', event => {
	        	event.preventDefault();

	        	var $beforeLeaveSearch = $('.before-you-leave-search');

	            $beforeLeaveSearch.toggleClass('is-open');

	            if($beforeLeaveSearch.hasClass('is-open')){
	            	$beforeLeaveSearch.siblings().addClass('is-hidden');
	            	$('#search_query2').trigger('click');
	            	$beforeLeave.find('.tabs-contents').addClass('is-hidden');
	            	$('#quickSearch .quickSearchResults').appendTo($beforeLeaveSearch);
	            	$('#quickSearch .quickSearchResultsCustom').appendTo($beforeLeaveSearch);
	            } else{
	            	$beforeLeaveSearch.find('.quickSearchResults').appendTo('#quickSearch');
	            	$beforeLeaveSearch.find('.quickSearchResultsCustom').appendTo('#quickSearch');
	            	$beforeLeaveSearch.siblings().removeClass('is-hidden');
	            	$beforeLeave.find('.tabs-contents').removeClass('is-hidden');
	            }
	        });
        }
        
        function timerIncrement() {
            idleTime = idleTime + 1;

            if (idleTime >= 1 && !$('body.openBeforeYouLeave').length) {
            	var tab = $beforeLeave.find('.tabs-contents .tab-content.is-active .product-slider');

            	ProductsCarousel(tab);
            	$('body').addClass('openBeforeYouLeave');
            }
        }

        function resetTimer() {
            idleTime = -1;
        }

        function recommendedProducts() {
        	const $options = {
	            template: 'halothemes/sidebar/halo-before-you-leave-tmp'
	        };

            var productIDS = context.themeSettings.before_you_leave_recommended_id,
            	listIDs = JSON.parse("[" + productIDS + "]"),
            	list = listIDs.slice(0,parseInt(context.themeSettings.before_you_leave_product_count));

            var $tab = $('#halo-leave-sidebar #tab-recommended');

            if ($tab.length) {
            	for (var i = 0; i < list.length; i++) {
	                var $prodId = list[i];

	                if($prodId != undefined){
	                   	utils.api.product.getById($prodId, $options, (err, response) => {
				            if(err){
				                return false;
				            }

				            var hasProduct = $(response).find('.card-link').attr('href');

				            if(hasProduct !== undefined && hasProduct !== null && hasProduct !== ''){

					            if ($tab.find('.product').length < list.length){
					            	if($tab.find('.product-slider').hasClass('slick-initialized')) {
					            		$tab.find('.product-slider').slick('unslick');
					            		$tab.find('.product-slider').append(response);
					            	} else{
					            		$tab.find('.product-slider').append(response);
					            	}

					            	ProductsCarousel($tab.find('.product-slider'));
					            }
					        }

	            			$beforeLeave.find('.tab.recommended .count').text(list.length);
				        });
				    }
                }
            }
        }

        function historyProducts(){
        	BC_Products.recordHistory();

        	var cookieValue = getCookie("bigcommerce_history");

        	if (!(cookieValue !== null && cookieValue !== undefined && cookieValue !== "")) {
			    $beforeLeave.find('.tab.history .count').text("0");
			} else{
				BC_Products.showHistory({
				    howManyToShow: context.themeSettings.before_you_leave_product_count,
				    howManyToStoreInMemory: context.themeSettings.before_you_leave_product_count,
				    onComplete: function() {}
				});
			}
        }
    }

    function setCookie(cname, cvalue, exdays) {
    	const d = new Date();
      	d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
      	const expires = 'expires=' + d.toUTCString();
      	document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/';
   	}

   	function getCookie(cname) {
    	const name = cname + '=';
      	const ca = document.cookie.split(';');

      	for (var i = 0; i < ca.length; i++) {
        	var c = ca[i];
        	while (c.charAt(0) === ' ') {
            	c = c.substring(1);
         	}
         	if (c.indexOf(name) === 0) {
            	return c.substring(name.length, c.length);
         	}
      	}
      	return '';
   	}

   	const deleteCookie = function(name) {
    	document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
   	};
}
