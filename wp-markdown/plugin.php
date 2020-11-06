<?php

defined( 'ABSPATH' ) || exit;

define( 'WP_MARKDOWN_VERSION', '1.0.0' );
define( 'WP_MARKDOWN_FILE', __FILE__ );
define( 'WP_MARKDOWN_PATH', dirname( WP_MARKDOWN_FILE ) );
define( 'WP_MARKDOWN_INCLUDES', WP_MARKDOWN_PATH . '/includes/' );
define( 'WP_MARKDOWN_URL', plugins_url( '', WP_MARKDOWN_FILE ) );
define( 'WP_MARKDOWN_ASSETS', WP_MARKDOWN_URL . '/assets/' );
define( 'WP_MARKDOWN_TEMPLATES', WP_MARKDOWN_PATH . '/templates/' );


if ( ! class_exists( 'WP_Markdown' ) ) {


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

			if ( file_exists( WP_MARKDOWN_PATH . '/build/index.asset.php' ) ) {
				$asset = include WP_MARKDOWN_PATH . '/build/index.asset.php';

				$dependencies = $asset['dependencies'];
				$version      = $asset['version'];
			}

			wp_enqueue_script(
				'wp-markdown-script',
				WP_MARKDOWN_URL . '/build/index.js',
				array_merge( $dependencies, [ 'wp-api', 'wp-compose' ] ),
				$version
			);

			//todo
			list( $iceberg_theme, ) = (array) get_theme_support( 'iceberg-editor' );

			wp_localize_script(
				'wp-markdown-script',
				'WPMD_Settings',
				array(
					'siteurl'            => wp_parse_url( get_bloginfo( 'url' ) ),
					'WPMD_SettingsNonce' => wp_create_nonce( 'wp_rest' ),
					'isDefaultEditor'    => get_option( 'iceberg_is_default_editor' ),
					'customThemes'       => ( false !== $iceberg_theme ) ? $iceberg_theme : '',
					'license'            => get_option( 'iceberg_license_active' ),
					'isGutenberg'        => defined( 'GUTENBERG_VERSION' ) || ( function_exists( 'is_plugin_active' ) && is_plugin_active( 'gutenberg/gutenberg.php' ) ) ? true : false,
					'isEditWPMD'         => isset( $_GET['is_markdown'] ) ? sanitize_text_field( $_GET['is_markdown'] ) : false,
					'is_pro'             => false,
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
			return __( 'Title', 'iceberg' );
		}

		public function write_your_story( $text, $post ) {
			return __( 'Tell your story...', 'iceberg' );
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
					__( 'Edit (Markdown)', 'iceberg' )
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


