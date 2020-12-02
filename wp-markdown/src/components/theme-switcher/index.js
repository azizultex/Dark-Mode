/*global WPMD_Settings*/

/**
 * External dependencies
 */
import {assign, get, map, merge} from 'lodash';
/**
 * Internal dependencies
 */
import defaults from '../theme-editor/default';
import EditorThemes from '../theme-editor/editor-themes';
import ThemeEditor from '../theme-editor';
import icons from '../icons';
import {assignVariables} from './variables';
import difference from './utils/difference';
/**
 * WordPress dependencies
 */
import {__} from '@wordpress/i18n';
import {compose} from '@wordpress/compose';
import {addQueryArgs} from '@wordpress/url';
import {withDispatch, withSelect} from '@wordpress/data';
import {Component, Fragment, render} from '@wordpress/element';
import {Button, Dropdown, MenuGroup, MenuItem, Tooltip, withSpokenMessages,} from '@wordpress/components';

import BackToGutenberg from '../back-to-gutenberg';
import GetProBanner from '../get-pro-banner';


class ThemeSwitcher extends Component {
    constructor() {
        super(...arguments);
        this.updateState = this.updateState.bind(this);
        this.addControl = this.addControl.bind(this);
        this.onSelect = this.onSelect.bind(this);
        this.onEditTheme = this.onEditTheme.bind(this);
        this.onExitEditTheme = this.onExitEditTheme.bind(this);
        this.loadConfig = this.loadConfig.bind(this);

        this.state = {
            isOpen: false,
            theme: '',
            themeSettings: {},
            isEditorThemeLoaded: false,
            isEditingTheme: false,
            isEditingTypography: false,
        };
    }

    componentDidMount() {
        this.setState({themeSettings: this.props.themeSettings});
        this.addControl();
    }

    componentDidUpdate() {
        const {themeSettings} = this.props;

        // Wait for settings to load
        if (typeof themeSettings.theme === 'undefined') {
            return false;
        }

        if (Object.keys(this.state.themeSettings).length < 1) {
            this.setState({themeSettings});
        }

        if (!this.state.isEditorThemeLoaded && Object.keys(this.state.themeSettings).length > 1) {
            this.setState({isEditorThemeLoaded: true});
        }

        this.addControl();

        const markdownButton = document.querySelector('.components-markdown-theme-switcher__trigger');

        if (markdownButton && this.props.isEnabled) {
            markdownButton.style.visibility = '';
        }

        // Update switcher color
        if (markdownButton && this.state.themeSettings.theme === 'custom') {
            markdownButton.querySelector('.components-markdown-theme-switcher__palette')
                .style.backgroundImage = `linear-gradient(130deg,${
                typeof EditorThemes[this.state.theme] !== 'undefined'
                    ? EditorThemes[this.state.theme].colors.background
                    : this.state.themeSettings.colors.background
            } 48.75%, ${
                typeof EditorThemes[this.state.theme] !== 'undefined'
                    ? EditorThemes[this.state.theme].colors.accent
                    : this.state.themeSettings.colors.accent
            } 50%)`;
        }
    }

    updateState(key, value) {
        this.setState({[key]: value});
    }

