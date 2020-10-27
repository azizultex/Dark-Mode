/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { displayShortcutList } from '@wordpress/keycodes';

const headings = {
	title: __( 'Headings', 'iceberg' ),
	panel: true,
	initialOpen: false,
	shortcuts: [
		{
			keyCombination: [ '#' ],
			description: __( 'Heading 1', 'iceberg' ),
		},
		{
			keyCombination: [ '#', '#' ],
			description: __( 'Heading 2', 'iceberg' ),
		},
		{
			keyCombination: [ '#', '#', '#' ],
			description: __( 'Heading 3', 'iceberg' ),
		},
		{
			keyCombination: [ '#', '#', '#', '#' ],
			description: __( 'Heading 4', 'iceberg' ),
		},
		{
			keyCombination: [ '#', '#', '#', '#', '#' ],
			description: __( 'Heading 5', 'iceberg' ),
		},
	],
};

const markdown = {
	title: __( 'Markdown', 'iceberg' ),
	panel: true,
	initialOpen: true,
	shortcuts: [
		{
			keyCombination: [ '*bold*' ],
			description: __( 'Bold', 'iceberg' ),
		},
		{
			keyCombination: [ '_italic_' ],
			description: __( 'Italic', 'iceberg' ),
		},
		{
			keyCombination: [ '**bold & italic**' ],
			description: __( 'Bold & italic', 'iceberg' ),
		},
		{
			keyCombination: [ '~strikethrough~' ],
			description: __( 'Strikethrough', 'iceberg' ),
		},
		{
			keyCombination: [ ':mark:' ],
			description: __( 'Mark', 'iceberg' ),
		},
		{
			keyCombination: [ '`code`' ],
			description: __( 'Code', 'iceberg' ),
		},
		{
			keyCombination: [ '`', '`', '`', __( 'space', 'iceberg' ) ],
			description: __( 'Code block', 'iceberg' ),
		},
		{
			keyCombination: [ '-', '-', '-', __( 'space', 'iceberg' ) ],
			description: __( 'Divider', 'iceberg' ),
		},
		{
			keyCombination: [ '>', __( 'space', 'iceberg' ) ],
			description: __( 'Blockquote', 'iceberg' ),
		},
		{
			keyCombination: [ '1.', __( 'space', 'iceberg' ) ],
			description: __( 'Numbered list', 'iceberg' ),
		},
		{
			keyCombination: [ '*', __( 'space', 'iceberg' ) ],
			description: __( 'Ordered list', 'iceberg' ),
		},
		{
			keyCombination: [ '+', '+', __( 'space', 'iceberg' ) ],
			description: __( 'Comment', 'iceberg' ),
		},
		{
			keyCombination: [ ':keyword', __( 'enter', 'iceberg' ) ],
			description: __( 'Emoji', 'iceberg' ),
		},
	],
};

const formatting = {
	title: __( 'Formatting', 'iceberg' ),
	panel: true,
	initialOpen: false,
	shortcuts: [
		{
			keyCombination: displayShortcutList.primaryAlt( '1' ),
			description: __( 'Convert to H1', 'iceberg' ),
		},
		{
			keyCombination: displayShortcutList.primaryAlt( '2' ),
			description: __( 'Convert to H2', 'iceberg' ),
		},
		{
			keyCombination: displayShortcutList.primaryAlt( '3' ),
			description: __( 'Convert to H3', 'iceberg' ),
		},
		{
			keyCombination: displayShortcutList.primaryAlt( '4' ),
			description: __( 'Convert to H4', 'iceberg' ),
		},
		{
			keyCombination: displayShortcutList.primaryAlt( '5' ),
			description: __( 'Convert to H5', 'iceberg' ),
		},
		{
			keyCombination: displayShortcutList.primaryAlt( '7' ),
			description: __( 'Convert to P', 'iceberg' ),
		},
		{
			keyCombination: displayShortcutList.primaryAlt( '8' ),
			description: __( 'Convert to list', 'iceberg' ),
		},
		{
			keyCombination: displayShortcutList.primaryShift( '9' ),
			description: __( 'Convert list type', 'iceberg' ),
		},
		{
			keyCombination: displayShortcutList.primary( 'm' ),
			description: __( 'Indent list', 'iceberg' ),
		},
		{
			keyCombination: displayShortcutList.primaryShift( 'm' ),
			description: __( 'Outdent list', 'iceberg' ),
		},
		{
			keyCombination: displayShortcutList.primary( 'k' ),
			description: __( 'Insert link', 'iceberg' ),
		},
		{
			keyCombination: displayShortcutList.primaryShift( 'k' ),
			description: __( 'Remove link', 'iceberg' ),
		},
		{
			keyCombination: displayShortcutList.ctrl( 'space' ),
			description: __( 'Clear formatting', 'iceberg' ),
		},
		{
			keyCombination: displayShortcutList.access( 'z' ),
			description: __( 'Remove block', 'iceberg' ),
		},
	],
};

const ui = {
	title: __( 'Interface', 'iceberg' ),
	panel: true,
	initialOpen: false,
	shortcuts: [
		{
			keyCombination: displayShortcutList.secondary( 'i' ),
			description: __( 'Exit Iceberg', 'iceberg' ),
		},
		{
			keyCombination: displayShortcutList.primaryShift( '+' ),
			description: __( 'Add new {type}', 'iceberg' ),
			override: true,
			single: true,
		},
		{
			keyCombination: displayShortcutList.secondary( 'p' ),
			description: __( 'All {type}', 'iceberg' ),
			override: true,
		},
		{
			keyCombination: displayShortcutList.access( 'h' ),
			description: __( 'Display shortcuts', 'iceberg' ),
		},
	],
};

export default [ headings, markdown, formatting, ui ];
