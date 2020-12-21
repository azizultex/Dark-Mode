<?php
/**
 * Plugin Name: WP Markdown Editor (Formerly Dark Mode)
 * Plugin URI: https://wppool.dev/wp-markdown-editor
 * Description: Quickly edit content in WordPress by getting an immersive, peaceful and natural writing experience with the coolest editor..
 * Author: WPPOOL
 * Author URI: https://wppool.dev
 * Text Domain: dark-mode
 * Version: 4.0.3
 */

defined( 'ABSPATH' ) || exit();

if ( ! class_exists( 'Dark_Mode' ) ) {
	define( 'DARK_MODE_VERSION', '4.0.3' );
	define( 'DARK_MODE_FILE', __FILE__ );
	define( 'DARK_MODE_PATH', plugin_dir_path( __FILE__ ) );
	define( 'DARK_MODE_URL', plugin_dir_url( __FILE__ ) );

	register_activation_hook( __FILE__, function () {
		require DARK_MODE_PATH . '/includes/class-install.php';
	} );

	require DARK_MODE_PATH . '/includes/class-dark-mode.php';
}