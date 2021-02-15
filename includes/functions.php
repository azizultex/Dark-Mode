<?php

function wpmd_is_gutenberg_page(){
	global $current_screen;

	if (!isset($current_screen)) {
		$current_screen = get_current_screen();
	}

	if ( ( method_exists($current_screen, 'is_block_editor') && $current_screen->is_block_editor() )
	     || ( function_exists('is_gutenberg_page') && is_gutenberg_page() ) ) {
		return true;
	}

	return false;
}

function wpmd_is_pro_active() {
	return apply_filters( 'wp_markdown_editor/is_pro_active', false );
}

/**
 * add admin notices
 *
 * @param           $class
 * @param           $message
 * @param   string  $only_admin
 *
 * @return void
 */
function wpmd_add_notice( $class, $message ) {

	$notices = get_option( sanitize_key( 'wp_markdown_editor_notices' ), [] );
	if ( is_string( $message ) && is_string( $class )
	     && ! wp_list_filter( $notices, array( 'message' => $message ) ) ) {

		$notices[] = array(
			'message' => $message,
			'class'   => $class,
		);

		update_option( sanitize_key( 'wp_markdown_editor_notices' ), $notices );
	}

}
