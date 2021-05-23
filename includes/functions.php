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

function wpmde_get_settings( $key = '', $default = '', $section = 'wpmde_general' ) {
	$settings = get_option( $section );

	return ! empty( $settings[ $key ] ) ? $settings[ $key ] : $default;
}

/**
 * Check if Classic Editor plugin is active.
 *
 * @return bool
 */
function wpmde_is_classic_editor_plugin_active() {
	if ( ! function_exists( 'is_plugin_active' ) ) {
		include_once ABSPATH . 'wp-admin/includes/plugin.php';
	}

	if ( is_plugin_active( 'classic-editor/classic-editor.php' ) ) {
		return true;
	}

	return false;
}


function wpmde_is_classic_editor_page() {
	global $pagenow;

	return wpmde_is_classic_editor_plugin_active() && ( $pagenow == 'post.php' );
}

function wpmde_darkmode_enabled() {

	if ( ! is_admin() ) {
		return false;
	}

	if ( ! wpmd_is_pro_active() ) {
		return 'on' == wpmde_get_settings( 'admin_darkmode', 'on' );
	}

	if ( 'on' == wpmde_get_settings( 'only_darkmode', 'off' ) ) {
		return true;
	}

	// Check if admin darkmode enabled
	if ( 'on' != wpmde_get_settings( 'admin_darkmode', 'on' ) ) {
		return false;
	}

	// Check if gutenberg darkmode enabled
	if ( 'off' == wpmde_get_settings( 'gutenberg_darkmode' ) && wpmd_is_gutenberg_page() ) {
		return false;
	}

	// Check if classic editor darkmode enabled
	if ( 'off' == wpmde_get_settings( 'classic_editor_darkmode', 'on' )
	     && wpmde_is_classic_editor_page() ) {
		return false;
	}


	return true;
}


