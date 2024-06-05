export default function() {
    const $productListing = $('#product-listing-container .productListing'),
        $gridMobile = $('#grid-view-mobile'),
        $listMobile = $('#list-view-mobile'),
        $viewAsBtn = $('#view_as');

    $viewAsBtn.on('change', event => {
        var $toggle = $(event.currentTarget).val();

        if($toggle == 'grid'){
            setTimeout(function(){ 
                $gridMobile.addClass('current-view');
                $listMobile.removeClass('current-view');
                $productListing.removeClass('productList').addClass('productGrid');
            }, 300);
        } else if($toggle == 'list'){
            setTimeout(function(){ 
                $listMobile.addClass('current-view');
                $gridMobile.removeClass('current-view');
                $productListing.removeClass('productGrid').addClass('productList');
            }, 300);
        }
    });

    $listMobile.on('click', event => {
        if(!$listMobile.hasClass('current-view')){
            $listMobile.addClass('current-view');

            setTimeout(function(){
                $viewAsBtn.val('list'); 
                $gridMobile.removeClass('current-view');
                $productListing.removeClass('productGrid').addClass('productList');
            }, 300);
        }
   });

    $gridMobile.on('click', event => {
        if(!$gridMobile.hasClass('current-view')){
            $gridMobile.addClass('current-view');

            setTimeout(function(){
                $viewAsBtn.val('grid');  
                $listMobile.removeClass('current-view');
                $productListing.removeClass('productList').addClass('productGrid');
            }, 300);
        }
    });
}
