import _ from 'lodash';
import haloUnistallMegaMenu from './haloUnistallMegaMenu';

export default function(context) {
    function initNavPagesDropdown() {
        if (context.themeSettings.haloMenuResize == true) {
            const $main = $('#halo-menu-resize');
            const $toggle = $main.children('.navPages-item-toggle');
            const $dropdown = $('#halo-navPages-dropdown');

            const resize = () => {
                if (!$toggle.is('.u-hiddenVisually')) {
                    $toggle.before($dropdown.children());
                    $toggle.addClass('u-hiddenVisually');
                }

                if ($(window).width() <=1024) {
                    return;
                }

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
            };

            $(window).on('resize', _.debounce(resize, 200));

            resize();
        }
    }
    initNavPagesDropdown();
}
