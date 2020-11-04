const {render} = wp.element;

import ColorPalettes from './Color-Palettes';

import './style.scss';

document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
        appendThemeSwitch();
    }, 1);
});

function appendThemeSwitch() {
    let node = document.querySelector('.edit-post-header__toolbar');

    let newElem = document.createElement('div');
    newElem.classList.add('darkmode-theme-switch-wrapper');

    let html = `<div id="darkmodeThemeSwitch"><img id="darkmodeThemeSwitchImg" src="${darkmode.plugin_url}/block/build/images/default.png" /> <i class="darkmode-arrow down"></i> </div>`;
    html += `<div id="darkmodeColorPalettesContainer"></div> `;

    newElem.innerHTML = html;
    node.insertBefore(newElem, node.childNodes[0]);

    document.getElementById('darkmodeThemeSwitch').addEventListener('click', editorColorPalettes);
}

let themeChooseActive = false;

function editorColorPalettes() {
    themeChooseActive = !themeChooseActive;
    render(<ColorPalettes active={themeChooseActive}/>, document.getElementById('darkmodeColorPalettesContainer'));
}

