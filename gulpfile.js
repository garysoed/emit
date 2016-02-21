var path= require('path');

var gn = require('./node_modules/gs-tools/gulp/gulp-node')(__dirname, require('gulp'));
var karmaTasks = require('./node_modules/gs-tools/gulp-tasks/karma')(
    require('karma').Server);
var mythTasks = require('./node_modules/gs-tools/gulp-tasks/myth')(
    require('gulp-concat'),
    require('gulp-myth'));
var packTasks = require('./node_modules/gs-tools/gulp-tasks/pack')(
    require('vinyl-named'),
    require('gulp-sourcemaps'),
    require('gulp-webpack'));
var tasks = require('./gulptasks');

gn.exec('compile-test', gn.series(
    '_compile',
    gn.parallel(
      'web/main:compile-test',
      'web/navigate:compile-test'
    )));

gn.exec('lint', gn.parallel(
  'web:lint',
  'web/main:lint'
));

// TODO(gs): Refactor this.
var mockAngular = {
  pattern: 'mock-angular.js',
  included: true
};
gn.exec('test', gn.series('.:compile-test', karmaTasks.once(gn, '**', [mockAngular])));
gn.exec('karma', gn.series('.:compile-test', karmaTasks.watch(gn, '**', [mockAngular])));
gn.exec('compile', gn.series('_compile'));

gn.exec('compile-ui', gn.series(
    gn.parallel(
        '_compile',
        mythTasks.compile(gn, 'web/**'),
        function ng_() {
          return gn.src(['web/**/*.ng'])
              .pipe(gn.dest('out/web'));
        }),
    packTasks.app(gn, 'web/app.js', 'js.js')
));


gn.exec('watch', function() {
  gn.watch(['web/**/*'], gn.series('.:compile-ui'));
});

gn.exec('watch-test', function() {
  gn.watch(['web/**/*.ts'], gn.series('.:compile-test'));
});

gn.exec('default', gn.exec('compile-ui'));
