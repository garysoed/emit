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
    )));

gn.exec('lint', gn.parallel(
));
gn.exec('test', gn.series('.:compile-test', karmaTasks.once(gn, '**')));
gn.exec('karma', gn.series('.:compile-test', karmaTasks.watch(gn, '**')));
gn.exec('compile', gn.series('_compile'));

gn.exec('compile-ui', gn.series(
    gn.parallel(
        '_compile',
        mythTasks.compile(gn, '**'),
        function ng_() {
          return gn.src(['src/**/*.ng'])
              .pipe(gn.dest('out/src'));
        }),
    packTasks.app(gn, 'app.js')
));


gn.exec('watch', function() {
  gn.watch(['src/**/*'], gn.series('.:compile-ui'));
});

gn.exec('watch-test', function() {
  gn.watch(['src/**/*.ts'], gn.series('.:compile-test'));
});

gn.exec('default', gn.exec('compile-ui'));
