"use strict";

const turf = require("turf");

const blacklist = ["helsingin"];

function normalize(value) {
    return value
        .toLowerCase()
        .replace(/\s/g, "")
        .replace(/0/g, "o")
        .replace(/1/g, "i")
        .replace(/3/g, "e")
        .replace(/4/g, "a")
        .replace(/7/g, "t");
}

module.exports = function(tileLayers, tileInfo, writeData, done) {
    const layer = tileLayers.osm.osm;
    const result = layer.features.filter((feature) => {
        for (const key of Object.keys(feature.properties)) {
            const value = feature.properties[key];
            if (value && typeof value === "string") {
                const normalizedValue = normalize(value);
                if (blacklist.some(word => normalizedValue.includes(word))) return true;
            }
        }
        return false;
    });

    if (result.length > 0) {
        var fc = turf.featureCollection(result);
        writeData(JSON.stringify(fc) + "\n");
    }

    done(null, null);
};
