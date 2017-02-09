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
}