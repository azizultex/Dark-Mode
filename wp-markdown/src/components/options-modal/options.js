/**
 * WordPress dependencies
 */
import {__} from '@wordpress/i18n';
import {withDispatch} from '@wordpress/data';
import {Component, Fragment} from '@wordpress/element';
import {compose, withInstanceId} from '@wordpress/compose';
import {Button, Modal, withSpokenMessages} from '@wordpress/components';
/**
 * Internal dependencies
 */
import Section from './section';
import {EnablePanelOption} from './';

import defaults from '../../components/theme-editor/default';

class Options extends Component {
    constructor() {
        super(...arguments);

        this.state = {
            isResetting: false,
        };
    }

    render() {
        const {closeModal, resetAllSettings} = this.props;
        const {isResetting} = this.state;
        return (
            <Fragment>
                <Modal
                    className="components-markdown-options-modal"
                    title={
                        <span>{__('WP Markdown Settings', 'dark-mode')}
                            {!WPMD_Settings.is_pro &&
                            <a href="https://wppool.dev/wp-markdown-editor" target={'_blank'} className={'wp-markdown-get-pro-btn'}>{__('Get PRO', 'dark-mode')}</a>}
                        </span>}
                    onRequestClose={closeModal}
                >
                    {!WPMD_Settings.is_pro ? <span className="components-markdown-options-modal-subtitle">{__('Upgrade to PRO to customize the settings', 'dark-mode')}</span> : ''}

                    <Section title={`Writing`}>

                        <EnablePanelOption
                            label={__('Minimize images', 'dark-mode')}
                            panelName="minimizeImages"
                        />

                        <EnablePanelOption
                            label={__('Emoji shortcuts', 'dark-mode')}
                            panelName="emoji"
                        />

                        <EnablePanelOption
                            label={__('Show heading levels', 'dark-mode')}
                            panelName="headingIndicators"
                        />

                        <EnablePanelOption
                            label={__('Scale heading levels', 'dark-mode')}
                            panelName="scaledHeading"
                        />

                        <EnablePanelOption
                            label={__('Indent paragraphs', 'dark-mode')}
                            panelName="textIndent"
                        />

                        <EnablePanelOption
                            label={__(
                                'Inline contextual toolbar',
                                'dark-mode'
                            )}
                            panelName="contextualToolbar"
                        />

                        <EnablePanelOption
                            label={__(
                                'Set WP Markdown as the default editor for posts',
                                'dark-mode'
                            )}
                            panelName="isDefaultEditor"
                        />

                    </Section>

                    <Section title={__('Interface', 'dark-mode')}>

                        <EnablePanelOption
                            label={__('Theme switcher', 'dark-mode')}
                            panelName="uiThemes"
                            optionType="ui"
                        />

                        <EnablePanelOption
                            label={__('Table of contents', 'dark-mode')}
                            panelName="uiToc"
                            optionType="ui"
                        />

                        <EnablePanelOption
                            label={__('Markdown shortcuts', 'dark-mode')}
                            panelName="uiShortcuts"
                            optionType="ui"
                        />

                        <EnablePanelOption
                            label={__(
                                'Back to WordPress button',
                                'dark-mode'
                            )}
                            panelName="uiBackTo"
                            optionType="ui"
                        />

                        <EnablePanelOption
                            label={__('Document information', 'dark-mode')}
                            panelName="documentInformation"
                            optionType="ui"
                        />

                        <EnablePanelOption
                            label={__(
                                'WP Markdown header toolbar shortcut',
                                'dark-mode'
                            )}
                            panelName="uiHeaderShortcut"
                            optionType="ui"
                        />
                    </Section>

                    {/*<Section title={ __( 'License', 'dark-mode' ) }>*/}
                    {/*	<LicenseSettings />*/}
                    {/*</Section>*/}

                    <Section title={__('Reset', 'dark-mode')}>
                        <Fragment>
                            {!isResetting && (
                                <Button
                                    isSecondary
                                    className="edit-post-options-modal__reset-markdown-confirmation-button"
                                    onClick={() => {
                                        this.setState({
                                            isResetting: true,
                                        });
                                    }}
                                >
                                    {__('Reset all settings', 'dark-mode')}
                                </Button>
                            )}
                            {isResetting && (
                                <Button
                                    isPrimary
                                    className="edit-post-options-modal__reset-markdown-confirmation-button"
                                    onClick={() => {
                                        resetAllSettings();
                                        location.reload();
                                    }}
                                >
                                    {__('Really reset?', 'dark-mode')}
                                </Button>
                            )}
                        </Fragment>
                    </Section>

                </Modal>
            </Fragment>
        );
    }
}

export default compose([
    withDispatch((dispatch) => {
        const {setThemeSettings} = dispatch('markdown-settings');

        return {
            resetAllSettings() {
                setThemeSettings(defaults);
            },
        };
    }),
    withInstanceId,
    withSpokenMessages,
])(Options);
