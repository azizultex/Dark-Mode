/**
 * Internal dependencies
 */

/**
 * WordPress dependencies
 */
import { withSelect, withDispatch, select } from '@wordpress/data';
import { compose } from '@wordpress/compose';
import { rawShortcut } from '@wordpress/keycodes';
import { switchToBlockType, createBlock } from '@wordpress/blocks';
import { Fragment, Component } from '@wordpress/element';
import { withSpokenMessages, KeyboardShortcuts } from '@wordpress/components';
import { addQueryArgs } from '@wordpress/url';
import {
	create,
	toHTMLString,
	join,
	__UNSTABLE_LINE_SEPARATOR,
} from '@wordpress/rich-text';

class RegisterShortcuts extends Component {
	constructor() {
		super( ...arguments );
		this.triggerHeadingShortcut = this.triggerHeadingShortcut.bind( this );
		this.triggerListShortcut = this.triggerListShortcut.bind( this );
		this.triggerListTransform = this.triggerListTransform.bind( this );
		this.triggerPagesShortcut = this.triggerPagesShortcut.bind( this );
		this.triggerOpenShortcut = this.triggerOpenShortcut.bind( this );
		this.triggerCreationShortcut = this.triggerCreationShortcut.bind(
			this
		);
	}

	triggerOpenShortcut( event ) {
		//open popover
		const opener = document.querySelector(
			'.components-markdown-shortcuts__trigger .components-button'
		);

		if ( opener ) {
			opener.style.visibility = 'visible';
			opener.click();
		}

		event.preventDefault();
		event.stopImmediatePropagation();
	}

	triggerHeadingShortcut( event ) {
		const {
			selectedBlock,
			updateBlockAttributes,
			onTransform,
		} = this.props;

		if ( typeof selectedBlock === 'undefined' ) {
			return false;
		}

		if ( ! selectedBlock ) {
			return false;
		}

		const level = parseInt( event.code.replace( /^\D+/g, '' ) );

		if ( [ 'core/heading' ].includes( selectedBlock.name ) ) {
			if ( level === 7 ) {
				onTransform(
					selectedBlock.clientId,
					selectedBlock,
					'core/paragraph'
				);
			} else {
				updateBlockAttributes( selectedBlock.clientId, {
					level,
				} );
			}
		} else if (
			[ 'core/paragraph' ].includes( selectedBlock.name ) &&
			level < 7
		) {
			onTransform(
				selectedBlock.clientId,
				selectedBlock,
				'core/heading'
			);

			// Update heading level
			updateBlockAttributes( selectedBlock.clientId, { level } );
		}

		event.preventDefault();
	}

	triggerListShortcut( event ) {
		const { selectedBlock, updateBlockAttributes } = this.props;

		if ( typeof selectedBlock === 'undefined' ) {
			return false;
		}

		if ( ! selectedBlock ) {
			return false;
		}

		if ( [ 'core/list' ].includes( selectedBlock.name ) ) {
			updateBlockAttributes( selectedBlock.clientId, {
				ordered: ! selectedBlock.attributes.ordered,
			} );
		}

		event.preventDefault();
	}

	triggerPagesShortcut( event ) {
		const { postType } = this.props;
		window.location.href = addQueryArgs( 'edit.php', {
			post_type: postType,
		} );

		event.preventDefault();
	}

	triggerCreationShortcut( event ) {
		const { postType } = this.props;

		window.location.href = addQueryArgs( 'post-new.php', {
			post_type: postType,
			is_markdown: 1,
		} );

		event.preventDefault();
		event.stopImmediatePropagation();
	}

