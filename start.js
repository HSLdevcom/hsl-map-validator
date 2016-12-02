"use strict";

const fs = require("fs");
const path = require("path");
const blacklistValidator = require("./validators/blacklist");

const options = {
    sources: [{
        name: "osm",
        mbtiles: path.join(__dirname, "import", "finland.mbtiles"),
        raw: false
    }],
    output: fs.createWriteStream(path.join(__dirname, "export", "blacklist.geojson")),
    zoom: 15,
};

blacklistValidator(options);
