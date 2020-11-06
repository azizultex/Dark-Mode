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
			self::create_default_data();
		}


		/**
		 * create default data
		 *
		 * @since 2.0.8
		 */
		private static function create_default_data() {

			$user_meta = array(
				'theme'     => 'default',
				'isDefault' => 1,
				'colors'    => array
				(
					'background' => '#edebe8',
					'text'       => '#1E1E1E',
					'accent'     => '#105d72',
				)
			);

			update_option( 'dark_mode_version', DARK_MODE_VERSION );

			$install_date = get_option( 'dark_mode_install_time' );

			if ( empty( $install_date ) ) {
				update_option( 'dark_mode_install_time', time() );
			}

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