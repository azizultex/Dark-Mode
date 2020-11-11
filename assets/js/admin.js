;(function ($) {
    const app = {
        init: () => {

            app.initDarkMode();
            app.handleExcludes();

            const btnSwitch = document.querySelector('.dark-mode-switch');
            if (btnSwitch) {
                btnSwitch.addEventListener('click', app.handleSwitchToggle);
            }

            window.addEventListener('dark_mode_init', app.checkDarkMode);

        },

        checkDarkMode: () => {
            document.querySelector('.dark-mode-switch').classList.toggle('active');
        },

        initDarkMode: () => {
            var is_saved = localStorage.getItem('dark_mode_active');
            if (is_saved && is_saved != 0) {
                document.querySelector('html').classList.add('dark-mode-active');
                document.querySelector('.dark-mode-switch').classList.toggle('active');
            }
        },

        handleSwitchToggle: function (e) {
            e.preventDefault();

            document.querySelector('html').classList.toggle('dark-mode-active');
            document.querySelector('.dark-mode-switch').classList.toggle('active');

            const is_saved = document.querySelector('html').classList.contains('dark-mode-active') ? 1 : 0;
            localStorage.setItem('dark_mode_active', is_saved);
        },

        handleExcludes: function () {

            const elements = document.querySelectorAll('.dark-mode-ignore, .color-palette');

            console.log(elements)

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
