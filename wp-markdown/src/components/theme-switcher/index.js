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
import Music from '../music';

import {createHooks} from '@wordpress/hooks';

window.wpmdeHooks = createHooks();

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
            isMusic: false,
            is_pro: wpmdeHooks.applyFilters('is_wpmde_pro', false),
    };

    }

    componentDidMount() {
        const {theme} = this.props.themeSettings;

        if (typeof theme !== 'undefined' && 'default' !== theme) {
            document.querySelector('html').classList.add('darkmode-theme');
        } else {
            document.querySelector('html').classList.remove('darkmode-theme');
        }

        this.setState({themeSettings: this.props.themeSettings});
        this.addControl();
    }

    componentDidUpdate() {

        const {themeSettings, isActive, isMarkdown} = this.props;

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


        const {isActive, toggleEditor, isEnabled, isMarkdown, toggleText, updateThemeSettings, postType} = this.props;

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

                                className={`components-markdown-theme-switcher__trigger ${!this.state.is_pro ? 'disabled' : ''}`}
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

                                {this.state.isMusic ?
                                    <Fragment>
                                        <MenuGroup
                                            className="components-markdown-music"
                                        >
                                            <Music/>
                                        </MenuGroup>

                                        <MenuGroup>
                                            <MenuItem
                                                className="components-markdown-exit-music"
                                                onClick={() => {
                                                    this.onExitMusic(onToggle);
                                                }}>
                                                <span>Back</span>

                                                <svg fill="none" viewBox="0 0 22 22" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true" focusable="false"><path clip-rule="evenodd" d="m6.25349 10.0667 2.55709-2.87673-1.12112-.99655-4.13649 4.65358 4.16672 4.1667 1.06066-1.0607-2.38634-2.3863h7.35799c.535 0 .8778.1787 1.1287.4378.2723.2812.479.7039.6218 1.2398.2599.9747.2542 2.0879.2504 2.8331-.0005.0848-.0009.1649-.0009.2394l1.5-.0002c0-.0662.0006-.1413.0012-.2242.0052-.7258.0146-2.0493-.3013-3.2345-.1779-.6673-.4753-1.3617-.9937-1.897-.5397-.5572-1.2741-.8942-2.2062-.8942z" fill="currentColor" fill-rule="evenodd"></path></svg>
                                            </MenuItem>
                                        </MenuGroup>
                                    </Fragment>
                                    : !this.state.isEditingTheme && !this.state.isEditingTypography ? (
                                        <Fragment>
                                            <MenuGroup>
                                                {map(EditorThemes, (theme, key) => {
                                                        if ('custom' !== key) {
                                                            return (
                                                                <MenuItem
                                                                    key={key}
                                                                    onClick={() => {

                                                                        if (!this.state.is_pro && ('default' !== key && 'darkmode' !== key)) {
                                                                            document.querySelector('.components-markdown-gopro').classList.remove('components-markdown-gopro-hidden');
                                                                        } else {
                                                                            this.onSelect(key, onToggle);
                                                                        }


                                                                    }}
                                                                    className={!this.state.is_pro && ('default' !== key && 'darkmode' !== key) && 'disabled'}
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

                                                                        {!this.state.is_pro && ('default' !== key && 'darkmode' !== key) &&
                                                                        <span className={'wp-markdown-pro-badge'}>PRO</span>}
                                                                    </Fragment>
                                                                </MenuItem>
                                                            );
                                                        }
                                                    })}

                                                <MenuItem
                                                    key="custom"
                                                    onClick={() => {
                                                        if (!this.state.is_pro) {
                                                            document.querySelector('.components-markdown-gopro').classList.remove('components-markdown-gopro-hidden');
                                                        } else {
                                                            this.onEditTheme(onToggle, 'isEditingTheme');
                                                            this.onSelect('custom', onToggle);
                                                        }
                                                    }}
                                                    className={!this.state.is_pro && 'disabled'}
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
                                                            this.state.is_pro ?
                                                                this.state.theme === 'custom' || typeof EditorThemes[this.state.theme] === 'undefined' ? icons.checkMark : icons.color
                                                                :
                                                                <span className={'wp-markdown-pro-badge'}>PRO</span>
                                                        }


                                                    </Fragment>
                                                </MenuItem>

                                            </MenuGroup>

                                            <MenuGroup>
                                                <MenuItem
                                                    className="components-markdown-theme-switcher__typography"
                                                    onClick={() => {
                                                        if (!this.state.is_pro) {
                                                            document.querySelector('.components-markdown-gopro').classList.remove('components-markdown-gopro-hidden');
                                                        } else {
                                                            this.onEditTheme(onToggle, 'isEditingTypography');
                                                        }
                                                    }}
                                                    className={!this.state.is_pro && 'disabled'}
                                                >
                                                    <span>✎ {__('Edit typography', 'dark-mode')}</span>
                                                    {this.state.is_pro ? icons.typography :
                                                        <span className={'wp-markdown-pro-badge'}>PRO</span>}
                                                </MenuItem>
                                            </MenuGroup>

                                            <MenuGroup>
                                                <MenuItem
                                                    className="components-markdown-edit-music"
                                                    onClick={() => {
                                                        this.onEditMusic(onToggle)
                                                    }}>
                                                    <svg id="wp-markdown-music" style={{
                                                        width: 15,
                                                        height: 15
                                                    }} enable-background="new 0 0 415.963 415.963" viewBox="0 0 415.963 415.963" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="m328.712 264.539c12.928-21.632 21.504-48.992 23.168-76.064 1.056-17.376-2.816-35.616-11.2-52.768-13.152-26.944-35.744-42.08-57.568-56.704-16.288-10.912-31.68-21.216-42.56-35.936l-1.952-2.624c-6.432-8.64-13.696-18.432-14.848-26.656-1.152-8.32-8.704-14.24-16.96-13.76-8.384.576-14.88 7.52-14.88 15.936v285.12c-13.408-8.128-29.92-13.12-48-13.12-44.096 0-80 28.704-80 64s35.904 64 80 64 80-28.704 80-64v-186.496c24.032 9.184 63.36 32.576 74.176 87.2-2.016 2.976-3.936 6.176-6.176 8.736-5.856 6.624-5.216 16.736 1.44 22.56 6.592 5.888 16.704 5.184 22.56-1.44 4.288-4.864 8.096-10.56 11.744-16.512.384-.448.737-.928 1.056-1.472z"/>
                                                        <g/>
                                                        <g/>
                                                        <g/>
                                                        <g/>
                                                        <g/>
                                                        <g/>
                                                        <g/>
                                                        <g/>
                                                        <g/>
                                                        <g/>
                                                        <g/>
                                                        <g/>
                                                        <g/>
                                                        <g/>
                                                        <g/>
                                                    </svg>
                                                    <span>Music</span>
                                                </MenuItem>
                                            </MenuGroup>

                                            <MenuGroup>
                                                <MenuItem
                                                    className="components-markdown-mode-toggle"
                                                    onClick={() => {
                                                        toggleEditor();
                                                        onToggle();
                                                    }}>

                                                    <svg width="60" height="27" viewBox="0 0 83 37" fill="none" xmlns="http://www.w3.org/2000/svg" style={{
                                                        borderRadius: '5px',
                                                        boxShadow: '0px 0px 3px #666'
                                                    }}>
                                                        <g clip-path="url(#clip0)">
                                                            <path d="M0 4.82332C0 2.16888 2.16888 0 4.82332 0H78.1767C80.8311 0 83 2.16888 83 4.82332V31.4002C83 34.0546 80.8311 36.2235 78.1767 36.2235H4.82332C2.16888 36.2559 0 34.087 0 31.4325V4.82332Z" fill="#0591E5"/>
                                                            <path d="M0 4.82332C0 2.16888 2.16888 0 4.82332 0H31.8857C34.5402 0 36.709 2.16888 36.709 4.82332V31.4002C36.709 34.0546 34.5402 36.2235 31.8857 36.2235H4.82332C2.16888 36.2559 0 34.087 0 31.4325V4.82332Z" fill="white"/>
                                                            <path d="M75.9431 19.5199V12.6572H72.0585V19.5199H69.7601L74.0008 24.408L78.2414 19.5199H75.9431Z" fill="white"/>
                                                            <path d="M41.1116 24.3756C41.9209 24.3756 42.5683 23.6958 42.5683 22.8865C42.5683 22.0772 41.9209 21.3974 41.1116 21.3974C40.3023 21.3974 39.6872 22.0772 39.6872 22.8865C39.6872 23.6958 40.3023 24.3756 41.1116 24.3756Z" fill="white"/>
                                                            <path d="M44.0897 24.2785H46.8412V19.0991C46.8412 18.225 47.3268 17.6747 48.0713 17.6747C48.8159 17.6747 49.2367 18.1603 49.2367 19.0343V24.2785H51.8588V19.0667C51.8588 18.1927 52.312 17.6424 53.0565 17.6424C53.8334 17.6424 54.2543 18.1279 54.2543 19.0343V24.2785H57.0058V18.3222C57.0058 16.5417 55.8728 15.344 54.2219 15.344C52.9594 15.344 51.9235 16.0885 51.5998 17.2215H51.5351C51.3085 16.0238 50.4344 15.344 49.172 15.344C48.0066 15.344 47.1002 16.0885 46.7441 17.1892H46.6794V15.5059H43.9926V24.2785H44.0897Z" fill="white"/>
                                                            <path d="M61.4407 24.408C62.7032 24.408 63.6743 23.6958 64.0304 22.7894H64.0952V24.2785H66.8143V12.6572H64.0628V17.0597H63.998C63.6096 16.0885 62.7032 15.3764 61.4731 15.3764C59.3689 15.3764 58.0741 17.0597 58.0741 19.876C58.0741 22.6923 59.3366 24.408 61.4407 24.408ZM62.4766 17.61C63.4477 17.61 64.0628 18.484 64.0628 19.9084C64.0628 21.3327 63.4801 22.1743 62.4766 22.1743C61.4731 22.1743 60.8904 21.3003 60.8904 19.9084C60.8904 18.484 61.5055 17.61 62.4766 17.61Z" fill="white"/>
                                                            <path d="M18.3869 5.14704C20.0702 5.14704 21.7535 5.50312 23.3073 6.15055C24.0519 6.47426 24.764 6.86271 25.4438 7.34828C26.1236 7.80148 26.7387 8.35179 27.3214 8.93448C27.9041 9.51716 28.422 10.1646 28.8752 10.8444C29.3284 11.5242 29.7169 12.2687 30.0406 13.0456C30.688 14.6318 31.0441 16.3151 31.0441 18.0632C31.0441 19.8112 30.7204 21.4945 30.0406 23.0807C29.7169 23.8576 29.3284 24.5698 28.8752 25.282C28.422 25.9618 27.9041 26.6092 27.3214 27.1919C26.7387 27.7746 26.1236 28.2925 25.4438 28.7781C24.764 29.2313 24.0519 29.6521 23.3073 29.9758C21.7535 30.6556 20.1026 30.9793 18.3869 30.9793C16.6712 30.9793 15.0203 30.6232 13.4665 29.9758C12.7219 29.6521 12.0098 29.2637 11.33 28.7781C10.6502 28.3249 10.0351 27.7746 9.45242 27.1919C8.86974 26.6092 8.3518 25.9618 7.8986 25.282C7.4454 24.6022 7.05695 23.8576 6.73323 23.0807C6.08581 21.4945 5.72972 19.8112 5.72972 18.0632C5.72972 16.3151 6.05344 14.6318 6.73323 13.0456C7.05695 12.2687 7.4454 11.5566 7.8986 10.8444C8.3518 10.1646 8.86974 9.51716 9.45242 8.93448C10.0351 8.35179 10.6502 7.83385 11.33 7.34828C12.0098 6.89509 12.7219 6.47426 13.4665 6.15055C15.0203 5.50312 16.6712 5.14704 18.3869 5.14704ZM18.3869 4.33775C10.9415 4.33775 4.92044 10.4883 4.92044 18.0308C4.92044 25.5733 10.9415 31.7239 18.3869 31.7239C25.8323 31.7239 31.8534 25.5733 31.8534 18.0308C31.821 10.4559 25.7999 4.33775 18.3869 4.33775Z" fill="#32373C"/>
                                                            <path d="M7.15405 18.0308C7.15405 22.5628 9.74376 26.4474 13.4665 28.3249L8.12519 13.4017C7.51014 14.7937 7.15405 16.3799 7.15405 18.0308ZM25.9618 17.4481C25.9618 16.0238 25.4762 15.0527 25.023 14.3081C24.4403 13.3694 23.9224 12.5601 23.9224 11.6213C23.9224 10.5854 24.6993 9.58191 25.7999 9.58191C25.8647 9.58191 25.897 9.58191 25.9294 9.58191C23.9224 7.70438 21.2679 6.57138 18.3545 6.57138C14.4376 6.57138 10.9739 8.61077 8.96685 11.7184C9.22582 11.7184 9.48479 11.7184 9.67901 11.7184C10.8444 11.7184 12.6572 11.5889 12.6572 11.5889C13.2722 11.5566 13.337 12.463 12.7219 12.5277C12.7219 12.5277 12.1069 12.5924 11.4271 12.6248L15.5058 24.9906L17.9661 17.4805L16.218 12.5924C15.603 12.5601 15.0526 12.4953 15.0526 12.4953C14.4376 12.463 14.5347 11.5242 15.1174 11.5566C15.1174 11.5566 16.9626 11.686 18.0632 11.686C19.2285 11.686 21.0413 11.5566 21.0413 11.5566C21.6564 11.5242 21.7211 12.4306 21.1061 12.4953C21.1061 12.4953 20.491 12.5601 19.8112 12.5924L23.8576 24.8612L25.023 21.1385C25.6381 19.5846 25.9618 18.4516 25.9618 17.4481ZM18.5811 19.0343L15.2145 29.0047C16.218 29.296 17.2863 29.4579 18.3869 29.4579C19.6817 29.4579 20.9442 29.2313 22.1096 28.8105C22.0772 28.7457 22.0448 28.7133 22.0448 28.6486L18.5811 19.0343ZM28.2278 12.5601C28.2601 12.9162 28.2925 13.3046 28.2925 13.7254C28.2925 14.8908 28.0659 16.1857 27.4509 17.8042L24.0195 27.9041C27.3537 25.9294 29.5874 22.2391 29.5874 18.0308C29.5874 16.0562 29.1018 14.1786 28.2278 12.5601Z" fill="#32373C"/>
                                                        </g>
                                                        <defs>
                                                            <clipPath id="clip0">
                                                                <rect width="83" height="36.2559" fill="white"/>
                                                            </clipPath>
                                                        </defs>
                                                    </svg>

                                                    <span>{toggleText()}</span>

                                                </MenuItem>
                                            </MenuGroup>

                                            {!this.state.is_pro &&
                                            <MenuGroup
                                                className="components-menu-group__get-pro"
                                            >
                                                <MenuItem
                                                    className="components-markdown-theme-switcher__get-pro"
                                                >
                                                        <span>{__('Unlock all features now.', 'dark-mode')}
                                                            <a href="https://wppool.dev/wp-markdown-editor" target={'_blank'} className={'wp-markdown-get-pro-btn'}>{__('Get PRO', 'dark-mode')}</a> </span>
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

                    {!this.state.is_pro && <GetProBanner/>}
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

        //Save theme settings
        this.props.updateThemeSettings(this.state.themeSettings);
    }

    onEditMusic(onToggle) {
        //const wrapper = document.querySelector('.components-markdown-theme-switcher__content');
        //const editorWrapper = document.querySelector('.block-editor-writing-flow');

        this.setState({isMusic: true});
        onToggle();

        setTimeout(function () {
            //wrapper.classList.add('is-editing-theme');
            //editorWrapper.classList.add('is-editing-theme');

            document.querySelector('.components-markdown-theme-switcher__trigger').click();
        }, 25);

        // focus manually to fix closing outside bug
        //document.querySelector('.components-markdown-theme-switcher__content .components-popover__content').focus();

        // Save theme settings
        //this.props.updateThemeSettings(this.state.themeSettings);
    }

    onExitMusic(onToggle) {
        //const wrapper = document.querySelector('.components-markdown-theme-switcher__content');
        //const editorWrapper = document.querySelector('.block-editor-writing-flow');

        this.setState({isMusic: false});
        onToggle();

        setTimeout(function () {
            //wrapper.classList.add('is-editing-theme');
            //editorWrapper.classList.add('is-editing-theme');

            document.querySelector('.components-markdown-theme-switcher__trigger').click();
        }, 25);

        // focus manually to fix closing outside bug
        //document.querySelector('.components-markdown-theme-switcher__content .components-popover__content').focus();

        // Save theme settings
        //this.props.updateThemeSettings(this.state.themeSettings);
    }

    onExitEditTheme() {
        this.setState({isEditingTheme: false});
    }

    onSelect(theme, onToggle) {

        if ('default' !== theme) {
            document.querySelector('html').classList.add('darkmode-theme');
        } else {
            document.querySelector('html').classList.remove('darkmode-theme');
        }

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
