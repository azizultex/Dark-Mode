/**
 * External dependencies
 */
import { flow } from 'lodash';

/**
 * WordPress dependencies
 */
import { ClipboardButton } from '@wordpress/components';
import { withSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { withState, compose } from '@wordpress/compose';

/**
 * Internal dependencies
 */
import icons from '../icons';
import stripTags from '../utils/stripTags';
import stripHTMLEntities from '../utils/stripHTMLEntities';
import stripHTMLComments from '../utils/stripHTMLComments';
import stripRemovables from '../utils/stripRemovables';

function CreateHTMLAnchorMenuItem( {
	clientId,
	updateBlockAttributes,
	content,
	anchor,
	permalink,
	hasCopied,
	setState,
} ) {
	if ( typeof anchor === 'undefined' && content ) {
		anchor = flow(
			stripTags.bind( content ),
			stripHTMLComments.bind( content ),
			stripHTMLEntities.bind( content ),
			stripRemovables.bind( content )
		)( content );

		anchor = anchor
			.split( ' ' )
			.splice( 0, 10 )
			.join( '-' )
			.toLowerCase();
	}

	const link = permalink + '#' + anchor;

	return (
		<ClipboardButton
			text={ link }
			role="menuitem"
			className="components-menu-item__button"
			onCopy={ () => {
				setState( { hasCopied: true } );

				if ( anchor ) {
					updateBlockAttributes( clientId, {
						anchor,
					} );
				}
			} }
			onFinishCopy={ () => setState( { hasCopied: false } ) }
		>
			{ hasCopied
				? __( 'Copied to clipboard!' )
				: __( 'Create HTML anchor', 'dark-mode' ) }
			{ hasCopied ? icons.checkMark : icons.link }
		</ClipboardButton>
	);
}

export default compose(
	withSelect( ( select ) => ( {
		permalink: select( 'core/editor' ).getPermalink(),
	} ) ),
	withState( { hasCopied: false } )
)( CreateHTMLAnchorMenuItem );
