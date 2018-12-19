<?php

/**
 * The core Dark Mode class.
 *
 * @package danieltj27/Dark-Mode
 *
 * @since 3.0
 */
class Dark_Mode {
	/**
	 * Plugin version constant.
	 *
	 * @since 3.0
	 */
	const PLUGIN_VERSION = '3.2';

	/**
	 * Make WordPress Dark.
	 *
	 * @since 1.0
	 * @since 1.1 Changed admin_enqueue_scripts hook to 99 to override admin colour scheme styles.
	 * @since 1.3 Added hook for the Feedback link in the toolbar.
	 * @since 1.8 Added filter for the plugin table links and removed admin toolbar hook.
	 * @since 3.1 Added the admin body class filter.
	 *
	 * @return void
	 */
	public function __construct() {
		add_action( 'plugins_loaded', array( __CLASS__, 'load_text_domain' ), 10, 0 );
		add_action( 'admin_enqueue_scripts', array( __CLASS__, 'load_dark_mode_css' ), 99, 0 );
		add_action( 'personal_options', array( __CLASS__, 'add_profile_fields' ), 10, 1 );
		add_action( 'personal_options_update', array( __CLASS__, 'save_profile_fields' ), 10, 1 );
		add_action( 'edit_user_profile_update', array( __CLASS__, 'save_profile_fields' ), 10, 1 );

		add_filter( 'plugin_action_links', array( __CLASS__, 'add_plugin_links' ), 10, 2 );
		add_filter( 'admin_body_class', array( __CLASS__, 'add_body_class' ), 10, 1 );
	}

	/**
	 * Load the plugin text domain.
	 *
	 * @since 1.0
	 *
	 * @return void
	 */
	public static function load_text_domain() {
		load_plugin_textdomain( 'dark-mode', false, untrailingslashit( dirname( __FILE__ ) ) . '/languages' );
	}

	/**
	 * Checks if a user has Dark Mode enabled.
	 *
	 * Using this function allows you to check if a specified user
	 * or the current user (default) has Dark Mode enabled. Set the
	 * $check_auto parameter to true to check if it's set to automatically
	 * come between two time frames and we're between the time frame now.
	 *
	 * @since 1.0
	 * @since 1.6 Major rewrite to properly address automatic Dark Mode.
	 * @since 2.0 Removed the automatic checks and added filters.
	 * @since 3.2 Removed `not_using_dark_mode` filter.
	 *
	 * @param int $user_id The user id to check.
	 *
	 * @return boolean
	 */
	public static function is_using_dark_mode( $user_id = 0 ) {
		if ( 0 === $user_id ) {
			$user_id = get_current_user_id();
		}

		$is_using_dark_mode = ( 'on' === get_user_meta( $user_id, 'dark_mode', true ) );

		/**
		 * Filters when Dark Mode is on.
		 *
		 * @since 2.0
		 *
		 * @param boolean          Defaults to true.
		 * @param int     $user_id The current user id.
		 */
		return = apply_filters( 'is_using_dark_mode', $is_using_dark_mode, $user_id );
	}

	/**
	 * Add the stylesheet to the dashboard if enabled.
	 *
	 * @since 1.0
	 * @since 2.1 Removed the register stylesheet function.
	 *
	 * @return void
	 */
	public static function load_dark_mode_css() {
		// Has the user enabled Dark Mode?
		if ( false !== self::is_using_dark_mode() ) {
			$user_id = get_current_user_id();

			/**
			 * Fires just before the stylesheet is included.
			 *
			 * @since 1.0
			 * @since 2.1 Added `$user_id` integer.
			 *
			 * @param int $user_id The current user id.
			 */
			do_action( 'doing_dark_mode', $user_id );

			/**
			 * Filters the Dark Mode stylesheet URL.
			 *
			 * @since 1.1
			 * @since 2.1 Removed second parameter from `plugins_url()`.
			 * @since 3.0 Changed CSS file to include hyphen in name.
			 *
			 * @param string $css_url Default CSS file path for Dark Mode.
			 *
			 * @return string $css_url
			 */
			$css_url = apply_filters( 'dark_mode_css', plugins_url( 'dark-mode' ) . '/dark-mode.css' );

			// Enqueue the stylesheet.
			wp_enqueue_style( 'dark_mode', $css_url, array(), self::PLUGIN_VERSION );
		}
	}

