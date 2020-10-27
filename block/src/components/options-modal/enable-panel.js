/**
 * WordPress dependencies
 */
import { compose, ifCondition } from '@wordpress/compose';
import { withSelect, withDispatch } from '@wordpress/data';

/**
 * Internal dependencies
 */
import BaseOption from './base';
import UpdateTitleHeight from '../utils/title-height';

export default compose(
	withSelect( ( select, { panelName } ) => {
		const { isEditorPanelEnabled } = select( 'iceberg-settings' );
		// console.log( panelName );
		return {
			isChecked: isEditorPanelEnabled( panelName ),
		};
	} ),
	ifCondition( ( { isRemoved } ) => ! isRemoved ),
	withDispatch( ( dispatch, { panelName } ) => ( {
		onChange: () => {
			dispatch( 'iceberg-settings' ).toggleEditorPanelEnabled(
				panelName
			);

			setTimeout( function() {
				UpdateTitleHeight();
			}, 100 );
		},
	} ) )
)( BaseOption );
