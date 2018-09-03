var gulp = require("gulp");
var mincss = require("gulp-clean-css");
var sass = require("gulp-sass");
var uglify = require("gulp-uglify");
var server = require("gulp-webserver");
var url = require("url");
var fs = require("fs");
var path = require("path");
//压缩css编译sass
gulp.task("devcss", function() {
    return gulp.src("./src/scss/*.scss")
        .pipe(sass())
        .pipe(mincss())
        .pipe(gulp.dest("./src/css"))
});
//压缩js
gulp.task("minjs", function() {
    return gulp.src("./src/js/*.js")
        .pipe(uglify())
        .pipe(gulp.dest("./dist"))
});
//起服务
gulp.task("server", function() {
        return gulp.src("src")
            .pipe(server({
                port: 9090,
                middleware: function(req, res, next) {
                    var pathname = url.parse(req.url).pathname;
                    if (pathname === "/favicon.ico") {
                        res.end("");
                        return;
                    }
                    pathname = pathname === "/" ? "/index.html" : pathname;
                    res.end(fs.readFileSync(path.join(__dirname, "src", pathname)));

                }
            }))
    })
    //监听css
gulp.task("watch", function() {
    return gulp.watch("./src/scss/*.scss", gulp.series("devcss"))
});
//合并
gulp.task("dev", gulp.series("devcss", "minjs", "server", "watch"))