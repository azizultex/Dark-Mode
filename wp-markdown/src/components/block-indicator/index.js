/**
 * Internal dependencies
 */
import BlockIndicator from './indicator';
import allowedBlocks from '../block-limiter/allowed-blocks';

/**
 * WordPress dependencies
 */
import { addFilter } from '@wordpress/hooks';
import { Fragment } from '@wordpress/element';
import { createHigherOrderComponent } from '@wordpress/compose';

/**
 * Override the default edit UI to include a new block toolbar control
 *
 * @param {Function} BlockEdit Original component.
 * @return {string} Wrapped component.
 */
const withBlockName = createHigherOrderComponent( ( BlockEdit ) => {
	return ( props ) => {
		return (
			<Fragment>
				{ ! allowedBlocks.includes( props.name ) &&
					! props.name.includes( 'core-embed' ) && (
						<BlockIndicator { ...{ ...props } } />
					) }
				<BlockEdit { ...props } />
			</Fragment>
		);
	};
}, 'withBlockName' );

const addEditorBlockAttributes = createHigherOrderComponent(
	( BlockListBlock ) => {
		return ( props ) => {
			const { name } = props;

			let wrapperProps = props.wrapperProps;
			let customData = {};

			if (
				! allowedBlocks.includes( name ) &&
				! name.includes( 'core-embed' )
			) {
				customData = Object.assign( customData, {
					'data-markdown-not-allowed': 1,
				} );
			}

			wrapperProps = {
				...wrapperProps,
				...customData,
			};

			return (
				<BlockListBlock { ...props } wrapperProps={ wrapperProps } />
			);
		};
	},
	'addEditorBlockAttributes'
);

addFilter( 'editor.BlockEdit', 'markdown/block-indicator', withBlockName );

addFilter(
	'editor.BlockListBlock',
	'markdown/addEditorBlockAttributes',
	addEditorBlockAttributes
);
