/**
 * WordPress dependencies
 */
import { withSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { count as wordCount } from '@wordpress/wordcount';
import { BaseControl } from '@wordpress/components';

function WordCount( { content } ) {
	return (
		<BaseControl>
			{ __( 'Words:', 'iceberg' ) }
			<span>{ wordCount( content, 'words' ) }</span>
		</BaseControl>
	);
}

export default withSelect( ( select ) => {
	return {
		content: select( 'core/editor' ).getEditedPostAttribute( 'content' ),
	};
} )( WordCount );
