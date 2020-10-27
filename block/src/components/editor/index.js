/**
 * Internal dependencies
 */
import IcebergEditor from './editor';
import createIcebergStore from '../../extensions/settings-store/store';

/**
 * WordPress dependencies
 */
import { registerGenericStore } from '@wordpress/data';
import { registerPlugin } from '@wordpress/plugins';

registerPlugin( 'iceberg-editor', {
	icon: false,
	render: IcebergEditor,
} );

registerGenericStore( 'iceberg-settings', createIcebergStore() );
