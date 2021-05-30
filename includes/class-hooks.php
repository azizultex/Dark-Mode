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
			add_action( 'admin_bar_menu', [ $this, 'render_admin_switcher_menu' ], 2000 );
			add_action( 'admin_head', [ $this, 'head_scripts' ] );
			//add_action( 'admin_footer', [ $this, 'footer_scripts' ] );

			add_action( 'admin_init', [ $this, 'display_notice' ] );

			add_action( 'wp_ajax_wp_markdown_editor_update_notice', [ $this, 'handle_update_notice' ] );
			add_action( 'wp_ajax_wp_markdown_editor_review_notice', [ $this, 'handle_review_notice' ] );
			add_action( 'wp_ajax_wp_markdown_editor_affiliate_notice', [ $this, 'handle_affiliate_notice' ] );

			add_action( 'wppool_after_settings', [ $this, 'pro_promo' ] );

		}

		public function pro_promo() {
			include_once DARK_MODE_INCLUDES . '/promo.php';
		}

		/**
		 * handle review notice
		 */
		public function handle_review_notice() {

			$value = ! empty( $_REQUEST['value'] ) ? sanitize_text_field( $_REQUEST['value'] ) : 7;

			if ( 'hide_notice' == $value ) {
				update_option( 'wp_markdown_editor_review_notice_interval', 'off' );
			} else {
				set_transient( 'wp_markdown_editor_review_notice_interval', 'off', $value * DAY_IN_SECONDS );
			}

			update_option( sanitize_key( 'wp_markdown_editor_notices' ), [] );

		}

		/**
		 * handle affiliate notice
		 */
		public function handle_affiliate_notice() {
			$value = ! empty( $_REQUEST['value'] ) ? sanitize_text_field( $_REQUEST['value'] ) : 7;

			if ( 'hide_notice' == $value ) {
				update_option( 'wp_markdown_editor_affiliate_notice_interval', 'off' );
			} else {
				set_transient( 'wp_markdown_editor_affiliate_notice_interval', 'off', $value * DAY_IN_SECONDS );
			}

			update_option( sanitize_key( 'wp_markdown_editor_notices' ), [] );

		}

		public function footer_scripts() { ?>
            <script>
                ;(function () {
                    var is_saved = localStorage.getItem('dark_mode_active');

                    if (!is_saved) {
                        is_saved = 1;
                    }

                    var is_gutenberg = document.querySelector('html').classList.contains('block-editor-page');

                    if(is_gutenberg) return;


                    if (is_saved && is_saved != 0) {
                        document.querySelector('html').classList.add('dark-mode');
                    }
                })();

            </script>
		<?php }

		public function handle_update_notice() {
			update_option( 'wp_markdown_editor_update_notice_interval', 'off' );
			update_option( sanitize_key( 'wp_markdown_editor_notices' ), [] );//
			die();
		}

		public function display_notice() {

			//Return if allow tracking is not interacted yet
			if ( ! get_option( 'dark-mode_allow_tracking' ) ) {
				return;
			}

		    //Update Notice
			if ( 'off' != get_option( 'wp_markdown_editor_update_notice_interval', 'on' )){

				$notice = '<p>WP Markdown Editor (formerly Dark Mode) has now additional settings that you can turn off. </p> 
                <a style="margin-bottom: 8px;" href="' . admin_url( 'options-general.php?page=wp-markdown-settings' )
				          . '" class="button-primary">Explore Now</a> ';

				wpmd_add_notice( 'info is-dismissible wp-markdown-editor-update-notice', $notice );
			}

			if ( 'off' != get_option( 'wp_markdown_editor_update_notice_interval', 'on' ) ) {
				return;
			}

				//Review notice
			if ( 'off' != get_option( 'wp_markdown_editor_review_notice_interval', 'on' )
			     && 'off' != get_transient( 'wp_markdown_editor_review_notice_interval' ) ) {

				ob_start();
				include_once DARK_MODE_PATH . '/includes/notices/review-notice.php';
				$notice_html = ob_get_clean();

				wpmd_add_notice( 'info is-dismissible wp-markdown-editor-review-notice', $notice_html );
			}

			//Affiliate notice
			if ( 'off' == get_option( 'wp_markdown_editor_review_notice_interval' )
			     && 'off' != get_option( 'wp_markdown_editor_affiliate_notice_interval', 'on' )
			     && 'off' != get_transient( 'wp_markdown_editor_affiliate_notice_interval') ){

				ob_start();
				include_once DARK_MODE_PATH . '/includes/notices/affiliate-notice.php';
				$notice_html = ob_get_clean();

			wpmd_add_notice( 'info is-dismissible wp-markdown-editor-affiliate-notice', $notice_html );
			}

		}

		public function head_scripts() {

			if ( ! wpmde_darkmode_enabled() ) {
				return;
			}

			?>
            <script>

                //Check Darkmode
                ;(function () {
                    var is_saved = localStorage.getItem('dark_mode_active');

                    if (!is_saved) {
                        is_saved = 1;
                    }

                    var is_gutenberg = document.querySelector('html').classList.contains('block-editor-page');

                    if(is_gutenberg) return;


                    if (is_saved && is_saved != 0) {
                        document.querySelector('html').classList.add('dark-mode');
                    }
                })();

                //Check OS aware mode
                ;(function () {

                    var is_saved = localStorage.getItem('dark_mode_active');

                    if (is_saved == 0) {
                        return;
                    }

                    //check os aware mode
                    var darkMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

                    try {
                        // Chrome & Firefox
                        darkMediaQuery.addEventListener('change', function (e) {
                            var newColorScheme = e.matches ? 'dark' : 'light';

                            if ('dark' === newColorScheme) {
                                document.querySelector('html').classList.add('dark-mode');
                            } else {
                                document.querySelector('html').classList.remove('dark-mode');
                            }

                            window.dispatchEvent(new Event('dark_mode_init'));

                        });
                    } catch (e1) {
                        try {
                            // Safari
                            darkMediaQuery.addListener(function (e) {
                                var newColorScheme = e.matches ? 'dark' : 'light';

                                if ('dark' === newColorScheme) {
                                    document.querySelector('html').classList.add('dark-mode');
                                } else {
                                    document.querySelector('html').classList.remove('dark-mode');
                                }

                                window.dispatchEvent(new Event('dark_mode_init'));

                            });
                        } catch (e2) {
                            console.error(e2);
                        }
                    }

                    /** check init dark theme */
                    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                        document.querySelector('html').classList.add('dark-mode');
                        window.dispatchEvent(new Event('dark_mode_init'));
                    }

                })();

            </script>
		<?php }

		/**
		 * display dark mode switcher button on the admin bar menu
		 */
		public function render_admin_switcher_menu() {

			if ( ! wpmde_darkmode_enabled() ) {
				return;
            }

			$light_text = __( 'Light', 'dark-mode' );
			$dark_text  = __( 'Dark', 'dark-mode' );

			global $wp_admin_bar;
			$wp_admin_bar->add_menu( array(
				'id'    => 'dark-mode-switch',
				'title' => sprintf( '<div class="dark-mode-switch dark-mode-ignore">
	                                    <div class="toggle dark-mode-ignore"></div>
	                                    <div class="modes dark-mode-ignore">
	                                        <p class="light dark-mode-ignore">%s</p>
	                                        <p class="dark dark-mode-ignore">%s</p>
	                                    </div>
	                            	</div>', $light_text, $dark_text ),
				'href'  => '#',
			) );
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

