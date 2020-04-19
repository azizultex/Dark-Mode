<tr class="dark-mode user-dark-mode-option" id="dark-mode">
    <th scope="row"><?php esc_html_e('Dark Mode', 'dark-mode'); ?>
    </th>
    <td>
        <p>
            <label for="dark_mode">
                <input type="checkbox" id="dark_mode" name="dark_mode" class="dark_mode" <?php checked(get_user_meta($user->data->ID, 'dark_mode', true), 'on', true); ?>/>
                <?php esc_html_e('Enable Dark Mode in the dashboard', 'dark-mode'); ?>
            </label>
            <br />
            <label for="dark_mode_auto">
                <input type="checkbox" id="dark_mode_auto" name="dark_mode_auto" class="dark_mode" <?php checked(get_user_meta($user->data->ID, 'dark_mode_auto', true), 'on', true); ?>/>
                <?php esc_html_e('Automatically switch between light and dark mode when your system does', 'dark-mode'); ?>
            </label>
        </p>
        <?php
        /**
         * Fires after the main setting but before the nonce.
         *
         * @since 2.0
         *
         * @param object $user WP_User object of the current user.
         */
        do_action('dark_mode_profile_settings', $user);
        ?>
        <input type="hidden" name="dark_mode_nonce" id="dark_mode_nonce"
            value="<?php echo esc_attr($dark_mode_nonce); ?>" />
    </td>
</tr>