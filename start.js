"use strict";

const fs = require("fs");
const path = require("path");
const extend = require("lodash/extend");

const changedTagValuesValidator = require("./validators/changedTagValues");

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

const changedTagValuesOptions = extend(options, {
    mapOptions: {
        tags: ["name", "name:sv"],
    },
});

changedTagValuesValidator(changedTagValuesOptions);

