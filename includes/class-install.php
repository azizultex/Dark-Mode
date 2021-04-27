<?php

/** block direct access */
defined( 'ABSPATH' ) || exit;

/** check if class `Dark_Mode_Install` not exists yet */
if ( ! class_exists( 'Dark_Mode_Install' ) ) {
	/**
	 * Class Install
	 */
	class Dark_Mode_Install {

		/**
		 * @var null
		 */
		private static $instance = null;

		/**
		 * Do the activation stuff
		 *
		 * @return void
		 * @since 1.0.0
		 */
		public function __construct() {
			if ( ! class_exists( 'WP_Markdown_Editor_Update' ) ) {
				require_once DARK_MODE_INCLUDES . '/class-update.php';
			}

			$updater = new WP_Markdown_Editor_Update();

			if ( ! $updater->needs_update() ) {
				self::create_default_data();
			}

		}


		/**
		 * create default data
		 *
		 * @since 2.0.8
		 */
		private static function create_default_data() {

			update_option( 'dark_mode_version', DARK_MODE_VERSION );

			$install_date = get_option( 'dark_mode_install_time' );

			if ( empty( $install_date ) ) {
				update_option( 'dark_mode_install_time', time() );
			}

			set_transient( 'wp_markdown_editor_review_notice_interval', 'off', 3 * DAY_IN_SECONDS );
			set_transient( 'wp_markdown_editor_affiliate_notice_interval', 'off', 3 * DAY_IN_SECONDS );

		}

		/**
		 * @return Dark_Mode_Install|null
		 */
		public static function instance() {
			if ( is_null( self::$instance ) ) {
				self::$instance = new self();
			}

			return self::$instance;
		}

	}
}

Dark_Mode_Install::instance();