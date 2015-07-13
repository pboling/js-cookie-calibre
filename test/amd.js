require(['qunit'], function (QUnit) {
	QUnit.module('amd');

	QUnit.start();
	QUnit.test('module loading', function (assert) {
		QUnit.expect(1);
		var done = assert.async();
		require(['/src/js.cookie.calibre.js'], function (Calibre) {
			assert.ok(!!Calibre.get, 'should load the Calibre api');
			done();
		});
	});

});
