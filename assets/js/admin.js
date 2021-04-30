import './comoponents/notice';

;(function ($) {
    const app = {
        init: () => {


            app.checkEditorDarkmode();
            app.checkOnlyDarkmode();

            //Admin Darkmode Settings Toggle
            const adminDarkmode = document.querySelector('.admin_darkmode input[type=checkbox]');
            if (adminDarkmode) {
                adminDarkmode.addEventListener('change', app.checkEditorDarkmode);
            }

            //Only Darkmode Settings Toggle
            $('.only_darkmode input[type=checkbox]').on('change', app.checkOnlyDarkmode);

            app.checkMarkdownEditor();
            $('.markdown_editor input[type=checkbox]').on('change', app.checkMarkdownEditor);

            //darkmode switch
            app.checkDarkmode();
            $('.dark-mode-switch').on('click', function () {
                $('body').toggleClass('dark-mode');

                app.checkDarkmode();

                localStorage.setItem('dark_mode_active', $('body').hasClass('dark-mode') ? 1 : 0)
            });

            //license button
            $('.button.activate-license').on('click', function () {
                $('#wpmde_license-tab').trigger('click');
            });


        },

        checkDarkmode: function () {
            const enabled = $('body').hasClass('dark-mode');

            if (enabled) {
                $('.dark-mode-switch').addClass('active');
            } else {
                $('.dark-mode-switch').removeClass('active');
            }
        },

        checkMarkdownEditor: function () {
            const checked = $('.markdown_editor input[type=checkbox]').is(':checked');

            if (checked) {
                $('.only_darkmode input[type=checkbox]').prop('checked', false).change();

                $('.productivity_sound, .new_fonts').css('display', 'revert');
            } else {
                $('.productivity_sound, .new_fonts').css('display', 'none');
            }

        },

        checkOnlyDarkmode: function () {

            const checked = $('.only_darkmode input[type=checkbox]').is(':checked');

            if (checked) {
                $('.admin_darkmode, .productivity_sound, .new_fonts').css('display', 'none');

                $('.markdown_editor input[type=checkbox]').prop('checked', false).change();
            } else {
                $('.admin_darkmode').css('display', 'revert');
            }
        },

        checkEditorDarkmode: function () {
            const checkBox = document.querySelector('.admin_darkmode input[type=checkbox]');
            if (!checkBox) {
                return;
            }
            const is_darkmode_enabled = checkBox.checked;

            if (is_darkmode_enabled) {
                if (document.querySelector('.classic_editor_darkmode')) {
                    document.querySelector('.classic_editor_darkmode').style.display = 'revert';
                }

                if (document.querySelector('.gutenberg_darkmode')) {
                    document.querySelector('.gutenberg_darkmode').style.display = 'revert';
                }
            } else {
                if (document.querySelector('.classic_editor_darkmode')) {
                    document.querySelector('.classic_editor_darkmode').style.display = 'none';
                }

                if (document.querySelector('.gutenberg_darkmode')) {
                    document.querySelector('.gutenberg_darkmode').style.display = 'none';
                }
            }
        },

    };

    document.addEventListener('DOMContentLoaded', app.init);

})(jQuery);
