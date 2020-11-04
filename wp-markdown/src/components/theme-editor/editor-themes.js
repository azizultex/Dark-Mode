/*global WPMD_Settings*/

/**
 * External dependencies
 */
import { map, assign, merge, reverse } from 'lodash';

/**
 * Internal dependencies
 */
import EditorThemesData from './themes';

let EditorThemes = EditorThemesData;
let customThemes = {};

if ( WPMD_Settings.customThemes ) {
	map( reverse( WPMD_Settings.customThemes ), ( custom, key ) => {
		customThemes = assign(
			{ [ 'theme-support-' + key ]: custom },
			customThemes
		);
	} );
}

EditorThemes = merge( {}, EditorThemes, customThemes );

export default EditorThemes;
