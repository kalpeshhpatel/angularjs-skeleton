/**
 * Created by kalpesh on 07/03/16.
 */

'use strict';

var gulp = require('gulp');
var usemin = require('gulp-usemin');
var uglify = require('gulp-uglify');
var minifyCss = require('gulp-minify-css');
var runSequence = require('run-sequence');
var Promise = require('es6-promise').Promise;



//define base directory structure
var bases = {
    tmp : 'tmp',
    app: './',
    dist: './'
};



//process index.html file
//Combine all script tag to single one and merge it
//Combine all CSS tag to single file and merge it
gulp.task('indexHtml',function() {
    return gulp.src(bases.app + 'index.html')
        .pipe(usemin({
            css: [minifyCss({processImport: false}), 'concat'],
            js: [uglify({mangle:false })]
        }))
        .pipe(gulp.dest(bases.dist));

});


// Define the default task as a sequence of the above tasks
gulp.task('default', function(callback) {
    runSequence('indexHtml',callback);
});

