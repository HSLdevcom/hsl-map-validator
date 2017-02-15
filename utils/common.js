"use strict";

function findMatchingFeature(feature, otherFeatures) {
    return otherFeatures.find(otherFeature => {
        return feature.properties["@type"] === otherFeature.properties["@type"] &&
           feature.properties["@id"] === otherFeature.properties["@id"];
    });
}

function getChangedTagValues(feature, otherFeature, featureTags) {   
    const tags = featureTags || Object.keys(feature.properties).filter(key => !key.includes("@"));

    const changes = [];
    for (const tag of tags) {
        if (feature.properties[tag] !== otherFeature.properties[tag]) {
            changes.push(`${tag}: ${otherFeature.properties[tag]} > ${feature.properties[tag]}`);
        }
    }
    return changes;
};

// Copyright (c) 2015, OSM Lint contributors https://github.com/osmlab/osmlint/blob/master/LICENSE
function isIntersecting(way1, way2) {
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
};

function getTimestamp(features) {
    let newestTimestamp = 0;
    features.forEach(function(feature) {
        if (feature.properties["@timestamp"] > newestTimestamp) newestTimestamp = feature.properties["@timestamp"];
    })
    return newestTimestamp;
};

module.exports = {
    findMatchingFeature,
    getChangedTagValues,
    isIntersecting,
    getTimestamp,
}