    addControl() {

        const {isActive, updateThemeSettings, postType} = this.props;
        let {themeSettings} = this.state;

        // Wait for settings to load
        if (typeof themeSettings.theme === 'undefined') {
            return false;
        }

        // Wait for post type information
        if (typeof postType === 'undefined') {
            return false;
        }

        if (typeof themeSettings.colors === 'undefined') {
            themeSettings = assign(
                {colors: {background: '#444', accent: '#111'}},
                themeSettings
            );
        }

        if (!this.state.theme) {
            this.setState({theme: themeSettings.theme});
        }


        const onRequestClose = (event) => {
            const closeButton = document.querySelector('.components-markdown-theme-switcher__trigger');

            const editorWrapper = document.querySelector('.block-editor-writing-flow');

            if (closeButton && event && !event.relatedTarget.classList.contains('components-markdown-theme-switcher__trigger')) {
                closeButton.click();
            } else if (typeof event === 'undefined') {
                closeButton.click();
            }

            document.body.classList.remove('is-editing-theme');
            editorWrapper.classList.remove('is-editing-theme');

            // Hide when Theme Switcher is disabled
            if (!this.props.isEnabled) {
                const markdownButton = document.querySelector('.components-markdown-theme-switcher__trigger');
                if (markdownButton) {
                    markdownButton.style.visibility = 'hidden';
                }
            }

            this.setState({isEditingTypography: false});
            updateThemeSettings(this.state.themeSettings);
        };

        const ButtonControls = () => {
            return (
                <Fragment>
                    <Tooltip
                        text={__('Back to all ' + get(postType, ['labels', 'name'], 'Posts').toLowerCase(), 'dark-mode')}
                    >
                        <Button
                            className="components-markdown-back-to"
                            onClick={() => {
                                window.location.href = addQueryArgs(
                                    'edit.php',
                                    {
                                        post_type: postType.slug,
                                    }
                                );
                            }}
                        >
                            {icons.caretDown}
                        </Button>
                    </Tooltip>

                    <Dropdown
                        className="components-markdown-theme-switcher__dropdown"
                        label={__('Change heading level', 'dark-mode')}
                        contentClassName="components-markdown-popover components-markdown-theme-switcher__content"
                        popoverProps={{
                            role: 'menu',
                            onFocusOutside: (event) => {
                                onRequestClose(event);
                            },
                            onClose: (event) => {
                                onRequestClose(event);
                            },
                        }}
                        position="bottom left"
                        renderToggle={({isOpen, onToggle}) => (
                            <Button
                                onClick={() => {

                                    // if (!WPMD_Settings.is_pro) {
                                    //     return;
                                    // }

                                    const editorWrapper = document.querySelector('.block-editor-writing-flow');

                                    if (!isOpen) {
                                        document.body.classList.add('is-editing-theme');
                                        editorWrapper.classList.add('is-editing-theme');
                                    } else {
                                        document.body.classList.remove('is-editing-theme');
                                        editorWrapper.classList.remove('is-editing-theme');
                                    }

                                    onToggle();
                                    this.onExitEditTheme(onToggle);
                                }}

                                //disabled={!WPMD_Settings.is_pro}

                                className={`components-markdown-theme-switcher__trigger ${!WPMD_Settings.is_pro ? 'disabled' : ''}`}
                                className={`components-markdown-theme-switcher__trigger`}
                            >
								<span className="components-markdown-theme-switcher__palette"
                                    style={{
                                        backgroundImage: `linear-gradient(130deg,${
                                            typeof EditorThemes[this.state.theme] !== 'undefined'
                                                ? EditorThemes[this.state.theme].colors.background
                                                : this.state.themeSettings.colors.background
                                        } 48.75%, ${
                                            typeof EditorThemes[this.state.theme] !== 'undefined'
                                                ? EditorThemes[this.state.theme].colors.accent
                                                : this.state.themeSettings.colors.accent
                                        } 50%)`,
                                    }}
                                ></span>

                                {icons.caretDown}
                            </Button>
                        )}

                        renderContent={({onToggle}) => (
                            <Fragment>
                                {!this.state.isEditingTheme &&
                                !this.state.isEditingTypography ? (
                                    <Fragment>
                                        <MenuGroup>
                                            {map(EditorThemes, (theme, key) => {
                                                    if ('custom' !== key) {
                                                        return (
                                                            <MenuItem
                                                                key={key}
                                                                onClick={() => {
                                                                    if(!WPMD_Settings.is_pro && ('default' !== key && 'pumpkin-spice' !== key)){
                                                                        document.querySelector('.components-markdown-gopro').classList.remove('components-markdown-gopro-hidden');
                                                                    } else {
                                                                        this.onSelect(key, onToggle);
                                                                    }
                                                                }}
                                                                className={!WPMD_Settings.is_pro && ('default' !== key && 'pumpkin-spice' !== key) && 'disabled'}
                                                            >
                                                                <Fragment>

                                                                    <span
                                                                        className="components-markdown-theme-switcher__palette"
                                                                        style={{
                                                                            backgroundImage: `linear-gradient(130deg,${theme.colors.background} 48.75%, ${theme.colors.accent} 50%)`,
                                                                        }}
                                                                    ></span>

                                                                    <span>{theme.name}</span>

                                                                    {this.state.theme === key ? icons.checkMark : null}

                                                                    {!WPMD_Settings.is_pro && ('default' !== key && 'pumpkin-spice' !== key) &&
                                                                    <span className={'wp-markdown-pro-badge'}>PRO</span>}
                                                                </Fragment>
                                                            </MenuItem>
                                                        );
                                                    }
                                                }
                                            )}

                                            <MenuItem
                                                key="custom"
                                                onClick={() => {
                                                    if(!WPMD_Settings.is_pro){
                                                        document.querySelector('.components-markdown-gopro').classList.remove('components-markdown-gopro-hidden');
                                                    } else {
                                                        this.onEditTheme(onToggle, 'isEditingTheme');
                                                        this.onSelect('custom', onToggle);
                                                    }
                                                }}
                                                className={!WPMD_Settings.is_pro && 'disabled'}
                                            >
                                                <Fragment>
													<span
                                                        className="components-markdown-theme-switcher__palette"
                                                        style={{
                                                            backgroundImage: `linear-gradient(130deg,${this.state.themeSettings.colors.background} 48.75%, ${this.state.themeSettings.colors.accent} 50%)`,
                                                        }}
                                                    ></span>

                                                    <span>{__('Custom', 'dark-mode')}</span>

                                                    {
                                                        WPMD_Settings.is_pro ?
                                                            this.state.theme === 'custom' || typeof EditorThemes[this.state.theme] === 'undefined' ? icons.checkMark : icons.color
                                                            : <span className={'wp-markdown-pro-badge'}>PRO</span>
                                                    }


                                                </Fragment>
                                            </MenuItem>

                                        </MenuGroup>

                                        <MenuGroup>
                                            <MenuItem
                                                className="components-markdown-theme-switcher__typography"
                                                onClick={() => {
                                                    if(!WPMD_Settings.is_pro){
                                                        document.querySelector('.components-markdown-gopro').classList.remove('components-markdown-gopro-hidden');
                                                    } else {
                                                        this.onEditTheme(onToggle, 'isEditingTypography');
                                                    }
                                                }}
                                                className={!WPMD_Settings.is_pro && 'disabled'}
                                            >
                                                <span>✎ {__('Edit typography', 'dark-mode')}</span>
                                                {WPMD_Settings.is_pro ? icons.typography :
                                                    <span className={'wp-markdown-pro-badge'}>PRO</span>}
                                            </MenuItem>
                                        </MenuGroup>

                                        {!WPMD_Settings.is_pro &&
                                        <MenuGroup
                                        className="components-menu-group__get-pro"
                                        >
                                            <MenuItem
                                                className="components-markdown-theme-switcher__get-pro"
                                            >
                                                <span>{__('Unlock all features now.', 'dark-mode')} <a href="https://wppool.dev/wp-markdown-editor" target={'_blank'} className={'wp-markdown-get-pro-btn'}>{__('Get PRO', 'dark-mode')}</a> </span>
                                            </MenuItem>
                                        </MenuGroup>
                                        }

                                    </Fragment>
                                ) : (
                                    <ThemeEditor
                                        onToggle={onToggle}
                                        loadConfig={this.loadConfig}
                                        isEditingTheme={
                                            this.state.isEditingTheme
                                        }
                                        isEditingTypography={
                                            this.state.isEditingTypography
                                        }
                                        updateState={this.updateState}
                                        themeSettings={
                                            this.state.themeSettings
                                        }
                                        onClose={() => {
                                            this.setState({
                                                isEditingTheme: false,
                                                isEditingTypography: false,
                                            });
                                            this.onExitEditTheme(onToggle);
                                        }}
                                    />
                                )}
                            </Fragment>
                        )}
                    />
                    <BackToGutenberg/>
                    {!WPMD_Settings.is_pro && <GetProBanner/>}
                </Fragment>
            );
        };

        const wrapper = document.querySelector('.edit-post-header__toolbar');

        if (!wrapper.classList.contains('markdown-additional-controls') && isActive) {
            wrapper.classList.add('markdown-additional-controls');
            wrapper.insertAdjacentHTML('afterbegin', '<div id="components-markdown-theme-switcher"></div>');

            render(<ButtonControls/>, document.getElementById('components-markdown-theme-switcher'));
        } else if (wrapper.classList.contains('markdown-additional-controls') && !isActive) {
            document.getElementById('components-markdown-theme-switcher').remove();
            wrapper.classList.remove('markdown-additional-controls');
        }
    }

