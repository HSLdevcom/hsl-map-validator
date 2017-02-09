"use strict";

const utils = require("../../utils/common"); 

module.exports = function(tileLayers, tileInfo, writeData, done) {
    const featuresTest = tileLayers.test.osm.features;
    const featuresBase = tileLayers.base.osm.features;
    const timestamp = utils.getTimestamp(featuresBase);

    const railwaysTest = featuresTest.filter(function(feature) {
        return (feature.properties.railway === "rail");
    });

    const waysTest = featuresTest.filter(function(feature) {
        return (feature.properties["@timestamp"] > timestamp && feature.properties.railway !== "rail");
    });

    const waysBase = featuresBase.filter(function(feature) {
        return (feature.properties.railway !== "rail");
    });

    railwaysTest.forEach((railway) => {
        waysTest.forEach((way) => {
            if (utils.isIntersecting(railway, way)) {
                const changedTags = JSON.stringify(utils.changedTags(way, waysBase));
                way.properties["@validator"] = "trainCrossing";
                way.properties["@changedTags"] = changedTags;
                writeData(JSON.stringify(way) + "\n");
            }
        });
    });

    done(null, null);
};
