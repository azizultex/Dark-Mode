;(function ($) {
    $(document).ready(function () {

        //Handle the update notice
        $(document).on('click','.wp-markdown-editor-update-notice .notice-dismiss', function () {

            wp.ajax.send('wp_markdown_editor_update_notice', {
                success: () => {},
                error: (error) => console.log(error),
            });
        });

        /**--------------Review Notice----------------**/
        //handle review notice remind_later
        $('.wp-markdown-editor-review-notice .remind_later').on('click', function () {
            $('.notice-overlay-wrap').css('display', 'flex');
        });

        //close the review notice
        $('.wp-markdown-editor-review-notice .close-notice').on('click', function () {
            $(this).parents('.notice-overlay-wrap').css('display', 'none');
        });


        $('.wp-markdown-editor-review-notice .notice-overlay-actions a, .wp-markdown-editor-review-notice .notice-actions a.hide_notice, .wp-markdown-editor-review-notice .notice-dismiss').on('click', function () {
            $(this).parents('.wp-markdown-editor-review-notice').slideUp();

            let value = $(this).data('value');

            if (!value) {
                value = 7;
            }


            wp.ajax.send('wp_markdown_editor_review_notice', {
                data: {
                    value,
                },
                success: () => {
                },
                error: (error) => console.log(error),
            });

        });


        /*-- Affiliate Notice --*/
        //close the affiliate notice
        $('.wp-markdown-editor-affiliate-notice .close-notice').on('click', function () {
            $(this).parents('.notice-overlay-wrap').css('display', 'none');
        });

        $('.wp-markdown-editor-affiliate-notice .dashicons-dismiss').on('click', function (e) {
            e.preventDefault();
            $('.wp-markdown-editor-affiliate-notice .notice-overlay-wrap').css('display', 'flex');
        });

        $(`.wp-markdown-editor-affiliate-notice .notice-overlay-actions a, .wp-markdown-editor-affiliate-notice .notice-dismiss, .wp-markdown-editor-affiliate-notice .notice-actions a.hide_notice`).on('click', function () {

            $(this).parents('.wp-markdown-editor-affiliate-notice').slideUp();

            let value = $(this).data('value');

            if (!value) {
                value = 7;
            }


            wp.ajax.send('wp_markdown_editor_affiliate_notice', {
                data: {
                    value,
                },
                success: () => {},
                error: (error) => console.log(error),
            });

        });


    });
})(jQuery);