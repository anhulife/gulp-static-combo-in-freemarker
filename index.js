'use strict';

var path = require('path');
var fs = require('fs');
var crypto = require('crypto');
var gutil = require('gulp-util');
var through = require('through2');
var mkdirp = require('mkdirp');
var EOL = require('os').EOL;

module.exports = function (options) {
	var asset = options.asset || 'static';
	var assetAbsolute = path.resolve(asset);
	var dest = options.dest || 'dest';
	var destAbsolute = path.resolve(dest);
	var urlPrefix = options.urlPrefix || '';
	var macroName = options.macroName || ['combo'];
	var macroArg = options.macroArg || ['js', 'css'];
	var macroReg = new RegExp('<@(?:' + macroName.join('|') + ')[\\s\\S]*?>', 'gim');
	var macroArgReg = new RegExp('(' + macroArg.join('|') + ')\\s*=\\s*\\[(?:\\s*(?:[\'\"][\\w\\/\\.]+[\'\"])\\s*\\,?\\s*)+\\]', 'gim');
	var macroArgValueReg = new RegExp('[\'\"]([\\w\\/\\.]+?)[\'\"]', 'g');
	var contents;

	function sha1(content) {
		return crypto.createHash('md5')
			.update(content)
			.digest('hex').slice(-7);
	}

	function concat(files) {
		var buffer = [];
		var content;
		var name;
		var fullPath;

		files.forEach(function (file) {
			buffer.push(String(file.contents));
		});

		content = buffer.join(EOL);

		name = 'combo_' + sha1(content) + (/\.js$/.test(files[0].path) ? '.js' : '.css');

		fullPath = path.join(destAbsolute, name);

		if(!fs.existsSync(fullPath)){
			mkdirp.sync(destAbsolute);

			fs.writeFileSync(path.join(destAbsolute, name), content);
		}

		return name;
	}

	function getFiles(paths) {
		return paths.map(function (filePath) {
			filePath = path.join(assetAbsolute, filePath);

			return new gutil.File({
				path: filePath,
				contents: fs.readFileSync(filePath)
			});
		});
	}

	return through.obj(function (file, enc, callback) {
		if (file.isNull()) {
			this.push(file);
			return callback();
		}

		if (file.isStream()) {
			this.emit('error', new gutil.PluginError('gulp-static-combo-in-freemarker', 'Streams are not supported!'));
			return callback();
		}

		try{
			contents = file.contents.toString().replace(macroReg, function (macro) {
				return macro.replace(macroArgReg, function (macroArg, macroArgName) {
					var paths = macroArg.match(macroArgValueReg);

					if (paths.length > 0) {
						paths = paths.map(function (path) {
							return path.replace(/(\'|\")/g, '');
						});

						return macroArg + ' ' + macroArgName + 'Combo="' + urlPrefix + concat(getFiles(paths)) + '"';
					} else {
						return macroArg;
					}
				});
			});
		}catch(e){
			this.emit('error', new gutil.PluginError('gulp-static-combo-in-freemarker', 'Process ' + file.path + ' error!\n' + e.message));
			return callback();
		}

		file.contents = new Buffer(contents);

		this.push(file);
		return callback();
	});
};