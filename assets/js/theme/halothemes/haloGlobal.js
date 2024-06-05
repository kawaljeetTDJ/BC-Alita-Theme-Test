import datepicker from 'js-datepicker';
import utils from '@bigcommerce/stencil-utils';
import { defaultModal } from '../global/modal';

export default function(context, productId){
    function authSidebar() {
        if (!$('body').hasClass('page-type-login')) {
            $('[data-login-form]').on('click', event => {
                event.preventDefault();

                if($('.halo-auth-sidebar').hasClass('is-open')){
                    $('.halo-auth-sidebar').removeClass('is-open');
                    $('body').removeClass('openAuthSidebar');
                } else{
                    $('.halo-auth-sidebar').addClass('is-open');
                    $('body').addClass('openAuthSidebar');
                }
            });
        } else {
            $('[data-login-form]').on('click', event => {
                event.preventDefault();

                $('html, body').animate({
                    scrollTop: $('.login').offset().top,
                }, 700);
            });
        }

        $('.halo-auth-sidebar .halo-sidebar-header .close').on('click', event =>{
            event.preventDefault();

            $('.halo-auth-sidebar').removeClass('is-open');
            $('body').removeClass('openAuthSidebar');
        });

        $(document).on('click', event => {
            if ($('.halo-auth-sidebar').hasClass('is-open')) {
                if (($(event.target).closest('.halo-auth-sidebar').length === 0) && ($(event.target).closest('[data-login-form]').length === 0)){
                    $('.halo-auth-sidebar').removeClass('is-open');
                    $('body').removeClass('openAuthSidebar');
                }
            }
        });
    }
    authSidebar();

    function footerMobileToggle(){
        $('.footer-info-col--mobile .footer-info-heading').on('click', event => {
            $('.footer-info-col--mobile .footer-info-heading').not($(event.currentTarget)).removeClass('is-clicked');

            if($(event.currentTarget).hasClass('is-clicked')){
                $(event.currentTarget).removeClass('is-clicked');
            } else{
                $(event.currentTarget).addClass('is-clicked');
            }

            $('.footer-info-col--mobile').each((index, element) => {
                if($('.footer-info-heading', element).hasClass('is-clicked')){
                    $(element).find('.footer-info-wrapper').slideDown("slow");
                } else{
                    $(element).find('.footer-info-wrapper').slideUp("slow");
                }
            });
        });
    }
    footerMobileToggle();

    function activeMenuMobile() {
        $('.halo-menu-sidebar .halo-sidebar-close').on('click', event => {
            event.preventDefault();

            if ($('body').hasClass('has-activeNavPages')) {
                $('.mobileMenu-toggle').trigger('click');
            }
        });

        $(document).on('click', event => {
            if ($('body').hasClass('has-activeNavPages')) {
                if (($(event.target).closest('.halo-menu-sidebar').length === 0) && ($(event.target).closest('.mobileMenu-toggle').length === 0)){
                    $('.mobileMenu-toggle').trigger('click');
                }
            }
        });

        var $menuPc = $('.halo-bottomHeader .navPages-list:not(.navPages-list--user)'),
            $menuMobile = '#halo-menu-sidebar .navPages-list:not(.navPages-list--user)';

        if ($(window).width() <= 1024) {
            $('.mobileMenu-toggle').on('click', event => {
                if ($menuPc.length) {
                    $menuPc.children().appendTo($menuMobile);
                }
            });
        }
    }
    activeMenuMobile();

    function hoverMenu(){
        if ($(window).width() > 1024) {
            if ($('.navPages-list:not(.navPages-list--user)').length) {
                $('.navPages-list:not(.navPages-list--user)').on('mouseover', event => {
                    $('body').addClass('openMenuPC');
                })
                .on('mouseleave', event => {
                    $('body').removeClass('openMenuPC');
                });
            }
        }
    } 
    hoverMenu();

    function searchFormMobile() {
        if ($(window).width() <= 1024) {
            if ($('.halo-search-box #quickSearch').length) {
                $('#quickSearch').appendTo('#halo-search-sidebar .halo-sidebar-wrapper');
            }
        } else {
            if (!$('.halo-search-box #quickSearch').length) {
                $('#halo-search-sidebar #quickSearch').appendTo('.halo-search-box .container');
            }
        }
    }
    searchFormMobile();

    function askAnExpert(context, productId){
        var message;

        if(!$('body').hasClass('page-type-product')){
            $('.ask-an-expert-link').on('click', event => {
                event.preventDefault();

                const $options = {
                    template: 'halothemes/halo-ask-an-expert-content'
                };

                const modal = defaultModal();

                modal.$modal.removeClass().addClass('modal modal--standard halo-ask-an-expert');
                modal.open();

                utils.api.getPage('/', $options, (err, response) => {
                    modal.updateContent(response);
                });
            });
        } else if($('body').hasClass('page-type-product')){
            $('.ask-an-expert-link').on('click', event => {
                event.preventDefault();

                const $options = {
                    template: 'halothemes/halo-ask-an-expert-content'
                };

                const modal = defaultModal();

                modal.$modal.removeClass().addClass('modal modal--standard halo-ask-an-expert');
                modal.open();

                utils.api.product.getById(productId, $options, (err, response) => {
                    modal.updateContent(response);
                });
            });
        }

        $(document).on('change', '#term-ask', event => {
            if($("#term-ask:checked").length){
                $('#halo-ask-an-expert-button').attr('disabled', false);
            } else{
                $('#halo-ask-an-expert-button').attr('disabled', true);
            }
        });

        $(document).on('click', '#halo-ask-an-expert-button', event => {
            var ask_proceed = true,
                subjectMail = context.themeSettings.halo_ask_an_expert_subject_mail,
                mailTo = context.themeSettings.halo_ask_an_expert_mailto,
                customerName = $('#halo-ask-an-expert-form input[name=customer_name]').val(),
                customerMail = $('#halo-ask-an-expert-form input[name=customer_email]').val(),
                customerPhone = $('#halo-ask-an-expert-form input[name=customer_phone]').val(),
                typeContact = $('#halo-ask-an-expert-form input[name=type_contact]:checked').val(),
                typePackage = $('#halo-ask-an-expert-form input[name=type_package]:checked').val(),
                customerMessage = $('#halo-ask-an-expert-form textarea[name=comment_area]').val();

            if(!$('body').hasClass('page-type-product')){
                message = "<div style='border: 1px solid #e6e6e6;padding: 30px;max-width: 500px;margin: 0 auto;'>\
                                <h2 style='margin-top:0;margin-bottom:30px;color: #000000;'>"+ subjectMail +"</h2>\
                                <p style='border-bottom: 1px solid #e6e6e6;padding-bottom: 23px;margin-bottom:25px;color: #000000;'>You received a new message from your online store's ask an expert form.</p>\
                                <table style='width:100%;'>\
                            <tr><td style='padding-right: 10px;vertical-align: top;width:50%;'><strong>Customer Name: </strong></td><td>" + customerName + "</td></tr>\
                            <tr><td style='padding-right: 10px;vertical-align: top;width:50%;'><strong>Email Address: </strong></td><td>" + customerMail + "</td></tr>\
                            <tr><td style='padding-right: 10px;vertical-align: top;width:50%;'><strong>Phone Number: </strong></td><td>" + customerPhone + "</td></tr>\
                            <tr><td style='padding-right: 10px;vertical-align: top;width:50%;'><strong>How would you like me to contact you? </strong></td><td>" + typeContact + "</td></tr>\
                            <tr><td style='padding-right: 10px;vertical-align: top;width:50%;'><strong>Do you need: </strong></td><td>" + typePackage + "</td></tr>\
                            <tr><td style='padding-right: 10px;vertical-align: top;width:50%;'><strong>What can i help you with today? </strong></td><td>" + customerMessage + "</td></tr>\
                        </table></div>";
            } else if($('body').hasClass('page-type-product')){
                var img = $('.halo-ask-an-expert [data-product-image]').attr('data-product-image'),
                    title =  $('.halo-ask-an-expert [data-product-title]').attr('data-product-title'),
                    sku = $('.halo-ask-an-expert [data-product-sku]').attr('data-product-sku'),
                    url = $('.halo-ask-an-expert [data-product-url]').attr('data-product-url');


                message = "<div style='border: 1px solid #e6e6e6;padding: 30px;max-width: 500px;margin: 0 auto;'>\
                                <h2 style='margin-top:0;margin-bottom:30px;color: #000000;'>"+ subjectMail +"</h2>\
                                <p style='border-bottom: 1px solid #e6e6e6;padding-bottom: 23px;margin-bottom:25px;color: #000000;'>You received a new message from your online store's ask an expert form.</p>\
                                <table style='width:100%;'>\
                                <tr>\
                                    <td style='border-bottom: 1px solid #e6e6e6;padding-bottom: 25px;margin-bottom:25px;width:50%;'><img style='width: 100px' src='"+img+"' alt='"+title+"' title='"+title+"'></td><td style='border-bottom: 1px solid #e6e6e6;padding-bottom: 25px;margin-bottom:25px;'>"+sku+" <br><a href='"+url+"'>"+title+"</a></td>\
                                </tr>\
                            <tr><td style='padding-right: 10px;vertical-align: top;width:50%;'><strong>Customer Name: </strong></td><td>" + customerName + "</td></tr>\
                            <tr><td style='padding-right: 10px;vertical-align: top;width:50%;'><strong>Email Address: </strong></td><td>" + customerMail + "</td></tr>\
                            <tr><td style='padding-right: 10px;vertical-align: top;width:50%;'><strong>Phone Number: </strong></td><td>" + customerPhone + "</td></tr>\
                            <tr><td style='padding-right: 10px;vertical-align: top;width:50%;'><strong>How would you like me to contact you? </strong></td><td>" + typeContact + "</td></tr>\
                            <tr><td style='padding-right: 10px;vertical-align: top;width:50%;'><strong>Do you need: </strong></td><td>" + typePackage + "</td></tr>\
                            <tr><td style='padding-right: 10px;vertical-align: top;width:50%;'><strong>What can i help you with today? </strong></td><td>" + customerMessage + "</td></tr>\
                        </table></div>";
            }
      
            $("#halo-ask-an-expert-form input[required], #halo-ask-an-expert-form textarea[required]").each((index, el) => {
                if (!$.trim($(el).val())) {
                    $(el).parent('.form-field').removeClass('form-field--success').addClass('form-field--error');
                    ask_proceed = false;
                } else {
                    $(el).parent('.form-field').removeClass('form-field--error').addClass('form-field--success');
                }

                var email_reg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;

                if ($(el).attr("name") == "customer_email" && !email_reg.test($.trim($(el).val()))) {
                    $(el).parent('.form-field').removeClass('form-field--success').addClass('form-field--error');
                    ask_proceed = false;
                }
            });

            if (ask_proceed) {
                var ask_post_data = {
                    "api": "i_send_mail",
                    "subject": subjectMail,
                    "from_name": customerName,
                    "email": mailTo,
                    "email_from": customerMail,
                    "message": message
                };

                $.post('https://themevale.net/tools/sendmail/quotecart/sendmail.php', ask_post_data, (response) => {
                    if (response.type == 'error') {
                        var output = '<div class="alertBox alertBox--error"><p class="alertBox-message">' + response.text + '</p></div>';
                    } else {
                        var output = '<div class="alertBox alertBox--success"><p class="alertBox-message">Thank you. We\'ve received your feedback and will respond shortly.</p></div>';
                        $("#halo-ask-an-expert-form  input[required], #halo-ask-an-expert-form textarea[required]").val('');
                        $("#halo-ask-an-expert-form").hide();
                    }
                    $("#halo-ask-an-expert-results").hide().html(output).show();
                }, 'json');
            }
        });
    }
    askAnExpert(context, productId);

    function bookingForm(context){
        $('[data-book-an-appointment]').on('click', event => {
            event.preventDefault();

            const $options = {
                template: 'halothemes/halo-book-an-appointment'
            };

            const url = context.urls.cart;

            const modal = defaultModal();

            modal.$modal.removeClass().addClass('modal modal--standard halo-booking');
            modal.open();

            utils.api.getPage(url, $options, (err, response) => {
                modal.updateContent(response);

                const date_1 = datepicker('#customer_date1'),
                    date_2 = datepicker('#customer_date2');
            });
        });

        $(document).on('change', '#term-ask-booking', event => {
            if($("#term-ask-booking:checked").length){
                $('#halo-booking-button').attr('disabled', false);
            } else{
                $('#halo-booking-button').attr('disabled', true);
            }
        });

        $(document).on('click', '#halo-booking-button', event => {
            var ask_proceed = true,
                subjectMail = context.themeSettings.halo_book_an_appointment_subject_mail,
                mailTo = context.themeSettings.halo_book_an_appointment_mailto,
                customerName1 = $('#halo-booking-form input[name=customer_name1]').val(),
                customerName2 = $('#halo-booking-form input[name=customer_name2]').val(),
                customerMail = $('#halo-booking-form input[name=customer_email1]').val(),
                customerPhone = $('#halo-booking-form input[name=customer_phone1]').val(),
                customerCountry = $.trim($('#halo-booking-form select[name=customer_country]').find('option:selected').text()),
                customerState = $('#halo-booking-form input[name=customer_state]').val(),
                customerDate1 = $('#halo-booking-form input[name=customer_date1]').val(),
                customerDate2 = $('#halo-booking-form input[name=customer_date2]').val(),
                typeContact = $('#halo-booking-form input[name=type_contact1]:checked').val(),
                customerMessage = $('#halo-booking-form textarea[name=comment_area1]').val();

            var message = "<div style='border: 1px solid #e6e6e6;padding: 30px;max-width: 500px;margin: 0 auto;'>\
                                <h2 style='margin-top:0;margin-bottom:30px;color: #000000;'>"+ subjectMail +"</h2>\
                                <p style='border-bottom: 1px solid #e6e6e6;padding-bottom: 23px;margin-bottom:25px;color: #000000;'>You received a new message from your online store's ask an expert form.</p>\
                                <table style='width:100%;'>\
                            <tr><td style='padding-right: 10px;vertical-align: top;width:50%;'><strong>Name: </strong></td><td>" + customerName1 + "</td></tr>\
                            <tr><td style='padding-right: 10px;vertical-align: top;width:50%;'><strong>Last Name: </strong></td><td>" + customerName2 + "</td></tr>\
                            <tr><td style='padding-right: 10px;vertical-align: top;width:50%;'><strong>Email Address: </strong></td><td>" + customerMail + "</td></tr>\
                            <tr><td style='padding-right: 10px;vertical-align: top;width:50%;'><strong>Phone Number: </strong></td><td>" + customerPhone + "</td></tr>\
                            <tr><td style='padding-right: 10px;vertical-align: top;width:50%;'><strong>Country: </strong></td><td>" + customerCountry + "</td></tr>\
                            <tr><td style='padding-right: 10px;vertical-align: top;width:50%;'><strong>Province/State: </strong></td><td>" + customerState + "</td></tr>\
                            <tr><td style='padding-right: 10px;vertical-align: top;width:50%;'><strong>Appointment: </strong></td><td>" + customerDate1 + "</td></tr>\
                            <tr><td style='padding-right: 10px;vertical-align: top;width:50%;'><strong>Wedding: </strong></td><td>" + customerDate2 + "</td></tr>\
                            <tr><td style='padding-right: 10px;vertical-align: top;width:50%;'><strong>How would you like me to contact you? </strong></td><td>" + typeContact + "</td></tr>\
                            <tr><td style='padding-right: 10px;vertical-align: top;width:50%;'><strong>Comment </strong></td><td>" + customerMessage + "</td></tr>\
                        </table></div>";
      
            $("#halo-booking-form input[required], #halo-booking-form textarea[required], #halo-booking-form select[required]").each((index, el) => {
                if (!$.trim($(el).val())) {
                    $(el).parent('.form-field').removeClass('form-field--success').addClass('form-field--error');
                    ask_proceed = false;
                } else {
                    $(el).parent('.form-field').removeClass('form-field--error').addClass('form-field--success');
                }

                var email_reg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;

                if ($(el).attr("name") == "customer_email1" && !email_reg.test($.trim($(el).val()))) {
                    $(el).parent('.form-field').removeClass('form-field--success').addClass('form-field--error');
                    ask_proceed = false;
                }
            });

            if (ask_proceed) {
                var ask_post_data = {
                    "api": "i_send_mail",
                    "subject": subjectMail,
                    "from_name": customerName1 + customerName2,
                    "email": mailTo,
                    "email_from": customerMail,
                    "message": message
                };

                $.post('https://themevale.net/tools/sendmail/quotecart/sendmail.php', ask_post_data, (response) => {
                    if (response.type == 'error') {
                        var output = '<div class="alertBox alertBox--error"><p class="alertBox-message">' + response.text + '</p></div>';
                    } else {
                        var output = '<div class="alertBox alertBox--success"><p class="alertBox-message">Thank you. We\'ve received your feedback and will respond shortly.</p></div>';
                        $("#halo-booking-form  input[required], #halo-booking-form textarea[required]").val('');
                        $("#halo-booking-form").hide();
                    }
                    $("#halo-booking-results").hide().html(output).show();
                }, 'json');
            }
        }); 
    }
    bookingForm(context);

    function clickSubLinksMenu(){
        $(document).on('click', '.halo-menu-megamenu .navPage-subMenu-links .navPages-action', event => {
            if($(event.target).hasClass('has-subMenu')){
                event.preventDefault();
                $(event.target).parent('.navPage-subMenu-item-child').addClass('is-open');
                $(event.target).parents('.navPage-subMenu-links').siblings().addClass('is-hidden');
            }
        });

        $(document).on('click', '.halo-menu-megamenu .navPage-subMenu-links .navPage-subMenu-title .navPages-action', event => {
            event.preventDefault();

            $(event.target).parents('.navPage-subMenu-item-child.is-open').removeClass('is-open');
            $(event.target).parents('.navPage-subMenu-links').siblings().removeClass('is-hidden');
        });
    }
    clickSubLinksMenu();

    function backToTop() {
        var offset = $(window).height()/2;
        const backToTop = $('#haloBackToTop');

        $(window).scroll(event => {
            ($(event.currentTarget).scrollTop() > offset) ? backToTop.addClass('is-visible') : backToTop.removeClass('is-visible');
        });

        backToTop.on('click', event => {
            event.preventDefault();

            $('body,html').animate({
                scrollTop: 0
            }, 1000);
        });
    }
    backToTop();

    function addWishList() {
        $('.card .card-wishlist').on('click', event => {
            event.preventDefault();

            var $this_wl = $(event.currentTarget),
                url_awl = $this_wl.attr('href');

            $.post(url_awl).done(() => {
                window.location.href = url_awl;
            });
        });
    }
    addWishList();

    function checkCookiesPopup() {
        if ($('#consent-manager').length) {
            var height = $('#consent-manager').height();
            $('body').css('padding-bottom',height);
        }
        if ($('#consent-manager-update-banner').length) {
            var height = $('#consent-manager-update-banner').height();
            $('body').css('padding-bottom',height);
        }
    }
    checkCookiesPopup();

    $(window).resize(function() {
        var $menuPc = '.halo-bottomHeader .navPages-list:not(.navPages-list--user)',
            $menuMobile = $('#halo-menu-sidebar .navPages-list:not(.navPages-list--user)');

        if ($(window).width() > 1024) {
            if($menuMobile.length){
                $menuMobile.children().prependTo($menuPc);
            }

            if ($('body').hasClass('has-activeNavPages')) {
                $('.mobileMenu-toggle').trigger('click');
            }
        } else {
            if ($menuPc.length) {
                $menuMobile.append($($menuPc).children());
            }
        }

        searchFormMobile();
    });
}
