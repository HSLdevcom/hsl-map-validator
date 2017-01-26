"use strict";

module.exports = function(tileLayers, tileInfo, writeData, done) {

    const featuresTest = tileLayers.test.osm.features;
    const featuresBase = tileLayers.base.osm.features;

    for (const test of featuresTest) {
        const tags = mapOptions.tags || Object.keys(test.properties).filter(key => !key.includes("@"));
        const base = featuresBase.find(feature => feature.properties["@id"] === test.properties["@id"]);

        if (!base) continue;

        const changes = [];
        for (const tag of tags) {
            if (test.properties[tag] !== base.properties[tag]) {
                changes.push(`${tag}: ${base.properties[tag]} > ${test.properties[tag]}`);
            }
        }

        if (changes.length) {
            test.properties["@validation"] = changes.join();
            writeData(JSON.stringify(test) + "\n");
        }
    }

    done(null, null);
};
