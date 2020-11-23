<?php
/**
 * Plugin Name: WP Markdown Editor Pro (Formerly Dark Mode)
 * Plugin URI: https://wppool.dev/wp-markdown
 * Description: Lets your users make the WordPress admin dashboard darker.
 * Author: WPPOOL
 * Author URI: https://wppool.dev
 * Text Domain: dark-mode
 * Version: 4.0.0
 */

defined( 'ABSPATH' ) || exit();

add_action('plugins_loaded', function() {
	if ( ! class_exists( 'Dark_Mode' ) ) {
		define( 'DARK_MODE_VERSION', '4.0.0' );
		define( 'DARK_MODE_FILE', __FILE__ );
		define( 'DARK_MODE_PATH', plugin_dir_path( __FILE__ ) );
		define( 'DARK_MODE_URL', plugin_dir_url( __FILE__ ) );
	
		register_activation_hook( __FILE__, function () {
			require DARK_MODE_PATH . '/includes/class-install.php';
		} );
	
		if(!defined('DARK_MODE_PRO_VERSION')){
			require DARK_MODE_PATH . '/includes/class-dark-mode.php';
		} 
	}
}, 11);