# JavaScript Cookie Calibre [![Build Status](https://travis-ci.org/pboling/js-cookie-calibre.svg?branch=master)](https://travis-ci.org/pboling/js-cookie-calibre) [![Code Climate](https://codeclimate.com/github/pboling/js-cookie-calibre.svg)](https://codeclimate.com/github/pboling/js-cookie-calibre)

A simple, lightweight JavaScript API for handling cookies namespaced with `calibre_*`

* Works in [all](https://saucelabs.com/u/pboling) browsers (TODO: Finish configuring Sauce)
* Accepts any character
* [Heavily](test) tested
* Only dependency is js.cookie, which has no dependencies.
* [Unobtrusive](#json) JSON support
* Supports AMD/CommonJS
* [RFC 6265](http://www.rfc-editor.org/rfc/rfc6265.txt) compliant
* Enable [custom decoding](#converter)
* **~500 bytes** gzipped!

**If you're viewing this at https://github.com/pboling/js-cookie-calibre, you're reading the documentation for the master branch.
[View documentation for the latest release (1.0.0).](https://github.com/pboling/js-cookie-calibre/tree/v1.0.0#readme)**

## Build Status Matrix

[![Selenium Test Status](https://saucelabs.com/browser-matrix/js-cookie-calibre.svg)](https://saucelabs.com/u/pboling)

## Installation

Include the script (unless you are packaging scripts somehow else):

```html
<script src="/path/to/js.cookie.calibre.js"></script>
```

**Do not include the script directly from GitHub (http://raw.github.com/...).** The file is being served as text/plain and as such being blocked
in Internet Explorer on Windows 7 for instance (because of the wrong MIME type). Bottom line: GitHub is not a CDN.

js-cookie supports [npm](https://www.npmjs.com/package/js-cookie-calibre) and [Bower](http://bower.io/search/?q=js-cookie-calibre) under the name `js-cookie-calibre`

It can also be loaded as an AMD or CommonJS module.

## Basic Usage

Create a Calibre cookie, valid across the entire site:

```javascript
Calibre.set('name', 'value');
```

Create a Calibre cookie that expires 7 days from now, valid across the entire site:

```javascript
Calibre.set('name', 'value', { expires: 7 });
```

Create an expiring Calibre cookie, valid to the path of the current page:

```javascript
Calibre.set('name', 'value', { expires: 7, path: '' });
```

Read Calibre cookie:

```javascript
Calibre.get('name'); // => 'value'
Calibre.get('nothing'); // => undefined
```

Read all visible Calibre cookies (and *only* Calibre cookies).
The following example shows how Cookies (from js.cookie) and Calibre can be used together:

```javascript
Cookies.set("smell","good");
Calibre.set("smell","bad"); // actually sets "calibre_smell", so does not collide with Cookies' smell key
Calibre.get(); // => { smell: 'bad' }
Calibre.get("smell"); // => 'bad'
Cookies.get(); // => { smell: 'good', calibre_smell: 'bad' }
Cookies.get("smell"); // => 'good'
Cookies.get("calibre_smell"); // => 'bad'
```

Delete Calibre cookie:

```javascript
Calibre.remove('name');
```

Delete a Calibre cookie valid to the path of the current page:

```javascript
Calibre.set('name', 'value', { path: '' });
Calibre.remove('name'); // fail!
Calibre.remove('name', { path: '' }); // removed!
```

Delete all Calibre cookies (will not affect non-Calibre cookies!:

```javascript
Calibre.remove();
```

*IMPORTANT! when deleting a cookie, you must pass the exact same path, domain and secure attributes that were used to set the cookie, unless you're relying on the [default attributes](#cookie-attributes).*

## Namespace conflicts

If there is any danger of a conflict with the namespace `Calibre`, the `noConflict` method will allow you to define a new namespace and preserve the original one. This is especially useful when running the script on third party sites e.g. as part of a widget or SDK.

```javascript
// Assign the js-cookie api to a different variable and restore the original "window.Calibre"
var Calibre2 = Calibre.noConflict();
Calibre2.set('name', 'value');
```

*Note: The `.noConflict` method is not necessary when using AMD or CommonJS, thus it is not exposed in those environments.*

## JSON

js-cookie-calibre provides unobstrusive JSON storage for cookies.

When creating a cookie you can pass an Array or Object Literal instead of a string in the value. If you do so, js-cookie will store the string representation of the object according to `JSON.stringify`:

```javascript
Calibre.set('name', { foo: 'bar' });
```

When reading a cookie with the default `Calibre.get` api, you receive the string representation stored in the cookie:

```javascript
Calibre.get('name'); // => '{"foo":"bar"}'
```

```javascript
Calibre.get(); // => { name: '{"foo":"bar"}' }
```

When reading a cookie with the `Calibre.getJSON` api, you receive the parsed representation of the string stored in the cookie according to `JSON.parse`:

```javascript
Calibre.getJSON('name'); // => { foo: 'bar' }
```

```javascript
Calibre.getJSON(); // => { name: { foo: 'bar' } }
```

*Note: To support IE6-8 you need to include the JSON-js polyfill: https://github.com/douglascrockford/JSON-js*

## Encoding

This project is [RFC 6265](http://tools.ietf.org/html/rfc6265#section-4.1.1) compliant. All special characters that are not allowed in the cookie-name or cookie-value are encoded with each one's UTF-8 Hex equivalent using [percent-encoding](http://en.wikipedia.org/wiki/Percent-encoding).  
The only character in cookie-name or cookie-value that is allowed and still encoded is the percent `%` character, it is escaped in order to interpret percent input as literal.  
To override the default cookie decoding you need to use a [converter](#converter).

## Cookie Attributes

Cookie attributes defaults can be set globally by setting properties of the `Calibre.defaults` object or individually for each call to `Calibre.set(...)` by passing a plain object in the last argument. Per-call attributes override the default attributes.

### expires

Define when the cookie will be removed. Value can be a [`Number`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number) which will be interpreted as days from time of creation or a [`Date`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) instance. If omitted, the cookie becomes a session cookie.

**Default:** Cookie is removed when the user closes the browser.

**Examples:**

```javascript
Calibre.set('name', 'value', { expires: 365 });
Calibre.get('name'); // => 'value'
Calibre.remove('name');
```

### path

A [`String`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) indicating the path where the cookie is visible.

**Default:** `/`

**Examples:**

```javascript
Calibre.set('name', 'value', { path: '' });
Calibre.get('name'); // => 'value'
Calibre.remove('name', { path: '' });
```

**Note regarding Internet Explorer:**

> Due to an obscure bug in the underlying WinINET InternetGetCookie implementation, IE’s document.cookie will not return a cookie if it was set with a path attribute containing a filename.

(From [Internet Explorer Cookie Internals (FAQ)](http://blogs.msdn.com/b/ieinternals/archive/2009/08/20/wininet-ie-cookie-internals-faq.aspx))

This means one cannot set a path using `path: window.location.pathname` in case such pathname contains a filename like so: `/check.html` (or at least, such cookie cannot be read correctly).

### domain

A [`String`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) indicating a valid domain where the cookie is visible.

**Default:** Domain of the page where the cookie was created.

**Examples:**

```javascript
Calibre.set('name', 'value', { domain: 'sub.domain.com' });
Calibre.get('name'); // => undefined (need to read at 'sub.domain.com')
```

### secure

Either `true` or `false`, indicating if the cookie transmission requires a secure protocol (https).

**Default:** No secure protocol requirement.

**Examples:**

```javascript
Calibre.set('name', 'value', { secure: true });
Calibre.get('name'); // => 'value'
Calibre.remove('name', { secure: true });
```

## Converter

Create a new instance of the api that overrides the default decoding implementation.  
All methods that rely in a proper decoding to work, such as `Calibre.remove()` and `Calibre.get()`, will run the converter first for each cookie.  
The returning String will be used as the cookie value.

Example from reading one of the cookies that can only be decoded using the `escape` function:

```javascript
document.cookie = 'calibre_escaped=%u5317';
document.cookie = 'calibre_default=%E5%8C%97';
var cookies = Calibre.withConverter(function (value, name) {
    if ( name === 'escaped' ) {
        return unescape(value);
    }
});
cookies.get('escaped'); // 北
cookies.get('default'); // 北
cookies.get(); // { escaped: '北', default: '北' }
```

Example for parsing the value from a cookie generated with PHP's `setcookie()` method:

```javascript
// 'cookie+with+space' => 'cookie with space'
Calibre.withConverter(function (value) {
    return value.replace(/\+/g, ' ');
}).get('foo');
```

## Contributing

Check out the [Contributing Guidelines](CONTRIBUTING.md)

## Manual release steps

* Increment the "version" attribute of `package.json`
* Increment the version number in the `src/js.cookie.calibre.js` file
* Commit with the message "Release version x.x.x"
* Create version tag in git
* Create a github release and upload the minified file
* Link the documentation of the latest release tag in the `README.md`
* Commit with the message "Prepare for the next development iteration"
* Release on npm

## Authors

* [Peter Boling](https://github.com/pboling)
* Contributors [contributors](https://github.com/pboling/js-cookie-calibre/graphs/contributors)
