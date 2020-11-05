<?php
/**
 * Iceberg registered settings.
 *
 * @package Iceberg
 */

defined( 'ABSPATH' ) || exit;

/**
 * Iceberg_Settings class.
 */
class Markdown_Settings {

	/**
	 * Hook in methods.
	 */
	public static function init() {
		add_action( 'init', array( __CLASS__, 'register_settings' ) );
	}

	/**
	 * Register settings.
	 */
	public static function register_settings() {
		global $wpdb;

		register_setting(
			'markdown_limited_blocks',
			'markdown_limited_blocks',
			array(
				'type'              => 'string',
				'description'       => __( 'Markdown blocks', 'iceberg' ),
				'sanitize_callback' => 'sanitize_text_field',
				'show_in_rest'      => true,
				'auth_callback'     => array( __CLASS__, 'auth_callback' ),
			)
		);

		register_setting(
			'markdown_is_default_editor',
			'markdown_is_default_editor',
			array(
				'type'              => 'boolean',
				'description'       => __( 'Markdown interface setting to enable as default editor', 'iceberg' ),
				'sanitize_callback' => null,
				'show_in_rest'      => true,
				'default'           => false,
			)
		);

		// Store theme settings to user meta.
		register_meta(
			'user',
			$wpdb->get_blog_prefix() . 'markdown_theme_settings',
			array(
				'type'         => 'object',
				'single'       => true,
				'show_in_rest' => array(
					'name'   => 'markdown_theme_settings',
					'type'   => 'object',
					'schema' => array(
						'type'                 => 'object',
						'properties'           => array(),
						'additionalProperties' => true,
					),
				),
			)
		);

		register_meta(
			'post',
			'_markdown_editor_remember',
			array(
				'show_in_rest'  => true,
				'single'        => true,
				'type'          => 'boolean',
				'auth_callback' => function() {
					return current_user_can( 'edit_posts' );
				},
			)
		);
	}

	/**
	 * Determine if the current user can edit posts.
	 *
	 * @return bool True when can edit posts, else false.
	 */
	private static function auth_callback() {
		return current_user_can( 'read' );
	}
}

Markdown_Settings::init();
