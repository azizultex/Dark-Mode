=== Dark Mode ===
Contributors: azizultex, wppool, emrikol, danieltj, munyagu, travel_girl, melchoyce, afercia, hedgefield, megane9988, presskopp, willrad, loumray, bueltge, dingo_bastard, yuanhao, leetaylor5455
Tags: dark, style, admin, dashboard, profile
Requires at least: 4.0
Tested up to: 5.5.1
Stable tag: 3.3.2
Requires PHP: 5.4
License: GNU GPL v2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Lets your users make the WordPress admin dashboard darker.

== Description ==

This is a beta plugin that might one day be part of the WordPress core. Please don't use this on production websites unless you're happy with the stability as some things may still be experimental.

Using technology at night time can have a negative effect on your eyesight. Dark Mode will darken the colors of your admin dashboard making it easier for you to work at night.

For information on the progress of this plugin, please refer to the [Trac ticket](https://core.trac.wordpress.org/ticket/41928) or you can get involved on the [GitHub repository](https://github.com/emrikol/Dark-Mode).

= How to use? =
After activating the plugin, you need to go to the profile edit page from admin backend.
You can see a Darkmode titled checkbox field.
You need to check the field and save the settings.


= Developers =

There are many hooks and filters available within the Dark Mode plugin which allow you to extend it's capabilities with small amounts of code. Please see the [GitHub wiki](https://github.com/emrikol/Dark-Mode/wiki) pages for more information.

To learn how you can make your own plugins compatible with Dark Mode, please read the [compatibility guide](https://github.com/emrikol/Dark-Mode/wiki/Help:-Plugin-Compatibility-Guide) located on the GitHub Repository.

If you would like to contribute to the development of this plugin, please read [contributing.md](https://github.com/emrikol/Dark-Mode/blob/master/contributing.md)

= Translators =

Whilst Dark Mode has been translated into a few different languages already, we need your help! If you have just five minutes to spare, please consider [translating Dark Mode](https://translate.wordpress.org/projects/wp-plugins/dark-mode) into your language today.

= Automatic Dark Mode =

Automatic Dark Mode was removed from the plugin in version 2.0 but don't worry, it's still [available on GitHub](https://github.com/emrikol/Dark-Mode/issues/153) for those that want it back.

## Privacy Policy
Dark Mode uses [Appsero](https://appsero.com) SDK to collect some telemetry data upon user's confirmation. This helps us to troubleshoot problems faster & make product improvements.

Appsero SDK **does not gather any data by default.** The SDK only starts gathering basic telemetry data **when a user allows it via the admin notice**. We collect the data to ensure a great user experience for all our users.

Integrating Appsero SDK **DOES NOT IMMEDIATELY** start gathering data, **without confirmation from users in any case.**

Learn more about how [Appsero collects and uses this data](https://appsero.com/privacy-policy/).



== Installation ==

1. Upload the plugin package to the plugins directory.
2. Login to the dashboard and activate the plugin.
3. Go to your profile and enable Dark Mode.

== Frequently Asked Questions ==

= What does this plugin do? =

By default, WordPress has a very bright color scheme which means working at night time can be difficult. Dark Mode allows you to change the overall design to a much darker and subtle design making it more visually pleasing when working late.

= Does this support multi sites? =

Yes, the network administration areas have been styled accordingly to ensure a smooth, darker interface across your WordPress experience.

= Can I set it to come on automatically? =

Having Dark Mode come on automatically between certain times was a feature in this plugin that has since been removed as of version 2.0. Don't worry though, there is [a helper plugin](https://github.com/emrikol/Dark-Mode/issues/153) available which brings this functionality back.

= Why was the automatic feature removed? =

A lot more work was needed to ensure that it is stable, and it didn't fit in with the original plan of the Dark Mode feature. It is still available as an additional plugin if you'd like it back though.

= Can I contribute to this plugin? =

Yes, you can please open an [issue](https://github.com/emrikol/Dark-Mode/issues) or submit a [pull request](https://github.com/emrikol/Dark-Mode/pulls). All suggestions, feedback and code contributions are most welcome!

== Screenshots ==

1. The dashboard with Dark Mode turned off.
2. The dashboard with Dark Mode turned on.
3. Dark Mode with an admin color scheme in use.
4. The Dark Mode settings on a user's profile page.
5. Media Screen Dark Mode
6. Gutenberg Editor Color Schemes

== Changelog ==

= Latest Changes =

Refer to the [GitHub commit logs](https://github.com/emrikol/Dark-Mode/commits) for more information regarding the latest changes.

= Version History =

= 3.3.1 =
* New: Add RankMath plugin support

= 3.3.0 =
* New: Add Gutenberg Editor Color Scheme
* New: Add Appsero Integration

= 3.2.1 =

* Styling: Fixed style issue with media uploads and site health dashboard.
* Bugfix: Allow plugin to be installed in any directory, instead of forcing `dark-mode`
* Misc: PHPCS coding style updates.
* Misc: Removed unused CSS files.
* Misc: Documentation updates.

= 3.2 - March 15, 2019 =

* Updated author and GitHub links.
* Removed PLUGIN_VERSION constant. The plugin version is now derived dynamically so you don't have to update manually.
