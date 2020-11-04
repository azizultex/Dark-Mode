/**
 * Removes items matched in the regex.
 *
 * @param {string} text     The string being counted.
 *
 * @return {string} The manipulated text.
 */
export default function( text ) {
	return text.replace(
		new RegExp(
			[
				'[',

				// Basic Latin (extract)
				'\u0021-\u0040\u005B-\u0060\u007B-\u007E',

				// Latin-1 Supplement (extract)
				'\u0080-\u00BF\u00D7\u00F7',

				/*
				 * The following range consists of:
				 * General Punctuation
				 * Superscripts and Subscripts
				 * Currency Symbols
				 * Combining Diacritical Marks for Symbols
				 * Letterlike Symbols
				 * Number Forms
				 * Arrows
				 * Mathematical Operators
				 * Miscellaneous Technical
				 * Control Pictures
				 * Optical Character Recognition
				 * Enclosed Alphanumerics
				 * Box Drawing
				 * Block Elements
				 * Geometric Shapes
				 * Miscellaneous Symbols
				 * Dingbats
				 * Miscellaneous Mathematical Symbols-A
				 * Supplemental Arrows-A
				 * Braille Patterns
				 * Supplemental Arrows-B
				 * Miscellaneous Mathematical Symbols-B
				 * Supplemental Mathematical Operators
				 * Miscellaneous Symbols and Arrows
				 */
				'\u2000-\u2BFF',

				// Supplemental Punctuation
				'\u2E00-\u2E7F',
				']',
			].join( '' ),
			'g'
		),
		''
	);
}
