<?php
/**
 * Plugin Name: WP Markdown (Formerly Dark Mode)
 * Plugin URI: https://wppool.dev/wp-dark-mode
 * Description: Lets your users make the WordPress admin dashboard darker.
 * Author: WPPOOL
 * Author URI: https://wppool.dev
 * Text Domain: dark-mode
 * Version: 3.3.2
 */

defined( 'ABSPATH' ) || exit();

define( 'DARK_MODE_VERSION', '3.3.2' );
define( 'DARK_MODE_FILE', __FILE__ );
define( 'DARK_MODE_PATH', plugin_dir_path( __FILE__ ) );
define( 'DARK_MODE_URL', plugin_dir_url( __FILE__ ) );

require DARK_MODE_PATH.'/includes/class-dark-mode.php';
