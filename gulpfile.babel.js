import gulp from 'gulp';
import pkg from './package';
import yargs from 'yargs';
import sass from 'gulp-sass';
import autoprefixer from 'gulp-autoprefixer';
import cleanCss from 'gulp-clean-css';
import gulpif from 'gulp-if';
import sourcemaps from 'gulp-sourcemaps';
import browserSync from 'browser-sync';
import zip from 'gulp-zip';
import checktextdomain from 'gulp-checktextdomain';
import wpPot from 'gulp-wp-pot';
import webpack from 'webpack-stream';
import named from 'vinyl-named';
import del from 'del';
import rename from 'gulp-rename';

import ReplaceInFileWebpackPlugin from 'replace-in-file-webpack-plugin';

const PRODUCTION = yargs.argv.prod;
const server = browserSync.create();

const paths = {
    css: {
        src: ['assets/scss/admin.scss'],
        dest: 'assets/css/'
    },

    js: {
        src: ['assets/js/admin.js'],
        dest: 'assets/js/'
    },

    php: {
        src: [
            '**/*.php',
            '!wp-markdown/**',
            '!apigen/**',
            '!includes/libraries/**',
            '!node_modules/**',
            '!tests/**',
            '!vendor/**',
            '!includes/scss.inc.php',
            '!tmp/**'
        ],
        dest: './'
    },

    build: {
        src: [
            '**/*',
            '!node_modules/**',

            '!vendor/**',
            '!wp-markdown/node_modules/**',
            '!wp-markdown/src/**',
            '!wp-markdown/package.json',
            '!wp-markdown/package-lock.json',
            '!wp-markdown/webpack.config.js',
            '!assets/scss/**',
            '!build/**',
            '!src/**',
            '!**/*.md',
            '!**/*.map',
            '!**/*.sh',
            '!.idea/**',
            '!bin/**',
            '!.git/**',
            '!gulpfile.babel.js',
            '!package.json',
            '!composer.json',
            '!composer.lock',
            '!package-lock.json',
            '!debug.log',
            '!none',
            '!.babelrc',
            '!.gitignore',
            '!.gitmodules',
            '!phpcs.xml.dist',
            '!npm-debug.log',
            '!plugin-deploy.sh',
            '!export.sh',
            '!config.codekit',
            '!nbproject/*',
            '!tests/**',
            '!.csscomb.json',
            '!.editorconfig',
            '!.jshintrc',
            '!.tmp'
        ],
        dest: 'build'
    },

};

export const clean = () => del(['build'], {force: true});

//css stuff
export const css = () => {

    return gulp.src(paths.css.src)
        .pipe(gulpif(!PRODUCTION, sourcemaps.init()))
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({cascade: false}))
        .pipe(gulpif(PRODUCTION, cleanCss({compatibility: 'ie8'})))
        .pipe(gulpif(!PRODUCTION, sourcemaps.write()))
        .pipe(gulp.dest(paths.css.dest))
        .pipe(server.stream());
};

export const js = () => {
    return gulp.src(paths.js.src)
        .pipe(named())
        .pipe(webpack({
            mode: PRODUCTION ? 'production' : 'development',
            module: {
                rules: [
                    {
                        test: /\.js$/,
                        use: [
                            {
                                loader: 'babel-loader',
                                options: {
                                    presets: ['@babel/preset-env']
                                }
                            }
                        ]
                    }
                ]
            },

            devtool: !PRODUCTION ? 'inline-source-map' : false
        }))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(paths.js.dest));
};

//live server
export const serve = done => {
    // server.init({
    //     proxy: `localhost/test`
    // });

    done();
};

//reload browser on change
export const reload = done => {
    server.reload();
    done();
};

//watch changes
export const watch = () => {
    gulp.watch('assets/scss/**/*.scss', css);
    gulp.watch(['assets/js/admin.js','assets/js/components/**.js'], reload);
    gulp.watch('**/*.php', reload);
};

// export const copy = () => {
//     return gulp.src(paths.build.src)
//         .pipe(gulp.dest(paths.pro.dest));
// };

//compress to build files
export const compress = () => {
    return gulp.src(paths.build.src)
    //.pipe(gulp.dest(paths.pro.dest))
        .pipe(zip(`${pkg.name}.zip`))
        .pipe(gulp.dest(paths.build.dest));
};

//check text domain and correct it
export const checkdomain = () => {
    return gulp.src(paths.php.src)
        .pipe(checktextdomain({
            text_domain: pkg.name,
            keywords: [
                '__:1,2d',
                '_e:1,2d',
                '_x:1,2c,3d',
                'esc_html__:1,2d',
                'esc_html_e:1,2d',
                'esc_html_x:1,2c,3d',
                'esc_attr__:1,2d',
                'esc_attr_e:1,2d',
                'esc_attr_x:1,2c,3d',
                '_ex:1,2c,3d',
                '_n:1,2,4d',
                '_nx:1,2,4c,5d',
                '_n_noop:1,2,3d',
                '_nx_noop:1,2,3c,4d'
            ],
            report_success: true,
            correct_domain: true
        }))
};

//make pot file
export const makepot = () => {
    return gulp.src(paths.php.src)
        .pipe(wpPot({
            domain: pkg.name,
            package: pkg.name
        }))
        .pipe(gulp.dest(`languages/${pkg.name}.pot`))
};

export const dev = gulp.series(gulp.parallel(css, js), serve, watch);
export const build = gulp.series(clean, gulp.parallel(css, js), checkdomain, makepot, compress);

export default dev;