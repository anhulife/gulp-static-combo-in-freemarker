/* global describe, it */

'use strict';

var assert = require('assert');
var fs = require('fs');
var gutil = require('gulp-util');
var path = require('path');
var combo = require('../index');

function getFile(filePath) {
	return new gutil.File({
		path: filePath,
		base: path.dirname(filePath),
		contents: fs.readFileSync(filePath)
	});
}

function getFixture(filePath) {
	return getFile(path.join('test', 'fixtures', filePath));
}

function getExpected(filePath) {
	return getFile(path.join('test', 'expected', filePath));
}

function compare(name, expectedName, done) {
	var stream = combo({
		asset: 'test/fixtures/static',
		dest: 'test/expected/static',
		macroName: ['combo', 'jsCombo', 'cssCombo'],
		macroArg: ['file', 'js', 'css'],
		urlPrefix: 'build/'
	});

	stream.on('data', function (newFile) {
		if (path.basename(newFile.path) === name) {
			assert.equal(String(getExpected(expectedName).contents), String(newFile.contents));
		}
	});
	stream.on('end', function () {
		done();
	});

	stream.write(getFixture(name));
	stream.end();
}

describe('gulp-static-combo-in-freemarker', function () {
	it('combo-js', function (done) {
		compare('combo-js.ftl', 'combo-js.ftl', done);
	});

	it('combo-css', function (done) {
		compare('combo-css.ftl', 'combo-css.ftl', done);
	});

	it('combo-js-css', function (done) {
		compare('combo-js-css.ftl', 'combo-js-css.ftl', done);
	});

	it('combo-single-file', function (done) {
		compare('combo-single-file.ftl', 'combo-single-file.ftl', done);
	});

	it('combo-multi-line-macro', function (done) {
		compare('combo-multi-line-macro.ftl', 'combo-multi-line-macro.ftl', done);
	});

	it('with-other-arg', function (done) {
		compare('with-other-arg.ftl', 'with-other-arg.ftl', done);
	});

	it('multi-macro', function (done) {
		compare('multi-macro.ftl', 'multi-macro.ftl', done);
	});

	it('combo-special-characters-named-file', function (done) {
		compare('combo-special-characters-named-file.ftl', 'combo-special-characters-named-file.ftl', done);
	});
});