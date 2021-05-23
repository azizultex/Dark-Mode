<?php

defined( 'ABSPATH' ) || exit();

final class Dark_Mode {

	private static $instance = null;

	/**
	 * Make WordPress Dark.
	 *
	 * @return void
	 * @since 1.1 Changed admin_enqueue_scripts hook to 99 to override admin colour scheme styles.
	 * @since 1.3 Added hook for the Feedback link in the toolbar.
	 * @since 1.8 Added filter for the plugin table links and removed admin toolbar hook.
	 * @since 3.1 Added the admin body class filter.
	 *
	 * @since 1.0
	 */
	public function __construct() {
		$this->appsero_init_tracker_dark_mode();

		$this->includes();

		add_action( 'plugins_loaded', [ $this, 'load_text_domain' ], 10, 0 );
		add_action( 'admin_enqueue_scripts', [ $this, 'admin_scripts' ], 99, 0 );

		add_filter( 'plugin_action_links_' . plugin_basename( DARK_MODE_FILE ), array( $this, 'plugin_action_links' ) );

		add_action( 'admin_notices', [ $this, 'print_notices' ], 15 );
		//add_filter( 'admin_body_class', array( $this, 'add_body_class' ), 10, 1 );

	}

	public static function add_body_class( $classes ) {
		if (  wpmde_darkmode_enabled() ) {
			$classes .= ' dark-mode ';
		}

		return $classes;
	}

	public function print_notices() {
		$notices = get_option( sanitize_key( 'wp_markdown_editor_notices' ), [] );
		foreach ( $notices as $notice ) { ?>
            <div class="notice notice-<?php echo $notice['class']; ?>">
				<?php echo $notice['message']; ?>
            </div>
			<?php
			update_option( sanitize_key( 'wp_markdown_editor_notices' ), [] );
		}
	}

	/**
	 * Includes require files
	 *
	 */
	public function includes() {
		include DARK_MODE_PATH . '/includes/functions.php';
		include DARK_MODE_PATH . '/includes/class-settings-api.php';
		include DARK_MODE_PATH . '/includes/class-settings.php';
		include DARK_MODE_PATH . '/includes/class-hooks.php';

		if ( is_admin() ) {
			include DARK_MODE_PATH . '/includes/class-admin.php';
		}

	}

	/**
	 * Load the plugin text domain.
	 *
	 * @return void
	 * @since 1.0
	 *
	 */
	public function load_text_domain() {
		load_plugin_textdomain( 'dark-mode', false, untrailingslashit( dirname( __FILE__ ) ) . '/languages' );
	}

	/**
	 * Add the scripts to the dashboard if enabled.
	 *
	 * @return void
	 * @since 2.1 Removed the register stylesheet function.
	 *
	 * @since 1.0
	 */
	public function admin_scripts() {
		wp_enqueue_style( 'wp-markdown-editor-admin', DARK_MODE_URL . 'assets/css/admin.css', false, DARK_MODE_VERSION );

		wp_enqueue_script( 'jquery.syotimer', DARK_MODE_URL . 'assets/js/jquery.syotimer.min.js', array('jquery'), '2.1.2', true );
		wp_enqueue_script( 'wp-markdown-editor-admin', DARK_MODE_URL . 'assets/js/admin.min.js', [ 'jquery', 'wp-util' ], DARK_MODE_VERSION,
			true );
		wp_localize_script( 'wp-markdown-editor-admin', 'darkmode', [ 'plugin_url' => DARK_MODE_URL, ] );

	}

	public function is_pro_active() {
		return apply_filters( 'wp_markdown_editor/is_pro_active', false );
	}

	/**
	 * Plugin action links
	 *
	 * @param   array  $links
	 *
	 * @return array
	 */
	public function plugin_action_links( $links ) {

		$links[] = sprintf( '<a href="%1$s" >%2$s</a>', admin_url( 'options-general.php?page=wp-markdown-settings' ),
			__( 'Settings', 'dark-mode' ) );

		if ( ! $this->is_pro_active() ) {
			$links[] = sprintf( '<a href="%1$s" style="color: orangered;font-weight: bold;">%2$s</a>',
				'https://wppool.dev/wp-markdown-editor', __( 'GET PRO', 'dark-mode' ) );
		}

		return $links;
	}

	/**
	 * Initialize the plugin tracker
	 *
	 * @return void
	 */
	public function appsero_init_tracker_dark_mode() {

		if ( ! class_exists( 'Appsero\Client' ) ) {
			require_once DARK_MODE_PATH . '/appsero/src/Client.php';
		}

		$client = new Appsero\Client( 'abf3e1be-dc75-4d7e-af65-595a8039cad7', 'WP Markdown Editor', DARK_MODE_FILE );

		// Active insights
		$client->insights()->init();

	}

	/**
	 * @return Dark_Mode|null
	 */
	public static function instance() {
		if ( is_null( self::$instance ) ) {
			self::$instance = new self();
		}

		return self::$instance;
	}
}

Dark_Mode::instance();
