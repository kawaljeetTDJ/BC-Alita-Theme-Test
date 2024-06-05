import 'focus-within-polyfill';
import './global/jquery-migrate';
import './common/select-option-plugin';
import PageManager from './page-manager';
import quickSearch from './global/quick-search';
import currencySelector from './global/currency-selector';
import mobileMenuToggle from './global/mobile-menu-toggle';
import foundation from './global/foundation';
import quickView from './global/quick-view';
import cartPreview from './global/cart-preview';
import privacyCookieNotification from './global/cookieNotification';
import adminBar from './global/adminBar';
import carousel from './common/carousel';
import loadingProgressBar from './global/loading-progress-bar';
import svgInjector from './global/svg-injector';
import haloGlobal from './halothemes/haloGlobal';
import haloStickyHeader from './halothemes/haloStickyNavigation';
import haloResizeMenu from './halothemes/haloResizeMenu';
import haloRecentlyBoughtPopup from './halothemes/haloRecentlyBoughtPopup';
import RecentlyViewedProduct from './halothemes/haloRecentlyViewedProduct';
import haloNewsletterPopup from './halothemes/haloNewsletterPopup';
import haloAjaxAddToCart from './halothemes/haloAjaxAddToCart';
import haloQuickShop from './halothemes/haloQuickShop';
import haloBeforeYouLeave from './halothemes/haloBeforeYouLeave';
import haloAjaxLogin from './halothemes/haloAjaxLogin';
import haloMegaMenu from './halothemes/haloMegaMenu';
    window.haloMegaMenu = haloMegaMenu;

export default class Global extends PageManager {
    onReady() {
        const {
            channelId, cartId, productId, categoryId, secureBaseUrl, maintenanceModeSettings, adminBarLanguage, showAdminBar,
        } = this.context;
        if (!$('body').hasClass('page-type-cart')) {
            cartPreview(secureBaseUrl, cartId, this.context);
        }
        if (!$('body').hasClass('page-type-login')) {
            haloAjaxLogin();
        }
        quickSearch(this.context);
        currencySelector(cartId);
        foundation($(document));
        quickView(this.context);
        carousel();
        mobileMenuToggle();
        privacyCookieNotification();
        if (showAdminBar) {
            adminBar(secureBaseUrl, channelId, maintenanceModeSettings, JSON.parse(adminBarLanguage), productId, categoryId);
        }
        loadingProgressBar();
        svgInjector();
        haloGlobal(this.context, this.context.productId);
        haloStickyHeader(this.context);
        haloResizeMenu(this.context);
        haloNewsletterPopup(this.context);
        haloRecentlyBoughtPopup(this.context);
        RecentlyViewedProduct(this.context);
        haloAjaxAddToCart(this.context);
        haloQuickShop(this.context);
        haloBeforeYouLeave(this.context);
    }
}