	triggerListTransform( event ) {
		const {
			removeBlocks,
			selectedBlock,
			onTransform,
			hasMultiSelection,
			multiSelectedBlocks,
			multiSelectedBlockClientIds,
			insertionPoint,
			insertBlock,
		} = this.props;

		if ( typeof selectedBlock === 'undefined' && ! hasMultiSelection ) {
			return false;
		}

		if ( ! selectedBlock && ! hasMultiSelection ) {
			return false;
		}

		if ( selectedBlock ) {
			if ( [ 'core/paragraph' ].includes( selectedBlock.name ) ) {
				onTransform(
					selectedBlock.clientId,
					selectedBlock,
					'core/list'
				);
			}
		} else if ( hasMultiSelection ) {
			let validBlocks = true;

			multiSelectedBlocks.forEach( ( { name } ) => {
				if ( ! [ 'core/paragraph', 'core/heading' ].includes( name ) ) {
					validBlocks = false;
				}
			} );

			if ( ! validBlocks ) {
				return false;
			}

			const created = createBlock( 'core/list', {
				values: toHTMLString( {
					value: join(
						multiSelectedBlocks.map( ( { attributes } ) => {
							const value = create( {
								html: attributes.content,
							} );

							return value;
						} ),
						__UNSTABLE_LINE_SEPARATOR
					),
					multilineTag: 'li',
				} ),
			} );

			removeBlocks( multiSelectedBlockClientIds );
			insertBlock( created, insertionPoint.index - 1 );
		}

		event.preventDefault();
	}

	render() {
		const { isActive } = this.props;

		if ( ! isActive ) {
			return false;
		}

		return (
			<Fragment>
				<KeyboardShortcuts
					bindGlobal
					shortcuts={ {
						[ rawShortcut.primaryAlt( 'h' ) ]: this
							.triggerOpenShortcut,
						[ rawShortcut.primaryAlt( '1' ) ]: this
							.triggerHeadingShortcut,
						[ rawShortcut.primaryAlt( '2' ) ]: this
							.triggerHeadingShortcut,
						[ rawShortcut.primaryAlt( '3' ) ]: this
							.triggerHeadingShortcut,
						[ rawShortcut.primaryAlt( '4' ) ]: this
							.triggerHeadingShortcut,
						[ rawShortcut.primaryAlt( '5' ) ]: this
							.triggerHeadingShortcut,
						[ rawShortcut.primaryAlt( '6' ) ]: this
							.triggerHeadingShortcut,
						[ rawShortcut.primaryAlt( '7' ) ]: this
							.triggerHeadingShortcut,
						[ rawShortcut.primaryAlt( '8' ) ]: this
							.triggerListTransform,
						[ rawShortcut.primaryShift( '9' ) ]: this
							.triggerListShortcut,
						[ rawShortcut.secondary( 'p' ) ]: this
							.triggerPagesShortcut,
						[ rawShortcut.primaryShift( '=' ) ]: this
							.triggerCreationShortcut,
					} }
				/>
			</Fragment>
		);
	}
}

export default compose( [
	withSelect( () => {
		const {
			getSelectedBlock,
			getMultiSelectedBlocks,
			hasMultiSelection,
			getMultiSelectedBlockClientIds,
		} = select( 'core/block-editor' );
		const selectedBlock = getSelectedBlock();

		return {
			selectedBlock,
			hasMultiSelection: hasMultiSelection(),
			multiSelectedBlocks: getMultiSelectedBlocks(),
			multiSelectedBlockClientIds: getMultiSelectedBlockClientIds(),
			postType: select( 'core/editor' ).getCurrentPostType(),
			insertionPoint: select(
				'core/block-editor'
			).getBlockInsertionPoint(),
		};
	} ),
	withDispatch( ( dispatch ) => ( {
		updateBlockAttributes: dispatch( 'core/block-editor' )
			.updateBlockAttributes,
		onTransform( clientId, blocks, name ) {
			dispatch( 'core/block-editor' ).replaceBlocks(
				clientId,
				switchToBlockType( blocks, name )
			);
		},
		removeBlocks( clientIds ) {
			dispatch( 'core/block-editor' ).removeBlocks( clientIds );
		},
		insertBlock( created, insertionPoint ) {
			dispatch( 'core/block-editor' ).insertBlocks(
				created,
				insertionPoint
			);
		},
	} ) ),
	withSpokenMessages,
] )( RegisterShortcuts );
