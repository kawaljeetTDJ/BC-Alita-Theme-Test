import jqueryCookie from 'jquery.cookie';
import utils from '@bigcommerce/stencil-utils';
const fetch = require('node-fetch');

export default function(context) {
    const token = context.token;

    function recentlyBought() {
        var productIDs = context.themeSettings.recently_bought_productID,
            hoursItems = context.themeSettings.recently_bought_hours,
            listHours = JSON.parse("[" + hoursItems + "]"),
            listIDs = JSON.parse("[" + productIDs + "]"),
            info = context.themeSettings.recently_bought_text_info,
            text = context.themeSettings.recently_bought_text_name,
            changeSlides = 1000*(Number(context.themeSettings.recently_bought_changeSlides));

        var customerName1 = context.themeSettings.recently_bought_customer_name1,
            customerName2 = context.themeSettings.recently_bought_customer_name2,
            customerName3 = context.themeSettings.recently_bought_customer_name3,
            customerName4 = context.themeSettings.recently_bought_customer_name4,
            customerName5 = context.themeSettings.recently_bought_customer_name5;

        setInterval(function(){
            var item = (Math.floor(Math.random()*listIDs.length)),
                list = [];

            list.push(listIDs[item].toString());

            $('.halo-recently-bought').hide();

            var customerNameList = Array(customerName1,customerName2,customerName3,customerName4,customerName5),
                customerNameItem = (Math.floor(Math.random()*customerNameList.length)),
                customerName = customerNameList[customerNameItem],
                hourItem = (Math.floor(Math.random()*listHours.length)),
                hours = listHours[hourItem];

            if ($.cookie('recently_bought_notification') == 'closed') {
                $('#halo-recently-bought-popup').remove();
            }

            $(document).on('click', '#halo-recently-bought-list [data-close-recently-bought]', event => {
                event.preventDefault();
                
                $('#halo-recently-bought-popup').remove();
                $.cookie('recently_bought_notification', 'closed', {expires:1, path:'/'});
            });

            if( $('#halo-item-rb-'+ listIDs[item]).length) {
                $('#halo-item-rb-'+ listIDs[item]).show().css('animation-name','fadeIn');
            } else {
                getProduct(list).then(data => {
                    renderProduct(data.site.products.edges, text, hours, info, customerName);
                });
            }

            setTimeout(function(){ 
                $('#halo-item-rb-'+ listIDs[item]).hide();
            }, changeSlides);
        }, changeSlides); 
    }

    function getProduct(arr) {
      return fetch('/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({
          query: `
            query MyQuery {
                site {
                    products (entityIds: [`+arr+`]) {
                      edges {
                        product: node {
                          ...ProductFields
                          }
                        }
                    }
                }
            }
            fragment ProductFields on Product {
                id
                entityId
                name
                path
                defaultImage {
                    img90px: url(width: 90)
                    altText
                }
            }
        `}),
    }).then(res => res.json())
       .then(res => res.data);
    }

    function renderProduct(product, text, hours, info, customer) {
        var item = product.map(node => node.product);

        if(item.length > 0){
            var html = '<div id="halo-item-rb-'+item[0].entityId+'" class="halo-recently-bought">\
                <a href="#" data-close-recently-bought><svg class="icon"><use xlink:href="#icon-close"></use></svg></a>\
                <div class="recently-bought-inner">\
                    <a class="product-image" href="'+item[0].path+'"><img data-sizes="auto" src="'+item[0].defaultImage.img90px+'" alt="'+item[0].defaultImage.altText+'" title="'+item[0].defaultImage.altText+'"></a>\
                    <div class="product-info">\
                        <p class="text" style="-webkit-box-orient: vertical;">'+text+' <a href="'+item[0].path+'" class="product-name">'+item[0].name+'</a></p>\
                        <div class="info">'+hours+' '+info+' '+customer+'</div>\
                    </div>\
                </div>\
            </div>';
            
            $('#halo-recently-bought-list').append(html);
            $('#halo-item-rb-'+item[0].entityId).show().css('animation-name','fadeIn');
        }
    }

    if ($(window).width() > 1024) {
        if (context.themeSettings.haloRecentlyBought == true) {
            recentlyBought();
        } 
    } else {
        if(context.themeSettings.haloRecentlyBought == true && context.themeSettings.haloRecentlyBought_mobile == true) {
            recentlyBought();
        }
    }
}
