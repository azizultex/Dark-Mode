/**
 * External dependencies
 */
import { transform, isEqual, isObject } from 'lodash';

const difference = ( object, base ) => {
	/* eslint-disable no-shadow */
	function changes( object, base ) {
		return transform( object, function( result, value, key ) {
			if ( ! isEqual( value, base[ key ] ) ) {
				result[ key ] =
					isObject( value ) && isObject( base[ key ] )
						? changes( value, base[ key ] )
						: value;
			}
		} );
	}
	return changes( object, base );
};

export default difference;
