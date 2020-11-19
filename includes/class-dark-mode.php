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

			add_filter( 'plugin_action_links', [ $this, 'add_plugin_links' ], 10, 2 );
		}

		/**
		 * Includes require files
		 *
		 */
		public function includes() {
			include DARK_MODE_PATH . '/includes/class-hooks.php';
			include DARK_MODE_PATH . '/wp-markdown/plugin.php';
			//include DARK_MODE_PATH . '/block/plugin.php';
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

			wp_enqueue_script( 'dark-mode', DARK_MODE_URL . 'assets/js/admin.js', false, DARK_MODE_VERSION, true );
			wp_localize_script( 'dark-mode', 'darkmode', [
				'plugin_url' => DARK_MODE_URL,
			] );

			global $pagenow;
			if ( is_admin() && ( $pagenow === 'post.php' || $pagenow === 'post-new.php' ) ) {
				return;
			}


			/**
			 * Filters the Dark Mode stylesheet URL.
			 *
			 * @param string $css_url Default CSS file path for Dark Mode.
			 *
			 * @return string $css_url
			 * @since 3.0 Changed CSS file to include hyphen in name.
			 *
			 * @since 1.1
			 * @since 2.1 Removed second parameter from `plugins_url()`.
			 */
			$css_url = apply_filters( 'dark_mode_css', DARK_MODE_URL . 'assets/css/dark-mode.css' );

			wp_enqueue_style( 'dark-mode', $css_url, false, DARK_MODE_VERSION );

		}

		/**
		 * Add some useful links to the plugin table.
		 *
		 * @param array $links The list of plugin links.
		 * @param string $file The current plugin.
		 *
		 * @return array $links
		 * @since 1.8
		 *
		 */
		public function add_plugin_links( $links, $file ) {
			// Check Dark Mode is the next plugin.
			if ( 'dark-mode/dark-mode.php' === $file ) {
				// Create the feedback link.
				$feedback_link = '<a href="https://github.com/dgwyer/Dark-Mode/issues" target="_blank">' . __( 'Feedback', 'dark-mode' ) . '</a>';

				// Add the feedback link.
				array_unshift( $links, $feedback_link );
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

			$client = new Appsero\Client( 'abf3e1be-dc75-4d7e-af65-595a8039cad7', 'Dark Mode', __FILE__ );

			// Active insights
			$client->insights()->init();

		}

		public static function instance() {
			if ( is_null( self::$instance ) ) {
				self::$instance = new self();
			}

			return self::$instance;
		}
	}

Dark_Mode::instance();
