"use strict";

const fs = require("fs");
const path = require("path");
const countValidator = require("./validators/count");

const limits = JSON.parse(fs.readFileSync(path.join(__dirname, "limits.geojson")));

const options = {
    sources: [{
        name: "osm",
        mbtiles: path.join(__dirname, "finland.mbtiles"),
        raw: false
    }],
    zoom: 15,
  //  geojson: limits,
};

countValidator(options, (result) => {
    console.log("Tile count " + result);
});
