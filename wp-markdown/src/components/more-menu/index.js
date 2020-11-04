/*global WPMD_Settings*/

/**
 * External dependencies
 */
import { get } from 'lodash';

/**
 * Internal dependencies
 */
import CopyContentMenuItem from '../copy-content-menu-item';
import CopyContentMarkdownMenuItem from '../copy-content-menu-item/markdown';
import Options from '../options-modal/options';
import icons from '../icons';
import UpdateTitleHeight from '../utils/title-height';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { withDispatch, withSelect } from '@wordpress/data';
import { compose } from '@wordpress/compose';
import { Fragment, Component, render } from '@wordpress/element';
import { displayShortcut } from '@wordpress/keycodes';
import { addQueryArgs } from '@wordpress/url';
import {
	withSpokenMessages,
	DropdownMenu,
	MenuGroup,
	MenuItem,
	BaseControl,
} from '@wordpress/components';

class MoreMenu extends Component {
	constructor() {
		super( ...arguments );

		this.addMoreMenu = this.addMoreMenu.bind( this );

		this.state = {
			isEnabled: false,
			isSettingsOpen: false,
		};
	}

	componentDidMount() {
		this.addMoreMenu();
	}

	componentDidUpdate() {
		this.addMoreMenu();
	}

	addMoreMenu() {
		const { isActive, toggleEditorMode, postType } = this.props;

		if ( ! postType ) {
			return null;
		}

		const POPOVER_PROPS = {
			className:
				'components-markdown-popover components-markdown-more-menu__content',
			position: 'bottom left',
		};

		const TOGGLE_PROPS = {
			tooltipPosition: 'bottom',
		};

		const MoreMenuDropdown = () => {
			return (
				<Fragment>
					<DropdownMenu
						className="components-markdown-more-menu__trigger"
						icon={ icons.ellipsis }
						label={ __( 'WP Markdown Settings', 'iceberg' ) }
						popoverProps={ POPOVER_PROPS }
						toggleProps={ TOGGLE_PROPS }
					>
						{ ( { onClose } ) => (
							<Fragment>
								<MenuGroup>
									<BaseControl className="components-markdown-menu-title">
										{ __( 'General', 'iceberg' ) }
									</BaseControl>
									<MenuItem
										onClick={ () => {
											const icebergButton = document.querySelector(
												'.components-markdown-theme-switcher__trigger'
											);
											if ( icebergButton ) {
												icebergButton.style.visibility =
													'visible';
												icebergButton.click();
											}
										} }
									>
										{ __( 'Edit editor theme', 'iceberg' ) }
									</MenuItem>
									<MenuItem
										onClick={ () => {
											const icebergButton = document.querySelector(
												'.components-markdown-theme-switcher__trigger'
											);
											if ( icebergButton ) {
												icebergButton.style.visibility =
													'visible';
												icebergButton.click();

												const checkExist = setInterval(
													function() {
														document
															.querySelector(
																'.components-markdown-theme-switcher__typography'
															)
															.click();

														clearInterval(
															checkExist
														);
													},
													100
												);
											}
										} }
									>
										{ __( 'Edit typography', 'iceberg' ) }
									</MenuItem>
									<MenuItem
										className="components-markdown-more-menu__back"
										onClick={ () => {
											window.location.href = addQueryArgs(
												'edit.php',
												{
													post_type: postType.slug,
												}
											);
										} }
									>
										{ __(
											'Back to all ' +
												get(
													postType,
													[ 'labels', 'name' ],
													'Posts'
												).toLowerCase(),
											'iceberg'
										) }
									</MenuItem>
									<MenuItem
										className="components-markdown-more-menu__exit"
										shortcut={ displayShortcut.secondary(
											'i'
										) }
										onClick={ () => {
											onClose();
											toggleEditorMode();
										} }
									>
										{ __( 'Exit Markdown', 'iceberg' ) }
									</MenuItem>
								</MenuGroup>
								<MenuGroup>
									<BaseControl className="components-markdown-menu-title">
										{ __( 'Tools', 'iceberg' ) }
									</BaseControl>
									<MenuItem
										className="components-markdown-more-menu__new"
										shortcut={ displayShortcut.primaryShift(
											'+'
										) }
										onClick={ () => {
											window.location.href = addQueryArgs(
												'post-new.php',
												{
													post_type: postType.slug,
													is_iceberg: 1,
												}
											);
										} }
									>
										{ __(
											'New ' +
												get(
													postType,
													[
														'labels',
														'singular_name',
													],
													'Posts'
												).toLowerCase(),
											'iceberg'
										) }
									</MenuItem>
									<CopyContentMenuItem />
									<CopyContentMarkdownMenuItem />
									<MenuItem
										role="menuitem"
										href="https://wppool.dev/"
										target="_new"
									>
										{ __( 'Help', 'iceberg' ) }
									</MenuItem>
								</MenuGroup>
								<MenuGroup>
									<MenuItem
										onClick={ () => {
											this.setState( {
												isSettingsOpen: true,
											} );
										} }
									>
										{ __( '⚙️ Settings', 'iceberg' ) }
									</MenuItem>
								</MenuGroup>
							</Fragment>
						) }
					</DropdownMenu>
				</Fragment>
			);
		};

		const wrapper = document.querySelector( '.edit-post-header__settings' );

		if ( ! wrapper.classList.contains( 'iceberg-more-menu' ) && isActive ) {
			wrapper.classList.add( 'iceberg-more-menu' );
			wrapper.insertAdjacentHTML(
				'beforeend',
				'<div id="components-markdown-more-menu"></div>'
			);

			render(
				<MoreMenuDropdown />,
				document.getElementById( 'components-markdown-more-menu' )
			);
		} else if (
			wrapper.classList.contains( 'iceberg-more-menu' ) &&
			! isActive
		) {
			document.getElementById( 'components-markdown-more-menu' ).remove();
			wrapper.classList.remove( 'iceberg-more-menu' );
		}
	}

