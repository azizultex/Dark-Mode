/**
 * External dependencies
 */
import { map } from 'lodash';

/**
 * WordPress dependencies
 */
import { __, _x } from '@wordpress/i18n';
import { withSelect } from '@wordpress/data';
import { compose } from '@wordpress/compose';
import { Fragment, Component } from '@wordpress/element';
import { count } from '@wordpress/wordcount';
import { withSpokenMessages, BaseControl } from '@wordpress/components';

const mediaBlocks = [ 'core/image', 'core/gallery', 'core/cover' ];

class EstimatedReadingTime extends Component {
	constructor() {
		super( ...arguments );

		this.calculateReadingTime = this.calculateReadingTime.bind( this );
	}

	calculateReadingTime() {
		const { content, blocks } = this.props;
		const words = count( content, 'words', {} );

		let estimated = ( words / 275 ) * 60; //get time on seconds
		if ( blocks ) {
			let i = 12;
			map( blocks, ( block ) => {
				if ( mediaBlocks.includes( block.name ) ) {
					estimated = estimated + i;
					if ( i > 3 ) {
						i--;
					}
				}
			} );
		}
		estimated = estimated / 60; //convert to minutes

		//do not show zero
		if ( estimated < 1 ) {
			estimated = 1;
		}

		return estimated.toFixed();
	}

	render() {
		return (
			<Fragment>
				<BaseControl>
					{ __( 'Reading time:', 'dark-mode' ) }
					<span>
						{ this.calculateReadingTime() }
						{ _x(
							' min',
							'Reading time in minutes. Do not translate!'
						) }
					</span>
				</BaseControl>
			</Fragment>
		);
	}
}

export default compose( [
	withSelect( ( select ) => ( {
		content: select( 'core/editor' ).getEditedPostAttribute( 'content' ),
		blocks: select( 'core/editor' ).getEditedPostAttribute( 'blocks' ),
	} ) ),
	withSpokenMessages,
] )( EstimatedReadingTime );
