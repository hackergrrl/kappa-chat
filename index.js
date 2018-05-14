var kappa = require('kappa-core')
var discovery = require("discovery-swarm")
var swarmDefaults = require("dat-swarm-defaults")
var EventEmitter = require('events').EventEmitter
var inherits = require('inherits')

module.exports = Chat

function Chat (key, storage, opts) {
  if (!(this instanceof Chat)) return new Chat(key, storage, opts)

  var self = this

  this.key = key
  this._core = kappa(storage, opts)

  this._writer
  this._core.feed('default', function (err, feed) {  
    self._writer = feed
    readyFns.forEach(function (fn) { fn() })
    readyFns = []
  })

  var readyFns = []
  this._ready = function (fn) {
    if (!self._writer) readyFns.push(fn)
    else process.nextTick(fn)
  }
}

inherits(Chat, EventEmitter)

Chat.prototype.publish = function (msg, cb) {
  var self = this
  this._ready(function () {
    self._writer.append(msg, cb || noop)
  })
}

Chat.prototype.start = function () {
  if (!this.swarm) return

  var core = this._core

  var swarm = discovery(swarmDefaults({
    id: this.key,
    stream: function (peer) {
      return core.replicate({live: true})
    }
  }))

  swarm.join(this.key)

  this.swarm = swarm
}

function noop () {}
