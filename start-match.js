"use strict";

const pixelMatcher = require("./matching/pixelmatch");

const options = {
	url1: process.env.TILE_URL1,
    url2: process.env.TILE_URL2,
    area: {
    	zoom: Number(process.env.ZOOM) || 14,
	    size:  Number(process.env.SIZE) || 256,
    },
    threshold: {
    	pixelsCritical: Number(process.env.PIXELS_CRITICAL) || 1000,
    	colorThreshold: Number(process.env.COLOR_THRESHOLD) || 0.1,
    },
};

if (process.env.AREA_XYZ) options.area.xyz = JSON.parse(process.env.AREA_XYZ);
else if (process.env.AREA_BBOX) options.area.bbox = JSON.parse(process.env.AREA_BBOX);

pixelMatcher(options);
