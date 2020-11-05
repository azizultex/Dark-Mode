/**
 * WordPress dependencies
 */
import { withSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { count as wordCount } from '@wordpress/wordcount';
import { BaseControl } from '@wordpress/components';

function CharacterCount( { content } ) {
	return (
		<BaseControl>
			{ __( 'Characters:', 'dark-mode' ) }
			<span>{ wordCount( content, 'characters_excluding_spaces' ) }</span>
		</BaseControl>
	);
}

export default withSelect( ( select ) => {
	return {
		content: select( 'core/editor' ).getEditedPostAttribute( 'content' ),
	};
} )( CharacterCount );
