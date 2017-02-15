"use strict";

const fs = require("fs");
const path = require("path");

const changedTagValuesValidator = require("./validators/changedTagValues");
const trainCrossingValidator = require("./validators/trainCrossing");

const options = {
    sources: [{
        name: "test",
        mbtiles: path.join(__dirname, "import", "osm.mbtiles"),
        raw: false,
    },
    {
        name: "base",
        mbtiles: path.join(__dirname, "import", "osm.base.mbtiles"),
        raw: false,
    }],
    zoom: 14,
    output: fs.createWriteStream(path.join(__dirname, "export", "features.geojson")),
};

const changedTagValuesOptions = Object.assign({}, options, {
    mapOptions: { tags: ["name", "name:sv"] },
});

changedTagValuesValidator(changedTagValuesOptions);
trainCrossingValidator(options);
