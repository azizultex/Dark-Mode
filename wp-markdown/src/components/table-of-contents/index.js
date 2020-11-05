/**
 * Internal dependencies
 */
import TableOfContents from './controls';

/**
 * WordPress dependencies
 */
import { registerPlugin } from '@wordpress/plugins';

registerPlugin( 'markdown-toc', {
	icon: false,
	render: TableOfContents,
} );
