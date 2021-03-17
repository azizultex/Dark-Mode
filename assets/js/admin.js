import './comoponents/notice';

;(function () {
    const app = {
        init: () => {

            app.initDarkMode();
            app.handleExcludes();

            app.checkEditorDarkmode();
            app.checkOnlyDarkmode();

            const btnSwitch = document.querySelector('.dark-mode-switch');
            if (btnSwitch) {
                btnSwitch.addEventListener('click', app.handleSwitchToggle);
            }

            window.addEventListener('dark_mode_init', app.checkDarkMode);

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
            } else {
                document.querySelector('.admin_darkmode').style.display = 'revert';
                document.querySelector('.markdown_editor').style.display = 'revert';
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

        checkDarkMode: () => {
            document.querySelector('.dark-mode-switch').classList.toggle('active');
        },

        initDarkMode: () => {
            var is_saved = localStorage.getItem('dark_mode_active');

            if (!is_saved) {
                is_saved = 1;
            }

            var is_gutenberg = document.querySelector('body').classList.contains('block-editor-page');
            if (is_saved && is_saved != 0) {
                document.querySelector('html').classList.add('dark-mode-active');
                document.querySelector('.dark-mode-switch').classList.toggle('active');
                DarkMode.enable();
            }
        },

        handleSwitchToggle: function (e) {
            e.preventDefault();

            document.querySelector('html').classList.toggle('dark-mode-active');
            document.querySelector('.dark-mode-switch').classList.toggle('active');

            const is_saved = document.querySelector('html').classList.contains('dark-mode-active') ? 1 : 0;
            if(is_saved){
                DarkMode.enable();
            }else{
                DarkMode.disable();
            }

            localStorage.setItem('dark_mode_active', is_saved);
        },

        handleExcludes: function () {

            const elements = document.querySelectorAll('.dark-mode-ignore, .color-palette, .health-check-accordion-heading');

            if(!elements){
                return;
            }

            elements.forEach((element) => {
                element.classList.add('dark-mode-ignore');
                const children = element.querySelectorAll('*');

                children.forEach((child) => {
                    child.classList.add('dark-mode-ignore');
                })
            });
        },
    };

    document.addEventListener('DOMContentLoaded', app.init);

})();
