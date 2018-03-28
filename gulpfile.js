const gulp = require('gulp');
//Others
const browserSync = require('browser-sync').create();
//css
const autoprefixer = require('gulp-autoprefixer');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const minify = require('gulp-minify');
//Handlebar
const handlebars = require('gulp-compile-handlebars');
const rename =  require('gulp-rename');
const data = require('./data.json'); 		//Data to use in templates
const helper = require('./src/helpers/filename.js'); //Helper function to generate filename - no spaces


//Handlebars preprocessor
gulp.task('handlebars', function () {
	options = {
			templates: 'src/templates',
			//data: 'src/data'
			partials : 'src/partials',
			helpers : 'src/helpers'
	}

	return gulp.src(['src/templates/*.handlebars'])
		.pipe(handlebars(data, options))
		.pipe(rename({extname:".html"}))
		.pipe(gulp.dest('dist'))
        .pipe(browserSync.reload({
            stream:true
        }));
});


gulp.task('data-to-htmls', function() {
    options = {	
			partials : 'src/partials',
			helpers : 'src/helpers'
	}
    var items = data.list;
  	if(!items)return
    for(var i=0; i<items.length; i++) {
        var item = items[i],
            fileName = item.name.replace(/ +/g, '-').toLowerCase() || "";
        	gulp.src('src/templates/item.handlebars')
            .pipe(handlebars({item:item,site:data.site}, options))
            .pipe(rename(fileName + ".html"))
            .pipe(gulp.dest('dist'));
    }
});

//Sass preprocessor
gulp.task('sass', function () {
  return gulp.src('./sass/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
    .pipe(gulp.dest('dist/css'))
    .pipe(browserSync.reload({
            stream:true
        }));
});

//concat
gulp.task('scripts', function() {
  return gulp.src('./src/js/*.js')
    .pipe(concat('scripts.js'))
	.pipe(minify())
    .pipe(gulp.dest('./dist/js/'));
});

//Update browser
gulp.task('browser-sync', function(){
    browserSync.init(null,{
        open:false,
        server:{
            baseDir:'dist'
        },
        port:3333
    })
})

//Images rename
gulp.task('img-rename', function(){
	gulp.src('src/images/*')
	.pipe(rename((path)=>{
		path.basename = path.basename.replace(/ +/g, '-').toLowerCase();
		path.extname = ".jpg"
	}))
	.pipe(gulp.dest('dist/images/books'))
});


gulp.task('build',function(){
	gulp.start(['sass','handlebars','data-to-htmls','img-rename','scripts'])
})

//Start and watch
gulp.task('start',function(){
    gulp.start(['browser-sync']);
    gulp.watch(['./sass/*.scss'],['sass'])
    gulp.watch(['./src/**/*.handlebars'],['handlebars','data-to-htmls'])
    gulp.watch(['./src/images/*.*'],['img-rename'])
    gulp.watch(['./src/js/*.js'],['scripts'])
})