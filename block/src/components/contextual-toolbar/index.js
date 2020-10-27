/**
 * Internal dependencies
 */
import ContextualToolbar from './toolbar';

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
const withToolbar = createHigherOrderComponent( ( BlockEdit ) => {
	return ( props ) => {
		const { isSelected } = props;
		return (
			<Fragment>
				{ isSelected && <ContextualToolbar { ...{ ...props } } /> }
				<BlockEdit { ...props } />
			</Fragment>
		);
	};
}, 'withToolbar' );

addFilter( 'editor.BlockEdit', 'iceberg/contextual-toolbar', withToolbar );
