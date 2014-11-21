function GeojsonMinifier(options) {
  this.precision = options && options.precision || 0;
}

GeojsonMinifier.prototype.pack = function(geojson) {
  if (geojson && geojson.features) {
    for (var i = 0; i < geojson.features.length; i++) {
      var geometry = geojson.features[i].geometry;

      if (!geometry) {
        geometry = null;
        continue;
      }

      switch(geometry.type) {
        case 'Point':
          console.log("Skipping point geometries");
          break;
        case 'LineString':
          geometry.coordinates = this.encodeGeometry(geometry.coordinates);
          break;
        case 'MultiLineString':
        case 'Polygon':
          geometry.coordinates = this.encodeGeometry(geometry.coordinates[0]);
          break;
        case 'MultiPolygon':
          for (var j = 0; j < geometry.coordinates.length; j++) {
            geometry.coordinates[j] = this.encodeGeometry(geometry.coordinates[j][0]);
          }
          break;
      }
    }
  }

  return JSON.stringify(geojson);
}

GeojsonMinifier.prototype.unpack = function(geojson) {
  if (geojson && geojson.features) {
    for (var i = 0; i < geojson.features.length; i++) {
      var geometry = geojson.features[i].geometry;

      if (!geometry) {
        geometry = null;
        continue;
      }

      switch(geometry.type) {
        case 'Point':
          console.log("Skipping point geometries");
          break;
        case 'LineString':
          var decoded = this.decodeGeometry(geometry.coordinates);
          geometry.coordinates = decoded;
          break;
        case 'MultiLineString':
        case 'Polygon':
          var decoded = this.decodeGeometry(geometry.coordinates);
          geometry.coordinates = [];
          geometry.coordinates.push(decoded);
          break;
        case 'MultiPolygon':
          for (var j = 0; j < geometry.coordinates.length; j++) {
            var decoded = this.decodeGeometry(geometry.coordinates[j]);
            geometry.coordinates[j] = [];
            geometry.coordinates[j].push(decoded);
          }
          break;
      }
    }
  }

  return JSON.stringify(geojson);
}

GeojsonMinifier.prototype.encodeGeometry = function(coordinates) {
  var minified = [];
  var previous = coordinates[0];
  minified.push(previous[0], previous[1]);

  for (var i = 1; i < coordinates.length; i++) {
    var currentX = this.toWholeNumber(coordinates[i][0]);
    var currentY = this.toWholeNumber(coordinates[i][1])

    var delta = currentX - this.toWholeNumber(previous[0]);
    var zigzag = (delta << 1) ^ (delta >> 31)
    minified.push(zigzag);

    delta = currentY - this.toWholeNumber(previous[1]);
    zigzag = (delta << 1) ^ (delta >> 31)
    minified.push(zigzag);

    previous = coordinates[i];
  }

  return minified;
}

GeojsonMinifier.prototype.decodeGeometry = function(coordinates) {
  var decodedGeometry = [];
  var previous = [];
  previous.push(coordinates[0], coordinates[1]);
  decodedGeometry.push(previous);

  for (var i = 2; i < coordinates.length; i+=2) {
    var current = [coordinates[i], coordinates[i+1]];
    var decoded = [];

    var zigzag = (current[0] >>> 1) ^ -(current[0] & 1);
    var delta = this.toWholeNumber(previous[0]) + zigzag;
    decoded.push(this.fromWholeNumber(delta));

    zigzag = (current[1] >>> 1) ^ -(current[1] & 1);
    delta = this.toWholeNumber(previous[1]) + zigzag;
    decoded.push(this.fromWholeNumber(delta));

    decodedGeometry.push(decoded);
    previous = decoded;
  }

  return decodedGeometry;
}

GeojsonMinifier.prototype.toWholeNumber = function(number) {
  return Math.floor(number * Math.pow(10, this.precision));
}

GeojsonMinifier.prototype.fromWholeNumber = function(number) {
  return number / Math.pow(10, this.precision);
}

module.exports = GeojsonMinifier;
