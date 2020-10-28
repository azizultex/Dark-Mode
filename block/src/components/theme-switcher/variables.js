/**
 * External dependencies
 */
import { map } from 'lodash';
import Color from 'color';

/**
 * Internal dependencies
 */
import EditorFonts from '../theme-editor/fonts';

/**
 * Assign global CSS variables
 *
 * @param {Object} settings
 */
export function assignVariables( settings ) {
	const link = document.createElement( 'link' );
	link.rel = 'stylesheet';
	const cssVariables = [];

	const styleElement = document.getElementById( 'wp-mark-down-editor-style-inline-css' );
	const colors =
		typeof settings.colors !== 'undefined' ? settings.colors : {};
	const typography =
		typeof settings.typography !== 'undefined' ? settings.typography : {};

	const headingFontSize = parseFloat( typography[ 'font-size' ] ) * 1;
	const headingLineHeight = typography[ 'line-height' ] * 1;
	const captionFontSize = parseFloat( typography[ 'font-size' ] ) * 0.8;

	const colorBackground = colors.background;
	const isColorBackgroundLight = Color( colorBackground ).isLight();

	const generatedColorText100 = isColorBackgroundLight
		? Color( colors.text ).darken( 0.1 )
		: Color( colors.text )
				.darken( 0.33 )
				.desaturate( 0.75 );
	const generatedColorBackground100 = isColorBackgroundLight
		? Color( colorBackground ).lighten( 0.0275 )
		: Color( colorBackground ).lighten( 0.115 );
	const generatedColorBackground200 = isColorBackgroundLight
		? Color( colorBackground ).darken( 0.1 )
		: Color( colorBackground ).lighten( 0.85 );
	const generatedColorBackground200a = isColorBackgroundLight
		? Color( colorBackground )
				.darken( 0.15 )
				.alpha( 0.9 )
		: Color( colorBackground )
				.darken( 0.66 )
				.alpha( 0.9 );
	const colorAccent = colors.accent;
	const isColorAccentLight = Color( colorAccent ).isLight();
	const generatedColorAccent100 = isColorAccentLight
		? Color( colorAccent )
				.lighten( 0.1 )
				.alpha( 0.5 )
		: Color( colorAccent ).alpha( 0.6 );
	const generatedColorAccent200 = isColorAccentLight
		? Color( colorAccent ).darken( 0.085 )
		: Color( colorAccent ).darken( 0.1 );
	const generatedColorAccent300 = isColorBackgroundLight
		? Color( colorAccent )
				.darken( 0.35 )
				.alpha( 0.115 )
				.saturate( 0.25 )
		: Color( colorAccent )
				.lighten( 0.01 )
				.alpha( 0.115 )
				.saturate( 0.25 );

	map( typography, ( fontConfig, key ) => {
		if ( typeof typography[ key ] !== 'undefined' ) {
			fontConfig = typography[ key ];

			if ( 'font' === key ) {
				cssVariables.push(
					'--iceberg--typography--font-family: ' +
						EditorFonts[ fontConfig ][ 'font-family' ] +
						';'
				);
			} else {
				cssVariables.push(
					'--iceberg--typography--' + key + ': ' + fontConfig + ';'
				);
			}
		}
	} );

	let fontUrl = '';
	if (
		typeof typography.font !== 'undefined' &&
		typeof EditorFonts[ typography.font ] !== 'undefined'
	) {
		fontUrl = EditorFonts[ typography.font ].url;
	}

	if ( fontUrl ) {
		link.href = fontUrl;
		document.head.appendChild( link );
	}

	cssVariables.push(
		`--iceberg--typography--heading--font-size: ${ parseFloat(
			headingFontSize
		).toFixed( 2 ) }rem;`
	);
	cssVariables.push(
		`--iceberg--typography--heading--line-height: ${ headingLineHeight.toFixed(
			2
		) };`
	);
	cssVariables.push(
		`--iceberg--typography--caption--font-size: ${ parseFloat(
			captionFontSize
		).toFixed( 2 ) }rem;`
	);

	map( colors, ( color, key ) => {
		cssVariables.push(
			'--iceberg--color--' + key + ': ' + Color( color ).hsl() + ';'
		);
	} );

	cssVariables.push(
		`--iceberg--color--text--dark: ${ generatedColorText100 };`
	);

	cssVariables.push(
		`--iceberg--color--accent--alpha: ${ generatedColorAccent300 };`
	);

	cssVariables.push(
		`--iceberg--color--accent--light: ${ generatedColorAccent100 };`
	);

	cssVariables.push(
		`--iceberg--color--accent--dark: ${ generatedColorAccent200 };`
	);

	cssVariables.push(
		`--iceberg--color--background--light: ${ generatedColorBackground100 };`
	);

	cssVariables.push(
		`--iceberg--color--background--dark: ${ generatedColorBackground200 };`
	);

	cssVariables.push(
		`--iceberg--color--background--alpha: ${ generatedColorBackground200a };`
	);

	// Add variables to <style>
	styleElement.innerHTML = ':root{' + cssVariables.join( '' ) + '}';
}