    onEditTheme(onToggle, type) {
        const wrapper = document.querySelector('.components-markdown-theme-switcher__content');
        const editorWrapper = document.querySelector('.block-editor-writing-flow');

        this.setState({[type]: true});
        onToggle();

        setTimeout(function () {
            wrapper.classList.add('is-editing-theme');
            editorWrapper.classList.add('is-editing-theme');

            document.querySelector('.components-markdown-theme-switcher__trigger').click();
        }, 25);

        // focus manually to fix closing outside bug
        document.querySelector('.components-markdown-theme-switcher__content .components-popover__content').focus();

        // Save theme settings
        this.props.updateThemeSettings(this.state.themeSettings);
    }

    onExitEditTheme() {
        this.setState({isEditingTheme: false});
    }

    onSelect(theme, onToggle) {


        const {themeSettings} = this.state;
        this.setState({theme});

        let assignedSettings = themeSettings;

        if (typeof themeSettings.isDefault !== 'undefined' && themeSettings.isDefault) {
            // assignedSettings = EditorThemes[ theme ];
            assignedSettings = merge({}, assignedSettings, {
                isDefault: true,
                theme,
            });
        } else {
            const settingsDiff = difference(themeSettings,
                typeof EditorThemes[themeSettings.theme] !== 'undefined' ? EditorThemes[themeSettings.theme] : {}
            );

            // if ( typeof settingsDiff.name === 'undefined' ) {
            assignedSettings = merge(
                {},
                theme === 'custom' ? themeSettings : EditorThemes[theme],
                settingsDiff
            );
            delete assignedSettings.isDefault;
            delete assignedSettings.theme;

            assignedSettings = assign({isDefault: theme === 'custom' ? false : true}, assignedSettings);
            // }
        }

        this.loadConfig(theme, assignedSettings, true);

        onToggle();

        if (theme !== 'custom') {
            setTimeout(function () {
                document.querySelector('.components-markdown-theme-switcher__trigger').click();
            }, 25);
        }

        // update theme settings
        delete assignedSettings.theme;

        const settings = assign({theme}, assignedSettings);
        this.setState({themeSettings: settings});
    }

