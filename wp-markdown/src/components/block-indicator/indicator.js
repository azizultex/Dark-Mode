/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Component, Fragment } from '@wordpress/element';
import { withSelect, withDispatch } from '@wordpress/data';
import { compose, withInstanceId } from '@wordpress/compose';
import { rawHandler, getBlockContent } from '@wordpress/blocks';
import { withSpokenMessages, Button } from '@wordpress/components';

class BlockIndicator extends Component {
	render() {
		const { isActive, name, convertToBlocks } = this.props;

		if ( ! isActive ) {
			return false;
		}

		let indicator = name;

		if ( 'core/block' === name ) {
			indicator = __( 'core/reusable', 'iceberg' );
		} else if ( 'core/freeform' === name ) {
			indicator = __( 'core/classic', 'iceberg' );
		}

		return (
			<Fragment>
				<div className="components-markdown-block-indicator">
					<span>{ indicator }</span>

					{ 'core/freeform' === name && (
						<Button
							isSecondary
							className="components-markdown-block-indicator-converter"
							onClick={ () => {
								convertToBlocks();
							} }
						>
							{ __( 'Convert to Blocks', 'iceberg' ) }
						</Button>
					) }
				</div>
			</Fragment>
		);
	}
}

export default compose( [
	withInstanceId,
	withSelect( ( select, { clientId } ) => ( {
		block: select( 'core/block-editor' ).getBlock( clientId ),
		isActive: select( 'core/edit-post' ).isFeatureActive(
			'icebergWritingMode'
		),
	} ) ),
	withDispatch( ( dispatch, { block } ) => {
		const { replaceBlock } = dispatch( 'core/block-editor' );

		return {
			convertToBlocks() {
				replaceBlock(
					block.clientId,
					rawHandler( { HTML: getBlockContent( block ) } )
				);
			},
		};
	} ),
	withSpokenMessages,
] )( BlockIndicator );
