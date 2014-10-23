gulp-static-combo-in-freemarker
=============

> A gulp plugin for combo static file in freemarker

## Install

```
npm install --save-dev gulp-static-combo-in-freemarker
```

## Examples
```js
var gulp = require('gulp');
var combo = require('gulp-static-combo-in-freemarker');

gulp.task('combo-in-freemarker', function () {
	gulp.src('template/**/*.ftl')
		.pipe(combo({
			asset: 'static', 
			dest: 'static/build', 
			macroName: ['combo', 'jsCombo', 'cssCombo'], 
			macroArg: ['file', 'js', 'css'], 
			urlPrefix: 'build/'
		}))
		.pipe(gulp.dest('template'));
});
```

#### Input:

```html
<@combo js=['a.js', 'b.js'] css=['a.css', 'b.css']/>
<@jsCombo file=['a.js', 'b.js']/>
<@cssCombo file=['a.css', 'b.css']/>
```

#### Output:

```html
<@combo js=['a.js', 'b.js'] jsCombo="build/2a4050d061337a61fb899b1a3bbad894.js" css=['a.css', 'b.css'] cssCombo="build/f9f11605af34d7fa2873cfa83066f5f6.css"/>
<@jsCombo file=['a.js', 'b.js'] fileCombo="build/2a4050d061337a61fb899b1a3bbad894.js"/>
<@cssCombo file=['a.css', 'b.css'] fileCombo="build/f9f11605af34d7fa2873cfa83066f5f6.css"/>
```

### Options

##### asset: 'static'

##### dest: 'dest'

##### macroName: ['combo']

##### macroArg: ['js', 'css']

##### urlPrefix: ''