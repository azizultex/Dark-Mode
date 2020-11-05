/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { displayShortcutList } from '@wordpress/keycodes';

const headings = {
	title: __( 'Headings', 'dark-mode' ),
	panel: true,
	initialOpen: false,
	shortcuts: [
		{
			keyCombination: [ '#' ],
			description: __( 'Heading 1', 'dark-mode' ),
		},
		{
			keyCombination: [ '#', '#' ],
			description: __( 'Heading 2', 'dark-mode' ),
		},
		{
			keyCombination: [ '#', '#', '#' ],
			description: __( 'Heading 3', 'dark-mode' ),
		},
		{
			keyCombination: [ '#', '#', '#', '#' ],
			description: __( 'Heading 4', 'dark-mode' ),
		},
		{
			keyCombination: [ '#', '#', '#', '#', '#' ],
			description: __( 'Heading 5', 'dark-mode' ),
		},
	],
};

const markdown = {
	title: __( 'Markdown', 'dark-mode' ),
	panel: true,
	initialOpen: true,
	shortcuts: [
		{
			keyCombination: [ '*bold*' ],
			description: __( 'Bold', 'dark-mode' ),
		},
		{
			keyCombination: [ '_italic_' ],
			description: __( 'Italic', 'dark-mode' ),
		},
		{
			keyCombination: [ '**bold & italic**' ],
			description: __( 'Bold & italic', 'dark-mode' ),
		},
		{
			keyCombination: [ '~strikethrough~' ],
			description: __( 'Strikethrough', 'dark-mode' ),
		},
		{
			keyCombination: [ ':mark:' ],
			description: __( 'Mark', 'dark-mode' ),
		},
		{
			keyCombination: [ '`code`' ],
			description: __( 'Code', 'dark-mode' ),
		},
		{
			keyCombination: [ '`', '`', '`', __( 'space', 'dark-mode' ) ],
			description: __( 'Code block', 'dark-mode' ),
		},
		{
			keyCombination: [ '-', '-', '-', __( 'space', 'dark-mode' ) ],
			description: __( 'Divider', 'dark-mode' ),
		},
		{
			keyCombination: [ '>', __( 'space', 'dark-mode' ) ],
			description: __( 'Blockquote', 'dark-mode' ),
		},
		{
			keyCombination: [ '1.', __( 'space', 'dark-mode' ) ],
			description: __( 'Numbered list', 'dark-mode' ),
		},
		{
			keyCombination: [ '*', __( 'space', 'dark-mode' ) ],
			description: __( 'Ordered list', 'dark-mode' ),
		},
		{
			keyCombination: [ '+', '+', __( 'space', 'dark-mode' ) ],
			description: __( 'Comment', 'dark-mode' ),
		},
		{
			keyCombination: [ ':keyword', __( 'enter', 'dark-mode' ) ],
			description: __( 'Emoji', 'dark-mode' ),
		},
	],
};

const formatting = {
	title: __( 'Formatting', 'dark-mode' ),
	panel: true,
	initialOpen: false,
	shortcuts: [
		{
			keyCombination: displayShortcutList.primaryAlt( '1' ),
			description: __( 'Convert to H1', 'dark-mode' ),
		},
		{
			keyCombination: displayShortcutList.primaryAlt( '2' ),
			description: __( 'Convert to H2', 'dark-mode' ),
		},
		{
			keyCombination: displayShortcutList.primaryAlt( '3' ),
			description: __( 'Convert to H3', 'dark-mode' ),
		},
		{
			keyCombination: displayShortcutList.primaryAlt( '4' ),
			description: __( 'Convert to H4', 'dark-mode' ),
		},
		{
			keyCombination: displayShortcutList.primaryAlt( '5' ),
			description: __( 'Convert to H5', 'dark-mode' ),
		},
		{
			keyCombination: displayShortcutList.primaryAlt( '7' ),
			description: __( 'Convert to P', 'dark-mode' ),
		},
		{
			keyCombination: displayShortcutList.primaryAlt( '8' ),
			description: __( 'Convert to list', 'dark-mode' ),
		},
		{
			keyCombination: displayShortcutList.primaryShift( '9' ),
			description: __( 'Convert list type', 'dark-mode' ),
		},
		{
			keyCombination: displayShortcutList.primary( 'm' ),
			description: __( 'Indent list', 'dark-mode' ),
		},
		{
			keyCombination: displayShortcutList.primaryShift( 'm' ),
			description: __( 'Outdent list', 'dark-mode' ),
		},
		{
			keyCombination: displayShortcutList.primary( 'k' ),
			description: __( 'Insert link', 'dark-mode' ),
		},
		{
			keyCombination: displayShortcutList.primaryShift( 'k' ),
			description: __( 'Remove link', 'dark-mode' ),
		},
		{
			keyCombination: displayShortcutList.ctrl( 'space' ),
			description: __( 'Clear formatting', 'dark-mode' ),
		},
		{
			keyCombination: displayShortcutList.access( 'z' ),
			description: __( 'Remove block', 'dark-mode' ),
		},
	],
};

const ui = {
	title: __( 'Interface', 'dark-mode' ),
	panel: true,
	initialOpen: false,
	shortcuts: [
		{
			keyCombination: displayShortcutList.secondary( 'i' ),
			description: __( 'Exit Markdown', 'dark-mode' ),
		},
		{
			keyCombination: displayShortcutList.primaryShift( '+' ),
			description: __( 'Add new {type}', 'dark-mode' ),
			override: true,
			single: true,
		},
		{
			keyCombination: displayShortcutList.secondary( 'p' ),
			description: __( 'All {type}', 'dark-mode' ),
			override: true,
		},
		{
			keyCombination: displayShortcutList.access( 'h' ),
			description: __( 'Display shortcuts', 'dark-mode' ),
		},
	],
};

export default [ headings, markdown, formatting, ui ];
