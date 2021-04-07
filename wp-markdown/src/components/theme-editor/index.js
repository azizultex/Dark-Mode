/**
 * External dependencies
 */
import { map, merge } from 'lodash';

/**
 * Internal dependencies
 */
import defaults from './default';
import icons from '../icons';
import EditorThemes from './editor-themes';
import EditorFonts from './fonts';
import ColorPalette from './color-palette';
import UpdateTitleHeight from '../utils/title-height';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Fragment, Component } from '@wordpress/element';
import { withDispatch } from '@wordpress/data';
import { compose, withInstanceId } from '@wordpress/compose';
import {
	MenuGroup,
	MenuItem,
	BaseControl,
	RangeControl,
	SelectControl,
	withSpokenMessages,
} from '@wordpress/components';

class ThemeEditor extends Component {
	constructor() {

		console.log(EditorFonts)

		super( ...arguments );

		this.state = {
			updatedSettings: {},
		};
	}
	componentDidMount() {
		this.setState( { updatedSettings: this.props.themeSettings } );
	}
	render() {
		const {
			onToggle,
			onClose,
			themeSettings,
			loadConfig,
			isEditingTypography,
			updateState,
		} = this.props;

		const { updatedSettings } = this.state;

		if ( typeof updatedSettings.theme === 'undefined' ) {
			return false;
		}

		const updateSettings = ( category, key, value ) => {
			let settings = merge( {}, updatedSettings, {
				[ category ]: {
					[ key ]: value,
				},
				isDefault: typeof EditorThemes[ updatedSettings.theme ] !== 'undefined' ? true : false,
			} );

			if ( category === 'colors' ) {
				updateState( 'theme', 'custom' );
				settings = merge( {}, settings, {
					theme: 'custom',
					isCustom: true,
				} );
			}

			updateState( 'themeSettings', settings );
			this.setState( { updatedSettings: settings } );

			//reload variables
			loadConfig( settings.theme, settings );

			if ( category === 'typography' ) {
				UpdateTitleHeight();
			}
		};

		const selectOptions = () => {
			return [
				{
					label: __( 'Select font', 'dark-mode' ),
					value: '',
					disabled: true,
				},
				...map( EditorFonts, ( { name }, key ) => ( {
					value: key,
					label: name,
				} ) ),
			];
		};

		let colors =
			typeof updatedSettings.colors !== 'undefined'
				? updatedSettings.colors
				: {};

		let typography =
			typeof updatedSettings.typography !== 'undefined'
				? updatedSettings.typography
				: {};

		// merge defaults for missing values
		colors = merge( {}, defaults.colors, colors );
		typography = merge( {}, defaults.typography, typography );

		return (
			<Fragment>
				{ isEditingTypography ? (
					<Fragment>
						<MenuGroup className="components-markdown-theme-switcher__typography-panel">
							<SelectControl
								value={
									typeof typography.font !== 'undefined'
										? typography.font
										: ''
								}
								label={ __( 'Font', 'dark-mode' ) }
								onChange={ ( selected ) => {
									updateSettings(
										'typography',
										'font',
										selected
									);
								} }
								options={ selectOptions() }
								className="components-markdown-theme-switcher__font-family"
							/>
							<RangeControl
								label={ __( 'Font size', 'dark-mode' ) }
								value={
									typeof typography[ 'font-size' ] !==
									'undefined'
										? parseFloat(
												typography[ 'font-size' ]
										  )
										: null
								}
								min={ 0.75 }
								step={ 0.01 }
								max={ 1.75 }
								onChange={ ( fontSize ) => {
									updateSettings(
										'typography',
										'font-size',
										fontSize + 'rem'
									);
								} }
							/>
							<RangeControl
								label={ __( 'Line height', 'dark-mode' ) }
								value={
									typeof typography[ 'line-height' ] !==
									'undefined'
										? typography[ 'line-height' ]
										: null
								}
								min={ 1 }
								step={ 0.1 }
								max={ 5 }
								onChange={ ( lineHeight ) => {
									updateSettings(
										'typography',
										'line-height',
										lineHeight
									);
								} }
							/>
							<RangeControl
								label={ __( 'Line width', 'dark-mode' ) }
								value={
									typeof typography[ 'line-width' ] !==
									'undefined'
										? parseInt( typography[ 'line-width' ] )
										: null
								}
								min={ 25 }
								step={ 0.01 }
								max={ 65 }
								onChange={ ( lineWidth ) => {
									updateSettings(
										'typography',
										'line-width',
										lineWidth + 'rem'
									);
								} }
							/>
							<RangeControl
								label={ __( 'Paragraph spacing', 'dark-mode' ) }
								value={
									typeof typography.spacing !== 'undefined'
										? parseInt( typography.spacing )
										: null
								}
								min={ 0.75 }
								step={ 0.01 }
								max={ 5 }
								onChange={ ( spacing ) => {
									updateSettings(
										'typography',
										'spacing',
										spacing + 'rem'
									);
								} }
							/>
						</MenuGroup>
					</Fragment>
				) : (
					<Fragment>
						<MenuGroup>
							<BaseControl className="components-markdown-menu-title is-colors">
								{ __( 'Custom', 'dark-mode' ) }
							</BaseControl>
							<BaseControl className="components-base-control--is-colors">
								<ColorPalette
									label={ __( 'Text', 'dark-mode' ) }
									value={ colors.text }
									onChange={ ( textColor ) => {
										if ( ! textColor ) {
											textColor =
												EditorThemes[
													themeSettings.theme
												].colors.text;
										}
										updateSettings(
											'colors',
											'text',
											textColor
										);
									} }
								/>
								<ColorPalette
									label={ __( 'Background', 'dark-mode' ) }
									value={ colors.background }
									onChange={ ( backgroundColor ) => {
										if ( ! backgroundColor ) {
											backgroundColor =
												EditorThemes[
													themeSettings.theme
												].colors.background;
										}
										updateSettings(
											'colors',
											'background',
											backgroundColor
										);
									} }
								/>
								<ColorPalette
									label={ __( 'Accent', 'dark-mode' ) }
									value={ colors.accent }
									onChange={ ( accentColor ) => {
										if ( ! accentColor ) {
											accentColor =
												EditorThemes[
													themeSettings.theme
												].colors.accent;
										}
										updateSettings(
											'colors',
											'accent',
											accentColor
										);
									} }
								/>
							</BaseControl>
						</MenuGroup>
					</Fragment>
				) }
				<MenuGroup>
					<MenuItem
						className="components-markdown-theme-switcher__apply-defaults"
						onClick={ () => {
							onClose();
							onToggle();

							setTimeout( function() {
								document
									.querySelector(
										'.components-markdown-theme-switcher__trigger'
									)
									.click();
							}, 25 );

							// focus manually to fix closing outside bug
							document
								.querySelector(
									'.components-markdown-theme-switcher__content .components-popover__content'
								)
								.focus();
						} }
					>
						{ __( 'Back to editor themes', 'dark-mode' ) }
						{ icons.back }
					</MenuItem>
				</MenuGroup>
			</Fragment>
		);
	}
}

export default compose( [
	withInstanceId,
	withDispatch( ( dispatch ) => {
		const { setThemeSettings } = dispatch( 'markdown-settings' );

		return {
			updateThemeSettings( settings ) {
				setThemeSettings( settings );
			},
		};
	} ),
	withSpokenMessages,
] )( ThemeEditor );
