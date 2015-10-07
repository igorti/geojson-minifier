## geojson-minifier

`geojson-minifier` is a small utility that minifies [GeoJSON](http://geojson.org) files by encoding(delta and zigzag)
geometries. Depending on data, you can shrink file size up to 2-4 times, sometimes even more. Use it to speed up load time of your web application.

## Installation
Either fetch source code or install with `npm`:

```bash
npm install -g geojson-minifier
```

This will give you `geojson-minifier` command.

## CLI
Use `geojson-minifier` from command line passing `-o`, `-f` and `-p` parameters(operation, input file, decimal precision).
When dealing with coordinate systems where decimal precision is important, like WGS84, use parameter `-p` to specify
number of decimal places that utility should retain. The default is 0.


```bash
geojson-minifier -o pack -f <filename> -p 6
```

This will create minified version `<filename>.packed` in the same folder as input file. To unpack use following:

```bash
geojson-minifier -o unpack -f <filename>.packed -p 6
```

## API
If you want to integrate `geojson-minifier` into existing application you can use 2 methods that API exposes - `pack` and `unpack`:

```javascript
var GeojsonMinifier = require('geojson-minifier');
var minifier = new GeojsonMinifier({ precision: 6 });

var packed = minifier.pack(<geojson-object>);
var unpacked = minifier.unpack(<geojson-object>);
```
