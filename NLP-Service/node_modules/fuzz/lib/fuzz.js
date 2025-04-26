var config = require('../config');
var amqp = require('amqp');
var debug = require('debug')('fuzz');
var eventHandlers = require('./eventHandlers');

module.exports = fuzz = function(conf){
  var self = this;
  self.connection = null;
  self.config = conf || config;
  self.connected = false;
  self.eventHandlers = new eventHandlers(self);
};

/**
 * Establish an amqp connection.
 * @param conf - amqp configuration object
 * @param cb - callback to fire when the amqp triggers the 'ready' event
 */
fuzz.prototype.connect = function(cb){
  var self = this;
  if(self.connection){
    // If rabbit connection already exists, close it
    self.connection.end(); // Will trigger the 'close' event, invoking the eventHandler for close
  }
  self.connection = amqp.createConnection(self.config.rabbitMQ);
  // Set up internal event handlers. Each handler function name matches an amqp event
  self.eventHandlers.wireEvents(self.connection);
  self.connection.once('ready', function(){
    cb(null, self.connection);
  });
  self.connection.once('error', function(e){
    cb(e, null);
  });
}
