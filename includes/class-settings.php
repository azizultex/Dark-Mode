<?php

/** if class `WPMDE_Settings` not exists yet */
if ( ! class_exists( 'WPMDE_Settings' ) ) {

	class WPMDE_Settings {

		private static $instance = null;
		private static $settings_api = null;

		public function __construct() {
			add_action( 'admin_init', array( $this, 'settings_fields' ) );
			add_action( 'admin_menu', array( $this, 'settings_menu' ) );
		}


		/**
		 * Registers settings section and fields
		 */
		public function settings_fields() {

			$sections = array(
				array(
					'id'    => 'wpmde_general',
					'title' => sprintf( __( '%s <span>General Settings</span>', 'dark-mode' ),
						'<i class="dashicons dashicons-admin-generic" ></i>' ),
				),

				'wpmde_license' => array(
					'id'    => 'wpmde_license',
					'title' => sprintf( __( '%s <span>License Activation</span>', 'dark-mode' ),
						'<i class="dashicons dashicons-admin-tools" ></i>' ),
				),

			);

			$fields = array(

				'wpmde_general' => array(

					'only_darkmode' => array(
						'name'    => 'only_darkmode',
						'default' => 'on',
						'label'   => __( 'Only Dark Mode', 'dark-mode' ),
						'desc'    => __( 'Turn ON to disable all the features of this plugin except Dark Mode.', 'dark-mode' ),
						'type'    => 'switcher',
					),

					'markdown_editor' => array(
						'name'    => 'markdown_editor',
						'default' => 'off',
						'label'   => __( 'Enable Markdown Editor', 'dark-mode' ),
						'desc'    => __( 'Enable/disable The Markdown Editor.', 'dark-mode' ),
						'type'    => 'switcher',
					),

					'admin_darkmode' => array(
						'name'    => 'admin_darkmode',
						'default' => 'on',
						'label'   => __( 'Enable Admin Darkmode', 'dark-mode' ),
						'desc'    => __( 'Enable/disable Darkmode in the admin dashboard.', 'dark-mode' ),
						'type'    => 'switcher',
					),

					//					'gutenberg_darkmode' => [],
					//
					//					'classic_editor_darkmode' => [],

					'productivity_sound' => array(
						'name'    => 'productivity_sound',
						'default' => 'on',
						'label'   => __( 'Enable Productivity Sounds', 'dark-mode' ),
						'desc'    => __( 'Enable/disable productivity sounds in the admin dashboard.', 'dark-mode' ),
						'type'    => 'switcher',
					),

					//					'new_fonts' => array(
					//						'name'    => 'new_fonts',
					//						'default' => 'on',
					//						'label'   => __( 'Enable New Fonts', 'dark-mode' ),
					//						'desc'    => __( 'Enable/disable new fonts for Gutenberg and Markdown editor.', 'dark-mode' ),
					//						'type'    => 'switcher',
					//					),

				),

				'wpmde_license' => array(
					'license' => array(
						'name'    => 'license',
						'default' => [ $this, 'license_output' ],
						'type'    => 'cb_function',
					),
				),
			);

			if ( ! class_exists( 'WP_Markdown_Editor_Pro' ) ) {
				unset( $sections['wpmde_license'] );
			}

//			if ( wpmde_is_classic_editor_plugin_active() ) {
//
//
//				unset($fields['wpmde_general']['gutenberg_darkmode']);
//
//
//				$fields['wpmde_general']['classic_editor_darkmode'] = array(
//					'name'    => 'classic_editor_darkmode',
//					'default' => 'on',
//					'label'   => __( 'Enable Darkmode in Classic Editor', 'dark-mode' ),
//					'desc'    => __( 'Enable/disable Darkmode in the classic editor.', 'dark-mode' ),
//					'type'    => 'switcher',
//				);
//			}else{
//			    unset($fields['wpmde_general']['classic_editor_darkmode']);
//
//				$fields['wpmde_general']['gutenberg_darkmode'] = array(
//					'name'    => 'gutenberg_darkmode',
//					'default' => 'off',
//					'label'   => __( 'Enable Darkmode in Gutenberg', 'dark-mode' ),
//					'desc'    => __( 'Enable/disable Darkmode in the Gutenberg editor.', 'dark-mode' ),
//					'type'    => 'switcher',
//				);
//            }

			self::$settings_api = new WPPOOL_Settings_API();

			//set sections and fields
			self::$settings_api->set_sections( $sections );
			self::$settings_api->set_fields( $fields );

			//initialize them
			self::$settings_api->admin_init();
		}

		public function license_output() {
			global $wp_markdown_editor_license;
			if ( $wp_markdown_editor_license ) {
				$wp_markdown_editor_license->menu_output();
			}
		}


		/**
		 * Register the plugin page
		 */
		public function settings_menu() {
			add_options_page( 'WP Markdown Editor Settings', 'WP Markdown Editor', 'manage_options', 'wp-markdown-settings',
				[ $this, 'settings_page' ] );
		}

		/**
		 * Display the plugin settings options page
		 */
		public function settings_page() {

			update_option( 'wp_markdown_editor_update_notice_interval', 'off' );

			?>
                <div class="wrap wp-markodwn-editor-settings-page">
                    <h2><?php _e( 'WP Markdown Editor Settings', 'dark-mode' ); ?></h2>
					<?php self::$settings_api->show_settings(); ?>
                </div>
			<?php

		}

		/**
		 * @return WPMDE_Settings|null
		 */
		public static function instance() {
			if ( is_null( self::$instance ) ) {
				self::$instance = new self();
			}

			return self::$instance;
		}

	}
}

WPMDE_Settings::instance();
