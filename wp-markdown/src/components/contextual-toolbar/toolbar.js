/**
 * WordPress dependencies
 */
import { Component, Fragment, createRef } from '@wordpress/element';
import { withSelect, withDispatch } from '@wordpress/data';
import { ESCAPE, BACKSPACE } from '@wordpress/keycodes';
import { compose, withInstanceId } from '@wordpress/compose';
import { switchToBlockType } from '@wordpress/blocks';
import {
	withSpokenMessages,
	Popover,
	Toolbar,
	Slot,
} from '@wordpress/components';

class ContextualToolbar extends Component {
	constructor() {
		super( ...arguments );
		this.onSelectionChange = this.onSelectionChange.bind( this );
		this.onSelectionEnd = this.onSelectionEnd.bind( this );
		this.containerRef = createRef();

		this.state = {
			anchorRef: null,
			isVisible: false,
			isSelecting: false,
		};
	}

	componentDidMount() {
		document.addEventListener( 'selectionchange', this.onSelectionChange );
		document.addEventListener( 'mouseup', this.onSelectionEnd );
		document.addEventListener( 'keyup', this.onSelectionEnd );
	}

	onSelectionEnd( event ) {
		const { isSelecting, isVisible } = this.state;
		const { keyCode } = event;

		if (
			( ESCAPE === keyCode || BACKSPACE === keyCode || event.shiftKey ) &&
			isVisible
		) {
			this.setState( { isVisible: false } );
		}

		if ( isSelecting && ! event.shiftKey ) {
			setTimeout(
				function() {
					this.setState( { isSelecting: false, isVisible: true } );
				}.bind( this ),
				150
			);
		}
	}

	onSelectionChange() {
		const { isSelecting } = this.state;
		const selection = window.getSelection();
		const range =
			selection.rangeCount > 0 ? selection.getRangeAt( 0 ) : null;
		if ( ! range ) {
			return;
		}

		if ( ! isSelecting && range.startOffset !== range.endOffset ) {
			this.setState( { isSelecting: true } );
		}

		if ( selection.isCollapsed ) {
			this.setState( { isVisible: false, anchorRef: null } );
			return;
		}

		if (
			range.startContainer.parentNode.classList.contains( 'wp-block' ) ||
			range.startContainer.parentNode.classList.contains( 'rich-text' ) ||
			range.startContainer.parentNode.parentNode.classList.contains(
				'wp-block'
			) ||
			range.startContainer.parentNode.parentNode.classList.contains(
				'rich-text'
			) ||
			range.startContainer.parentNode.hasAttribute(
				'data-rich-text-format-boundary'
			)
		) {
			this.setState( { anchorRef: range } );
		}

		return false;
	}

	render() {
		const { isActive, name, isEnabled } = this.props;
		const { anchorRef, isVisible } = this.state;

		if ( ! isActive ) {
			return false;
		}

		if ( ! isEnabled ) {
			return false;
		}

		if ( anchorRef && isVisible && ! [ 'core/code' ].includes( name ) ) {
			return (
				<Fragment>
					<Popover
						ref={ this.containerRef }
						className="component-iceberg-contextual-toolbar"
						position="top center"
						focusOnMount={ false }
						anchorRef={ anchorRef }
						onFocusOutside={ ( event ) => {
							const containerElement = document.querySelector(
								'.component-iceberg-contextual-toolbar'
							);
							if (
								containerElement &&
								! containerElement.contains( event.target )
							) {
								this.setState( {
									isVisible: false,
								} );
							}
						} }
					>
						<Toolbar>
							{ [ 'bold', 'italic', 'link' ].map( ( format ) => (
								<Slot
									name={ `RichText.ToolbarControls.${ format }` }
									key={ format }
								/>
							) ) }
						</Toolbar>
					</Popover>
				</Fragment>
			);
		}

		return false;
	}
}

export default compose( [
	withInstanceId,
	withSelect( ( select ) => {
		const { isEditorPanelEnabled } = select( 'markdown-settings' );

		return {
			isActive: select( 'core/edit-post' ).isFeatureActive(
				'icebergWritingMode'
			),
			isEnabled: isEditorPanelEnabled( 'contextualToolbar' ),
		};
	} ),
	withDispatch( ( dispatch ) => ( {
		onTransform( clientId, blocks, name ) {
			dispatch( 'core/block-editor' ).replaceBlocks(
				clientId,
				switchToBlockType( blocks, name )
			);
		},
	} ) ),
	withSpokenMessages,
] )( ContextualToolbar );
