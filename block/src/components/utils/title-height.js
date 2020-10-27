/**
 * Fix title height : https://wordpress.slack.com/archives/C02QB2JS7/p1589311097095200
 */

function UpdateTitleHeight() {
	const title = document.querySelector( '.editor-post-title__input' );
	if ( title ) {
		title.dispatchEvent( new Event( 'autosize:update' ) );
	}

	return false;
}

export default UpdateTitleHeight;
