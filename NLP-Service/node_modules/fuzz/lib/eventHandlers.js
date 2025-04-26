var config = require('config');
var amqp = require('amqp');
var debug = require('debug')('eventHandlers');
var eventEmitter = require('events').EventEmitter;
var util = require('util');

var eventHandlers = function(fuzz){
  var self = this;
  eventEmitter.call(self);
  self.fuzz = fuzz;
  self.handlers = {};

  self.handlers.ready = function(){
    debug("connection ready");
    self.fuzz.connected = true;
  }

  self.handlers.close = function(){
    debug("connection closed");
    self.fuzz.connected = false;
    self.fuzz.connection = false;
  }

  self.handlers.error = function(e){
    debug("connection error: "+e);
  }
}

util.inherits(eventHandlers, eventEmitter);

eventHandlers.prototype.wireEvents = function(amqp){
  var self = this;
  for(var i in self.handlers){
    var handler = self.handlers[i];
    amqp.on(i, handler);
  }
}

module.exports = eventHandlers;
