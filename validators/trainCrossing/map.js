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
                const matchingFeature = utils.findMatchingFeature(way, waysBase);
                if (matchingFeature) {
                    const changes = matchingFeature ? utils.getChangedTagValues(way, matchingFeature) : null;
                    if (changes && changes.length) way.properties["@changedTags"] = changes.join("; ");
                }
                way.properties["@validator"] = "trainCrossing";
                writeData(JSON.stringify(way) + "\n");
            }
        });
    });

    done(null, null);
};
