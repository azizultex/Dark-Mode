/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { addFilter } from '@wordpress/hooks';
import { Fragment } from '@wordpress/element';
import { withDispatch } from '@wordpress/data';
import {
	compose,
	createHigherOrderComponent,
	withState,
} from '@wordpress/compose';
import { TextControl, Button, Spinner, Notice } from '@wordpress/components';

const enhance = compose(
	withState( {
		licenseKey: window.icebergSettings.license.key,
		action: 'activate',
		isLoading: false,
	} ),
	withDispatch( ( dispatch, props ) => {
		const { licenseKey, action, setState } = props;
		const { license } = window.icebergSettings;

		if (
			licenseKey === null &&
			typeof license.typography.key !== 'undefined'
		) {
			// licenseKey = license.key;
		}

		return {
			handleActivation() {
				dispatch( 'iceberg-settings' ).handleLicenseActivation(
					action,
					licenseKey,
					setState
				);
			},
		};
	} )
);

const LicenseActivation = createHigherOrderComponent( ( FilteredComponent ) => {
	return enhance( ( { ...props } ) => {
		const {
			handleActivation,
			setState,
			licenseKey,
			action,
			isLoading,
		} = props;
		const { license } = window.icebergSettings;

		if (
			typeof licenseKey !== 'undefined' &&
			licenseKey !== '' &&
			typeof license.license !== 'undefined' &&
			license.license === 'valid'
		) {
			if ( action !== 'deactivate' ) {
				setState( () => ( { action: 'deactivate' } ) );
			}
		}

		return (
			<Fragment>
				<FilteredComponent { ...props } />

				<div className="license-flex">
					<TextControl
						value={ licenseKey }
						onChange={ ( newValue ) => {
							setState( () => ( {
								licenseKey: newValue,
							} ) );
						} }
					/>
					<Button
						isPrimary={ action !== 'deactivate' }
						isSecondary={ action === 'deactivate' }
						isLarge
						isBusy={ isLoading }
						isDisabled={ isLoading }
						onClick={ () => {
							setState( () => ( {
								isLoading: true,
							} ) );
							handleActivation();
						} }
					>
						{ isLoading ? <Spinner /> : action }
					</Button>
				</div>

				{ typeof license !== 'undefined' &&
					typeof license.license !== 'undefined' &&
					license.license === 'invalid' && (
						<Notice isDismissible={ false } status="error">
							<p>
								{ __(
									'Invalid or expired license',
									'iceberg'
								) }
							</p>
						</Notice>
					) }
				{ typeof license !== 'undefined' &&
					typeof license.license !== 'undefined' &&
					license.license === 'valid' && (
						<Notice isDismissible={ false } status="success">
							<p>
								{ __( 'Successfully activated!', 'iceberg' ) }
							</p>
						</Notice>
					) }
			</Fragment>
		);
	} );
}, 'LicenseActivation' );

addFilter(
	'iceberg.licenseSection',
	'iceberg/license-activation',
	LicenseActivation
);
