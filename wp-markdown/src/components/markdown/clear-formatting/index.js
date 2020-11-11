/**
 * External dependencies
 */
import { map } from 'lodash';

/**
 * Internal dependencies
 */

import { getActiveFormats } from './get-active-formats';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Fragment } from '@wordpress/element';
import { RichTextShortcut } from '@wordpress/block-editor';
import { removeFormat, registerFormatType } from '@wordpress/rich-text';

/**
 * Block constants
 */
const name = 'markdown/clear-formatting';
const title = __( 'Clear formatting', 'dark-mode' );

export const settings = {
	name,
	title,
	tagName: 'span',
	className: 'markdown-clear-format',
	edit( { value, onChange } ) {
		const onToggle = () => {
			const activeFormats = getActiveFormats( value );
			if ( activeFormats.length > 0 ) {
				let newValue = value;

				map( activeFormats, ( activeFormat ) => {
					newValue = removeFormat( newValue, activeFormat.type );
				} );

				onChange( { ...newValue } );
			}
		};
		return (
			<Fragment>
				<RichTextShortcut
					type="ctrl"
					character="space"
					onUse={ onToggle }
				/>
			</Fragment>
		);
	},
};

registerFormatType( name, settings );
