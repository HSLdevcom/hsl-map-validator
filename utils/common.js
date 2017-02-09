"use strict";

module.exports = {
    changedTags: function(test, featuresBase) {
        function isMatchingFeature(feature, other) {
            return feature.properties["@type"] === other.properties["@type"] &&
                   feature.properties["@id"] === other.properties["@id"];
        }

        const tags = mapOptions.tags || Object.keys(test.properties).filter(key => !key.includes("@"));
        const base = featuresBase.find(feature => isMatchingFeature(feature, test));

        if (!base) return;

        const changes = [];
        for (const tag of tags) {
            if (test.properties[tag] !== base.properties[tag]) {
                changes.push(`${tag}: ${base.properties[tag]} > ${test.properties[tag]}`);
            }
        }
        return changes;
    },
    // Copyright (c) 2015, OSM Lint contributors https://github.com/osmlab/osmlint/blob/master/LICENSE
    isIntersecting: function(way1, way2) {
        const coord1 = way1.geometry.coordinates;
        const coord2 = way2.geometry.coordinates;
        const x1 = coord1[0][0];
        const y1 = coord1[0][1];
        const x2 = coord1[coord1.length - 1][0];
        const y2 = coord1[coord1.length - 1][1];
        const x3 = coord2[0][0];
        const y3 = coord2[0][1];
        const x4 = coord2[coord2.length - 1][0];
        const y4 = coord2[coord2.length - 1][1];
        const adx = x2 - x1;
        const ady = y2 - y1;
        const bdx = x4 - x3;
        const bdy = y4 - y3;
        const s = (-ady * (x1 - x3) + adx * (y1 - y3)) / (-bdx * ady + adx * bdy);
        const t = (+bdx * (y1 - y3) - bdy * (x1 - x3)) / (-bdx * ady + adx * bdy);
        return (s >= 0 && s <= 1 && t >= 0 && t <= 1);
    },
    getTimestamp: function(features) {
        let newestTimestamp = 0;
        features.forEach(function(feature) {
            if (feature.properties["@timestamp"] > newestTimestamp) newestTimestamp = feature.properties["@timestamp"];
        })
        return newestTimestamp;
    },
}