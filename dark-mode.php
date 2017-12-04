<?php

/**
 * Plugin Name: Dark Mode
 * Plugin URI: https://wordpress.org/plugins/dark-mode/
 * Description: Let's your users make the WordPress admin dashboard darker.
 * Author: Daniel James
 * Author URI: https://www.danieltj.co.uk/
 * Text Domain: dark-mode
 * Version: 1.2
 */

// No thank you
if ( ! defined( 'ABSPATH' ) ) die();

// Start here
new Dark_Mode;

/**
 * Define the Dark Mode class.
 * 
 * @package Dark_Mode
 * @since 1.0
 */
class Dark_Mode {

	/**
	 * Function which hooks into WordPress Core.
	 * 
	 * @since 1.0
	 * @since 1.1 Changed admin_enqueue_scripts hook to 99 to override admin colour scheme styles.
	 * 
	 * @return void
	 */
	public function __construct() {

		add_action('plugins_loaded', array( __CLASS__, 'load_text_domain' ), 10);
		add_action('admin_enqueue_scripts', array( __CLASS__, 'load_dark_mode_css' ), 99);
		add_action('personal_options', array( __CLASS__, 'add_profile_fields' ), 10);
		add_action('personal_options_update', array( __CLASS__, 'save_profile_fields' ), 10);
		add_action('edit_user_profile_update', array( __CLASS__, 'save_profile_fields' ), 10);

	}

	/**
	 * Load the plugin text domain for l10n.
	 * 
	 * @since 1.0
	 * 
	 * @return void
	 */
	public static function load_text_domain() {

		load_plugin_textdomain( 'dark-mode', false, untrailingslashit(dirname(__FILE__)) . '/languages' );

	}

	/**
	 * Checks if the current user has Dark Mode turned on.
	 * 
	 * @since 1.0
	 * 
	 * @param  string $user_id The user ID of someone.
	 * 
	 * @return boolean
	 */
	public static function is_using_dark_mode( $user_id = NULL ) {

		// Check if we have a user id
		if ( empty( $user_id ) ) {

			$user_id = get_current_user_id();

		}

		// Check if the user is using Dark Mode
		if ( 'on' == get_user_meta( $user_id, 'dark_mode', true ) ) {

			// Using Dark Mode
			return true;

		} else {

			// Not using Dark Mode
			return false;

		}

	}

	/**
	 * Add the stylesheet to the dashboard if enabled.
	 * 
	 * @since 1.0
	 * 
	 * @return void
	 */
	public static function load_dark_mode_css() {

		// Is the current user using Dark Mode?
		if ( false !== self::is_using_dark_mode() ) {

			/**
			 * Hook for when Dark Mode is running.
			 * 
			 * This hook is run at the start of Dark Mode initialising
			 * the stylesheet but before it is enqueued.
			 *
			 * @since 1.0
			 */
			do_action('doing_dark_mode');

			/**
			 * Filters the Dark Mode stylesheet URL.
			 *
			 * @since 1.1
			 *
			 * @param  string $css_url Default CSS file path for Dark Mode.
			 * 
			 * @return string $css_url
			 */
			$css_url = apply_filters( 'dark_mode_css', plugins_url('dark-mode', 'dark-mode') . '/darkmode.css' );

			// Register the dark mode stylesheet
			wp_register_style('dark_mode', $css_url, array(), '1.2');

			// Enqueue the stylesheet for loading
			wp_enqueue_style('dark_mode');
			
			// Load style sheet only on pages affected by codemirror
			global $pagenow;
			
			if ('plugin-editor.php' == $pagenow || 'widgets.php' == $pagenow || 'theme-editor.php' == $pagenow || 'customize.php' == $pagenow) {
				
			// change styles set by codemirror default css to dark-mode color scheme for wp code editors
			wp_enqueue_style('dark_mode_codemirror', plugin_dir_url( __FILE__ ) . 'codemirror.min.css', array(), '1.2');	
				
			}
		}

	}

	/**
	 * Create the HTML markup for the profile setting.
	 * 
	 * @since 1.0
	 * 
	 * @param  object $profileuser WP_User object data.
	 * 
	 * @return mixed
	 */
	public static function add_profile_fields( $profileuser ) {

		?>
			<tr class="dark-mode user-dark-mode-option">
				<th scope="row"><?php _e('Dark Mode', 'dark-mode'); ?></th>
				<td>
					<label for="dark_mode">
						<input type="checkbox" id="dark_mode" name="dark_mode" class="dark_mode"<?php if ( 'on' == get_user_meta( $profileuser->data->ID, 'dark_mode', true ) ) : ?> checked="checked"<?php endif; ?> />
						<?php _e('Enable Dark Mode on the admin dashboard', 'dark-mode'); ?>
					</label>
				</td>
			</tr>
		<?php

	}

	/**
	 * Save the value of the profile field.
	 * 
	 * @since 1.0
	 * 
	 * @param  string $user_id The user ID of someone.
	 * 
	 * @return void
	 */
	public static function save_profile_fields( $user_id ) {

		// Set the value of the users choice
		$dark_mode_choice = isset ( $_POST['dark_mode'] ) ? 'on' : 'off';

		// Update the users meta data with the new value
		update_user_meta( $user_id, 'dark_mode', $dark_mode_choice );
	
	}

}

