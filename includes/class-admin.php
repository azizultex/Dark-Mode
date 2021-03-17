<?php

defined('ABSPATH') || exit();


if(!class_exists('Dark_Mode_Admin')){
	class Dark_Mode_Admin{
		/** @var null  */
		private static $instance = null;

		/**
		 * Dark_Mode_Admin constructor.
		 */
		public function __construct() {
			add_action('admin_menu', [$this, 'add_menu']);
		}

		public function add_menu(){
		}

		public function render_settings_page(){
			
		}

		/**
		 * @return Dark_Mode_Admin|null
		 */
		public static function instance(){
			if(is_null(self::$instance)){
				self::$instance = new self();
			}

			return self::$instance;
		}
	}

}

Dark_Mode_Admin::instance();