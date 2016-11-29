"use strict";

const fs = require("fs");
const path = require("path");
const blacklistValidator = require("./validators/blacklist");

const options = {
    sources: [{
        name: "osm",
        mbtiles: path.join(__dirname, "finland.mbtiles"),
        raw: false
    }],
    zoom: 15,
};

blacklistValidator(options);
