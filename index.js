'use strict'

var methods = [
  'get', 'post', 'put', 'head', 'patch', 'delete', 'connect', 'options',
  'trace', 'copy', 'lock', 'mkcol', 'move', 'propfind', 'proppatch',
  'unlock', 'report', 'mkactivity', 'checkout', 'merge'
]
var separator = /^[\s/]+|[\s/]+$/g
var i, length

function chainHandlers (chain) {
  return function (request, response, next) {
    var handlers = chain.slice()
    var handle = function () {
      var handler = handlers.shift()
      if (handler) {
        handler(request, response, handle)
      } else {
        next()
      }
    }
    handle()
  }
}

function createMethodHandler (method) {
  method = method.toUpperCase()
  return function () {
    var routes = []
    var handlers = []
    var i, handler
    for (i = 0; i < arguments.length; ++i) {
      if (typeof arguments[i] === 'function') {
        handlers.push(arguments[i])
      } else {
        routes.push(arguments[i])
      }
    }
    for (i = 0; i < routes.length; ++i) {
      if (handlers.length > 1) {
        handler = chainHandlers(handlers)
      } else {
        handler = handlers[0]
      }
      this.add(method, routes[i], handler)
    }
    return this
  }
}

var Router = function () {
  this.routes = {}
}

Router.prototype.add = function (method, route, handler) {
  var parts, part, current, i, length, name, prefix

  if (typeof handler !== 'function') {
    return
  }
  if (!this.routes[method]) {
    this.routes[method] = {
      childs: {} // handler: undefined, route: undefined
    }
  }

  parts = route.split('?', 1)[0].replace(separator, '').split('/')

  if (!parts[0].length) {
    this.routes[method].handler = handler
    this.routes[method].route = route
  } else {
    current = this.routes[method]
    for (i = 0, length = parts.length; i < length; ++i) {
      part = parts[i]
      name = undefined
      prefix = part.charAt(0)
      if (prefix === ':' || prefix === '*') {
        name = part.substr(1)
        part = parts[i] = '*'
      }
      if ((!current.childs[part] && (current.childs[part] = {})) ||
           (part === '*' && !current.childs[part][length])) {
        if (part === '*') {
          current.childs[part][length] = {
            childs: {}, name: name // handler: undefined, route: undefined
          }
        } else {
          current.childs[part] = {
            childs: {}, name: name // handler: undefined, route: undefined
          }
        }
      }
      if (part === '*') {
        current = current.childs[part][length]
        if (prefix === '*') {
          current.last = true
          break
        }
      } else {
        current = current.childs[part]
      }
    }
    current.handler = handler
    current.route = route
  }
}

Router.prototype.match = function (method, url) {
  var parts = decodeURI(url).split('?', 1)[0]
    .replace(separator, '')
    .split('/')
  var result = {
    params: {} // handler: undefined, route: undefined
  }
  var part, child, current, i, length

  if (this.routes[method]) {
    if (!parts[0].length) {
      result.handler = this.routes[method].handler
      result.route = this.routes[method].route
    } else {
      current = this.routes[method]
      for (i = 0, length = parts.length; i < length; ++i) {
        part = parts[i]
        if (current.childs[part]) {
          current = current.childs[part]
          result.handler = current.handler
          result.route = current.route
        } else {
          child = current.childs['*']
          if (child && child[i + 1] && child[i + 1].last) {
            current = child[i + 1]
            result.handler = current.handler
            result.route = current.route
            result.params[current.name] = parts.slice(i)
            break
          } else if (child && child[length]) {
            current = child[length]
            result.handler = current.handler
            result.route = current.route
            result.params[current.name] = part
          } else {
            result.handler = undefined
            result.route = undefined
            result.params = {}
            break
          }
        }
      }
    }
  }
  return result
}

for (i = 0, length = methods.length; i < length; ++i) {
  var method = methods[i]
  Router.prototype[method] = createMethodHandler(method)
}

module.exports = function (cb) {
  var router = new Router()
  if (typeof cb === 'function') {
    cb(router)
  }

  return function (req, res, next) {
    var action = router.match(req.method, req.url)
    if (action.handler) {
      req.route = action.route
      req.params = action.params
      action.handler(req, res, next)
    } else {
      req.route = undefined
      req.params = {}
      next()
    }
  }
}
