const gulp = require('gulp')
const handler = require('serve-handler')
const http = require('http')
const browserSync = require('browser-sync')
const sass = require('gulp-sass')
sass.compiler = require('node-sass')

gulp.task('serve', () => {
    const server = http.createServer((request, response) => {
        return handler(request, response, {
            public: 'dist'
        })
    })
    server.listen(4000)
    const bs = browserSync({
        proxy: 'localhost:4000',
        browser: ['google chrome', 'chromium']
    })
    const handleStop = () => {
        bs.cleanup()
        server.close()
    }
    process.on('SIGTERM', handleStop)
    process.on('SIGINT', handleStop)
})

gulp.task('watch', () => {
    gulp.watch('./src/**/*').on('change', gulp.parallel('scss', 'src'))
})

gulp.task('scss', () => {
    gulp.src('./src/**/*.scss').pipe(sass()).pipe(gulp.dest('./dist')).pipe(browserSync.stream())
})

gulp.task('src', () => {
    gulp.src(['./src/**/*','!./src/**/*.scss']).pipe(gulp.dest('./dist')).pipe(browserSync.stream())
})

gulp.task('dev', gulp.parallel('serve', 'watch', 'scss', 'src'))