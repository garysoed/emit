var gulp = require('gulp');
var typescriptTasks = require('./node_modules/gs-tools/gulp-tasks/typescript')(
    require('gulp-tslint'),
    require('gulp-typescript'));
var karmaTasks = require('./node_modules/gs-tools/gulp-tasks/karma')(
    require('karma').Server);
var packTasks = require('./node_modules/gs-tools/gulp-tasks/pack')(
    require('vinyl-named'),
    require('gulp-sourcemaps'),
    require('gulp-webpack'));

var tasks = {};
tasks.allTasks = function(gt, dir) {
  var dir = 'web/' + dir;
  gt.task('_compile-test', packTasks.tests(gt, dir));

  gt.exec('compile-test', gt.series('_compile', '.:_compile-test'));

  var mockAngular = {
    pattern: 'mock-angular.js',
    included: true
  };
  gt.exec('test', gt.series(
      '_compile',
      '.:_compile-test',
      karmaTasks.once(gt, dir, [mockAngular])));
  gt.exec('karma', gt.series(
      '_compile',
      '.:_compile-test',
      karmaTasks.watch(gt, dir, [mockAngular])));
  gt.exec('watch-test', function() {
    gt.watch(['web/**/*.ts'], gt.series('_compile', '.:compile-test'));
  });

  this.prodTasks(gt, dir);
};

tasks.prodTasks = function(gt, dir) {
  var dir = 'web/' + dir;
  gt.exec('lint', typescriptTasks.lint(gt, dir));
};

gulp.task('_compile', typescriptTasks.compile(gulp));

module.exports = tasks;
