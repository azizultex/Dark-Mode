/**
 * WordPress dependencies
 */
import { CheckboxControl } from '@wordpress/components';

/**
 * Internal dependencies
 */
import CheckboxUIControl from './checkbox-ui';

function BaseOption( { label, isChecked, onChange, children, optionType } ) {
	return (
		<div className="edit-post-options-modal__option">
			{ optionType === 'ui' ? (
				<CheckboxUIControl
					label={ label }
					checked={ isChecked }
					onChange={ onChange }
				/>
			) : (
				<CheckboxControl
					label={ label }
					checked={ isChecked }
					onChange={ onChange }
				/>
			) }
			{ children }
		</div>
	);
}

export default BaseOption;
