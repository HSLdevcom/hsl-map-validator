"use strict";

module.exports = function(tileLayers, tileInfo, writeData, done) {
    const layer = tileLayers.osm.osm;
    done(null, 1);
};
