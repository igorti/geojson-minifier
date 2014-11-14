'use strict';

var assert = require('chai').assert;
var GeojsonMinifier = require('../index.js');

describe('GeojsonMinifier', function(){
  var minifier;
  var unpacked = '{"type":"FeatureCollection","features":[{"type":"Feature","geometry":{"type":"Polygon","coordinates":[[[0,0],[1,1],[1,0],[0,0]]]}}]}';
  var packed = '{"type":"FeatureCollection","features":[{"type":"Feature","geometry":{"type":"Polygon","coordinates":[0,0,2,2,0,1,1,0]}}]}';

  before(function() {
    minifier = new GeojsonMinifier();
  });

  describe('pack()', function() {
    it('should minify provided geojson', function() {
      var _packed = minifier.pack(JSON.parse(unpacked));
      assert.equal(packed, _packed);
    });
  });

  describe('pack()', function() {
    it('should unpack minified geojson', function() {
      var _unpacked = minifier.unpack(JSON.parse(packed));
      assert.equal(unpacked, _unpacked);
    });
  });
});
