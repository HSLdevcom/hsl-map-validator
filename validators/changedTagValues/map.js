"use strict";

const utils = require("../../utils/common");

module.exports = function(tileLayers, tileInfo, writeData, done) {
    const featuresTest = tileLayers.test.osm.features;
    const featuresBase = tileLayers.base.osm.features;

    for (const test of featuresTest) {
        const matchingFeature = utils.findMatchingFeature(test, featuresBase);
        const changes =  matchingFeature ? utils.getChangedTagValues(test, matchingFeature, mapOptions.tags) : null;

        if (changes && changes.length) {
            test.properties["@validation"] = changes.join("; ");
            writeData(JSON.stringify(test) + "\n");
        }
    }

    done(null, null);
};
