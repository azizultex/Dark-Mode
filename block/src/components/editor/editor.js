/*global icebergSettings*/

/**
 * Internal dependencies
 */
import BlockLimiter from '../block-limiter';
import ThemeSwitcher from '../theme-switcher';
import MoreMenu from '../more-menu';
import Shortcuts from '../shortcuts';
import RegisterShortcuts from '../shortcuts/shortcuts';
import DocumentInfo from '../document-info';
import UpdateTitleHeight from '../utils/title-height';
import ShortcutButton from '../shortcut-button';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { withSelect, withDispatch } from '@wordpress/data';
import { PluginMoreMenuItem } from '@wordpress/edit-post';
import { compose } from '@wordpress/compose';
import { Fragment, Component } from '@wordpress/element';
import { rawShortcut, displayShortcut } from '@wordpress/keycodes';
import {
	KeyboardShortcuts,
	withSpokenMessages,
	Path,
	SVG,
} from '@wordpress/components';

class IcebergEditor extends Component {
	constructor() {
		super( ...arguments );

		this.state = {
			isEnabled: false,
		};
	}

	componentDidMount() {
		const { isActive, onToggle, isDefaultEditor, postmeta } = this.props;

		// wait for post meta
		if ( typeof postmeta === 'undefined' ) {
			return;
		}

		let isIcebergMode = false;

		if ( typeof postmeta._iceberg_editor_remember !== 'undefined' ) {
			isIcebergMode = postmeta._iceberg_editor_remember;
		}

		if ( ! isActive && isDefaultEditor ) {
			onToggle();
		} else if ( ! isActive && icebergSettings.isEditIceberg ) {
			onToggle();
		} else if ( ! isActive && isIcebergMode ) {
			onToggle();
		} else if (
			isActive &&
			! icebergSettings.isEditIceberg &&
			! isIcebergMode
		) {
			onToggle();
		}

		this.sync();

		if ( isActive ) {
			setTimeout( function() {
				UpdateTitleHeight();
			}, 100 );
		}
	}

	componentDidUpdate() {
		this.sync();
	}

	sync() {
		const {
			isActive,
			isMinimizeImages,
			isTextIndent,
			isThemesUI,
			isShortcutsUI,
			isBackTo,
			isScaledHeading,
			isDocumentInformation,
		} = this.props;

		const { license } = icebergSettings;

		// Add classes for each feature
		if ( isMinimizeImages ) {
			document.body.classList.add( 'has-minimized-images' );
		} else {
			document.body.classList.remove( 'has-minimized-images' );
		}

		if ( isThemesUI ) {
			document.body.classList.add( 'has-theme-switcher' );
		} else {
			document.body.classList.remove( 'has-theme-switcher' );
		}

		if ( isTextIndent ) {
			document.body.classList.add( 'has-text-indent' );
		} else {
			document.body.classList.remove( 'has-text-indent' );
		}

		if ( isShortcutsUI ) {
			document.body.classList.add( 'has-markdown-shortcuts' );
		} else {
			document.body.classList.remove( 'has-markdown-shortcuts' );
		}

		if ( isBackTo ) {
			document.body.classList.add( 'has-back-to' );
		} else {
			document.body.classList.remove( 'has-back-to' );
		}

		if ( isScaledHeading ) {
			document.body.classList.add( 'has-scaled-heading-levels' );
		} else {
			document.body.classList.remove( 'has-scaled-heading-levels' );
		}

		// Invalid license
		if (
			typeof license !== 'undefined' &&
			typeof license.license !== 'undefined' &&
			'invalid' === license.license
		) {
			document.body.classList.add( 'invalid-iceberg-license' );
		}

		if ( isDocumentInformation ) {
			document.body.classList.add( 'has-document-info' );
		} else {
			document.body.classList.remove( 'has-document-info' );
		}

		// If editor is active or enactive
		if ( isActive ) {
			document.body.classList.add( 'is-iceberg' );
			document
				.querySelector( '.edit-post-layout' )
				.classList.remove( 'is-sidebar-opened' );

			// Check if Gutenberg plugin is active
			if ( icebergSettings.isGutenberg ) {
				document.body.classList.add( 'is-gutenberg' );
			}
		} else {
			document.body.classList.remove(
				'is-iceberg',
				'is-gutenberg',
				'has-minimized-images',
				'has-theme-switcher',
				'has-text-indent',
				'has-markdown-shortcuts',
				'has-scaled-heading-levels',
				'has-document-info',
				'has-back-to'
			);
		}
	}

