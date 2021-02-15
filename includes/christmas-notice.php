<h4>Enjoy upto 85% OFF on WP Markdown Editor. Get Your Merry Christmas <a href="https://wppool.dev/wp-markdown-editor" target="_blank">Deals Now</a>
</h4>

<script>
    (function ($) {
        $(document).on('click', '.christmas_notice .notice-dismiss', function () {


            wp.ajax.send('wp_markdown_editor_hide_christmas_notice', {
                success: function (res) {
                    console.log(res);
                },

                error: function (error) {
                    console.log(error);
                },
            });
        })
    })(jQuery)
</script>