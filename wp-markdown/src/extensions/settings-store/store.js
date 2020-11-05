/*global WPMD_Settings*/

/**
 * Internal dependencies
 */
import defaults from '../../components/theme-editor/default';

/**
 * WordPress dependencies
 */
import apiFetch from '@wordpress/api-fetch';
import {select, dispatch} from '@wordpress/data';

export default function createMarkdownStore() {
    const {isFeatureActive} = select('core/edit-post');
    const settingsNonce = WPMD_Settings.WPMD_SettingsNonce;
    apiFetch.use(apiFetch.createNonceMiddleware(settingsNonce));

    let storeChanged = () => {
    };
    const settings = {
        markdownLimitedBlocks: JSON.stringify({}),
        markdownThemeSettings: {},
        textIndent: isFeatureActive('markdownTextIndent'),
        headingIndicators: !isFeatureActive('markdownHeadingIndicators'),
        scaledHeading: isFeatureActive('markdownScaledHeading'),
        minimizeImages: !isFeatureActive('markdownMinimizeImages'),
        contextualToolbar: isFeatureActive('markdownContextualToolbar'),
        uiThemes: !isFeatureActive('markdownUiThemes'),
        uiToc: !isFeatureActive('markdownUiToc'),
        uiShortcuts: !isFeatureActive('markdownUiShortcuts'),
        uiBackTo: !isFeatureActive('markdownUiBackTo'),
        uiHeaderShortcut: !isFeatureActive('markdownUiHeaderShortcut'),
        emoji: !isFeatureActive('markdownEmoji'),
        isDefaultEditor: isFeatureActive('markdownIsDefaultEditor'),
        documentInformation: isFeatureActive('markdownDocumentInformation'),
    };

    apiFetch({
        path: '/wp/v2/users/me',
        method: 'GET',
        headers: {
            'X-WP-Nonce': settingsNonce,
        },
    })
        .then((res) => {
            settings.markdownThemeSettings =
                Object.keys(res.meta.markdown_theme_settings).length > 0
                    ? res.meta.markdown_theme_settings
                    : defaults;

            storeChanged();
        })
        .catch(() => {
            settings.markdownThemeSettings = defaults;

            if (
                ['wp-markdown.wppool.dev', 'wppool.dev/wp-markdown'].includes(
                    WPMD_Settings.siteurl.host
                )
            ) {
                settings.markdownThemeSettings.theme = 'mustard-seed';
                settings.isDefaultEditor = true;
                settings.documentInformation = true;
            }

            storeChanged();
        });

    apiFetch({
        path: '/wp/v2/settings/',
        method: 'GET',
        headers: {
            'X-WP-Nonce': settingsNonce,
        },
    }).then((res) => {
        settings.markdownLimitedBlocks =
            res.markdown_limited_blocks || JSON.stringify({});
        storeChanged();
    });

    const capitalize = (str) => {
        return str.charAt(0).toUpperCase() + str.slice(1);
    };

    const selectors = {
        getLimitedBlocks() {
            return settings.markdownLimitedBlocks;
        },
        getThemeSettings() {
            return settings.markdownThemeSettings;
        },
        isEditorPanelEnabled(panelName) {
            return settings[panelName];
        },
    };

    const actions = {
        setLimitedBlocks(blockNames) {
            settings.markdownLimitedBlocks = JSON.stringify(blockNames);
            storeChanged();
            apiFetch({
                path: '/wp/v2/settings/',
                method: 'POST',
                headers: {
                    'X-WP-Nonce': settingsNonce,
                },
                data: {
                    markdown_limited_blocks: JSON.stringify(blockNames),
                },
            });
        },
        setThemeSettings(themeSettings) {
            settings.markdownThemeSettings = themeSettings;
            storeChanged();

            apiFetch({
                path: '/wp/v2/users/me',
                method: 'POST',
                headers: {
                    'X-WP-Nonce': settingsNonce,
                },
                data: {
                    meta: {
                        markdown_theme_settings: themeSettings,
                    },
                },
            });
        },

        toggleEditorPanelEnabled(panelName) {
            const toggle = !settings[panelName];
            settings[panelName] = toggle;

            const name = 'markdown' + capitalize(panelName);

            storeChanged();
            dispatch('core/edit-post').toggleFeature(name);
        },

        handleLicenseActivation(action, licenseKey, setState) {
            apiFetch({
                path: '/markdown/v1/license/' + action + '/' + licenseKey,
                method: 'POST',
                headers: {
                    'X-WP-Nonce': settingsNonce,
                },
            }).then((obj) => {
                if (typeof obj.success !== 'undefined' && obj.success) {
                    if (action === 'deactivate') {
                        setState(() => ({
                            action: 'activate',
                            licenseKey: '',
                        }));
                        window.WPMD_Settings.license = {};
                    } else {
                        setState(() => ({action: 'deactivate'}));
                        window.WPMD_Settings.license = obj;
                    }
                }

                setState(() => ({isLoading: false}));
            });
        },
    };

    return {
        getSelectors() {
            return selectors;
        },
        getActions() {
            return actions;
        },
        subscribe(listener) {
            storeChanged = listener;
        },
    };
}
