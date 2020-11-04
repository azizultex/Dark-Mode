/**
 * External dependencies
 */
import { castArray, get } from 'lodash';

/**
 * Internal dependencies
 */
import shortcutConfig from './shortcuts-menu';
import icons from '../icons';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { withSelect } from '@wordpress/data';
import { compose } from '@wordpress/compose';
import { Fragment, Component } from '@wordpress/element';
import {
	withSpokenMessages,
	DropdownMenu,
	BaseControl,
	PanelBody,
} from '@wordpress/components';

class Shortcuts extends Component {
	constructor() {
		super( ...arguments );

		this.state = {
			isOpen: false,
		};
	}

	componentDidMount() {
		const element = document.querySelector(
			'.components-markdown-shortcuts'
		);
		if ( element ) {
			element.parentElement.style.display = 'block';
		}
	}

	componentDidUpdate() {
		const element = document.querySelector(
			'.components-markdown-shortcuts'
		);
		if ( element ) {
			element.parentElement.style.display = 'block';
		}
	}

	render() {
		const { postType } = this.props;

		if ( ! postType ) {
			return null;
		}

		const POPOVER_PROPS = {
			className:
				'components-markdown-shortcuts__content components-markdown-popover',
			position: 'top right',
			focusOnMount: 'container',
		};

		const TOGGLE_PROPS = {
			tooltipPosition: 'bottom',
		};

		const ShortcutList = ( { shortcuts } ) => {
			const singular = get(
				postType,
				[ 'labels', 'singular_name' ],
				'Posts'
			).toLowerCase();
			const plural = get(
				postType,
				[ 'labels', 'name' ],
				'Posts'
			).toLowerCase();
			return (
				<dl className="components-markdown-shortcuts__shortcut-list">
					{ shortcuts.map(
						(
							{ keyCombination, description, override, single },
							index
						) => {
							if ( typeof override !== 'undefined' && override ) {
								if ( typeof single !== 'undefined' && single ) {
									description = description.replace(
										'{type}',
										singular
									);
								} else {
									description = description.replace(
										'{type}',
										plural
									);
								}
							}
							return (
								<div
									className="components-markdown-shortcuts__shortcut"
									key={ index }
								>
									<div className="components-markdown-shortcuts__shortcut-description">
										{ description }
									</div>
									<div className="components-markdown-shortcuts__shortcut-term">
										{ mapKeyCombination(
											castArray( keyCombination )
										) }
									</div>
								</div>
							);
						}
					) }
				</dl>
			);
		};

		const ShortcutSection = ( {
			title,
			shortcuts,
			panel,
			initialOpen,
		} ) => (
			<section className="components-markdown-shortcuts__section">
				{ panel ? (
					<PanelBody title={ title } initialOpen={ initialOpen }>
						<ShortcutList shortcuts={ shortcuts } />
					</PanelBody>
				) : (
					<Fragment>
						<BaseControl className="components-markdown-menu-title">
							{ title }
						</BaseControl>
						<ShortcutList shortcuts={ shortcuts } />
					</Fragment>
				) }
			</section>
		);

		const mapKeyCombination = ( keyCombination ) =>
			keyCombination.map( ( character, index ) => {
				return (
					<kbd
						key={ index }
						className="components-markdown-shortcuts__shortcut-key"
					>
						{ character }
					</kbd>
				);
			} );

		return (
			<Fragment>
				<div className="components-markdown-shortcuts">
					<DropdownMenu
						className="components-markdown-shortcuts__trigger"
						label={ __( 'Open shortcuts', 'iceberg' ) }
						icon={ icons.shortcuts }
						popoverProps={ POPOVER_PROPS }
						toggleProps={ TOGGLE_PROPS }
					>
						{ () => (
							<Fragment>
								{ shortcutConfig.map( ( config, index ) => (
									<ShortcutSection
										key={ index }
										{ ...config }
									/>
								) ) }
							</Fragment>
						) }
					</DropdownMenu>
				</div>
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
	withSpokenMessages,
] )( Shortcuts );
