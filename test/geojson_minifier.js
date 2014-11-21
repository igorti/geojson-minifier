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

  describe('unpack()', function() {
    it('should unpack minified geojson', function() {
      var _unpacked = minifier.unpack(JSON.parse(packed));
      assert.equal(unpacked, _unpacked);
    });
  });

  describe('null geometries', function(){
    it('should handle null geometries', function() {
      var null_geom = {type:"FeatureCollection",features:[{type:"Feature",geometry:null}]};
      var _packed = minifier.pack(null_geom);
      var _unpacked = minifier.unpack(null_geom);

      assert.equal(_packed, JSON.stringify(null_geom));
      assert.equal(_unpacked, JSON.stringify(null_geom));
    });
  });
});
