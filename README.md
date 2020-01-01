[![NPM version](https://badge.fury.io/js/connect-route-ext.png)](http://badge.fury.io/js/connect-route-ext)
[![Build Status](https://travis-ci.org/prantlf/connect-route.svg?branch=combined)](https://travis-ci.org/prantlf/connect-route)
[![codecov](https://codecov.io/gh/prantlf/connect-route/branch/combined/graph/badge.svg)](https://codecov.io/gh/prantlf/connect-route)
[![dependencies Status](https://david-dm.org/prantlf/connect-route/status.svg)](https://david-dm.org/prantlf/connect-route)
[![devDependencies Status](https://david-dm.org/prantlf/connect-route/dev-status.svg)](https://david-dm.org/prantlf/connect-route?type=dev)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

[![NPM Downloads](https://nodei.co/npm/connect-route-ext.png?downloads=true&stars=true)](https://www.npmjs.com/package/connect-route-ext)

# About

Extended, but still simple and fast router for [connect] or other middleware with the same interface.

# Installation

You will need [node] version >= 6 and [npm] to install and use this module:

    npm install connect-route-ext

# Usage

```js
var connectRoute = require('connect-route-ext')
var connect = require('connect')
var app = connect()

app.use(connectRoute(function (router) {
  router.get('/', function (req, res, next) {
          res.end('index')
        })
        .get('/home', function (req, res, next) {
          res.end('home')
        })
        .get('/home/:id', function (req, res, next) {
          res.end('home ' + req.params.id)
        })
        .get('/home/*path', function (req, res, next) {
          res.end('home ' + req.params.path.join('/'))
        })
        .post('/home', function (req, res, next) {
          res.end('POST to home')
        })

  function authenticate(req, res, next) {
    if (authenticated(req)) {
      next()
    } else {
      fail(res)
    }
  }

  router.get('/secret', authenticate, function (req, res, next) {
    res.end('secret')
  })
}))

app.listen(3000)
```

## Background

This project started as a fork of [connect-route] and added functionality to support usage scenarios needed by a more complex server, which supports an SPA:

* Match the rest of the path by "*path" parameter
* Pass multiple chained handlers to a single route

## Contributing

In lieu of a formal style guide, take care to maintain the existing coding style.

## Release History

* 2018-04-27   v1.0.0   Dropped support of Node.js 4
* 2017-11-26   v0.2.0   Initial release or the fork with a new name
                        and additional features

## License

Copyright (c) 2017-2019 Ferdinand Prantl
Copyright (c) 2012 Vadim M. Baryshev

Licensed under the MIT license.

[node]: https://nodejs.org
[npm]: https://npmjs.org
[connect]: https://github.com/senchalabs/connect
[connect-route]: https://github.com/baryshev/connect-route
