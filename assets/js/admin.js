import './comoponents/notice';

;(function ($) {
    const app = {
        init: () => {

            app.blockSettings();

            //darkmode switch
            app.checkDarkmode();
            $('.dark-mode-switch').on('click', function () {
                $('body').toggleClass('dark-mode');

                app.checkDarkmode();

                localStorage.setItem('dark_mode_active', $('body').hasClass('dark-mode') ? 1 : 0)
            });

        },

        blockSettings: () => {
            $('.only_darkmode, .markdown_editor, .productivity_sound').addClass('disabled');
        },

        checkDarkmode: function () {
            const enabled = $('body').hasClass('dark-mode');

            if (enabled) {
                $('.dark-mode-switch').addClass('active');
            } else {
                $('.dark-mode-switch').removeClass('active');
            }
        },

    };

    document.addEventListener('DOMContentLoaded', app.init);

})(jQuery);
