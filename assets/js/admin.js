import './comoponents/notice';

;(function () {
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
            const onlyDarkmode = document.querySelector('.only_darkmode input[type=checkbox]');
            if (onlyDarkmode) {
                onlyDarkmode.addEventListener('change', app.checkOnlyDarkmode);
            }

        },

        checkOnlyDarkmode: function () {
            const checkBox = document.querySelector('.only_darkmode input[type=checkbox]');
            if (!checkBox) {
                return;
            }
            const is_darkmode_enabled = checkBox.checked;

            if (is_darkmode_enabled) {
                document.querySelector('.admin_darkmode').style.display = 'none';
                document.querySelector('.markdown_editor').style.display = 'none';
                document.querySelector('.productivity_sound').style.display = 'none';
                document.querySelector('.new_fonts').style.display = 'none';
            } else {
                document.querySelector('.admin_darkmode').style.display = 'revert';
                document.querySelector('.markdown_editor').style.display = 'revert';
                document.querySelector('.productivity_sound').style.display = 'revert';
                document.querySelector('.new_fonts').style.display = 'revert';
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

})();
