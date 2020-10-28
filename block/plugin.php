<?php

defined( 'ABSPATH' ) || exit;


/**
 * Register all the block assets so that they can be enqueued through the block editor
 * in the corresponding context
 */
//add_action( 'admin_enqueue_scripts', 'dark_mode_editor_scripts' );
if ( ! function_exists( 'dark_mode_editor_scripts' ) ) {
	function dark_mode_editor_scripts( $hook ) {

		if ( is_plugin_active( 'classic-editor/classic-editor.php' ) ) {
			return;
		}

		// If block editor is not active, bail.
		if ( 'post.php' != $hook ) {
			return;
		}

		// Register the block editor scripts
		wp_enqueue_script( 'darkmode-editor-script', plugins_url( 'build/index.js', __FILE__ ),
			[
				'wp-blocks',
				'wp-i18n',
				'wp-element',
				'wp-editor'
			], filemtime( plugin_dir_path( __FILE__ ) . 'build/index.js' ) );

		// Register the block editor styles
		wp_enqueue_style( 'darkmode-editor-style', plugins_url( 'build/editor.css', __FILE__ ), [],
			filemtime( plugin_dir_path( __FILE__ ) . 'build/editor.css' ) );

		// Register the front-end styles
		wp_enqueue_style( 'darkmode-frontend-styles', plugins_url( 'build/style.css', __FILE__ ), [],
			filemtime( plugin_dir_path( __FILE__ ) . 'build/style.css' ) );
	}
}


add_action( 'enqueue_block_assets', 'wp_markdown_editor_scripts' );
add_action( 'enqueue_block_assets', 'wp_markdown_editor_styles' );

function wp_markdown_editor_scripts() {
	$dependencies = [];
	$version      = '';

	if ( file_exists( DARK_MODE_PATH . '/block/build/index.asset.php' ) ) {
		$asset = include DARK_MODE_PATH . '/block/build/index.asset.php';

		$dependencies = $asset['dependencies'];
		$version      = $asset['version'];
	}

	wp_enqueue_script(
		'wp-mark-down-editor-script',
		plugins_url( 'build/index.js', __FILE__ ),
		array_merge( $dependencies, [ 'wp-api', 'wp-compose' ] ),
		$version
	);

	//todo
	list( $iceberg_theme, ) = (array) get_theme_support( 'iceberg-editor' );

	wp_localize_script(
		'wp-mark-down-editor-script',
		'WPMD_Settings',
		array(
			'siteurl'            => wp_parse_url( get_bloginfo( 'url' ) ),
			'WPMD_SettingsNonce' => wp_create_nonce( 'wp_rest' ),
			'isDefaultEditor'    => get_option( 'iceberg_is_default_editor' ),
			'customThemes'       => ( false !== $iceberg_theme ) ? $iceberg_theme : '',
			'license'            => get_option( 'iceberg_license_active' ),
			'isGutenberg'        => defined( 'GUTENBERG_VERSION' ) || ( function_exists( 'is_plugin_active' ) && is_plugin_active( 'gutenberg/gutenberg.php' ) ) ? true : false,
			'isEditWPMD'         => isset( $_GET['is_iceberg'] ) ? sanitize_text_field( $_GET['is_iceberg'] ) : false
		)
	);

}


function wp_markdown_editor_styles() {

	wp_enqueue_style(
		'wp-mark-down-editor-style',
		plugins_url( 'build/index.css', __FILE__ ),
		[],
		filemtime( plugin_dir_path( __FILE__ ) . 'build/index.css' )
	);

	// Add inline style for the editor themes to hook into.
	wp_add_inline_style( 'wp-mark-down-editor-style', ':root{}' );
}