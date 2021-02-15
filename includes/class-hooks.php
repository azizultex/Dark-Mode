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

			//add_action( 'admin_init', [ $this, 'display_notice' ] );
			//add_action( 'wp_ajax_wp_markdown_editor_hide_christmas_notice', [ $this, 'hide_christmas_notice' ] );
		}

		public function hide_christmas_notice() {
//			update_option( 'wp_markdown_editor_hide_christmas_notice', true );
//			update_option( sanitize_key( 'wp_dark_mode_notices' ), [] );
//			die();
		}

		public function display_notice() {

//			if ( get_option( 'wp_markdown_editor_hide_christmas_notice' ) ) {
//				return;
//			}
//
//			/** display the black-friday notice if the pro version is not activated */
//			if ( wpmd_is_pro_active() ) {
//				return;
//			}
//
//			ob_start();
//			include DARK_MODE_PATH . '/includes/christmas-notice.php';
//			$message = ob_get_clean();
//
//			wpmd_add_notice( 'info is-dismissible christmas_notice', $message );

		}

		public function head_scripts() { ?>
            <script>
                var is_saved = localStorage.getItem('dark_mode_active');
                if (is_saved && is_saved != 0) {
                    document.querySelector('html').classList.add('dark-mode-active');
                }


                //check os aware mode
                var darkMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

                try {
                    // Chrome & Firefox
                    darkMediaQuery.addEventListener('change', function (e) {
                        var newColorScheme = e.matches ? 'dark' : 'light';

                        if ('dark' === newColorScheme) {
                            document.querySelector('html').classList.add('dark-mode-active');
                        } else {
                            document.querySelector('html').classList.remove('dark-mode-active');
                        }

                        window.dispatchEvent(new Event('dark_mode_init'));

                    });
                } catch (e1) {
                    try {
                        // Safari
                        darkMediaQuery.addListener(function (e) {
                            var newColorScheme = e.matches ? 'dark' : 'light';

                            if ('dark' === newColorScheme) {
                                document.querySelector('html').classList.add('dark-mode-active');
                            } else {
                                document.querySelector('html').classList.remove('dark-mode-active');
                            }

                            window.dispatchEvent(new Event('dark_mode_init'));

                        });
                    } catch (e2) {
                        console.error(e2);
                    }
                }

                /** check init dark theme */
                if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                    document.querySelector('html').classList.add('dark-mode-active');
                    window.dispatchEvent(new Event('dark_mode_init'));
                }

            </script>
		<?php }

		/**
		 * display dark mode switcher button on the admin bar menu
		 */
		public function render_admin_switcher_menu() {

			if ( ! is_admin() ) {
				return;
			}

			if(wpmd_is_gutenberg_page()){
			    return;
            }

			$light_text = __( 'Light', 'dark-mode' );
			$dark_text  = __( 'Dark', 'dark-mode' );

			global $wp_admin_bar;
			$wp_admin_bar->add_menu( array(
				'id'    => 'dark-mode-switch',
				'title' => sprintf( '<div class="dark-mode-switch dark-mode-ignore">
	                                    <div class="toggle"></div>
	                                    <div class="modes">
	                                        <p class="light">%s</p>
	                                        <p class="dark">%s</p>
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

