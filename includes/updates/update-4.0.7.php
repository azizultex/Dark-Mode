<?php

defined( 'ABSPATH' ) || exit();

class WP_Markdown_Editor_Update_4_0_7 {

	private static $instance = null;

	public function __construct() {
		$this->update_settings();

	}

	private function update_settings() {

		if ( defined( 'WPMDE_PRO_VERSION' ) ) {
			return;
		}

		$settings = (array) get_option( 'wpmde_general' );

		$settings['only_darkmode']      = 'on';
		$settings['markdown_editor']    = 'off';
		$settings['admin_darkmode']     = 'on';
		$settings['productivity_sound'] = 'off';
		$settings['new_fonts']          = 'off';

		update_option( 'wpmde_general', $settings );

	}

	public static function instance() {
		if ( is_null( self::$instance ) ) {
			self::$instance = new self();
		}

		return self::$instance;
	}

}


WP_Markdown_Editor_Update_4_0_7::instance();
