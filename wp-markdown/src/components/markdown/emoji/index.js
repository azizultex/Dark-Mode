/**
 * External dependencies
 */
import { concat } from 'lodash';
/**
 * Internal dependencies
 */
import emojis from './emojis'; // from https://github.com/github/gemoji/blob/master/db/emoji.json

/**
 * WordPress dependencies
 */
import { addFilter } from '@wordpress/hooks';
import { Fragment } from '@wordpress/element';
import { select } from '@wordpress/data';

const acronymCompleter = {
	name: 'emoji',
	triggerPrefix: ':',
	options: emojis,
	isDebounced: true,
	getOptionKeywords( emoji ) {
		const keywords = concat( emoji.aliases, emoji.tags );
		return [ emoji.emoji ].concat( keywords );
	},
	getOptionLabel( emoji ) {
		return (
			<Fragment>
				{ emoji.emoji }
				<span>:{ emoji.aliases }</span>
			</Fragment>
		);
	},
	getOptionCompletion( emoji ) {
		return emoji.emoji;
	},
};

// Our filter function
function addCompleter( completers, blockName ) {
	if (
		! select( 'core/edit-post' ).isFeatureActive( 'icebergWritingMode' ) ||
		! select( 'markdown-settings' ).isEditorPanelEnabled( 'emoji' )
	) {
		return completers;
	}

	return blockName === 'core/paragraph' ||
		blockName === 'core/heading' ||
		blockName === 'core/quote' ||
		blockName === 'core/list' ||
		blockName === 'core/verse' ||
		blockName === 'core/list'
		? [ ...completers, acronymCompleter ]
		: completers;
}

// Adding the filter
addFilter(
	'editor.Autocomplete.completers',
	'iceberg/markdown/emoji',
	addCompleter
);
