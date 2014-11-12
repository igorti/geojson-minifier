#!/usr/bin/env node

var fs = require('fs');
var GeojsonMinifier = require('./');
var argv = require('minimist')(process.argv.slice(2));

var operation = argv["o"];
var inputFile = argv["f"];
var precision = argv["p"];

if (!operation) {
  console.log("Please specify operation(-o) (pack|unpack)");
  process.exit();
}

if (!inputFile) {
  console.log("Please specify path to inputFile(-f)");
  process.exit();
}

var fileBefore = fs.readFileSync(inputFile);
console.log("File size before: " + Math.ceil(fileBefore.length/1024) + " kb");

var minifier = new GeojsonMinifier({ precision: precision });
var processed, filePrefix = "";

if (operation === "pack") {
  filePrefix = ".packed";
  processed = minifier.pack(JSON.parse(fileBefore))
} else {
  filePrefix = ".unpacked";
  processed = minifier.unpack(JSON.parse(fileBefore));
}

fs.writeFileSync(inputFile + filePrefix, processed);

var fileAfter = fs.readFileSync(inputFile + filePrefix);
console.log("File size after: " + Math.ceil(fileAfter.length/1024) + " kb");
