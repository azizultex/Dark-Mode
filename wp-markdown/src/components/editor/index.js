/**
 * Internal dependencies
 */
import MarkdownEditor from './editor';
import createMarkdownStore from '../../extensions/settings-store/store';

/**
 * WordPress dependencies
 */
import { registerGenericStore } from '@wordpress/data';
import { registerPlugin } from '@wordpress/plugins';

registerPlugin( 'iceberg-editor', {
	icon: false,
	render: MarkdownEditor,
} );

registerGenericStore( 'markdown-settings', createMarkdownStore() );
