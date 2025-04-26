var vows = require('vows');
var assert = require('assert');
var fuzz = require('../lib/fuzz');

vows.describe('fuzz').addBatch({
  'A new fuzz object': {
    topic: new fuzz,
    
    'has no connection': function(fuzz){
      assert.isNull(fuzz.connection);
      assert.isFalse(fuzz.connected);
    },
    
    'when connecting': {
      topic: function(fuzz){
        fuzz.connect(this.callback);
      },
      'returns amqp object when ready event fired': function(err, amqp){
        assert.isNull(err);
        assert.isObject(amqp);
      }
    }
  }
}).export(module);
