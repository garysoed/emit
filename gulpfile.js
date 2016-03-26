var path= require('path');

var gn = require('./node_modules/gs-tools/gulp/gulp-node')(__dirname, require('gulp'));
var karmaTasks = require('./node_modules/gs-tools/gulp-tasks/karma')(
    require('karma').Server);
var sassTasks = require('./node_modules/gs-tools/gulp-tasks/sass')(
    require('gulp-concat'),
    require('gulp-sass'));
var packTasks = require('./node_modules/gs-tools/gulp-tasks/pack')(
    require('vinyl-named'),
    require('gulp-sourcemaps'),
    require('gulp-webpack'));
var tasks = require('./gulptasks');

gn.exec('compile-test', gn.series(
    '_compile',
    gn.parallel(
      'web/about:compile-test',
      'web/main:compile-test',
      'web/navigate:compile-test',
      'web/schedule:compile-test'
    )));

gn.exec('lint', gn.parallel(
  'web:lint',
  'web/about:lint',
  'web/main:lint',
  'web/navigate:lint',
  'web/schedule:lint'
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
        sassTasks.compile(gn, 'web/**'),
        function images_() {
          return gn.src(['images/**'])
              .pipe(gn.dest('out/images'));
        },
        function ng_() {
          return gn.src(['web/**/*.ng'])
              .pipe(gn.dest('out/web'));
        }),
    packTasks.app(gn, 'web/app.js', 'js.js')
));

gn.exec('deploy', gn.series(
    'compile-ui',
    function copyNg_() {
      return gn.src(
          [
            'out/**/*.ng',
            'out/js.js',
            'out/css.css',
            'out/images/**',
            'index.html'
          ],
          { base: '.' })
          .pipe(gn.dest('server/src/main/webapp'));
    }));


gn.exec('watch', gn.series(
    '.:compile-ui',
    function() {
      gn.watch(['web/**/*'], gn.series('.:compile-ui'));
    }));

gn.exec('watch-test', gn.series(
    '.:compile-test',
    function() {
      gn.watch(['web/**/*.ts'], gn.series('.:compile-test'));
    }));

gn.exec('default', gn.exec('compile-ui'));
