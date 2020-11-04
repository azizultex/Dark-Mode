<?php

defined( 'ABSPATH' ) || exit;


/**
 * Register all the block assets so that they can be enqueued through the block editor
 * in the corresponding context
 */
add_action( 'admin_enqueue_scripts', 'dark_mode_editor_scripts' );
if(!function_exists('dark_mode_editor_scripts')) {
	function dark_mode_editor_scripts( $hook ) {

		if(is_plugin_active('classic-editor/classic-editor.php')){
			return;
		}

		// If block editor is not active, bail.
		if ( 'post.php' != $hook ) {
			return;
		}

		// Register the block editor scripts
		wp_enqueue_script( 'darkmode-editor-script', plugins_url( 'build/index.js', __FILE__ ),
			[ 'wp-blocks', 'wp-i18n', 'wp-element', 'wp-editor' ], filemtime( plugin_dir_path( __FILE__ ) . 'build/index.js' ) );

		// Register the block editor styles
		wp_enqueue_style( 'darkmode-editor-style', plugins_url( 'build/editor.css', __FILE__ ), [],
			filemtime( plugin_dir_path( __FILE__ ) . 'build/editor.css' ) );

		// Register the front-end styles
		wp_enqueue_style( 'darkmode-frontend-styles', plugins_url( 'build/style.css', __FILE__ ), [],
			filemtime( plugin_dir_path( __FILE__ ) . 'build/style.css' ) );
	}
}