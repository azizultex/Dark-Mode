<?php

/** Block direct access */
defined( 'ABSPATH' ) || exit();

/** check if class `Dark_Mode_Hooks` not exists yet */
if ( ! class_exists( 'Dark_Mode_Hooks' ) ) {
	class Dark_Mode_Hooks {

		/**
		 * @var null
		 */
		private static $instance = null;

		/**
		 * Dark_Mode_Hooks constructor.
		 */
		public function __construct() {

		}
		/**
		 * @return Dark_Mode_Hooks|null
		 */
		public static function instance() {
			if ( is_null( self::$instance ) ) {
				self::$instance = new self();
			}

			return self::$instance;
		}
	}
}

Dark_Mode_Hooks::instance();

