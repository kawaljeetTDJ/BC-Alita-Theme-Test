import haloUnistallMegaMenu from './haloUnistallMegaMenu';

export default function(context) {
    const $body = $('body');
    
    function header_sticky() {
        var header_height,
            sticky = $('.header-sticky');
            
        header_height = sticky.height();

        if (sticky.length) {
            header_scroll(header_height, sticky);
        }
    }

    function header_scroll(header_height, sticky) {
        $(window).on('scroll load', function() {
            var scroll = $(window).scrollTop();

            if (scroll > header_height) {
                sticky.addClass('is-sticky');
                $body.addClass('stickyNavigation');

                if(!sticky.hasClass('header-transparent')){
                    if($body.hasClass('has-stickyToolbar')){
                        $body.css('padding-top', header_height + $('.page-listing .halo-toolbar').height());
                    } else{
                        $body.css('padding-top', header_height);
                    }
                }
            } else {
                sticky.removeClass('is-sticky');
                $body.removeClass('stickyNavigation');

                if(!sticky.hasClass('header-transparent')){
                    $body.css('padding-top', 0);
                }
            }

            if ($(window).width() > 1024) {
                if (context.themeSettings.haloMenuResize == true) {
                    const $main = $('#halo-menu-resize');
                    const $toggle = $main.children('.navPages-item-toggle');
                    const $dropdown = $('#halo-navPages-dropdown');

                    do {
                        const $lastItem = $main.children('.navPages-item:not(:last-child):last');

                        const lastItemRight = Math.round($lastItem.offset().left - $main.offset().left + $lastItem.width());
                        const mainWidth = Math.round($main.width());

                        if ($dropdown.children().length > 0) {
                            if($toggle.length > 0){
                                const toggleRight = Math.round($toggle.offset().left - $main.offset().left + $toggle.width());

                                if (toggleRight > mainWidth) {
                                    $dropdown.prepend($lastItem);
                                    haloUnistallMegaMenu(context);
                                } else {
                                    break;
                                }
                            }
                        } else if (lastItemRight > mainWidth) {
                            $dropdown.prepend($lastItem);
                            $toggle.removeClass('u-hiddenVisually');
                            haloUnistallMegaMenu(context);
                        } else {
                            break;
                        }
                    } while (true);
                }
            }
        });
    }

    header_sticky();
}
