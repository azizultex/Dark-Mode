/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Fragment } from '@wordpress/element';
import { withFilters } from '@wordpress/components';

export const LicenseSettings = () => {
	return (
		<Fragment>
			<p className="license-help">
				{ __(
					'Enter your license key for updates and support',
					'iceberg'
				) }
			</p>
		</Fragment>
	);
};

export default withFilters( 'iceberg.licenseSection' )( LicenseSettings );
