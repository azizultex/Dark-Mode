<?php

/**
 * Plugin Name: WP Markdown Editor (Formerly Dark Mode)
 * Plugin URI: https://wppool.dev/wp-markdown-editor
 * Description: Quickly edit content in WordPress by getting an immersive, peaceful and natural writing experience with the coolest editor..
 * Author: WPPOOL
 * Author URI: https://wppool.dev
 * Text Domain: dark-mode
 * Version: 4.1.0.
 */

defined( 'ABSPATH' ) || exit();

if ( ! class_exists( 'Dark_Mode' ) ) {
	define( 'DARK_MODE_VERSION', '4.1.0.' );
	define( 'DARK_MODE_FILE', __FILE__ );
	define( 'DARK_MODE_PATH', plugin_dir_path( DARK_MODE_FILE ) );
	define( 'DARK_MODE_INCLUDES', DARK_MODE_PATH . '/includes' );
	define( 'DARK_MODE_URL', plugin_dir_url( DARK_MODE_FILE ) );

	register_activation_hook( __FILE__, function () {
		require DARK_MODE_PATH . '/includes/class-install.php';
	} );

	require DARK_MODE_PATH . '/includes/class-dark-mode.php';
}