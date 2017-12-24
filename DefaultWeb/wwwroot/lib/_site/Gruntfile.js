'use strict';
module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        banner: '/*!\n' +
        ' * <%= pkg.name %> v<%= pkg.version %>\n' +
        ' * Homepage: <%= pkg.homepage %>\n' +
        ' * Copyright 2012-<%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
        ' * Licensed under <%= pkg.license %>\n' +
        ' * Based on...\n' +
        '*/\n',
        swatch: {
            cerulean: {}, cosmo: {}, cyborg: {}, darkly: {},
            flatly: {}, journal: {}, litera: {}, lumen: {}, lux: {}, materia: {}, minty: {},
            pulse: {}, sandstone: {}, simplex: {}, slate: {}, solar: {}, spacelab: {},
            superhero: {}, united: {}, yeti: {}
        },
        clean: {
            options: {
                force: true
            },
            bootswatch: {
                src: ['../bootswatch/*/build.scss', '!../bootswatch/global/build.scss']
            },
            distcss: {
                src: ['dist/css/*.*']
            },
            distjs: {
                src: ['dist/js/*.*']
            },
            theme: {
                src: ''
            },
            wwwrootall: {
                src:['../../css/**', '../../js/**','../../fonts/**', '../../images/**']
            },
            wwwrootall: {
                src: ['../../css/**', '../../js/**']
            }
        },
        concat: {
            options: {
                banner: '<%= banner %>',
                stripBanners: false,

            },
            jcore: {
                src: ['<%= pkg.corejs %>'],
                dest: 'dist/js/jcore.js',
                nonull: true
            },
            site: {
                src: ['<%= pkg.sitejs %>'],
                dest: 'dist/js/site.js',
                nonull: true
            }
        },
        eslint: {
            src: ['dist/js/site.js']
        },
        sass: {
            dist: {
                options: {
                    sourceMap: false
                },
                src: [],
                dest: ''
            }
        },
        postcss: {
            options: {
                map: false, // inline sourcemaps
                processors: [
                    require('postcss')(), // add fallbacks for rem units

                ]
            },
            dist: {
                src: ''
            }
        },
        cssmin: {
            options: {
                // TODO: disable `zeroUnits` optimization once clean-css 3.2 is released
                //    and then simplify the fix for https://github.com/twbs/bootstrap/issues/14837 accordingly
                compatibility: 'ie10',
                keepSpecialComments: '*',
                sourceMap: true,
                advanced: false
            },
            wwwroot: {
                src: 'dist/css/*.*',
                dest: '../../css/defaultwebsite.min.css'
            },
            videojs: {
                src: 'dist/css/*.*',
                dest: '../../css/defaultwebsite.min.css'
            }
        },
        copy: {
            pdfworker: {
                expand: true,
                cwd: 'dist/js/',
                src: 'pdf.worker.js',
                dest: '../../js/',
                filter: 'isFile'
            },
            fonts: {
                expand: true,
                cwd: 'fonts/',
                src: '*.*',
                dest: '../../fonts/',
                filter: 'isFile'
            },
            images: {
                expand: true,
                cwd: 'images/',
                src: '*.*',
                dest: '../../images/',
                filter: 'isFile'
            },
            pdfjs: {
                expand: true,
                cwd: 'js/pdfjs/',
                src: '**',
                dest: 'dist/js/',
                filter: 'isFile'
            },
            videojs: {
                expand: true,
                cwd: '../video-js/dist/',
                src:'video.js',
                dest: 'dist/js/',
                filter: 'isFile'
            }
        },
        uglify: {
            wwwroot: {
                options: {
                    compress: {
                        warnings: false
                    },
                    mangle: true,
                    preserveComments: 'some',
                    sourceMap: '../../js/defaultwebsite.min.js.map',

                },
                files: {
                    '../../js/defaultwebsite.min.js': ['<%= pkg.deployjs %>']
                }
            }

        },
        exec: {
            //postcss: {
            //    command: 'npm run postcss'
            //}
        }
    });

    require('load-grunt-tasks')(grunt, { scope: 'devDependencies' });
    require('time-grunt')(grunt);

    // Register tasks
    grunt.registerTask('none', function () { });
    grunt.registerTask('default', '');


    //////////////////////////////////////////////////////////
    //// main build, must have dist built
    //////////////////////////////////////////////////////////
    grunt.registerTask('build', function () {
        grunt.task.run('clean:wwwroot');
        grunt.task.run('cssmin:wwwroot');
        grunt.task.run('uglify:wwwroot');
        //grunt.task.run('uglify:videojs');
    });

    //////////////////////////////////////////////////////////
    //// main dist, builds default theme and js
    //////////////////////////////////////////////////////////
    grunt.registerTask('build-all', function () {
        grunt.task.run('clean:wwwrootall');

        grunt.task.run('cssmin:wwwroot');
        grunt.task.run('uglify:wwwroot');

        grunt.task.run('copy:pdfworker');

        // fonts and images
        grunt.task.run('copy:fonts');
        grunt.task.run('copy:images');
    });

    //////////////////////////////////////////////////////////
    //// main dist, builds default theme and js
    //////////////////////////////////////////////////////////
    grunt.registerTask('dist', function () {
        grunt.task.run('theme');
        grunt.task.run('js');

    });

    //////////////////////////////////////////////////////////
    //// builds ALL themes and js, long running
    //////////////////////////////////////////////////////////
    grunt.registerTask('dist-all', function () {
        grunt.task.run('themes');
        grunt.task.run('js');
        grunt.task.run('dist-videojs-css');
    });

    //////////////////////////////////////////////////////////
    //// deal with the javascript, don't use VS bundle-minify'
    //////////////////////////////////////////////////////////
    grunt.registerTask('js', function () {
        grunt.task.run('clean:distjs');
        grunt.task.run('concat:jcore');
        grunt.task.run('concat:site');
        grunt.task.run('eslint');
        grunt.task.run('copy:pdfjs');
        grunt.task.run('copy:videojs');
        
    });

    //////////////////////////////////////////////////////////
    //// deal with the videojs css seperately, don't build with site!
    //////////////////////////////////////////////////////////
    grunt.registerTask('dist-videojs-css', function () {
        var scssSrc = '../video-js/src/css/video-js.scss';
        var scssDest = 'dist/css/video-js.css';
        grunt.config('sass.dist', { src: scssSrc, dest: scssDest });
        grunt.config('sass.dist.options.precision', 10);
        grunt.config('sass.dist.options.unix-newlines', true);
        grunt.task.run('sass');

        grunt.config('postcss.dist.src', scssDest);
        grunt.task.run('postcss');
    });

    //////////////////////////////////////////////////////////
    /// Builds default bootstrap and cerulean themes
    /////////////////////////////////////////////////////////
    grunt.registerTask('theme', 'Build default and cerulean theme', function () {
        grunt.task.run('buildtheme:default');
        //grunt.task.run('buildtheme:cerulean');
    });

    //////////////////////////////////////////////////////////////////////////////////////////
    //// Builds project scss dist, with all themes - Long running, only build manually
    /////////////////////////////////////////////////////////////////////////////////////////
    grunt.registerTask('themes', 'Builds complete project dist, with all themes', function () {
        //grunt.task.run('clean');
        grunt.task.run('buildtheme:default');
        grunt.task.run('swatch');
        //grunt.task.run('copy:css')
    });

    grunt.registerMultiTask('swatch', 'build all themes', function () {
        var t = this.target;
        grunt.task.run('buildtheme:' + t);
    });

    grunt.registerTask('clean-theme', function () {
        grunt.config('clean.theme.src', 'dist/css/default.*');
        grunt.task.run('clean:theme');
    });

    ////////////////////////////////////////////////////////////////////////////////////////
    // Main build process for each theme.
    ///////////////////////////////////////////////////////////////////////////////////////
    grunt.registerTask('buildtheme', 'build a regular theme from scss', function (theme) {
        var theme = theme == undefined ? grunt.config('buildtheme') : theme;
        //var compress = compress == undefined ? true : compress;
        var themedir = '../bootswatch/' + theme;
        console.log(themedir);

        var isValidTheme = grunt.file.exists(themedir, '_variables.scss') && grunt.file.exists(themedir, '_bootswatch.scss') || theme == 'default';
          
        console.log('Is valid theme:' + theme + ' - ' + isValidTheme);
        // cancel the build (without failing) if this directory is not a valid theme
        if (!isValidTheme) {
            return;
        }
        var concatSrc;
        var concatDest;
        var scssDest;
        var scssSrc;
        var files = {};
        var dist = {};

        concatSrc = 'sass/global/build.scss';
        concatDest = themedir + '/build.scss';

        if (theme == 'default') 
            scssSrc = 'sass/defaultwebsite.scss';
        else
            scssSrc = concatDest;

        scssDest = 'dist/css/' + theme + '.css';
          
        console.log(scssSrc + '\n' + scssDest);

        // clean this theme
        grunt.config('clean.theme.src', 'dist/css/' + theme + '.*');
        grunt.task.run('clean:theme')

        if (theme != 'default') {
            //dist = { src: concatSrc, dest: concatDest };
            grunt.config('concat.dist', { src: concatSrc, dest: concatDest });
            grunt.task.run('concat');
        }

        //dist = { src: scssSrc, dest: scssDest };
        grunt.config('sass.dist', { src: scssSrc, dest: scssDest });
        grunt.config('sass.dist.options.precision', 10);
        grunt.config('sass.dist.options.unix-newlines', true);
        grunt.task.run('sass');

        grunt.config('postcss.dist.src', scssDest);
        grunt.task.run('postcss');

        //grunt.config('cssmin.dist', {
        //    src: 'dist/css/' + theme + '.css',
        //    dest: '../../css/' + theme + '.min.css'
        //});
        //grunt.task.run('cssmin');

        //grunt.task.run(['sass:dist', 'prefix:' + scssDest, 'clean:build',
        //    compress ? 'compress_scss:' + scssDest + ':' + '<%=builddir%>/' + theme + '/' + theme + '.css' : 'none']);
    });
};
