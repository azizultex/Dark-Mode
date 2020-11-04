/**
 * External dependencies
 */
import map from 'lodash/map';

/**
 * Internal dependencies
 */
import { getActiveFormats } from './get-active-formats';

/**
 * WordPress dependencies
 */
import { Component } from '@wordpress/element';
import { compose, ifCondition } from '@wordpress/compose';
import { withDispatch, withSelect } from '@wordpress/data';
import { applyFormat, getTextContent, remove } from '@wordpress/rich-text';
import { withSpokenMessages } from '@wordpress/components';

class MarkdownControl extends Component {
	constructor() {
		super( ...arguments );

		this.state = {
			start: null,
			end: null,
		};
	}

	_experimentalMarkdown(
		record,
		onChange,
		markdown,
		formats,
		isDouble = false
	) {
		const { start } = record;
		const text = getTextContent( record );
		let double = false;

		// console.log( record );

		const checkMarkdown = text.slice( start - 1, start );
		// Quick check the text for the necessary character.
		if ( checkMarkdown !== markdown ) {
			return record;
		}

		const textBefore = text.slice( 0, start - 1 );
		const indexBefore = textBefore.lastIndexOf( markdown );

		if ( indexBefore === -1 ) {
			return record;
		}

		const startIndex = indexBefore;
		const endIndex = start - 2;

		if ( startIndex === endIndex ) {
			return record;
		}

		//return if text contains newline(↵)
		const characterInside = text.slice( startIndex, endIndex + 1 );
		const splitNewlines = characterInside.split( '\n' );

		if ( splitNewlines.length > 1 ) {
			return record;
		}

		//return if inside code format
		const activeFormats = getActiveFormats( record );
		if ( activeFormats.length > 0 ) {
			if (
				activeFormats.filter(
					( formatActive ) => formatActive.type === 'core/code'
				)
			) {
				return record;
			}
		}

		const characterBefore = text.slice( startIndex - 1, startIndex );

		//continue if character before is a letter
		if (
			characterBefore.length === 1 &&
			characterBefore.match( /[A-Z|a-z]/i )
		) {
			return record;
		}

		//check if doble markdown
		if ( characterBefore === markdown ) {
			double = true;
		}

		if ( characterBefore === markdown && ! isDouble ) {
			return record;
		}

		if ( isDouble && ! double ) {
			return record;
		}

		//do not apply markdown when next character is SPACE
		const characterAfter = text.slice( startIndex + 1, startIndex + 2 );
		if ( characterAfter === ' ' ) {
			return record;
		}

		record = remove( record, startIndex, startIndex + 1 );

		record = remove( record, endIndex, endIndex + 1 );

		if ( ! double && ! isDouble ) {
			record = applyFormat(
				record,
				{ type: formats },
				startIndex,
				endIndex
			);
		}

		if ( double && isDouble ) {
			map( formats.split( ',' ), ( format ) => {
				record = applyFormat(
					record,
					{ type: format.trim() },
					startIndex,
					endIndex
				);
			} );
		}

		// onSelectionChange( startIndex, endIndex );
		wp.data.dispatch( 'core/block-editor' ).stopTyping();

		this.setState( { start: startIndex, end: endIndex } );
		record.activeFormats = [];
		onChange( { ...record, needsSelectionUpdate: true } );

		return record;
	}

	render() {
		const { value, onChange } = this.props;
		const markdowns = {
			bold: {
				markdown: '*',
				format: 'core/bold',
			},
			italic: {
				markdown: '_',
				format: 'core/italic',
			},
			italicBold: {
				markdown: '*',
				format: 'core/italic, core/bold',
				double: true,
			},
			strikethrough: {
				markdown: '~',
				format: 'core/strikethrough',
			},
			mark: {
				markdown: ':',
				format: 'iceberg/mark',
			},
			markDouble: {
				markdown: ':',
				format: 'iceberg/mark',
				double: true,
			},
		};

		map( markdowns, ( markdown ) => {
			this._experimentalMarkdown(
				value,
				onChange,
				markdown.markdown,
				markdown.format,
				markdown.double
			);
		} );

		return null;
	}
}

export default compose(
	withSelect( ( select ) => {
		return {
			isIcebergActive: select( 'core/edit-post' ).isFeatureActive(
				'icebergWritingMode'
			),
		};
	} ),
	withDispatch(
		( dispatch, { clientId, instanceId, identifier = instanceId } ) => {
			const { selectionChange } = dispatch( 'core/block-editor' );

			return {
				onSelectionChange( start, end ) {
					selectionChange( clientId, identifier, start, end );
				},
			};
		}
	),
	ifCondition( ( props ) => props.isIcebergActive ),
	withSpokenMessages
)( MarkdownControl );
