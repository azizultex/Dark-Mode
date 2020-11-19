<?php

defined( 'ABSPATH' ) || exit;


if ( ! class_exists( 'WP_Markdown' ) ) {

	define( 'WP_MARKDOWN_VERSION', DARK_MODE_VERSION );
	define( 'WP_MARKDOWN_FILE', __FILE__ );
	define( 'WP_MARKDOWN_PATH', dirname( WP_MARKDOWN_FILE ) );
	define( 'WP_MARKDOWN_INCLUDES', WP_MARKDOWN_PATH . '/includes/' );
	define( 'WP_MARKDOWN_URL', plugins_url( '', WP_MARKDOWN_FILE ) );
	define( 'WP_MARKDOWN_ASSETS', WP_MARKDOWN_URL . '/assets/' );
	define( 'WP_MARKDOWN_TEMPLATES', WP_MARKDOWN_PATH . '/templates/' );

	final class WP_Markdown {
		private static $instance = null;

		public function __construct() {

			$this->includes();

			global $pagenow;
			if ( is_admin() && ( $pagenow === 'post.php' || $pagenow === 'post-new.php' ) ) {
				add_action( 'enqueue_block_assets', [ $this, 'editor_scripts' ] );
				add_action( 'enqueue_block_assets', [ $this, 'editor_styles' ] );
			}

			// Filters.
			add_filter( 'write_your_story', array( $this, 'write_your_story' ), 10, 2 );
			add_filter( 'enter_title_here', array( $this, 'enter_title_here' ), 10, 2 );

			add_filter( 'post_row_actions', array( $this, 'add_edit_links' ), 15, 2 );
			add_filter( 'page_row_actions', array( $this, 'add_edit_links' ), 15, 2 );

			add_action( 'admin_init', [ $this, 'update_user_meta' ] );
		}

		/**
		 * set default data to the user meta
		 *
		 * @return void
		 */
		public function update_user_meta() {
			global $wpdb;
			$meta_exists = get_user_meta( get_current_user_id(), $wpdb->get_blog_prefix() . 'markdown_theme_settings', true );

			if ( !empty( $meta_exists ) ) {
				return;
			}

			$meta_value = array(
				'theme'     => 'default',
				'isDefault' => 1,
				'colors'    => array(
					'background' => '#edebe8',
					'text'       => '#1E1E1E',
					'accent'     => '#105d72',
				)

			);
			update_user_meta( get_current_user_id(), $wpdb->get_blog_prefix() . 'markdown_theme_settings', $meta_value );

		}

		public function includes() {
			include WP_MARKDOWN_PATH . '/includes/class-settings.php';
		}

		public function editor_scripts() {
			$dependencies = '';
			$version      = '';
			$countdown_time = '';

			if ( file_exists( WP_MARKDOWN_PATH . '/build/index.asset.php' ) ) {
				$asset = include WP_MARKDOWN_PATH . '/build/index.asset.php';

				$dependencies = $asset['dependencies'];
				$version      = $asset['version'];
			}

			$countdown_time = get_transient( 'wpmd_promo_time' );

			if ( ! $countdown_time ) {

				$date = date( 'Y-m-d-H-i', strtotime( '+ 6 days' ) );

				$date_parts = explode( '-', $date );

				$countdown_time = [
					'year'   => $date_parts[0],
					'month'  => $date_parts[1],
					'day'    => $date_parts[2],
					'hour'   => $date_parts[3],
					'minute' => $date_parts[4],
				];

				set_transient( 'wpmd_promo_time', $countdown_time, ( ( 6 * 24 * HOUR_IN_SECONDS ) + 6 * HOUR_IN_SECONDS ) );
				
			}

			wp_enqueue_script(
				'wp-markdown-script',
				WP_MARKDOWN_URL . '/build/index.js',
				array_merge( $dependencies, [ 'wp-api', 'wp-compose' ] ),
				$version
			);

			wp_enqueue_script( 'jquery.syotimer', DARK_MODE_URL . 'assets/js/jquery.syotimer.min.js', array('jquery'), '2.1.2', true );

			//todo
			list( $iceberg_theme, ) = (array) get_theme_support( 'iceberg-editor' );

			wp_localize_script(
				'wp-markdown-script',
				'WPMD_Settings',
				array(
					'siteurl'            => wp_parse_url( get_bloginfo( 'url' ) ),
					'pluginDirUrl'  	 => plugin_dir_url( __DIR__ ),
					'countdown_time'	 => $countdown_time,
					'WPMD_SettingsNonce' => wp_create_nonce( 'wp_rest' ),
					'isDefaultEditor'    => get_option( 'iceberg_is_default_editor' ),
					'customThemes'       => ( false !== $iceberg_theme ) ? $iceberg_theme : '',
					'license'            => get_option( 'iceberg_license_active' ),
					'isGutenberg'        => defined( 'GUTENBERG_VERSION' ) || ( function_exists( 'is_plugin_active' ) && is_plugin_active( 'gutenberg/gutenberg.php' ) ) ? true : false,
					'isEditWPMD'         => isset( $_GET['is_markdown'] ) ? sanitize_text_field( $_GET['is_markdown'] ) : false,
					'is_pro'             => apply_filters('wp_markdown_editor_is_pro_active', false)
				)
			);

		}

		public function editor_styles() {

			wp_enqueue_style(
				'wp-markdown-style',
				WP_MARKDOWN_URL . '/build/index.css',
				[],
				filemtime( WP_MARKDOWN_PATH . '/build/index.css' )
			);

			// Add inline style for the editor themes to hook into.
			wp_add_inline_style( 'wp-markdown-style', ':root{}' );
		}

		public function enter_title_here( $text, $post ) {
			return __( 'Title', 'dark-mode' );
		}

		public function write_your_story( $text, $post ) {
			return __( 'Tell your story...', 'dark-mode' );
		}

		public function add_edit_links( $actions, $post ) {
			$is_default = get_option( 'markdown_is_default_editor' );
			$posttypes  = get_post_types(
				array(
					'public'       => true,
					'show_in_rest' => true,
				),
				'names',
				'and'
			);

			$url    = admin_url( 'post.php?post=' . $post->ID );
			$params = array(
				'action'      => 'edit',
				'is_markdown' => true,
			);
			if ( class_exists( 'Classic_Editor' ) ) {
				$params['classic-editor__forget'] = 'forget';
			}

			$edit_link = add_query_arg( $params, $url );

			$edit_actions = array(
				'edit_with_markdown' => sprintf(
					'<a href="%1$s">%2$s</a>',
					esc_url( $edit_link ),
					__( 'Edit (Markdown)', 'dark-mode' )
				),
			);

			if ( in_array( $post->post_type, $posttypes, true ) && ! $is_default ) {
				$actions = array_slice( $actions, 0, 1, true ) + $edit_actions + array_slice( $actions, 1, count( $actions ) - 1, true );
			}

			return $actions;
		}


		public static function instance() {
			if ( is_null( self::$instance ) ) {
				self::$instance = new self();
			}

			return self::$instance;
		}
	}

}

WP_Markdown::instance();


