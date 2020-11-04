/**
 * Internal dependencies
 */
import TableOfContents from './controls';

/**
 * WordPress dependencies
 */
import { registerPlugin } from '@wordpress/plugins';

registerPlugin( 'iceberg-toc', {
	icon: false,
	render: TableOfContents,
} );
