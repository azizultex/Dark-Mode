/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { Button, Dropdown, ColorPicker } from '@wordpress/components';

export default function ColorPalette( { label, value, onChange, className } ) {
	const POPOVER_PROPS = {
		className:
			'components-markdown-popover components-markdown-color-palette__content',
		position: 'bottom right',
	};

	const TOGGLE_PROPS = {
		tooltipPosition: 'bottom',
	};

	const classes = classnames(
		'components-color-palette',
		'iceberg-components-color-palette',
		className
	);
	return (
		<div className={ classes }>
			<Dropdown
				className="components-color-palette__item-wrapper components-color-palette__custom-color"
				contentClassName="components-color-palette__picker"
				popoverProps={ POPOVER_PROPS }
				toggleProps={ TOGGLE_PROPS }
				renderToggle={ ( { onToggle } ) => (
					<Button
						type="button"
						className="components-button components-circular-option-picker__option"
						style={ { color: value } }
						onClick={ onToggle }
					>
						<span>{ label }</span>
					</Button>
				) }
				renderContent={ () => (
					<ColorPicker
						color={ value }
						onChangeComplete={ ( color ) => onChange( color.hex ) }
						disableAlpha
					/>
				) }
			/>
		</div>
	);
}
