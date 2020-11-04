/**
 * WordPress dependencies
 */
import { useInstanceId } from '@wordpress/compose';
import { BaseControl, Icon } from '@wordpress/components';

/**
 * Internal dependencies
 */
import icons from '../icons';

export default function CheckboxUIControl( {
	label,
	className,
	heading,
	checked,
	help,
	onChange,
	...props
} ) {
	const instanceId = useInstanceId( CheckboxUIControl );
	const id = `inspector-checkboxui-control-${ instanceId }`;
	const onChangeValue = ( event ) => onChange( event.target.checked );

	return (
		<BaseControl
			label={ heading }
			id={ id }
			help={ help }
			className={ className }
		>
			<span className="components-checkbox-control__input-container components-checkbox-ui-control__input-container">
				<input
					id={ id }
					className="components-checkbox-control__input"
					type="checkbox"
					value="1"
					onChange={ onChangeValue }
					checked={ checked }
					aria-describedby={ !! help ? id + '__help' : undefined }
					{ ...props }
				/>
				{ checked ? (
					<Icon
						icon={ icons.eye }
						className="components-checkbox-control__checked"
						role="presentation"
					/>
				) : (
					<Icon
						icon={ icons.eyeClosed }
						className="components-checkbox-control__checked components-checkbox-control__checked--closed"
						role="presentation"
					/>
				) }
			</span>
			<label
				className="components-checkbox-control__label"
				htmlFor={ id }
			>
				{ label }
			</label>
		</BaseControl>
	);
}