    loadConfig(theme = '', updatedSettings = {}) {
        const {themeSettings} = this.state;

        if (!theme) {
            theme = themeSettings.theme;
        }

        if (typeof EditorThemes[theme] === 'undefined' && theme !== 'custom') {
            // theme = 'default';
        }

        // Merge values from defaults, settings and theme editor
        let assignedSettings;

        if (typeof EditorThemes[theme] !== 'undefined') {
            assignedSettings = EditorThemes[theme];
        } else {
            assignedSettings = themeSettings;
        }

        const temporaryMerger = merge({}, themeSettings, updatedSettings);

        if (typeof temporaryMerger.isDefault !== 'undefined' && temporaryMerger.isDefault) {
            let mergeTypography = merge(
                assignedSettings.typography,
                themeSettings.typography
            );

            if (Object.keys(updatedSettings).length > 1) {
                mergeTypography = merge(
                    mergeTypography.typography,
                    updatedSettings.typography
                );
            }

            delete assignedSettings.typography;

            assignedSettings = merge(
                {typography: mergeTypography},
                assignedSettings
            );

            // Prevent error from happening
            // if( typeof assignedSettings.typography === 'undefined' ){
            // 	delete assignedSettings.typography;

            // 	assignedSettings = assign(
            // 		{ typography: EditorThemes[ 'dark-mode' ].typography },
            // 		assignedSettings
            // 	);
            // }
        } else {
            assignedSettings = merge({}, assignedSettings, themeSettings);
            assignedSettings = merge({}, assignedSettings, updatedSettings);
        }

        // merge defaults to add missing values
        assignedSettings = merge({}, defaults, assignedSettings);

        assignVariables(assignedSettings);
    }

    render() {
        const {themeSettings} = this.props;

        // Wait for settings to load
        if (typeof themeSettings.theme === 'undefined') {
            return false;
        }

        if (!this.state.isEditorThemeLoaded && Object.keys(this.state.themeSettings).length > 1) {
            this.loadConfig(themeSettings.theme);
        }

        return false;
    }
}

export default compose([

    withSelect((select) => {
        const {getThemeSettings} = select('markdown-settings');
        const {getCurrentPostType} = select('core/editor');
        const {getPostType} = select('core');

        return {
            themeSettings: getThemeSettings(),
            postType: getPostType(getCurrentPostType()),
        };
    }),

    withDispatch((dispatch) => {
        const {setThemeSettings} = dispatch('markdown-settings');

        return {
            updateThemeSettings(settings) {
                setThemeSettings(settings);
            },
        };
    }),

    withSpokenMessages,

])(ThemeSwitcher);
