/*jshint node:true */
exports.commonjs = {
	should_load_js_cookie_calibre: function (test) {
		test.expect(1);
		var Calibre = require('../src/js.cookie.calibre');
		test.ok(!!Calibre.get, 'should load the Calibre API');
		test.done();
	}
};