	render() {
		const { isSettingsOpen } = this.state;
		const { license } = window.WPMD_Settings;

		let isValid = true;
		let label = '';

		if (
			typeof license !== 'undefined' &&
			typeof license.license === 'undefined'
		) {
			isValid = false;
			label = __( 'Unlicensed', 'iceberg' );
		}

		if (
			typeof license !== 'undefined' &&
			typeof license.license !== 'undefined' &&
			'invalid' === license.license
		) {
			isValid = false;
			label = __( 'Invalid License', 'iceberg' );
		}

		if (
			typeof license !== 'undefined' &&
			typeof license.expires !== 'undefined'
		) {
			const today = new Date();
			const expires = new Date( license.expires );

			if ( today > expires ) {
				isValid = false;
				label = __( 'Expired License', 'iceberg' );
			}
		}

		return (
			<Fragment>
				{ isSettingsOpen && (
					<Options
						closeModal={ () => {
							this.setState( { isSettingsOpen: false } );
						} }
					/>
				) }
			</Fragment>
		);
	}
}

export default compose( [
	withSelect( ( select ) => {
		const { getCurrentPostType } = select( 'core/editor' );
		const { getPostType } = select( 'core' );

		return {
			postType: getPostType( getCurrentPostType() ),
		};
	} ),
	withDispatch( ( dispatch ) => ( {
		toggleEditorMode() {
			dispatch( 'core/edit-post' ).toggleFeature( 'icebergWritingMode' );

			setTimeout( function() {
				UpdateTitleHeight();
			}, 100 );

			// Reset post meta
			dispatch( 'core/editor' ).editPost( {
				meta: {
					_iceberg_editor_remember: false,
				},
			} );

			dispatch( 'core/editor' ).savePost();
		},
	} ) ),
	withSpokenMessages,
] )( MoreMenu );