	/**
	 * Create the HTML markup for the profile setting.
	 *
	 * @since 1.0
	 * @since 1.3   Added automatic Dark Mode markup.
	 * @since 1.4   Added id attribute to element.
	 * @since 1.8.1 Removed default value from get_user_meta and added escaping to values.
	 * @since 2.0   Removed the automatic settings and added action hook and renamed variable.
	 *
	 * @param object $user WP_User object data.
	 *
	 * @return mixed
	 */
	public static function add_profile_fields( $user ) {
		// Setup a new nonce field for the Dark Mode options.
		$dark_mode_nonce = wp_create_nonce( 'dark_mode_nonce' );
		?>
		<tr class="dark-mode user-dark-mode-option" id="dark-mode">
			<th scope="row"><?php esc_html_e( 'Dark Mode', 'dark-mode' ); ?></th>
			<td>
				<p>
					<label for="dark_mode">
						<input type="checkbox" id="dark_mode" name="dark_mode" class="dark_mode"
						<?php checked( get_user_meta( $user->data->ID, 'dark_mode', true ), 'on', true ); ?> />
						<?php esc_html_e( 'Enable Dark Mode in the dashboard', 'dark-mode' ); ?>
					</label>
				</p>
				<?php
					/**
					 * Fires after the main setting but before the nonce.
					 *
					 * @since 2.0
					 *
					 * @param object $user WP_User object of the current user.
					 */
					do_action( 'dark_mode_profile_settings', $user );
				?>
				<input type="hidden" name="dark_mode_nonce" id="dark_mode_nonce" value="<?php echo esc_attr( $dark_mode_nonce ); ?>" />
			</td>
		</tr>
		<?php
	}

	/**
	 * Save the value of the profile field.
	 *
	 * @since 1.0
	 * @since 1.3 Added auto Dark Mode settings.
	 * @since 1.7 Added sanitisation to fields not explicitly set.
	 * @since 2.0 Removed the automatic settings.
	 * @since 3.0 Updated the nonce check for the save event.
	 *
	 * @param int $user_id The user id.
	 *
	 * @return void
	 */
	public static function save_profile_fields( $user_id ) {
		if ( wp_verify_nonce( sanitize_key( $_POST['dark_mode_nonce'] ), 'dark_mode_nonce' ) ) {
			// Set the option value.
			$option = isset( $_POST['dark_mode'] ) ? 'on' : 'off';

			/**
			 * Filter the user's Dark Mode choice.
			 *
			 * @since 2.0
			 *
			 * @param string $option  The user's option choice.
			 * @param int    $user_id The current user's id.
			 */
			$option = apply_filters( 'before_dark_mode_saved', $option, $user_id );

			// Update the users meta.
			update_user_meta( $user_id, 'dark_mode', $option );

			/**
			 * Fires after the Dark Mode option has been saved.
			 *
			 * @since 2.0
			 *
			 * @param string $option  The user's option choice.
			 * @param int    $user_id The current user's id.
			 */
			do_action( 'after_dark_mode_saved', $option, $user_id );
		}
	}

	/**
	 * Add some useful links to the plugin table.
	 *
	 * @since 1.8
	 *
	 * @param array  $links The list of plugin links.
	 * @param string $file  The current plugin.
	 *
	 * @return array $links
	 */
	public static function add_plugin_links( $links, $file ) {
		// Check Dark Mode is the next plugin.
		if ( 'dark-mode/dark-mode.php' === $file ) {
			// Create the feedback link.
			$feedback_link = '<a href="https://github.com/danieltj27/Dark-Mode/issues" target="_blank">' . __( 'Feedback', 'dark-mode' ) . '</a>';

			// Add the feedback link.
			array_unshift( $links, $feedback_link );
		}

		return $links;
	}

	/**
	 * Add the Dark Mode class to the body tag.
	 *
	 * @since 3.1
	 *
	 * @param string $classes A string of class names.
	 *
	 * @return string $classes
	 */
	public static function add_body_class( $classes ) {
		// Has the user enabled Dark Mode?
		if ( false !== self::is_using_dark_mode() ) {
			// Add the body class.
			$classes .= ' dark-mode ';
		}

		return $classes;
	}
}
