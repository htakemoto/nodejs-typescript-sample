var fs = require('fs'),
    ini = require('ini');

module.exports = function(grunt) {

    require('load-grunt-tasks')(grunt);

    var code = null;
    var envConfig = null;
    try {
        code = fs.readFileSync('envconfig.js', 'utf-8');
        eval(code); // jshint ignore:line
    } catch(e) {
    }

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        project: {
            src: 'src',
            dist: 'dist'
        },
        env: envConfig || {},

        // browserify: {
        //     dist: {
        //         options: {
        //             plugin: ['tsify'],
        //             browserifyOptions : {debug: true}
        //         },
        //         files: {
        //             '<%= project.dist %>/server.js' : [ '<%= project.src %>/**/*.ts' ]
        //         }
        //     }
        // },

        ts: {
            build: {
                src: ["<%= project.src %>/**/*.ts", "!node_modules/**/*.ts"],
                outDir: "<%= project.dist %>",
                options: {
                    target: 'es5',
                    module: 'commonjs',
                    sourceMap: false,
                    declaration: true,
                    removeComments: true,
                    fast: 'never' // You'll need to recompile all the files each time for NodeJS
                }
            }
        },

        // typescript: {
        //     base: {
        //         src: ["<%= project.src %>/server.ts", "!node_modules"],
        //         dest: "<%= project.dist %>",
        //         options: {
        //             module: 'commonjs',
        //             target: 'es5',
        //             sourceMap: false,
        //             declaration: true,
        //             removeComments: true
        //         }
        //     }
        // },

        nodemon: {
            dev: {
                script: '<%= project.dist %>/server.js'
            },
            options: {
                ignore: ['node_modules/**', 'Gruntfile.js', '<%= project.src %>/**'],
                env: {
                    // PORT: '8181'
                }
            }
        },

        // tsd: {
        //     refresh: {
        //         options: {
        //             command: 'reinstall',
        //             latest: true,
        //             config: 'tsd.json'
        //         }
        //     }
        // },

        watch: {
            scripts: {
                files: ['<%= project.src %>/**/*.ts', '!node_modules/**/*.ts'],
                tasks: ['build'],
                options: {
                    spawn: false // makes the watch task faster
                }
            }
        },

        concurrent: {
            watchers: {
                tasks: ['nodemon', 'watch'],
                options: {
                    logConcurrentOutput: true
                }
            }
        }
    });

    // grunt.event.on('watch', function(action, filepath) {
    //     grunt.config('jshint.all.src', filepath);
    // });

    grunt.registerTask('envconfig', function() {
        var package = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));
        var valuerConfig = {
            version: package.version
        };
        var txt = JSON.stringify(valuerConfig, null, '    ');
        fs.writeFileSync('config.json', txt);
    });

    grunt.registerTask('build', ['ts:build']);
    grunt.registerTask('test', []);
    grunt.registerTask('serve', ['build', 'nodemon', 'concurrent:watchers']);
};
