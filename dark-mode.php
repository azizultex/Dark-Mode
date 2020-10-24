<?php
/**
 * Plugin Name: Dark Mode
 * Plugin URI: https://wppool.dev/wp-dark-mode
 * Description: Lets your users make the WordPress admin dashboard darker.
 * Author: WPPOOL
 * Author URI: https://wppool.dev
 * Text Domain: dark-mode
 * Version: 3.3.2
 */

if ( ! defined( 'ABSPATH' ) ) {
	die();
}

define('DARK_MODE_VERSION', '3.3.2');
define('DARK_MODE_FILE', __FILE__);
define('DARK_MODE_PATH', plugin_dir_path(__FILE__));
define('DARK_MODE_URL', plugin_dir_url(__FILE__));


/**
 * Initialize the plugin tracker
 *
 * @return void
 */
function appsero_init_tracker_dark_mode() {

	if ( ! class_exists( 'Appsero\Client' ) ) {
		require_once __DIR__ . '/appsero/src/Client.php';
	}

	$client = new Appsero\Client( 'abf3e1be-dc75-4d7e-af65-595a8039cad7', 'Dark Mode', __FILE__ );

	// Active insights
	$client->insights()->init();

}

appsero_init_tracker_dark_mode();

/** block editor color scheme */
include DARK_MODE_PATH.'/block/plugin.php';

require 'class-dark-mode.php';
$dark_mode = new Dark_Mode();
