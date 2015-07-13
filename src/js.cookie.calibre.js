/*!
 * JavaScript Cookie v1.0.0
 * https://github.com/pboling/js-cookie-calibre
 *
 * Copyright 2015 Peter Boling
 * Released under the MIT license
 */

(function (factory) {
	if (typeof define === 'function' && define.amd) {
		define(factory);
	} else if (typeof exports === 'object') {
		module.exports = factory();
	} else {
		var _OldCalibre = window.Calibre;
		var api = window.Calibre = factory(window.jQuery);
		api.noConflict = function () {
			window.Calibre = _OldCalibre;
			return api;
		};
	}
}(function () {
	// extend function is copied from js.cookie.js, also MIT License
	// https://github.com/js-cookie/js-cookie/blob/v2.0.2/src/js.cookie.js#L22
	function extend () {
		var i = 0;
		var result = {};
		for (; i < arguments.length; i++) {
			var attributes = arguments[ i ];
			for (var key in attributes) {
				result[key] = attributes[key];
			}
		}
		return result;
	}

	function init (converter) {
		// represent the cookies from js.cookie with a converter if one was supplied
		var cookies = function () {
			return window.Cookies.withConverter(converter);
		};

		// Copy and Enhance Cookies API for Calibre
		function api (key, value, attributes) {
			if (arguments.length === 0) {
				var result = {};
				var cookiesInstance = cookies();
				Object.keys(cookiesInstance.get()).forEach(function (cookieKey) {
					if (cookieKey.search('calibre_') === 0) {
						result[cookieKey.replace('calibre_', '')] = cookiesInstance.get(cookieKey);
					}
				});
				return result;
			} else if (arguments.length > 1) {
				attributes = extend({
					path: '/'
				}, api.defaults, attributes);
				return cookies().set('calibre_'+key, value, attributes);
			} else {
				return cookies().get('calibre_'+key);
			}
		}

		// getJSON API is different from js.cookie in that with no arguments it will only return calibre relevant cookies
		api.getJSON = function (key) {
			if (arguments.length === 0) {
				var result = {};
				var cookiesInstance = cookies();
				Object.keys(cookiesInstance.get()).forEach(function (cookieKey) {
					if (cookieKey.search('calibre_') === 0) {
						result[cookieKey.replace('calibre_', '')] = cookiesInstance.getJSON(cookieKey);
					}
				});
				return result;
			} else {
				return cookies().getJSON('calibre_'+key);
			}
		};
		// remove API is different from js.cookie in that with no arguments it will actually remove cookies
		// (though, only calibre relevant ones)
		api.remove = function (key, attributes) {
			if (arguments.length === 0) {
				var cookiesInstance = cookies();
				Object.keys(cookiesInstance.get()).forEach(function (cookieKey) {
					if (cookieKey.search('calibre_') === 0) {
						cookiesInstance.remove(cookieKey, attributes);
					}
				});
			} else {
				cookies().remove('calibre_'+key, attributes);
			}
		};
		// get API is different from js.cookie in that with no arguments it will only return calibre relevant cookies
		api.get = api.set = api;
		api.defaults = {};
		api.withConverter = init;
		return api;
	}

	return init();
}));
