/**
 * Replaces items matched in the regex with new line
 *
 * @param {string} text     The string being counted.
 *
 * @return {string} The manipulated text.
 */
export default function( text ) {
	return text.replace( /<\/?[a-z][^>]*?>/gi, '\n' );
}
