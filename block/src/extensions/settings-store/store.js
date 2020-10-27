/*global icebergSettings*/

/**
 * Internal dependencies
 */
import defaults from '../../components/theme-editor/default';

/**
 * WordPress dependencies
 */
import apiFetch from '@wordpress/api-fetch';
import { select, dispatch } from '@wordpress/data';

export default function createIcebergStore() {
	const { isFeatureActive } = select( 'core/edit-post' );
	const settingsNonce = icebergSettings.icebergSettingsNonce;
	apiFetch.use( apiFetch.createNonceMiddleware( settingsNonce ) );

	let storeChanged = () => {};
	const settings = {
		icebergLimitedBlocks: JSON.stringify( {} ),
		icebergThemeSettings: {},
		textIndent: isFeatureActive( 'icebergTextIndent' ),
		headingIndicators: ! isFeatureActive( 'icebergHeadingIndicators' ),
		scaledHeading: isFeatureActive( 'icebergScaledHeading' ),
		minimizeImages: ! isFeatureActive( 'icebergMinimizeImages' ),
		contextualToolbar: isFeatureActive( 'icebergContextualToolbar' ),
		uiThemes: ! isFeatureActive( 'icebergUiThemes' ),
		uiToc: ! isFeatureActive( 'icebergUiToc' ),
		uiShortcuts: ! isFeatureActive( 'icebergUiShortcuts' ),
		uiBackTo: ! isFeatureActive( 'icebergUiBackTo' ),
		uiHeaderShortcut: ! isFeatureActive( 'icebergUiHeaderShortcut' ),
		emoji: ! isFeatureActive( 'icebergEmoji' ),
		isDefaultEditor: isFeatureActive( 'icebergIsDefaultEditor' ),
		documentInformation: isFeatureActive( 'icebergDocumentInformation' ),
	};

	apiFetch( {
		path: '/wp/v2/users/me',
		method: 'GET',
		headers: {
			'X-WP-Nonce': settingsNonce,
		},
	} )
		.then( ( res ) => {
			settings.icebergThemeSettings =
				Object.keys( res.meta.iceberg_theme_settings ).length > 0
					? res.meta.iceberg_theme_settings
					: defaults;

			storeChanged();
		} )
		.catch( () => {
			settings.icebergThemeSettings = defaults;

			if (
				[ 'demo.useiceberg.com', 'useiceberg.com' ].includes(
					icebergSettings.siteurl.host
				)
			) {
				settings.icebergThemeSettings.theme = 'mustard-seed';
				settings.isDefaultEditor = true;
				settings.documentInformation = true;
			}

			storeChanged();
		} );

	apiFetch( {
		path: '/wp/v2/settings/',
		method: 'GET',
		headers: {
			'X-WP-Nonce': settingsNonce,
		},
	} ).then( ( res ) => {
		settings.icebergLimitedBlocks =
			res.iceberg_limited_blocks || JSON.stringify( {} );
		storeChanged();
	} );

	const capitalize = ( str ) => {
		return str.charAt( 0 ).toUpperCase() + str.slice( 1 );
	};

	const selectors = {
		getLimitedBlocks() {
			return settings.icebergLimitedBlocks;
		},
		getThemeSettings() {
			return settings.icebergThemeSettings;
		},
		isEditorPanelEnabled( panelName ) {
			return settings[ panelName ];
		},
	};

	const actions = {
		setLimitedBlocks( blockNames ) {
			settings.icebergLimitedBlocks = JSON.stringify( blockNames );
			storeChanged();
			apiFetch( {
				path: '/wp/v2/settings/',
				method: 'POST',
				headers: {
					'X-WP-Nonce': settingsNonce,
				},
				data: {
					iceberg_limited_blocks: JSON.stringify( blockNames ),
				},
			} );
		},
		setThemeSettings( themeSettings ) {
			settings.icebergThemeSettings = themeSettings;
			storeChanged();

			apiFetch( {
				path: '/wp/v2/users/me',
				method: 'POST',
				headers: {
					'X-WP-Nonce': settingsNonce,
				},
				data: {
					meta: {
						iceberg_theme_settings: themeSettings,
					},
				},
			} );
		},
		toggleEditorPanelEnabled( panelName ) {
			const toggle = ! settings[ panelName ];
			settings[ panelName ] = toggle;

			const name = 'iceberg' + capitalize( panelName );

			storeChanged();
			dispatch( 'core/edit-post' ).toggleFeature( name );
		},
		handleLicenseActivation( action, licenseKey, setState ) {
			apiFetch( {
				path: '/iceberg/v1/license/' + action + '/' + licenseKey,
				method: 'POST',
				headers: {
					'X-WP-Nonce': settingsNonce,
				},
			} ).then( ( obj ) => {
				if ( typeof obj.success !== 'undefined' && obj.success ) {
					if ( action === 'deactivate' ) {
						setState( () => ( {
							action: 'activate',
							licenseKey: '',
						} ) );
						window.icebergSettings.license = {};
					} else {
						setState( () => ( { action: 'deactivate' } ) );
						window.icebergSettings.license = obj;
					}
				}

				setState( () => ( { isLoading: false } ) );
			} );
		},
	};

	return {
		getSelectors() {
			return selectors;
		},
		getActions() {
			return actions;
		},
		subscribe( listener ) {
			storeChanged = listener;
		},
	};
}
