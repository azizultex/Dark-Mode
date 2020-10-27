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
	// Register the block editor scripts
	wp_enqueue_script(
		'darkmode-editor-script',
		plugins_url( 'build/index.js', __FILE__ ),
		array(
			'lodash',
			'wp-api-fetch',
			'wp-block-editor',
			'wp-blocks',
			'wp-components',
			'wp-compose',
			'wp-data',
			'wp-dom',
			'wp-edit-post',
			'wp-element',
			'wp-hooks',
			'wp-i18n',
			'wp-keycodes',
			'wp-plugins',
			'wp-polyfill',
			'wp-rich-text',
			'wp-url',
			'wp-wordcount',
			'wp-api',
			'wp-compose'
		),
		filemtime( plugin_dir_path( __FILE__ ) . 'build/index.js' )
	);

	//iceberg

	list( $iceberg_theme, ) = (array) get_theme_support( 'iceberg-editor' );
	wp_localize_script(
		'darkmode-editor-script',
		'icebergSettings',
		array(
			'siteurl'              => wp_parse_url( get_bloginfo( 'url' ) ),
			'icebergSettingsNonce' => wp_create_nonce( 'wp_rest' ),
			'isDefaultEditor'      => get_option( 'iceberg_is_default_editor' ),
			'customThemes'         => ( false !== $iceberg_theme ) ? $iceberg_theme : '',
			'license'              => get_option( 'iceberg_license_active' ),
			'isGutenberg'          => defined( 'GUTENBERG_VERSION' ) || ( function_exists( 'is_plugin_active' ) && is_plugin_active( 'gutenberg/gutenberg.php' ) ) ? true : false,
			'isEditIceberg'        => isset( $_GET['is_iceberg'] ) ? sanitize_text_field( $_GET['is_iceberg'] ) : false
			// phpcs:ignore
		)
	);

}


function wp_markdown_editor_styles() {
	wp_enqueue_style(
		'iceberg-style',
		plugins_url( 'build/style.css', __FILE__ ),
		[],
		filemtime( plugin_dir_path( __FILE__ ) . 'build/style.css' )
	);

	// Add inline style for the editor themes to hook into.
	wp_add_inline_style( 'iceberg-style', ':root{}' );
}