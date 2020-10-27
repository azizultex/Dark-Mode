/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Fragment } from '@wordpress/element';
import { RichTextToolbarButton } from '@wordpress/block-editor';
import { toggleFormat, registerFormatType } from '@wordpress/rich-text';

/**
 * Block constants
 */
const name = 'iceberg/mark';
const title = __( 'Mark', 'iceberg' );

export const settings = {
	name,
	title,
	tagName: 'mark',
	className: 'iceberg-mark',
	edit( { isActive, value, onChange, onFocus } ) {
		const onToggle = () => {
			onChange( toggleFormat( value, { type: name } ) );
		};

		const onClick = () => {
			onToggle();
			onFocus();
		};

		return (
			<Fragment>
				<RichTextToolbarButton
					name={ name }
					title={ title }
					onClick={ onClick }
					isActive={ isActive }
					shortcutType="primary"
					shortcutCharacter="."
				/>
			</Fragment>
		);
	},
};

registerFormatType( name, settings );
