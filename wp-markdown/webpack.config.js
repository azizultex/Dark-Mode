const path = require( 'path' );
const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );
const MiniCssExtractPlugin = require( 'mini-css-extract-plugin' );
const FixStyleOnlyEntriesPlugin = require( 'webpack-fix-style-only-entries' );
const BrowserSyncPlugin = require( 'browser-sync-webpack-plugin' );
const OptimizeCssAssetsPlugin = require( 'optimize-css-assets-webpack-plugin' );
const ReplaceInFileWebpackPlugin = require( 'replace-in-file-webpack-plugin' );
const isProduction = process.env.NODE_ENV === 'production';
const pkg = require( './package.json' );

// Check if local.json exists
try {
  var localEnv = require( './local.json' ).devURL;
} catch ( err ) {
  // Fallback if it does not
  var localEnv = 'https://localshot/wp-dark-mode';
}

module.exports = {
  ...defaultConfig,

  entry: {
    index: path.resolve( process.cwd(), 'src/index.js' ),
  },

  module: {
    ...defaultConfig.module,
    rules: [
      ...defaultConfig.module.rules,
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: { url: false, sourceMap: ! isProduction },
          },
          {
            loader: 'sass-loader',
            options: { sourceMap: ! isProduction },
          },
        ],
      },
      {
        test: /\.(js|jsx)$/,
        use: {
          loader: "babel-loader",
          options: {
            babelrc: false,
            "presets": [
              [ "@babel/preset-env", {
                "modules": false,
                "targets": {
                  "browsers": [
                    "last 2 Chrome versions",
                    "last 2 Firefox versions",
                    "last 2 Safari versions",
                    "last 2 iOS versions",
                    "last 1 Android version",
                    "last 1 ChromeAndroid version",
                    "ie 11"
                  ]
                }
              } ]
            ],
            "plugins": [
              [ "@babel/plugin-transform-react-jsx", {
                "pragma": "wp.element.createElement"
              } ],
              "@babel/plugin-proposal-class-properties"
            ]
          },
        },
        exclude: /node_modules/
      },

    ],
  },

  plugins: [
    ...defaultConfig.plugins,
    new FixStyleOnlyEntriesPlugin(),
    new MiniCssExtractPlugin( { filename: '[name].css' } ),
    new BrowserSyncPlugin(
        {
          host: 'localhost',
          port: 3000,
          proxy: localEnv,
          open: true,
          files: [ 'build/*.php', 'build/*.js', 'build/*.css' ],
        },
        {
          injectCss: true,
          reload: false,
        }
    ),
    new OptimizeCssAssetsPlugin( {
      assetNameRegExp: /\.*\.css$/g,
      cssProcessor: require( 'cssnano' ),
      cssProcessorPluginOptions: {
        preset: [ 'default' ],
      },
      canPrint: true,
    } ),

    // new ReplaceInFileWebpackPlugin( [
    //   {
    //     files: [ 'iceberg.php' ],
    //     rules: [
    //       {
    //         search: /Version:(\s*?)[a-zA-Z0-9\.\-\+]+$/m,
    //         replace: 'Version:$1' + pkg.version,
    //       },
    //     ],
    //   },
    //   {
    //     files: [ 'readme.txt' ],
    //     rules: [
    //       {
    //         search: /^(\*\*|)Stable tag:(\*\*|)(\s*?)[a-zA-Z0-9.-]+(\s*?)$/im,
    //         replace: '$1Stable tag:$2$3' + pkg.version,
    //       },
    //     ],
    //   },
    //   {
    //     dir: 'includes/',
    //     files: [ 'class-iceberg.php' ],
    //     rules: [
    //       {
    //         search: /define\(\s*'ICEBERG_VERSION',\s*'(.*)'\s*\);/,
    //         replace:
    //             "define( 'ICEBERG_VERSION', '" +
    //             pkg.version +
    //             "' );",
    //       },
    //     ],
    //   },
    // ] ),

  ],
};
