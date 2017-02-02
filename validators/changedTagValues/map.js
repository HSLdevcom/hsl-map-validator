"use strict";

function isMatchingFeature(feature, other) {
    return feature.properties["@type"] === other.properties["@type"] &&
           feature.properties["@id"] === other.properties["@id"];
}

module.exports = function(tileLayers, tileInfo, writeData, done) {

    const featuresTest = tileLayers.test.osm.features;
    const featuresBase = tileLayers.base.osm.features;

    for (const test of featuresTest) {
        const tags = mapOptions.tags || Object.keys(test.properties).filter(key => !key.includes("@"));
        const base = featuresBase.find(feature => isMatchingFeature(feature, test));

        if (!base) continue;

        const changes = [];
        for (const tag of tags) {
            if (test.properties[tag] !== base.properties[tag]) {
                changes.push(`${tag}: ${base.properties[tag]} > ${test.properties[tag]}`);
            }
        }

        if (changes.length) {
            test.properties["@validation"] = changes.join("; ");
            writeData(JSON.stringify(test) + "\n");
        }
    }

    done(null, null);
};
