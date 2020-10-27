/**
 * Removes items matched in the regex.
 *
 * @param {string} text     The string being counted.
 *
 * @return {string} The manipulated text.
 */
export default function( text ) {
	return text.replace( /&\S+?;/g, '' );
}
