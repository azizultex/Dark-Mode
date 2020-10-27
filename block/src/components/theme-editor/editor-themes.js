/*global icebergSettings*/

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

if ( icebergSettings.customThemes ) {
	map( reverse( icebergSettings.customThemes ), ( custom, key ) => {
		customThemes = assign(
			{ [ 'theme-support-' + key ]: custom },
			customThemes
		);
	} );
}

EditorThemes = merge( {}, EditorThemes, customThemes );

export default EditorThemes;
