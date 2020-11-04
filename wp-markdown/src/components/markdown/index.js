/**
 * Internal dependencies
 */

import MarkdownControl from './controls';
import './formats/mark/';
import './transforms';
import './emoji';
import './clear-formatting';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Fragment } from '@wordpress/element';
import { registerFormatType } from '@wordpress/rich-text';

/**
 * Block constants
 */
const name = 'wp-mark-down-editor/markdown';

export const settings = {
	name,
	title: __( 'Markdown', 'iceberg' ),
	tagName: 'p',
	className: 'iceberg-markdown',
	attributes: {
		style: 'style',
	},
	edit( { isActive, value, onChange, activeAttributes } ) {
		return (
			<Fragment>
				<MarkdownControl
					name={ name }
					isActive={ isActive }
					value={ value }
					onChange={ onChange }
					activeAttributes={ activeAttributes }
				/>
			</Fragment>
		);
	},
};

registerFormatType( name, settings );
