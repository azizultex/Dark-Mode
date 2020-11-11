/**
 * External dependencies
 */
import { map } from 'lodash';

/**
 * Internal dependencies
 */
import allowedBlocks from './allowed-blocks';

/**
 * WordPress dependencies
 */
import { Component } from '@wordpress/element';
import { withSelect, withDispatch, select } from '@wordpress/data';
import { compose, withInstanceId } from '@wordpress/compose';
import { withSpokenMessages } from '@wordpress/components';

class BlockLimiter extends Component {
	render() {
		const {
			isActive,
			allowedBlockTypes,
			blockTypes,
			toggleVisible,
			updateLimitedBlocks,
		} = this.props;

		const disabled = [];
		const hiddenBlocks = [];

		if ( typeof this.props.limitedBlocks === 'undefined' ) {
			return false;
		}

		const limitedBlocks = JSON.parse( this.props.limitedBlocks, true );

		if ( allowedBlockTypes ) {
			allowedBlocks = allowedBlockTypes;
		}

		if ( isActive ) {
			map( blockTypes, ( blockType ) => {
				if (
					! allowedBlocks.includes( blockType.name ) &&
					! hiddenBlocks.includes( blockType.name )
				) {
					disabled.push( blockType.name );
				}
			} );

			if (
				typeof limitedBlocks.length === 'undefined' ||
				limitedBlocks.length === 0
			) {
				toggleVisible( disabled );
				toggleVisible( allowedBlocks, true );
				updateLimitedBlocks( disabled );
			}
		} else if ( ! isActive && limitedBlocks.length > 0 ) {
			toggleVisible( limitedBlocks, true );
			updateLimitedBlocks( {} );
		}

		return false;
	}
}

export default compose( [
	withInstanceId,
	withSelect( () => {
		const { getLimitedBlocks } = select( 'markdown-settings' );
		const { getBlockTypes } = select( 'core/blocks' );
		return {
			limitedBlocks: getLimitedBlocks(),
			blockTypes: getBlockTypes(),
		};
	} ),
	withDispatch( ( dispatch ) => {
		const { showBlockTypes, hideBlockTypes } = dispatch( 'core/edit-post' );
		const { setLimitedBlocks } = dispatch( 'markdown-settings' );

		return {
			toggleVisible( blockNames, nextIsChecked ) {
				if ( nextIsChecked ) {
					showBlockTypes( blockNames );
				} else {
					hideBlockTypes( blockNames );
				}
			},
			updateLimitedBlocks( blockNames ) {
				setLimitedBlocks( blockNames );
			},
		};
	} ),
	withSpokenMessages,
] )( BlockLimiter );
