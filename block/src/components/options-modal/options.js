/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { withDispatch } from '@wordpress/data';
import { Component, Fragment } from '@wordpress/element';
import { compose, withInstanceId } from '@wordpress/compose';
import { withSpokenMessages, Modal, Button } from '@wordpress/components';

/**
 * Internal dependencies
 */
import Section from './section';
import { EnablePanelOption } from './';
import LicenseSettings from './licenses/license-settings';
import defaults from '../../components/theme-editor/default';

class Options extends Component {
	constructor() {
		super( ...arguments );

		this.state = {
			isResetting: false,
		};
	}

	render() {
		const { closeModal, resetAllSettings } = this.props;
		const { isResetting } = this.state;
		return (
			<Fragment>
				<Modal
					className="components-iceberg-options-modal"
					title={ __( 'Iceberg options', 'iceberg' ) }
					onRequestClose={ closeModal }
				>
					<Section title={ __( 'Writing', 'iceberg' ) }>
						<EnablePanelOption
							label={ __( 'Minimize images', 'iceberg' ) }
							panelName="minimizeImages"
						/>
						<EnablePanelOption
							label={ __( 'Emoji shortcuts', 'iceberg' ) }
							panelName="emoji"
						/>
						<EnablePanelOption
							label={ __( 'Show heading levels', 'iceberg' ) }
							panelName="headingIndicators"
						/>
						<EnablePanelOption
							label={ __( 'Scale heading levels', 'iceberg' ) }
							panelName="scaledHeading"
						/>
						<EnablePanelOption
							label={ __( 'Indent paragraphs', 'iceberg' ) }
							panelName="textIndent"
						/>
						<EnablePanelOption
							label={ __(
								'Inline contextual toolbar',
								'iceberg'
							) }
							panelName="contextualToolbar"
						/>
						<EnablePanelOption
							label={ __(
								'Set Iceberg as the default editor for posts',
								'iceberg'
							) }
							panelName="isDefaultEditor"
						/>
					</Section>
					<Section title={ __( 'Interface', 'iceberg' ) }>
						<EnablePanelOption
							label={ __( 'Theme switcher', 'iceberg' ) }
							panelName="uiThemes"
							optionType="ui"
						/>
						<EnablePanelOption
							label={ __( 'Table of contents', 'iceberg' ) }
							panelName="uiToc"
							optionType="ui"
						/>
						<EnablePanelOption
							label={ __( 'Markdown shortcuts', 'iceberg' ) }
							panelName="uiShortcuts"
							optionType="ui"
						/>
						<EnablePanelOption
							label={ __(
								'Back to WordPress button',
								'iceberg'
							) }
							panelName="uiBackTo"
							optionType="ui"
						/>
						<EnablePanelOption
							label={ __( 'Document information', 'iceberg' ) }
							panelName="documentInformation"
							optionType="ui"
						/>
						<EnablePanelOption
							label={ __(
								'Iceberg header toolbar shortcut',
								'iceberg'
							) }
							panelName="uiHeaderShortcut"
							optionType="ui"
						/>
					</Section>
					<Section title={ __( 'License', 'iceberg' ) }>
						<LicenseSettings />
					</Section>
					<Section title={ __( 'Reset', 'iceberg' ) }>
						<Fragment>
							{ ! isResetting && (
								<Button
									isSecondary
									className="edit-post-options-modal__reset-iceberg-confirmation-button"
									onClick={ () => {
										this.setState( {
											isResetting: true,
										} );
									} }
								>
									{ __( 'Reset all settings', 'iceberg' ) }
								</Button>
							) }
							{ isResetting && (
								<Button
									isPrimary
									className="edit-post-options-modal__reset-iceberg-confirmation-button"
									onClick={ () => {
										resetAllSettings();
										location.reload();
									} }
								>
									{ __( 'Really reset?', 'iceberg' ) }
								</Button>
							) }
						</Fragment>
					</Section>
				</Modal>
			</Fragment>
		);
	}
}

export default compose( [
	withDispatch( ( dispatch ) => {
		const { setThemeSettings } = dispatch( 'iceberg-settings' );

		return {
			resetAllSettings() {
				setThemeSettings( defaults );
			},
		};
	} ),
	withInstanceId,
	withSpokenMessages,
] )( Options );
