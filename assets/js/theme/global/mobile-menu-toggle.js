import _ from 'lodash';
import mediaQueryListFactory from '../common/media-query-list';

const PLUGIN_KEY = {
    CAMEL: 'mobileMenuToggle',
    SNAKE: 'mobile-menu-toggle',
};

function optionsFromData($element) {
    const mobileMenuId = $element.data(PLUGIN_KEY.CAMEL);

    return {
        menuSelector: mobileMenuId && `#${mobileMenuId}`,
    };
}

/*
 * Manage the behaviour of a mobile menu
 * @param {jQuery} $toggle
 * @param {Object} [options]
 * @param {Object} [options.headerSelector]
 * @param {Object} [options.menuSelector]
 * @param {Object} [options.scrollViewSelector]
 */
export class MobileMenuToggle {
    constructor($toggle, {
        headerSelector = '.header',
        menuSelector = '#menu',
        scrollViewSelector = '.navPages',
    } = {}) {
        this.$body = $('body');
        this.$menu = $(menuSelector);
        this.$navList = $('.navPages-list');
        this.$header = $(headerSelector);
        this.$scrollView = $(scrollViewSelector, this.$menu);
        this.$subMenus = this.$navList.find('.navPages-action');
        this.$toggle = $toggle;
        this.mediumMediaQueryList = mediaQueryListFactory('medium');

        // Auto-bind
        this.onToggleClick = this.onToggleClick.bind(this);
        this.onSubMenuClick = this.onSubMenuClick.bind(this);

        // Listen
        this.bindEvents();

        // Assign DOM attributes
        this.$toggle.attr('aria-controls', this.$menu.attr('id'));

        // Hide by default
        this.hide();
    }

    get isOpen() {
        return this.$menu.hasClass('is-open');
    }

    bindEvents() {
        this.$toggle.on('click', this.onToggleClick);
        this.$subMenus.on('click', this.onSubMenuClick);
    }

    unbindEvents() {
        this.$toggle.off('click', this.onToggleClick);
    }

    toggle() {
        if (this.isOpen) {
            this.hide();
        } else {
            this.show();
        }
    }

    show() {
        this.$body.addClass('has-activeNavPages');

        this.$toggle
            .addClass('is-open')
            .attr('aria-expanded', true);

        this.$menu
            .addClass('is-open')
            .attr('aria-hidden', false);

        this.$header.addClass('is-open');
        this.$scrollView.scrollTop(0);

        this.resetSubMenus();
    }

    hide() {
        this.$body.removeClass('has-activeNavPages');

        this.$toggle
            .removeClass('is-open')
            .attr('aria-expanded', false);

        this.$menu
            .removeClass('is-open')
            .attr('aria-hidden', true);

        this.$header.removeClass('is-open');

        this.resetSubMenus();
    }

    // Private
    onToggleClick(event) {
        event.preventDefault();

        this.toggle();
    }

    onSubMenuClick(event) {
        const $closestAction = $(event.target).parent();
        const $parentSiblings = $closestAction.siblings();
        // const $parentAction = $closestAction.closest('.navPage-subMenu-horizontal').siblings('.navPages-action');
        if (!$closestAction.hasClass('navPage-subMenu-title')) {

            if (!$closestAction.hasClass('navPages-action-end')) {
                if($closestAction.hasClass('has-dropdown')){
                    $closestAction.toggleClass('is-open');
                }
            }

            if (this.$subMenus.hasClass('is-open')) {
                this.$navList.addClass('subMenu-is-open');
            } else {
                this.$navList.removeClass('subMenu-is-open');
            }

            if ($closestAction.hasClass('is-open')) {
                $parentSiblings.addClass('is-hidden');
            }

        } else {
            const $closestAction2 = $(event.target).closest('.navPage-subMenu');
            const $parentSiblings2 = $closestAction2.parent();
            const $parentAction2 = $parentSiblings2.siblings();

            if (this.$subMenus.hasClass('is-open')) {
                this.$navList.addClass('subMenu-is-open');
            } else {
                this.$navList.removeClass('subMenu-is-open');
            }

            $parentSiblings2.removeClass('is-open');
            $parentAction2.removeClass('is-hidden');
        }
    }

    resetSubMenus() {
        this.$navList.find('.is-hidden').removeClass('is-hidden');
        this.$navList.find('.is-open').removeClass('is-open');
        this.$navList.removeClass('subMenu-is-open');
    }
}

/*
 * Create a new MobileMenuToggle instance
 * @param {string} [selector]
 * @param {Object} [options]
 * @param {Object} [options.headerSelector]
 * @param {Object} [options.menuSelector]
 * @param {Object} [options.scrollViewSelector]
 * @return {MobileMenuToggle}
 */
export default function mobileMenuToggleFactory(selector = `[data-${PLUGIN_KEY.SNAKE}]`, overrideOptions = {}) {
    const $toggle = $(selector).eq(0);
    const instanceKey = `${PLUGIN_KEY.CAMEL}Instance`;
    const cachedMobileMenu = $toggle.data(instanceKey);

    if (cachedMobileMenu instanceof MobileMenuToggle) {
        return cachedMobileMenu;
    }

    const options = _.extend(optionsFromData($toggle), overrideOptions);
    const mobileMenu = new MobileMenuToggle($toggle, options);

    $toggle.data(instanceKey, mobileMenu);

    return mobileMenu;
}
