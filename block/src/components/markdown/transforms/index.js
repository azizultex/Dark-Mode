/**
 * WordPress dependencies
 */
import { addFilter } from '@wordpress/hooks';
import { createBlock } from '@wordpress/blocks';

/**
 * Filters registered block settings, extending attributes with anchor using ID
 * of the first node.
 *
 * @param {Object} settings Original block settings.
 *
 * @return {Object} Filtered block settings.
 */
function addTransforms( settings ) {
	if (
		( typeof settings.transforms !== 'undefined' ) !== 'undefined' &&
		[ 'core/paragraph' ].includes( settings.name )
	) {
		const transforms = settings.transforms;

		if ( typeof transforms.from === 'undefined' ) {
			transforms.from = [];
		}

		const convertToHeading = {
			type: 'prefix',
			prefix: '#',
			transform() {
				return createBlock( 'core/heading', { level: 1 } );
			},
		};

		const convertToSeparator = {
			type: 'prefix',
			prefix: '---',
			transform() {
				return createBlock( 'core/separator', {} );
			},
		};

		const convertToSeparatorEquals = {
			type: 'prefix',
			prefix: '===',
			transform() {
				return createBlock( 'core/separator', {} );
			},
		};

		const convertToCommentsWithPlus = {
			type: 'prefix',
			prefix: '++',
			transform() {
				return createBlock( 'core/paragraph', {
					customClassName: 'iceberg-comment',
					className: 'iceberg-comment with-plus',
				} );
			},
		};

		const convertToCommentsWithPercentage = {
			type: 'prefix',
			prefix: '%%',
			transform() {
				return createBlock( 'core/paragraph', {
					customClassName: 'iceberg-comment',
					className: 'iceberg-comment with-percentage',
				} );
			},
		};

		const convertToBlock = {
			type: 'prefix',
			prefix: '```',
			transform() {
				return createBlock( 'core/code', {} );
			},
		};

		transforms.from.push( convertToHeading );
		transforms.from.push( convertToSeparator );
		transforms.from.push( convertToSeparatorEquals );
		transforms.from.push( convertToCommentsWithPlus );
		transforms.from.push( convertToCommentsWithPercentage );
		transforms.from.push( convertToBlock );

		settings.transforms = transforms;
	}

	return settings;
}

addFilter(
	'blocks.registerBlockType',
	'editorskit/transform/group',
	addTransforms
);
