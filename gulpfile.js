var es = require('event-stream');
var gulp = require('gulp');
var concat = require('gulp-concat');
var connect = require('gulp-connect');
var templateCache = require('gulp-angular-templatecache');
var ngAnnotate = require('gulp-ng-annotate');
var uglify = require('gulp-uglify');


var scripts = require('./app.scripts.json');

var source = {
    js: {
        main: 'app/main.js',
        src: [
            // application config
            'app.config.js',

            // application bootstrap file
            'app/main.js',

            // main module
            'app/app.js',

            // module files

            'app/**/module.js',

            // other js files [controllers, services, etc.]
            'app/**/!(module)*.js',
        ],
        tpl: 'app/**/*.tpl.html'
    }
};

var custom_source = {
    js: {
        src: [

            // module files

            'custom/**/module.js',

            // other js files [controllers, services, etc.]
            'custom/**/!(module)*.js',
        ],
        tpl: 'custom/**/*.html'
    }
};

var destinations = {
    js: 'build'
};


gulp.task('build', function(){
    return es.merge(gulp.src(source.js.src) , getTemplateStream())
        // .pipe(ngAnnotate())
        // .pipe(uglify())
        .pipe(concat('app.js'))
        .pipe(gulp.dest(destinations.js));
});

gulp.task('custom', function () {
    return es.merge(gulp.src(custom_source.js.src), getCustomTemplateStream())
        .pipe(concat('custom.js'))
        .pipe(gulp.dest(destinations.js));
});

gulp.task('vendor', function(){
    var paths = [];
    scripts.prebuild.forEach(function(script){
        paths.push(scripts.paths[script]);
    });
    gulp.src(paths)
        .pipe(concat('vendor.js'))
        //.on('error', swallowError)
        .pipe(gulp.dest(destinations.js))
});

gulp.task('watch', function(){
    gulp.watch(source.js.src, ['build']);
    gulp.watch(source.js.tpl, ['build']);
    gulp.watch(custom_source.js.src, ['custom']);
});


gulp.task('connect', function() {
    connect.server({
        port: 8888
    });
});

gulp.task('default', ['vendor', 'build', 'custom', 'watch', 'connect']);

var swallowError = function(error){
    console.log(error.toString());
    this.emit('end')
};

var getTemplateStream = function () {
    return gulp.src(source.js.tpl)
        .pipe(templateCache({
            root: 'app/',
            module: 'app'
        }))
};

var getCustomTemplateStream = function () {
    return gulp.src(custom_source.js.tpl)
        .pipe(templateCache({
            root: 'custom/',
            module: 'app.custom'
        }))
};