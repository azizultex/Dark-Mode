/*global WPMD_Settings*/

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

class MarkdownEditor extends Component {
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

		let isMarkdownMode = false;

		if ( typeof postmeta._markdown_editor_remember !== 'undefined' ) {
			isMarkdownMode = postmeta._markdown_editor_remember;
		}

		if ( ! isActive && isDefaultEditor ) {
			onToggle();
		} else if ( ! isActive && WPMD_Settings.isEditWPMD ) {
			onToggle();
		} else if ( ! isActive && isMarkdownMode ) {
			onToggle();
		} else if (
			isActive &&
			! WPMD_Settings.isEditWPMD &&
			! isMarkdownMode
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

		const { license } = WPMD_Settings;

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
			document.body.classList.add( 'invalid-markdown-license' );
		}

		if ( isDocumentInformation ) {
			document.body.classList.add( 'has-document-info' );
		} else {
			document.body.classList.remove( 'has-document-info' );
		}

		// If editor is active or enactive
		if ( isActive ) {
			document.body.classList.add( 'is-markdown' );
			document
				.querySelector( '.edit-post-layout' )
				.classList.remove( 'is-sidebar-opened' );

			// Check if Gutenberg plugin is active
			if ( WPMD_Settings.isGutenberg ) {
				document.body.classList.add( 'is-gutenberg' );
			}
		} else {
			document.body.classList.remove(
				'is-markdown',
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
			<SVG xmlns="http://www.w3.org/2000/svg" aria-hidden="true"
				 focusable="false" width="1.63em" height="1em"
				 preserveAspectRatio="xMidYMid meet" viewBox="0 0 256 158">
				<Path
					d="M238.371 157.892H18.395C8.431 157.892 0 149.462 0 139.497V18.395C0 8.431 8.431 0 18.395 0h219.21C247.569 0 256 8.431 256 18.395v121.102c0 9.964-7.665 18.395-17.629 18.395zM18.395 12.263c-3.066 0-6.132 3.066-6.132 6.132v121.102c0 3.832 3.066 6.132 6.132 6.132h219.21c3.832 0 6.132-3.066 6.132-6.132V18.395c0-3.832-3.066-6.132-6.132-6.132H18.395zM36.79 121.102V36.79h24.527l24.527 30.66l24.527-30.66h24.527v84.312h-24.527V72.814l-24.527 30.66l-24.527-30.66v48.288H36.79zm154.06 0l-36.79-40.623h24.527V36.79h24.527v42.923h24.527l-36.79 41.389z"
					fill="#000"/>
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
					{ __( 'Switch to Markdown', 'dark-mode' ) }
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
		const { isEditorPanelEnabled } = select( 'markdown-settings' );
		return {
			isActive: isFeatureActive( 'markdownWritingMode' ),
			isFocusMode: isFeatureActive( 'focusMode' ),
			isFullscreenMode: isFeatureActive( 'fullscreenMode' ),
			isFixedToolbar: isFeatureActive( 'fixedToolbar' ),
			disableFullscreenMode: isFeatureActive(
				'markdownDisableFullscreenMode'
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
			dispatch( 'core/edit-post' ).toggleFeature( 'markdownWritingMode' );

			if ( ! ownProps.isActive ) {
				dispatch( 'core/editor' ).disablePublishSidebar();

				const newPath = window.location.href + '&is_markdown=1';
				const getUrl = new URL( window.location.href );
				// Force path to avoid issue on refresh
				if ( ! getUrl.searchParams.get( 'is_markdown' ) ) {
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
						'markdownDisableFullscreenMode'
					);
				}

				// Save post meta
				dispatch( 'core/editor' ).editPost( {
					meta: {
						_markdown_editor_remember: true,
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
						'markdownDisableFullscreenMode'
					);
					dispatch( 'core/edit-post' ).toggleFeature(
						'fullscreenMode'
					);
				}

				// Reset post meta
				dispatch( 'core/editor' ).editPost( {
					meta: {
						_markdown_editor_remember: false,
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
			dispatch( 'markdown-settings' ).toggleEditorPanelEnabled(
				'savedDefaultEditor'
			);
		},
	} ) ),
	withSpokenMessages,
] )( MarkdownEditor );
