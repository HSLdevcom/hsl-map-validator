"use strict";

function normalize(value) {
    return value.toLowerCase().replace(/\s/g, "");
}

module.exports = function(tileLayers, tileInfo, writeData, done) {
    const features = tileLayers.test.osm.features;
    const keywords = mapOptions.keywords.map(keyword => normalize(keyword));

    for (const feature of features) {
        const matches = [];

        const tags = mapOptions.tags || Object.keys(feature.properties).filter(key => !key.includes("@"));

        for (const tag of tags) {
            const value = feature.properties[tag];
            if (!value || typeof value !== "string") continue;

            for (const keyword of keywords) {
                if (normalize(value).includes(keyword)) {
                    matches.push(`${tag}: ${keyword} @ ${value}`);
                }
            }
        }

        if (matches.length) {
            feature.properties["@validation"] = matches.join("; ");
            writeData(JSON.stringify(feature) + "\n");
        }
    }

    done(null, null);
};
