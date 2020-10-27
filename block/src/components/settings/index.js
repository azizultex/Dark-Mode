/**
 * Internal dependencies
 */
import icons from '../icons';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { withSelect, withDispatch } from '@wordpress/data';
import { compose } from '@wordpress/compose';
import { Fragment, Component } from '@wordpress/element';
import {
	withSpokenMessages,
	DropdownMenu,
	BaseControl,
	MenuGroup,
	MenuItem,
} from '@wordpress/components';

class Settings extends Component {
	constructor() {
		super( ...arguments );

		this.state = {
			isOpen: false,
		};
	}

	componentDidMount() {
		const element = document.querySelector(
			'.components-iceberg-shortcuts'
		);
		if ( element ) {
			element.parentElement.style.display = 'block';
		}
	}

	render() {
		const { isDefaultEditor, onToggleEditor } = this.props;

		const POPOVER_PROPS = {
			className:
				'components-iceberg-settings__content components-iceberg-popover',
			position: 'top right',
			focusOnMount: 'container',
		};

		const TOGGLE_PROPS = {
			tooltipPosition: 'bottom',
		};

		return (
			<Fragment>
				<div className="components-iceberg-settings">
					<DropdownMenu
						className="components-iceberg-settings__trigger"
						label={ __( 'Open settings', 'iceberg' ) }
						icon="editor-help"
						popoverProps={ POPOVER_PROPS }
						toggleProps={ TOGGLE_PROPS }
					>
						{ () => (
							<Fragment>
								<MenuGroup>
									<BaseControl className="components-iceberg-menu-title">
										{ __( 'Writing', 'iceberg' ) }
									</BaseControl>
									<MenuItem
										onClick={ () => {
											onToggleEditor();
										} }
									>
										{ __(
											'Set Iceberg as the default editor',
											'iceberg'
										) }
										{ isDefaultEditor
											? icons.checkMark
											: null }
									</MenuItem>
								</MenuGroup>
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
		const { isEditorPanelEnabled } = select( 'iceberg-settings' );
		return {
			isDefaultEditor: isEditorPanelEnabled( 'isDefaultEditor' ),
		};
	} ),
	withDispatch( ( dispatch ) => ( {
		onToggleEditor: () =>
			dispatch( 'iceberg-settings' ).toggleEditorPanelEnabled(
				'isDefaultEditor'
			),
	} ) ),
	withSpokenMessages,
] )( Settings );
