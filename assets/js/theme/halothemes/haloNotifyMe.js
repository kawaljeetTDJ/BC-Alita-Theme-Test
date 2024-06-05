import nod from '../common/nod';
import forms from '../common/models/forms';
import { Validators } from '../common/form-utils';

export default function($scope, context){
    const $notify = $scope.find('.productView-notifyMe'),
        $notifyForm = $scope.find('.productView-notifyMe-form'),
        $notifyBtn = $notifyForm.find('.button'),
        $notifyCheck = $notifyForm.find('input[type="checkbox"]'),
        $notifyText = $scope.find('.productView-notifyMe-text');

    registerNotifyMeValidation($notifyForm);

    function registerNotifyMeValidation($notifyForm) {
        const notifyModel = forms;
        const notifyValidator = nod({
            submit: $notifyForm.find('.button'),
        });

        notifyValidator.add([
            {
                selector: $notifyForm.find('input[name="email"]'),
                validate: (cb, val) => {
                    const result = notifyModel.email(val);

                    cb(result);
                },
                errorMessage: 'Please use a valid email address, such as john@example.com.',
            },
        ]);

        $notifyCheck.on('change', event => {
            if($(event.currentTarget).is(':checked')){
                $notifyBtn.attr('disabled', false);
            } else{
                $notifyBtn.attr('disabled', true);
            }
        });

        $notifyBtn.on('click', event => {
            notifyValidator.performCheck();

            if (notifyValidator.areAll('valid')){
                sendMail($notifyForm);
            }
        });
    }

    function sendMail($notifyForm){
        var email = $notifyForm.find('input[name="email"]').val(),
            site = '',
            logo = '',
            subjectMail = context.themeSettings.halo_notify_me_subject,
            mailTo = context.themeSettings.halo_notify_me_mailto,
            productName = $notify.data('product-title'),
            productUrl = $notify.data('product-url');

        if($(".header-logo").find("img").length > 0){
            site = $(".header-logo").find("img").attr("title");
            logo = $(".header-logo").html() + '<br><br>';
        } else{
            site = $(".header-logo").text();
        }

        var content = '<div style="margin:30px auto;width:650px;border:10px solid #f7f7f7"><div style="border:1px solid #dedede">\
                    <h2 style="margin: 0; padding:20px 20px 20px;background:#f7f7f7;color:#555;font-size:2em;text-align:center;">'+logo+subjectMail+'</h2>';

        content += '<table style="margin:0px 0 0;padding:30px 30px 30px;line-height:1.7em">\
                  <tr><td style="padding: 5px 25px 5px 0;"><strong>Product Name:</strong> ' + productName + '</td></tr>\
                  <tr><td style="padding: 5px 25px 5px 0;"><strong>Product URL:</strong> ' + productUrl + '</td></tr>\
                  <tr><td style="padding: 5px 25px 5px 0;"><strong>Email Request:</strong> ' + email + '</td></tr>\
               </table>';

        content += '<a href="'+ window.location.hostname +'" style="display:block;padding:30px 0;background:#484848;color:#fff;text-decoration:none;text-align:center">&nbsp;'+site+'&nbsp;</a>';
        content += '</div></div>';

        var notify_post_data = {
            'api': 'i_send_mail',
            'subject': subjectMail,
            'email': mailTo,
            'from_name': 'BigCommerce',
            'email_from': email,
            'message': content
        };

        var output = '';

        $.post('https://themevale.net/tools/sendmail/quotecart/sendmail.php', notify_post_data, (response) => {
            if (response.type == 'error') {
               output = '<div class="alertBox alertBox--error"><p class="alertBox-column alertBox-message">' + response.text + '</p></div>';
            } else {
               output = '<div class="alertBox alertBox--success"><p class="alertBox-column alertBox-message">Thank you. We\'ve received your request and will respond shortly.</p></div>';
               resetForm($notifyForm);
            }

            $notifyText.html(output).show();
        }, 'json');
    }

    function resetForm($notifyForm){
        $('.form-field', $notifyForm).removeClass('form-field--success form-field--error');
        $('.form-inlineMessage', $notifyForm).hide().html('');
        $('input[type=email]', $notifyForm).val('');
    }
}
