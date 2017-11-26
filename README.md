# About 

Extended, but still simple and fast router for [connect] or other middleware with the same interface.

# Installation

You will need [node] version >= 0.10.0 and [npm] to install and use this module:

	npm install connect-route-ext

# Usage

```js
var connectRoute = require('connect-route-ext'),
	connect = require('connect'),
	app = connect();

app.use(connectRoute(function (router) {
	router.get('/', function (req, res, next) {
			  res.end('index');
		  })
		  .get('/home', function (req, res, next) {
			  res.end('home');
		  })
		  .get('/home/:id', function (req, res, next) {
			  res.end('home ' + req.params.id);
		  })
		  .get('/home/*path', function (req, res, next) {
			  res.end('home ' + req.params.path.join('/'));
		  })
		  .post('/home', function (req, res, next) {
			  res.end('POST to home');
		  });

	function authenticate(req, res, next) {
		if (authenticated(req)) {
			next();
		} else {
			fail(res);
		}
	}

	router.get('/secret', authenticate, function (req, res, next) {
		res.end('secret');
	});
}));

app.listen(3000);
```

## Backbround

This project started as a fork of [connect-route] and added functionality to support usage scenarios needed by a more complex server, which supports an SPA:

* Match the rest of the path by "*path" parameter
* Pass multiple chained handlers to a single route

## Contributing

In lieu of a formal styleguide, take care to maintain the existing coding style.

## Release History

 * 2017-11-26   v0.2.0   Initial release or the fork with a new name

## License

Copyright (c) 2017 Ferdinand Prantl

Licensed under the MIT license.

[node]: https://nodejs.org
[npm]: https://npmjs.org
[connect]: https://github.com/senchalabs/connect
[connect-route]: https://github.com/baryshev/connect-route