	render() {
		const {
			isActive,
			onToggle,
			isThemesUI,
			isSwitchTo,
			isDocumentInformation,
		} = this.props;

		const icon = (
			<SVG
				fill="none"
				viewBox="0 0 20 20"
				xmlns="http://www.w3.org/2000/svg"
			>
				<Path
					clipRule="evenodd"
					d="m8.14003 3h3.15457c-2.00451 2.0977-.9186 4.00235.1611 5.89622.6354 1.11458 1.2687 2.22538 1.2687 3.36968 0 1.6928-.438 2.7871-1.1827 3.4936h.2451c.6674 0 1.2132.5422 1.2132 1.2405h-7v-11.76074c0-1.23153.9629-2.23926 2.14003-2.23926zm-.23846 7.969v-2.21176c0-.81235-1.15748-.81138-1.15748.00097v3.44009c.64572 0 1.15748-.5534 1.15748-1.2293zm4.18903 1.2293c0 2.7272-1.1329 3.5543-3.03154 4.0786v-8.09921h1.35034c.1689.32009.3414.62743.5085.92514.624 1.11177 1.1727 2.08927 1.1727 3.09547zm-4.21659-7.83648c.31909-.33619.83813-.3369 1.15748-.00097 0-.81236-1.15748-.81139-1.15748.00097z"
					fill="currentColor"
					fillRule="evenodd"
				/>
			</SVG>
		);

		return (
			<Fragment>
				<PluginMoreMenuItem
					role="menuitemcheckbox"
					icon={ icon }
					onClick={ onToggle }
					shortcut={ displayShortcut.secondary( 'i' ) }
				>
					{ __( 'Switch to Iceberg', 'iceberg' ) }
				</PluginMoreMenuItem>
				<KeyboardShortcuts
					bindGlobal
					shortcuts={ {
						[ rawShortcut.secondary( 'i' ) ]: () => {
							onToggle();
						},
					} }
				/>
				{ isActive && <Shortcuts isActive={ isActive } /> }
				<RegisterShortcuts isActive={ isActive } />
				<MoreMenu isActive={ isActive } />
				<BlockLimiter isActive={ isActive } />
				<ThemeSwitcher isActive={ isActive } isEnabled={ isThemesUI } />
				{ isActive && isDocumentInformation && (
					<DocumentInfo isActive={ isActive } />
				) }
				{ ! isActive && (
					<ShortcutButton
						onToggle={ onToggle }
						isEnabled={ isSwitchTo }
					/>
				) }
			</Fragment>
		);
	}
}

export default compose( [
	withSelect( ( select ) => {
		const { isFeatureActive } = select( 'core/edit-post' );
		const { getEditedPostAttribute } = select( 'core/editor' );
		const { isEditorPanelEnabled } = select( 'iceberg-settings' );
		return {
			isActive: isFeatureActive( 'icebergWritingMode' ),
			isFocusMode: isFeatureActive( 'focusMode' ),
			isFullscreenMode: isFeatureActive( 'fullscreenMode' ),
			isFixedToolbar: isFeatureActive( 'fixedToolbar' ),
			disableFullscreenMode: isFeatureActive(
				'icebergDisableFullscreenMode'
			),
			isWelcomeGuide: isFeatureActive( 'welcomeGuide' ),
			isMinimizeImages: isEditorPanelEnabled( 'minimizeImages' ),
			isTextIndent: isEditorPanelEnabled( 'textIndent' ),
			isThemesUI: isEditorPanelEnabled( 'uiThemes' ),
			isShortcutsUI: isEditorPanelEnabled( 'uiShortcuts' ),
			isBackTo: isEditorPanelEnabled( 'uiBackTo' ),
			isSwitchTo: isEditorPanelEnabled( 'uiHeaderShortcut' ),
			isScaledHeading: isEditorPanelEnabled( 'scaledHeading' ),
			isDefaultEditor: isEditorPanelEnabled( 'isDefaultEditor' ),
			isDocumentInformation: isEditorPanelEnabled(
				'documentInformation'
			),
			postmeta: getEditedPostAttribute( 'meta' ),
		};
	} ),
	withDispatch( ( dispatch, ownProps ) => ( {
		onToggle() {
			dispatch( 'core/edit-post' ).toggleFeature( 'icebergWritingMode' );

			if ( ! ownProps.isActive ) {
				dispatch( 'core/editor' ).disablePublishSidebar();

				const newPath = window.location.href + '&is_iceberg=1';
				const getUrl = new URL( window.location.href );
				// Force path to avoid issue on refresh
				if ( ! getUrl.searchParams.get( 'is_iceberg' ) ) {
					window.history.pushState( { path: newPath }, '', newPath );
				}

				// Close sidebar to disable unnecessary loading of block settings
				dispatch( 'core/edit-post' ).closeGeneralSidebar();

				// Save fullscreen mode
				if (
					! ownProps.isFullscreenMode &&
					! ownProps.disableFullscreenMode
				) {
					dispatch( 'core/edit-post' ).toggleFeature(
						'icebergDisableFullscreenMode'
					);
				}

				// Save post meta
				dispatch( 'core/editor' ).editPost( {
					meta: {
						_iceberg_editor_remember: true,
					},
				} );

				dispatch( 'core/editor' ).savePost();
			} else {
				dispatch( 'core/editor' ).enablePublishSidebar();
				dispatch( 'core/edit-post' ).openGeneralSidebar(
					'edit-post/document'
				);

				if ( ownProps.disableFullscreenMode ) {
					dispatch( 'core/edit-post' ).toggleFeature(
						'icebergDisableFullscreenMode'
					);
					dispatch( 'core/edit-post' ).toggleFeature(
						'fullscreenMode'
					);
				}

				// Reset post meta
				dispatch( 'core/editor' ).editPost( {
					meta: {
						_iceberg_editor_remember: false,
					},
				} );

				dispatch( 'core/editor' ).savePost();
			}

			if ( ownProps.isFocusMode ) {
				dispatch( 'core/edit-post' ).toggleFeature( 'focusMode' );
			}

			if ( ! ownProps.isFullscreenMode ) {
				dispatch( 'core/edit-post' ).toggleFeature( 'fullscreenMode' );
			}

			if ( ! ownProps.isFixedToolbar ) {
				dispatch( 'core/edit-post' ).toggleFeature( 'fixedToolbar' );
			}

			if ( ownProps.isWelcomeGuide ) {
				dispatch( 'core/edit-post' ).toggleFeature( 'welcomeGuide' );
			}

			setTimeout( function() {
				UpdateTitleHeight();
			}, 100 );
		},
		saveDefaultEditor() {
			dispatch( 'iceberg-settings' ).toggleEditorPanelEnabled(
				'savedDefaultEditor'
			);
		},
	} ) ),
	withSpokenMessages,
] )( IcebergEditor );
