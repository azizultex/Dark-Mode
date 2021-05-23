<?php
$countdown_time = get_transient( 'wpmd_promo_time' );

if ( ! $countdown_time ) {

	$date = date( 'Y-m-d-H-i', strtotime( '+14 hours' ) );

	$date_parts = explode( '-', $date );

	$countdown_time = [
		'year'   => $date_parts[0],
		'month'  => $date_parts[1],
		'day'    => $date_parts[2],
		'hour'   => $date_parts[3],
		'minute' => $date_parts[4],
	];

	set_transient( 'wpmd_promo_time', $countdown_time, 14 * HOUR_IN_SECONDS );

}

$promo_data_transient_key = 'wp_markdown_editor_promo_data';

$saved_data = get_transient( $promo_data_transient_key );

$promo_data = array_merge( [
	'discount_text' => '80% OFF',
	'is_christmas'  => 'no',
], (array) $saved_data );

//			if ( ! $saved_data ) {
//				$url = 'https://wppool.dev/wp-markdown-editor-promo-data.json';
//
//				$res = wp_remote_get( $url );
//
//				if ( ! is_wp_error( $res ) ) {
//					$json = wp_remote_retrieve_body( $res );
//					$promo_data = (array) json_decode( $json );
//
//					set_transient( $promo_data_transient_key, $promo_data, DAY_IN_SECONDS );
//				}
//			}

$promo_data['countdown_time'] = $countdown_time;
?>

<div class="components-markdown-gopro components-markdown-gopro-hidden darkmode-ignore">
    <div class="markdown-gopro-inner darkmode-ignore">
        <span class="markdown-close-promo darkmode-ignore">×</span>

        <img class="promo-img darkmode-ignore" src="<?php echo DARK_MODE_URL ?>/assets/images/gift-box.svg" alt="WP Markdown"/>

        <h3 class="darkmode-ignore"><?php _e( 'Unlock PRO features', 'dark-mode' ); ?></h3>
        <h3 class="discount darkmode-ignore"><?php _e( 'GET', 'dark-mode' ); ?>
            <span class="percentage"><?php echo $promo_data['discount_text']; ?></span></h3>
        <h3 class="limited-title darkmode-ignore"><?php _e( 'LIMITED TIME ONLY', 'dark-mode' ); ?></h3>

        <div class="simple_timer darkmode-ignore"></div>

        <a href="https://wppool.dev/wp-markdown-editor" target="_blank" class="wpmd-pro-btn darkmode-ignore"><?php _e( 'GET PRO',
				'dark-mode' ); ?></a>

    </div>
</div>

<style>
    .syotimer {
        text-align: center;
        padding: 0 0 10px;
    }

    .syotimer-cell {
        display: inline-block;
        margin: 0 14px;

        width: 50px;
        background: url(<?php echo DARK_MODE_URL.'/assets/images/timer.svg'; ?>) no-repeat 0 0;
        background-size: contain;
    }

    .syotimer-cell__value {
        font-size: 28px;
        color: #fff;

        height: 54px;
        line-height: 54px;

        margin: 0 0 5px;
    }

    .syotimer-cell__unit {
        font-family: Arial, serif;
        font-size: 12px;
        text-transform: uppercase;
        color: #fff;
    }
</style>


<script>
    (function ($) {
        $(document).ready(function () {

            //show popup
            $(document).on('click', '.wp-markodwn-editor-settings-page .disabled', function (e) {
                e.preventDefault();

                $('.components-markdown-gopro').removeClass('components-markdown-gopro-hidden');
            });

            //close promo
            $(document).on('click', '.markdown-close-promo', function () {
                $('.components-markdown-gopro').addClass('components-markdown-gopro-hidden');
            });

            //close promo
            $(document).on('click', '.components-markdown-gopro', function (e) {

                if (e.target !== this) {
                    return;
                }

                $(this).addClass('components-markdown-gopro-hidden');
            });

			<?php if ( ! empty( $countdown_time ) ) { ?>

            if (typeof window.timer_set === 'undefined') {
                window.timer_set = $('.simple_timer').syotimer({
                    year: <?php echo $countdown_time['year']; ?>,
                    month: <?php echo $countdown_time['month']; ?>,
                    day: <?php echo $countdown_time['day']; ?>,
                    hour: <?php echo $countdown_time['hour']; ?>,
                    minute: <?php echo $countdown_time['minute']; ?>,
//                      second: <?php // echo $countdown_time['second']; ?>,
                });
            }
			<?php } ?>

        })
    })(jQuery);
</script>