export default function(context) {
    if (context.themeSettings.haloMegamenu == true) {
        $('#halo-navPages-dropdown .navPages-item').each((index, element) =>{
            if($(element).hasClass('has-megamenu')){
                var subMegaMenu = $(element).find('> .navPage-subMenu');

                if($(element).hasClass('style-3')){
                    $(element).removeClass('has-megamenu style-3 fullWidth');
                    subMegaMenu.find('.centerArea > .navPage-subMenu-list').appendTo(subMegaMenu);
                    subMegaMenu.find('.itemArea').remove();
                } else if ($(element).hasClass('style-4')){
                    $(element).removeClass('has-megamenu style-4 fullWidth');
                    subMegaMenu.find('.cateArea > .navPage-subMenu-list').appendTo(subMegaMenu);
                    subMegaMenu.find('.container').remove();
                    subMegaMenu.find('.megamenu-custom-list').remove();
                    subMegaMenu.find('.image').remove();
                } else {
                    $(element).removeClass('has-megamenu style-1 style-2 fullWidth');

                    subMegaMenu.find('.cateArea > .navPage-subMenu-list:not(.navPage-subMenu-links)').appendTo(subMegaMenu);
                    subMegaMenu.find('.cateArea').remove();
                    subMegaMenu.find('.imageArea').remove();
                }

                subMegaMenu.removeClass('haloCustomScrollbar');
            }
        });
    }
}
